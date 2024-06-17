import React, { useState } from 'react';
import TitleBox from './TitleBox';
import { useNavigate } from 'react-router-dom';
import '../style.css';
import { MY_URL } from '../../url';


function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(''); // 사용자에게 보여줄 오류 메시지를 위한 상태
    const navigate = useNavigate();

    // 이메일 유효성 검사 함수
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 비밀번호 유효성 검사 함수
    const validatePassword = (password) => {
        return password.length >= 4;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // 오류 메시지 초기화

        // 이메일, 비밀번호 유효성 검사 및 비밀번호 일치 검사
        if (!validateEmail(email)) {
            setError('Invalid email format.');
            return;
        }
        if (!validatePassword(password)) {
            setError('Password must be at least 4 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`${MY_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    experimentType: 2, 
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                alert('Registration successful!');
                navigate('/2/');// 회원가입 성공 후 추가 작업, 예: 로그인 페이지로 리다이렉트
            } else {
                if (response.status === 409) {
                    alert('Email already exists');
                } else {
                    alert('Registration failed!');
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred!');
        }
    };

    return (
        <div>
            <div>
                <TitleBox title="주식 투자 실험" subtitle="Stock Investment Experiment" />
            </div>
            <div className="register-container">
                <div className='divCenter'>
                    <h2>Create Account</h2>
                </div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <label className='register-label'>
                            이메일 (Email)
                            <input
                            className='register-input'
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label className='register-label'>
                            비밀번호 (Password)
                            <input
                            className='register-input'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <label className='register-label'>
                            비밀번호 확인 (Confirm Password)
                            <input
                            className='register-input'
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </label>
                        <div>
                        <button type="button" className="register-button" onClick={handleSubmit}>
                            회원가입 (Signup)
                        </button> </div>  
                        <div className='divCenter'>                    
                            {error && <p className="error">{error}</p>}
                        </div>
                    </form>
            </div>
        </div>
    );
}

export default RegisterPage;
