import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateCart, removeFromCart, loadCart } from '../../../store/Actions';
import { getProductById } from '../../../api/productApi';
import discountCodeApi from '../../../api/discountCodeApi';
import Swal from 'sweetalert2';

const ShoppingCart = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cart = useSelector((state) => state.cart);
	const [productDetails, setProductDetails] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [couponCode, setCouponCode] = useState('');
	const [discount, setDiscount] = useState(0);
	const [couponError, setCouponError] = useState('');
	const [couponSuccess, setCouponSuccess] = useState('');
	const [validDiscountCode, setValidDiscountCode] = useState(null);
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		dispatch(loadCart());
	}, [dispatch]);

	useEffect(() => {
		const fetchProductDetails = async () => {
			try {
				setLoading(true);
				const detailsPromises = cart.map(item =>
					getProductById(item.id).then(product => ({
						id: item.id,
						name: product.name,
						img: product.img,
						price: product.price,
						inStock: product.inStock
					}))
				);

				const details = await Promise.all(detailsPromises);
				const detailsObject = details.reduce((acc, product) => {
					acc[product.id] = product;
					return acc;
				}, {});

				setProductDetails(detailsObject);
				setLoading(false);
			} catch (error) {
				setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
				setLoading(false);
				console.error("Error fetching product details:", error);
			}
		};

		if (cart.length > 0) {
			fetchProductDetails();
		} else {
			setLoading(false);
		}
	}, [cart]);

	const handleRemoveItem = (id) => {
		Swal.fire({
			title: 'Xác nhận xóa',
			text: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Xóa',
			cancelButtonText: 'Hủy',
			confirmButtonColor: '#dc3545',
			cancelButtonColor: '#6c757d'
		}).then((result) => {
			if (result.isConfirmed) {
				dispatch(removeFromCart(id));
				Swal.fire({
					title: 'Đã xóa!',
					text: 'Sản phẩm đã được xóa khỏi giỏ hàng.',
					icon: 'success',
					timer: 1500,
					showConfirmButton: false
				});
			}
		});
	};

	const calculateSubtotal = () => {
		return cart.reduce((total, item) => {
			const product = productDetails[item.id];
			return total + (product ? product.price * item.quantity : 0);
		}, 0);
	};

	const handleCheckout = () => {
		if (validDiscountCode) {
			localStorage.setItem('discountCode', validDiscountCode);
			localStorage.setItem('discountAmount', discount.toString());
		} else {
			localStorage.removeItem('discountCode');
			localStorage.removeItem('discountAmount');
		}
		navigate('/payment');
	};

	const handleApplyCoupon = async () => {
		if (!couponCode.trim()) {
			setCouponError('Vui lòng nhập mã giảm giá');
			setCouponSuccess('');
			return;
		}

		try {
			setProcessing(true);
			setCouponError('');
			setCouponSuccess('');
			const subtotal = calculateSubtotal();
			const discountAmount = await discountCodeApi.validateDiscountCode(
				couponCode,
				subtotal.toString(),
				localStorage.getItem('userId')
			);

			if (typeof discountAmount === 'number' || typeof discountAmount === 'string') {
				const finalDiscountAmount = parseFloat(discountAmount);
				setDiscount(finalDiscountAmount);
				setValidDiscountCode(couponCode);
				setCouponSuccess('Áp dụng mã giảm giá thành công!');
			} else {
				throw new Error('Invalid discount amount returned');
			}
		} catch (error) {
			setDiscount(0);
			setValidDiscountCode(null);
			let errorMessage = 'Mã giảm giá không hợp lệ hoặc đã hết hạn';
			if (error.response && error.response.data) {
				if (typeof error.response.data === 'string') {
					errorMessage = error.response.data;
				} else if (error.response.data.message) {
					errorMessage = error.response.data.message;
					switch (error.response.data.code) {
						case 'CODE_NOT_FOUND':
							errorMessage = 'Mã giảm giá không tồn tại.';
							break;
						case 'CODE_EXPIRED':
							errorMessage = 'Mã giảm giá đã hết hạn.';
							break;
						case 'CODE_NOT_STARTED':
							errorMessage = 'Mã giảm giá chưa có hiệu lực.';
							break;
						case 'CODE_INACTIVE':
							errorMessage = 'Mã giảm giá không được kích hoạt.';
							break;
						case 'USAGE_LIMIT_REACHED':
							errorMessage = 'Mã giảm giá đã đạt giới hạn sử dụng.';
							break;
						case 'ORDER_TOO_SMALL':
							errorMessage = 'Giá trị đơn hàng chưa đạt mức tối thiểu để áp dụng mã giảm giá này.';
							break;
						case 'INVALID_FORMAT':
							errorMessage = 'Định dạng đơn hàng không hợp lệ.';
							break;
						case 'SERVER_ERROR':
							errorMessage = 'Đã xảy ra lỗi khi kiểm tra mã giảm giá. Vui lòng thử lại sau.';
							break;
						default:
							break;
					}
				}
			}
			setCouponError(errorMessage);
		} finally {
			setProcessing(false);
		}
	};

	const calculateTotal = () => {
		const subtotal = calculateSubtotal();
		return subtotal - discount;
	};

	if (loading) {
		return <div className="container text-center p-t-80 p-b-80">Đang tải giỏ hàng...</div>;
	}

	if (error) {
		return <div className="container text-center p-t-80 p-b-80">{error}</div>;
	}

	return (
		<div className="container p-t-100 p-b-85">
			<h1 style={{ textAlign: "center", marginBottom: "20px" }}>Giỏ hàng</h1>
			{cart.length === 0 ? (
				<div className="text-center p-t-50 p-b-50">
					<h2>Giỏ hàng của bạn đang trống</h2>
					<p className="p-t-20">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
					<Link
						to="/product"
						className="flex-c-m stext-101 cl0 size-107 bg1 bor2 hov-btn1 p-lr-15 trans-04 m-tb-10 m-lr-auto"
						style={{ width: "200px", marginTop: "20px" }}
					>
						Tiếp tục mua sắm
					</Link>
				</div>
			) : (
				<div className="row">
					<div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
						<div className="m-l-25 m-r--38 m-lr-0-xl">
							<div className="wrap-table-shopping-cart">
								<table className="table-shopping-cart">
									<thead>
									<tr className="table_head">
										<th className="column-1">Sản phẩm</th>
										<th className="column-2">Tên sản phẩm</th>
										<th className="column-3">Giá</th>
										<th className="column-4"></th>
									</tr>
									</thead>
									<tbody>
									{cart.map(item => {
										const product = productDetails[item.id];
										if (!product) return null;

										return (
											<tr className="table_row" key={item.id}>
												<td className="column-1">
													<div className="how-itemcart1">
														<img src={product.img} alt={product.name} />
													</div>
												</td>
												<td className="column-2">
													<Link
														to={`/product/${item.id}`}
														className="product-name"
													>
														{product.name}
													</Link>
												</td>
												<td className="column-3">
													{product.price.toLocaleString()} VND
												</td>
												<td className="column-4" style={{ paddingRight: "20px" }}>
													<button
														className="remove-item-btn"
														onClick={() => handleRemoveItem(item.id)}
													>
														<i className="zmdi zmdi-close"></i>
													</button>
												</td>
											</tr>
										);
									})}
									</tbody>
								</table>
							</div>

							<div className="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
								<div className="flex-w flex-m m-r-20 m-tb-5">
									<input
										className="stext-104 cl2 plh4 size-117 bor13 p-lr-20 m-r-10 m-tb-5"
										type="text"
										name="coupon"
										placeholder="Mã giảm giá"
										value={couponCode}
										onChange={(e) => setCouponCode(e.target.value)}
										disabled={processing || validDiscountCode !== null}
									/>
									{validDiscountCode ? (
										<div
											className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5"
											onClick={() => {
												setValidDiscountCode(null);
												setDiscount(0);
												setCouponCode('');
												setCouponSuccess('');
											}}
										>
											Xóa mã
										</div>
									) : (
										<div
											className={`flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5 ${processing ? 'disabled-btn' : ''}`}
											onClick={!processing ? handleApplyCoupon : undefined}
										>
											{processing ? 'Đang kiểm tra...' : 'Áp dụng'}
										</div>
									)}
								</div>
								{validDiscountCode && (
									<div className="flex-w flex-m m-r-20 m-tb-5">
										<div className="discount-applied-badge">
											<i className="zmdi zmdi-check-circle"></i> Mã giảm giá đã áp dụng: {validDiscountCode}
										</div>
										<div className="discount-amount">
											-{discount.toLocaleString()} VND
										</div>
									</div>
								)}
								{couponError && (
									<div className="coupon-error m-t-10">{couponError}</div>
								)}
								{couponSuccess && (
									<div className="coupon-success m-t-10">{couponSuccess}</div>
								)}
							</div>
						</div>
					</div>

					<div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
						<div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
							<h4 className="mtext-109 cl2 p-b-30" style={{ textAlign: "center" }}>
								Tổng Giỏ Hàng
							</h4>
							<div className="flex-w flex-t bor12 p-b-13">
								<div className="size-208">
									<span className="stext-110 cl2">
										Tiền đơn hàng:
									</span>
								</div>
								<div className="size-209">
									<span className="mtext-110 cl2">
										{calculateSubtotal().toLocaleString()} VND
									</span>
								</div>
							</div>
							{discount > 0 && (
								<div className="flex-w flex-t bor12 p-t-15 p-b-15">
									<div className="size-208">
										<span className="stext-110 cl2">
											Giảm giá:
										</span>
									</div>
									<div className="size-209">
										<span className="mtext-110 cl2 text-danger">
											-{discount.toLocaleString()} VND
										</span>
									</div>
								</div>
							)}
							<div className="flex-w flex-t p-t-27 p-b-33">
								<div className="size-208">
									<span className="mtext-101 cl2">
										Tổng thanh toán:
									</span>
								</div>
								<div className="size-209 p-t-1">
									<span className="mtext-110 cl2">
										{calculateTotal().toLocaleString()} VND
									</span>
								</div>
							</div>
							<button
								onClick={handleCheckout}
								style={{ background: "#5CB85C", borderRadius: "5px" }}
								className="flex-c-m stext-101 cl0 size-116 bg3 hov-btn3 p-lr-15 trans-04 pointer"
							>
								Thanh toán
							</button>
						</div>
					</div>
				</div>
			)}
			<style jsx>{`
				.coupon-error {
					color: #e65540;
					font-size: 14px;
					width: 100%;
					text-align: center;
				}
				.coupon-success {
					color: #28a745;
					font-size: 14px;
					width: 100%;
					text-align: center;
				}
				.text-danger {
					color: #e65540;
				}
				.disabled-btn {
					opacity: 0.6;
					cursor: not-allowed;
				}
				.discount-applied-badge {
					display: flex;
					align-items: center;
					background-color: #e8f5e9;
					color: #2e7d32;
					padding: 8px 12px;
					border-radius: 4px;
					margin-right: 10px;
					font-size: 14px;
					margin-bottom: 10px;
					width: 100%;
				}
				.discount-applied-badge i {
					margin-right: 8px;
					font-size: 16px;
				}
				.discount-amount {
					font-weight: bold;
					color: #e65540;
				}
			`}</style>
		</div>
	);
};

// Add inline styles for cart components
const cartStyles = `
	.column-1 {
		width: 20%;
	}
	.column-2 {
		width: 40%;
	}
	.column-3 {
		width: 20%;
	}
	.column-4 {
		width: 20%;
	}
	.remove-item-btn {
		background-color: #dc3545;
		color: white;
		border: none;
		border-radius: 4px;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 14px;
	}
	.remove-item-btn:hover {
		background-color: #c82333;
	}
	.product-name {
		font-weight: 500;
		color: #333;
		text-decoration: none;
	}
	.product-name:hover {
		color: #007bff;
		text-decoration: none;
	}
`;

// Inject styles
if (typeof document !== 'undefined') {
	const styleSheet = document.createElement("style");
	styleSheet.innerText = cartStyles;
	document.head.appendChild(styleSheet);
}

export default ShoppingCart;