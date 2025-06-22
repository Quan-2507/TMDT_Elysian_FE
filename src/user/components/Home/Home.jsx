import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
import { getAllProducts, getTopSellingProducts, getFeaturedProducts } from '../../../api/productApi';
import {addToCart} from "../../../store/Actions";
import { useDispatch, useSelector } from 'react-redux';
import Swal from "sweetalert2";

const Home = () => {
	const slideImages = [
		'assets/images/img.png',
		'assets/images/img_1.png',
	];

	const navigate = useNavigate();
	const cart = useSelector(state => state.cart);
	const dispatch = useDispatch();
	const [quantity, setQuantity] = useState(1);
	const [bestSellerProducts, setBestSellerProducts] = useState([]);
	const [newProducts, setNewProducts] = useState([]);
	const [favoriteProducts, setFavoriteProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch products from API
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);

				// Fetch all product categories in parallel for better performance
				const [bestSellers, newProds, favorites] = await Promise.all([
					getTopSellingProducts(),
					getFeaturedProducts(),
					getFeaturedProducts()
				]);

				setBestSellerProducts(bestSellers);
				setNewProducts(newProds);
				setFavoriteProducts(favorites);

				setLoading(false);
			} catch (error) {
				setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
				setLoading(false);
				console.error("Error fetching products:", error);
			}
		};

		fetchProducts();
	}, []);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		draggable: true,
		autoplay: true,
		autoplaySpeed: 2000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					infinite: true,
					dots: true,
					autoplay: true,
					autoplaySpeed: 3000,
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					autoplay: true,
					autoplaySpeed: 3000,
				}
			}
		],
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />
	};

	function SampleNextArrow(props) {
		const { className, style, onClick } = props;
		return (
			<div
				className={className}
				style={{ ...style, display: "block", right: "-25px" }}
				onClick={onClick}
			/>
		);
	}

	function SamplePrevArrow(props) {
		const { className, style, onClick } = props;
		return (
			<div
				className={className}
				style={{ ...style, display: "block", left: "-25px" }}
				onClick={onClick}
			/>
		);
	}

	// Show loading state
	if (loading) {
		return <div className="container text-center p-t-80 p-b-80">Loading products...</div>;
	}

	// Show error state
	if (error) {
		return <div className="container text-center p-t-80 p-b-80">{error}</div>;
	}

	// Function to handle click on product
	const handleProductClick = (id) => {
		navigate(`/product/${id}`);
	};

	const handleAddToCart = (product) => {
		// Kiểm tra nếu sản phẩm hết hàng
		if (!product.inStock) {
			Swal.fire({
				title: 'Sản phẩm đã hết hàng!',
				text: 'Sản phẩm này hiện đã hết hàng, vui lòng chọn sản phẩm khác hoặc quay lại sau.',
				icon: 'error',
				confirmButtonText: 'Đã hiểu',
				confirmButtonColor: '#e65540'
			});
			return;
		}
		const productToAdd = {
			id: parseInt(product.id),
			quantity: 1,
		};

		// Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng với cùng size
		const existingItem = cart.find(item =>
			item.id === productToAdd.id
		);
		if (existingItem) {
			const message = 'Sản phẩm đã có trong giỏ hàng. Bạn có muốn xem giỏ hàng không?';

			Swal.fire({
				title: 'Sản phẩm đã tồn tại',
				text: message,
				icon: 'info',
				showCancelButton: true,
				confirmButtonText: 'Xem giỏ hàng',
				cancelButtonText: 'Tiếp tục mua hàng',
				confirmButtonColor: '#e65540'
			}).then((result) => {
				if (result.isConfirmed) {
					navigate('/cart');
				}
			});

			return;
		}

		dispatch(addToCart(productToAdd));

		Swal.fire({
			title: 'Thêm vào giỏ hàng thành công!',
			text: 'Bạn có muốn đến trang giỏ hàng không?',
			icon: 'success',
			showCancelButton: true,
			confirmButtonText: 'Đến giỏ hàng',
			cancelButtonText: 'Tiếp tục mua hàng',
			confirmButtonColor: '#e65540'
		}).then((result) => {
			if (result.isConfirmed) {
				navigate('/cart');
			}
		});
	};
	return (
		<div className="home-page">
			{/* Main Banner Section */}
			<section className="main-banner-section">
				<div className="container-fluid px-4">
					<div className="row g-4">
						{/* Banner chính bên trái */}
						<div className="col-lg-12 col-md-12">
							<div className="hero-main-banner" style={{backgroundImage: `url('assets/images/banner20.png')`}}>
								<div className="banner-overlay">
									<div className="banner-content">
										<h1 className="main-banner-title">Themes & Website Templates cho mọi dự án</h1>
										<p className="main-banner-text">
											Khám phá hàng nghìn templates, themes,... với thiết kế tinh tế, hiện đại
										</p>
										<div className="search-box">
											<input type="text" placeholder="e.g. responsive WordPress"/>
											<button type="submit">
												Search
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Banner phụ bên phải */}

					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="features-section">
				<div className="container">
					<div className="row justify-content-center g-4">
						<div className="col-lg-3 col-md-6">
							<div className="feature-box">
								<div className="feature-icon">
									<i class="fa-solid fa-cart-shopping"></i>
								</div>
								<h5 className="feature-title">Ecommerce</h5>
								<p className="feature-desc">Giao diện thương mai điện tử</p>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="feature-box">
								<div className="feature-icon">
									<i className="fa-brands fa-wordpress"></i>
								</div>
								<h5 className="feature-title">WordPress themes</h5>
								<p className="feature-desc">Chủ đề WordPress chuyên nghiệp</p>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="feature-box">
								<div className="feature-icon">
									<i className="fa-solid fa-pen-to-square"></i>
								</div>
								<h5 className="feature-title">Blogging</h5>
								<p className="feature-desc">Hàng nghìn trang blogger</p>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="feature-box">
								<div className="feature-icon">
									<i className="fa-regular fa-file"></i>
								</div>
								<h5 className="feature-title">Site templates</h5>
								<p className="feature-desc">Html và website templates</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Products Grid */}
			{/*<section className="featured-grid-section">*/}
			{/*	<div className="container">*/}
			{/*		<div className="section-header text-center">*/}
			{/*			<h2 className="section-title">SẢN PHẨM TIÊU BIỂU</h2>*/}
			{/*			<p className="section-subtitle">Khám phá những sản phẩm trang sức được yêu thích nhất</p>*/}
			{/*		</div>*/}
			{/*		<div className="row justify-content-center g-4">*/}
			{/*			{favoriteProducts.slice(0, 8).map((product, index) => (*/}
			{/*				<div key={product.id} className="col-xl-3 col-lg-4 col-md-6">*/}
			{/*					<div className="featured-product-card">*/}
			{/*						{index < 4 && (*/}
			{/*							<div className="discount-label">*/}
			{/*								GIẢM {Math.floor(Math.random() * 20 + 10)}%*/}
			{/*							</div>*/}
			{/*						)}*/}
			{/*						<div className="product-img-container">*/}
			{/*							<img src={product.img} alt={product.name} className="product-img"/>*/}
			{/*							<div className="product-hover-overlay">*/}
			{/*								<button*/}
			{/*									onClick={() => handleProductClick(product.id)}*/}
			{/*									className="quick-view-btn"*/}
			{/*								>*/}
			{/*									<i className="fa fa-eye"></i>*/}
			{/*									Xem chi tiết*/}
			{/*								</button>*/}
			{/*							</div>*/}
			{/*						</div>*/}
			{/*						<div className="product-details">*/}
			{/*							<h5 className="product-title">{product.name}</h5>*/}
			{/*							<div className="product-pricing">*/}
			{/*								<span className="current-price">{product.price.toLocaleString()} ₫</span>*/}
			{/*								{index < 4 && (*/}
			{/*									<span className="old-price">{(product.price * 1.2).toLocaleString()} ₫</span>*/}
			{/*								)}*/}
			{/*							</div>*/}
			{/*						</div>*/}
			{/*					</div>*/}
			{/*				</div>*/}
			{/*			))}*/}
			{/*		</div>*/}
			{/*	</div>*/}
			{/*</section>*/}

			{/* Best Seller Section */}
			<section className="bg0 p-t-23 p-b-140">
				<div className="container">
					<div className="p-b-10">
						<h3 className="ltext-103 cl5">
							Sản phẩm bán chạy
						</h3>
					</div>

					<div className="product-slider">
						<Slider {...settings}>
							{bestSellerProducts.map((product) => (
								<div key={product.id} className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15">
									<div className="block2">
										<div className="block2-pic hov-img0">
											<img src={product.img} alt={product.name} style={{height:"200px"}}/>
										</div>
										<div className="block2-txt flex-w p-t-14">
											<div className="block2-txt-child1 flex-col-l"  style={{width:"100%"}}>
												<a
													href={`/product/${product.id}`}
													className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
												>
													{product.name}
												</a>
												<span className="stext-105 cl3">
													{product.price.toLocaleString()} VND
												</span>
												<div style={{display:"flex",justifyContent:"flex-end",gap:"10px",width: "100%"}} className="nav-btn">
													<button
														onClick={() => handleAddToCart(product)}
														className=""
														style={{
															border: "1px solid #2973B2",
															padding: "5px",
															color: "#2973B2"
														}}
													>
														<i className="fa-solid fa-cart-shopping"></i>
													</button>
													<button
														onClick={() => handleProductClick(product.id)}
													className=""
													style={{border: "1px solid #2973B2", padding: "5px", color:"#2973B2"}}
												>
													Chi tiết
												</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</Slider>
					</div>

					{/* New Products Section */}
					<div className="p-b-10 p-t-50">
						<h3 className="ltext-103 cl5">
							Sản phẩm mới
						</h3>
					</div>

					<div className="product-slider">
						<Slider {...settings}>
							{newProducts.map((product) => (
								<div key={product.id} className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15">
									<div className="block2">
										<div className="block2-pic hov-img0">
											<img src={product.img} alt={product.name} style={{height: "200px"}}/>
										</div>
										<div className="block2-txt flex-w p-t-14">
											<div className="block2-txt-child1 flex-col-l" style={{width:"100%"}}>
												<a
													href={`/product/${product.id}`}
													className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
												>
													{product.name}
												</a>
												<span className="stext-105 cl3">
													{product.price.toLocaleString()} VND
												</span>
												<div style={{display: "flex", justifyContent: "flex-end", gap: "10px",width: "100%"}}
													 className="nav-btn">
													<button
														onClick={() => handleAddToCart(product)}
														className=""
														style={{
															border: "1px solid #2973B2",
															padding: "5px",
															color: "#2973B2"
														}}
													>
														<i class="fa-solid fa-cart-shopping"></i>
													</button>
													<button
														onClick={() => handleProductClick(product.id)}
														className=""
														style={{
															border: "1px solid #2973B2",
															padding: "5px",
															color: "#2973B2"
														}}
													>
														Chi tiết
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</Slider>
					</div>

					{/* Favorite Products Section */}
					<div className="p-b-10 p-t-50">
						<h3 className="ltext-103 cl5">
							Sản phẩm nổi bật
						</h3>
					</div>

					<div className="product-slider">
						<Slider {...settings}>
							{favoriteProducts.map((product) => (
								<div key={product.id} className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15">
									<div className="block2">
										<div className="block2-pic hov-img0">
											<img src={product.img} alt={product.name} style={{height: "200px"}}/>
										</div>
										<div className="block2-txt flex-w p-t-14">
											<div className="block2-txt-child1 flex-col-l" style={{width:"100%"}}>
												<a
													href={`/product/${product.id}`}
													className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
												>
													{product.name}
												</a>
												<span className="stext-105 cl3">
													{product.price.toLocaleString()} VND
												</span>
												<div style={{display: "flex", justifyContent: "flex-end", gap: "10px",width: "100%"}}
													 className="nav-btn">
													<button
														onClick={() => handleAddToCart(product)}
														className=""
														style={{
															border: "1px solid #2973B2",
															padding: "5px",
															color: "#2973B2"
														}}
													>
														<i className="fa-solid fa-cart-shopping"></i>
													</button>
													<button
														onClick={() => handleProductClick(product.id)}
														className=""
														style={{
															border: "1px solid #2973B2",
															padding: "5px",
															color: "#2973B2"
														}}
													>
														Chi tiết
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</Slider>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
