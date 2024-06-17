import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import TitleBox from './TitleBox';
import '../style.css'
import { MY_URL } from '../../url';


function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // 페이지 리다이렉트를 위한 hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${MY_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userId', data.userId); // 서버로부터 받은 userId 저장
                navigate('/1/before-survey');
            } else {
                alert('Login failed. Please check your email and password.');
            }
            
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <div>
                <TitleBox title="주식 투자 실험" subtitle="Stock Investment Experiment" />
            </div>
            <div className='login-container'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='login-label'>Email
                        <input className = 'login-input' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                </div>
                <div>
                    <label className='login-label'>Password
                        <input className = 'login-input' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                </div>
                <button className = 'login-button' type="submit">Login</button>
            </form>
            <div className="additional-links">
          <p>
            계정이 없으신가요? <a href="/1/register">회원가입</a>
          </p>
          <p>
            비밀번호를 잊으셨나요? <a href="/1/forgot-password">비밀번호 찾기</a>
          </p>
        </div>
        </div>
        </div>
    );
}

export default LoginPage;
