import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css';

function ThankYou() {
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate('/1/');
    };

    return (
        <div className="thank-you-container">
            <h1>Thank You!</h1>
            <p className='typ'>본 연구에 참여해 주셔서 감사합니다. 여러분의 참여는 연구에 큰 도움이 됩니다. (Your participation in our study is greatly appreciated and has been very helpful for our research.)</p>
            <p className='typ'>연구에 대한 궁금한 점이 있으면 아래 이메일로 문의해 주세요. (If you have any questions about the study, please contact us at the email below.)</p>
            <div className="contact-info">
                <p>Email: dojeon@snu.ac.kr</p>
            </div>
             <strong>정동우</strong>
             <p>Dongwoo Jeong</p>
            <button onClick={goToLogin} className="btn-green">실험 종료 (End Experiment)</button>
        </div>
    );
}

export default ThankYou;
