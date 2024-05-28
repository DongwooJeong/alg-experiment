import React, { useState } from 'react';
import './ForgotPassword.css';
import { MY_URL } from '../../url';


function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 비밀번호 재설정 요청 API 호출
            const response = await fetch(`${MY_URL}/api/users/send-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            // 성공적으로 요청을 처리한 경우
            if (response.ok) {
                alert('A password reset link has been sent to your email address.');
            } else {
                // 서버에서 에러 응답을 반환한 경우 (예: 사용자를 찾을 수 없음)
                alert('Failed to send password reset link. Please check your email address and try again.');
            }
        } catch (error) {
            console.error('Failed to send password reset request:', error);
            alert('An error occurred while sending the password reset link. Please try again later.');
        }
    };

    return (
        <div className="fp-container">
            <h2>Password Recovery</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Password Reset Link</button>
            </form>
        </div>
    );
}

export default ForgotPassword;
