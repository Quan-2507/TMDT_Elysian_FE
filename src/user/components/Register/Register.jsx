import React, {createContext, useState, useContext } from 'react';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import '../css/login.css';
import '../css/Loading.css';
import { BACKEND_URL_HTTP } from '../../../config';
import imgHolder from '../img/login-holder.jpg';
import Swal from 'sweetalert2';
import axios from 'axios';
import {FcGoogle} from "react-icons/fc";
import {BsFacebook} from "react-icons/bs";
import {useGoogleLogin} from "@react-oauth/google";
import authService from "../../../services/authService";
import './register.css'

function Register() {
    const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const AuthContext = createContext();
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setIsLoading(true);

                // 1. Lấy thông tin từ Google API
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );

                const { email, name, picture } = userInfo.data;
                console.log("Google login info:", email, name, picture);


                // 2. Gửi thông tin đến backend thông qua authService
                const response = await authService.loginWithGoogle(tokenResponse.access_token, userInfo.data);

                // 3. Xử lý phản hồi
                Swal.fire({
                    title: 'Đăng nhập Google thành công!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/');
                });

                // 3. Xử lý phản hồi từ backend
                if (response.status === 200) {
                    const { token, refreshToken, userId, userName, userRole } = response.data;

                    // Lưu thông tin vào localStorage
                    localStorage.setItem('token', token);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('userName', userName);
                    localStorage.setItem('userRole', userRole);

                    // Trigger event để cập nhật header
                    window.dispatchEvent(new Event('auth-change'));

                    // Thông báo thành công và chuyển hướng
                    Swal.fire({
                        title: 'Đăng nhập Google thành công!',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        navigate('/');
                    });
                }
            } catch (error) {
                console.error("Google login error:", error);

                // Hiển thị thông báo lỗi
                Swal.fire({
                    title: 'Đăng nhập Google thất bại!',
                    text: error.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập bằng Google',
                    icon: 'error',
                    confirmButtonColor: "#3085d6",
                });
            } finally {
                setIsLoading(false);
            }
        },
        onError: error => {
            console.error('Google Login Failed:', error);
            Swal.fire({
                title: 'Không thể kết nối với Google',
                text: 'Vui lòng thử lại sau',
                icon: 'error',
                confirmButtonColor: "#3085d6",
            });
        }
    });
    const handleFacebookLogin = () => {
        if (!window.FB) {
            console.error("Facebook SDK not loaded yet");
            Swal.fire({
                title: 'Lỗi kết nối',
                text: 'Không thể kết nối với Facebook, vui lòng thử lại sau',
                icon: 'error',
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        setIsLoading(true);

        window.FB.login(async function(response) {
            if (response.authResponse) {
                console.log('Facebook login successful:', response);
                // Get user info
                window.FB.api('/me', { fields: 'id,name,email,picture' }, async function(userInfo) {
                    console.log('Facebook user info:', userInfo);

                    // Check if email is returned
                    if (!userInfo.email) {
                        setIsLoading(false);
                        Swal.fire({
                            title: 'Thiếu thông tin email',
                            text: 'Facebook không cung cấp email của bạn. Vui lòng sử dụng phương thức đăng nhập khác hoặc cập nhật email trong tài khoản Facebook.',
                            icon: 'error',
                            confirmButtonColor: "#3085d6",
                        });
                        return;
                    }

                    const userData = {
                        accessToken: response.authResponse.accessToken,
                        userId: response.authResponse.userID,
                        email: userInfo.email,
                        name: userInfo.name,
                        picture: userInfo.picture?.data?.url
                    };

                    console.log('Sending data to backend:', userData);

                    // Send to backend using authService (consistent with Google login)
                    try {
                        const response = await authService.loginWithFacebook(userData);
                        console.log('Backend response:', response);
                        setIsLoading(false);

                        // Show success message and redirect
                        Swal.fire({
                            title: 'Đăng nhập Facebook thành công!',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {
                            navigate('/');
                        });
                    } catch (error) {
                        console.error('Error during Facebook login:', error);
                        console.error('Error details:', error.response?.data || error.message);
                        setIsLoading(false);

                        Swal.fire({
                            title: 'Đăng nhập thất bại',
                            text: error.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập',
                            icon: 'error',
                            confirmButtonColor: "#3085d6",
                        });
                    }
                });
            } else {
                setIsLoading(false);
                console.log('Facebook login cancelled or failed');
            }
        }, { scope: 'public_profile,email' });
    };
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    const validateUserName = (username) => {
        if (username.length >= 3) {
            return true;  
          } else {
            return false; 
          }
    }

    const registerHandler = async (e) => {
    e.preventDefault();
        let timerInterval;
        if (username.length === 0 || password.length === 0 || email.length ===0) {
            Swal.fire({
                title: 'Please fill in the registration information !',
                icon: 'warning',
                confirmButtonColor: "#3085d6",
            });
      return;
  }
        if (!validateEmail(email)) {
            Swal.fire({
                title: 'The email is not in the correct format!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            })
        }
        if(!validateUserName(username)){
            Swal.fire({
                title: 'Usernames must be at least 3 characters !',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            })
        }

        setIsLoading(true); // Bắt đầu hiển thị loading spinner

            try {
                const response = await axios.post(`${BACKEND_URL_HTTP}/api/UserServices/register`, {
                    userName: username,
                    email: email,
                    password: password
                });
                 console.log(response);
    
                setIsLoading(false); // Ẩn loading spinner
    
                if (response.status === 200 && response.data.message === "Đăng ký tài khoản thành công ! Vui lòng xác minh tài khoản") {
                    Swal.fire({
                        title: 'Registration Successful!',
                        text: 'Please check your email to verify your account.',
                        icon: 'success',
                        confirmButtonColor: "#3085d6",
                    }).then(() => {
                        localStorage.setItem('email', email);
                        navigate('/verify-account');
                    });
                }
                if (response.status === 200 && response.data.message === "Email này đã được sử dụng") {
                    Swal.fire({
                        title: 'Registration failed !',
                        text: 'This account has been registered. Please use a different account.',

                        icon: 'error',
                        confirmButtonColor: "#3085d6",
                    })
                }
               
                
            } catch (error) {
                setIsLoading(false); // Ẩn loading spinner

                Swal.fire({
                    title: 'Registration failed !',
                    text: error.response?.data?.message || 'An error occurred. Please try again!',
                    icon: 'error',
                    confirmButtonColor: "#3085d6",
                });
            }
        
    }
    return (
        <div className="register-wrapper">
            <div className="register-box">
                <h2 className="app-title">ELYSIAN</h2>
                <h3 className="heading">Thật vui khi thấy bạn ở đây!!</h3>
                <p className="subheading">Hãy tạo tài khoản chỉ với vài bước đơn giản.</p>

                <button className="social-btn google" onClick={googleLogin}>
                    <FcGoogle size={22}/>
                    <span>Tiếp tục với Google</span>
                </button>

                <button className="social-btn facebook" onClick={handleFacebookLogin}>
                    <BsFacebook size={20} color="#1877F2"/>
                    <span>Tiếp tục với Facebook</span>
                </button>

                <div className="divider">
                    <hr/>
                    <span>hoặc</span>
                    <hr/>
                </div>

                <form onSubmit={registerHandler} className="register-form">
                    <label>Tên người dùng</label>
                    <input
                        type="text"
                        placeholder="Tên của bạn"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Email</label>
                    <input
                        type="text"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label>Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                    />

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        Đăng ký
                    </button>
                </form>

                <p className="login-link">
                    Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>.
                </p>

                <p className="terms">
                    Bằng cách tiếp tục, bạn xác nhận bạn từ 18 tuổi trở lên và đồng ý với
                    <Link to="/privacy-policy"> Chính sách quyền riêng tư</Link> và
                    <Link to="/terms-of-use"> Điều khoản sử dụng</Link>.
                </p>
            </div>
        </div>
    );

}

export default Register;