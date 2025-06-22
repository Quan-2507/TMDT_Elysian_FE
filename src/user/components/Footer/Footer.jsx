import React from 'react';

const styles = {
	logoName: {
		color: '#ffffff',
		textDecoration: 'none',
		fontSize: '30px',
		fontWeight: '500',
		padding: '10px 15px',
		transition: 'color 0.3s ease',
		textTransform: 'uppercase',
		whiteSpace: 'nowrap'
	}
};

const Footer = () => {
	return (
		<footer style={{ backgroundColor: '#2973B2', color: '#fff', padding: '50px 0 20px 0', fontSize: '14px' }}>
			<div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 20px' }}>
				<div className="row" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', margin: '0 auto' }}>

					{/* Cột 1 */}
					<div style={{ flex: '1 1 180px', marginBottom: '30px' }}>
						<h4 style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '13px' }}>THỊ TRƯỜNG ELYSIAN</h4>
						<ul style={{ listStyle: 'none', padding: 0 }}>
							<li><a href="#" style={linkStyle}>Điều khoản</a></li>
							<li><a href="#" style={linkStyle}>Giấy phép</a></li>
							<li><a href="#" style={linkStyle}>Market API</a></li>
							<li><a href="#" style={linkStyle}>Trở thành đối tác</a></li>
							<li><a href="#" style={linkStyle}>Cookies</a></li>
							<li><a href="#" style={linkStyle}>Cài đặt Cookie</a></li>
						</ul>
					</div>

					{/* Cột 2 */}
					<div style={{ flex: '1 1 180px', marginBottom: '30px' }}>
						<h4 style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '13px' }}>HỖ TRỢ</h4>
						<ul style={{ listStyle: 'none', padding: 0 }}>
							<li><a href="#" style={linkStyle}>Trung tâm trợ giúp</a></li>
							<li><a href="#" style={linkStyle}>Tác giả</a></li>
						</ul>
					</div>

					{/* Cột 3 */}
					<div style={{ flex: '1 1 180px', marginBottom: '30px' }}>
						<h4 style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '13px' }}>CỘNG ĐỒNG</h4>
						<ul style={{ listStyle: 'none', padding: 0 }}>
							<li><a href="#" style={linkStyle}>Cộng đồng</a></li>
							<li><a href="#" style={linkStyle}>Blog</a></li>
							<li><a href="#" style={linkStyle}>Diễn đàn</a></li>
							<li><a href="#" style={linkStyle}>Gặp gỡ</a></li>
						</ul>
					</div>

					{/* Cột 4 */}
					<div style={{ flex: '1 1 200px', marginBottom: '30px' }}>
						<h4 style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '13px' }}>GIỚI THIỆU</h4>
						<ul style={{ listStyle: 'none', padding: 0 }}>
							<li><a href="#" style={linkStyle}>Về Elysian</a></li>
							<li><a href="#" style={linkStyle}>Tuyển dụng</a></li>
							<li><a href="#" style={linkStyle}>Chính sách bảo mật</a></li>
							<li><a href="#" style={linkStyle}>Không bán hoặc chia sẻ thông tin cá nhân</a></li>
							<li><a href="#" style={linkStyle}>Sơ đồ trang</a></li>
						</ul>
					</div>

					{/* Thống kê và logo */}
					<div style={{flex: '1 1 250px', marginBottom: '30px', color: '#ccc'}}>
						<img
							src={`${process.env.PUBLIC_URL}/assets/images/icons/logo-Elysian-by-Gamuda-Land-BG.webp`}
							alt="Logo Elysian"
							style={{marginBottom: '10px', maxWidth: '32.5px'}}
						/><a style={styles.logoName}>ELYSIAN</a>
						<img
							src={`${process.env.PUBLIC_URL}/assets/images/icons/Certified_B_Corporation_B_Corp_Logo_2022_Black_RGB.svg.png`}
							alt="Chứng nhận B Corp"
							style={{marginTop: '10px', maxWidth: '50px'}}
						/>
						<p><strong style={{color: '#fff'}}>77,455,192</strong> <a style={{color: '#cccccc'}}>sản phẩm đã bán</a></p>
						<p><strong style={{color: '#fff'}}>$1,217,125,427</strong> <a style={{color: '#cccccc'}}>doanh thu cộng đồng</a></p>
					</div>
				</div>

				<hr style={{borderColor: '#333'}}/>

				<div style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingTop: '20px'
				}}>
					<div style={{color: '#aaa', fontSize: '13px' }}>
						© {new Date().getFullYear()} Elysian. Thương hiệu và bản quyền thuộc về các chủ sở hữu tương ứng.
					</div>
					<div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
						<a href="#" style={iconStyle}><i className="fa fa-twitter"></i></a>
						<a href="#" style={iconStyle}><i className="fa fa-facebook"></i></a>
						<a href="#" style={iconStyle}><i className="fa fa-youtube"></i></a>
						<a href="#" style={iconStyle}><i className="fa fa-instagram"></i></a>
						<a href="#" style={iconStyle}><i className="fa fa-pinterest"></i></a>
					</div>
				</div>
			</div>
		</footer>
	);
};

const linkStyle = {
	color: '#ccc',
	textDecoration: 'none',
	display: 'block',
	marginBottom: '8px',
	transition: 'color 0.3s ease'
};

const iconStyle = {
	color: '#ccc',
	fontSize: '18px',
	transition: 'color 0.3s ease'
};

export default Footer;
