import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import '../css/login.css';
import '../css/Loading.css';
import { BACKEND_URL_HTTP } from '../../../config';
import imgHolder from '../img/login-holder.jpg';
import Swal from 'sweetalert2';
import axios from 'axios';
import './forgot.css'

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const recoverPasswordHandler = async (e) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            Swal.fire({
                title: 'Email không đúng định dạng',
                text: 'Vui lòng kiểm tra lại địa chỉ email',
                icon: 'warning',
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axios.post(`${BACKEND_URL_HTTP}/api/UserServices/ForgotPassword?email=${encodeURIComponent(email)}`);
            
            setIsLoading(false);

            if(response.status === 200) {
                if(response.data.message === "Email này không đăng ký trên hệ thống. Vui lòng nhập lại email của bạn") {
                    Swal.fire({
                        title: 'Không tìm thấy tài khoản',
                        text: 'Email này chưa được đăng ký. Vui lòng kiểm tra lại.',
                        icon: 'error',
                        confirmButtonColor: "#3085d6",
                    });
                } else if(response.data.message === "Hệ thống đã gửi mật khẩu mới vào email của bạn. Vui lòng kiểm tra thư của bạn") {
                    Swal.fire({
                        title: 'Lấy lại mật khẩu thành công!',
                        text: 'Mật khẩu mới đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.',
                        icon: 'success',
                        confirmButtonColor: "#3085d6",
                    }).then(() => {
                        navigate('/login');
                    });
                }
            }
        } catch (error) {
            setIsLoading(false);
            Swal.fire({
                title: 'Lấy lại mật khẩu thất bại',
                text: error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau!',
                icon: 'error',
                confirmButtonColor: "#3085d6",
            });
        }
    }
    
    return (
        <div className="forgot-wrapper">
            <div className="forgot-box">
                <h2 className="app-title">ELYSIAN</h2>
                <h3 className="heading">KHÔI PHỤC MẬT KHẨU</h3>
                <p className="subheading">Nhập địa chỉ email để lấy lại mật khẩu của bạn.</p>

                <form onSubmit={recoverPasswordHandler} className="forgot-form">
                    <label>Email</label>
                    <input
                        type="text"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                    />

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        Lấy lại mật khẩu
                    </button>
                </form>

                <div className="divider">
                    <hr/>
                    <span>hoặc</span>
                    <hr/>
                </div>

                <p className="back-link">
                    <Link to="/login">Quay lại đăng nhập</Link>
                </p>

                {isLoading && (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <div className="loading-text">Đang xử lý...</div>
                    </div>
                )}
            </div>
        </div>

    );
}

export default ForgotPassword; 