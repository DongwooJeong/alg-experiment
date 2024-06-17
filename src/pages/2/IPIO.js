import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MY_URL } from '../../url';
import '../style.css';

const surveyQuestions = [
  {
    question: '주식 시장이 크게 하락할 때 당신의 행동은 어떻습니까? (What do you do when the stock market experiences a significant downturn?)',
    type: 'options',
    options: ['추가 투자하기 (Invest more)', '현 상태 유지 (Hold steady)', '일부 매도 (Sell some)', '대부분 매도 (Sell most)', '전부 매도 (Sell all)']
  },
  {
    question: '과거에 투자에서 손실을 경험한 적이 있습니까? 그 경험이 지금 당신의 투자 성향에 어떤 영향을 미쳤습니까? (Have you ever experienced a loss in your investments? How did that experience influence your current investment tendencies?)',
    type: 'options',
    options: ['손실 경험 없음 (No prior loss experience)', '영향 없음 (No effect)', '약간 보수적이게 됨 (Slightly more conservative)', '많이 보수적이게 됨 (Much more conservative)', '투자를 중단함 (Stopped investing)']
  },
  {
    question: '투자가 예상보다 빠르게 손실을 보이기 시작하면 어떻게 하시겠습니까? (What would you do if your investments start losing value more quickly than expected?)',
    type: 'options',
    options: ['즉시 매도하여 손실 최소화 (Sell immediately to minimize losses)', '상황을 지켜보며 기다림 (Wait and watch)', '추가 투자로 평균 매입 가격 낮춤 (Invest more to lower the average cost)']
  },
  {
    question: '투자에서 손실이 발생했을 때 감정적으로 어떻게 반응하십니까? (How do you emotionally react when you incur a loss in your investments?)',
    type: 'options',
    options: ['매우 불안해함 (Very anxious)', '다소 불안해함 (Somewhat anxious)', '별로 영향받지 않음 (Not much affected)', '전혀 영향받지 않음 (Not affected at all)']
  },
  {
    question: '높은 수익 기회를 제공하지만 손실 위험도 큰 투자 상품에 대한 당신의 관심도는? (What is your level of interest in investment products that offer high return opportunities but also come with a high risk of loss?)',
    type: 'options',
    options: ['매우 높음 (Very interested)', '관심 있음 (Interested)', '보통 (Neutral)', '별로 관심 없음 (Not very interested)', '전혀 관심 없음 (Not interested at all)']
  }
];

function InvestmentSurvey() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(surveyQuestions.map(() => ''));
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userId');
    if (email) {
      setUserEmail(email);
    } else {
      navigate('/2/');
    }
  }, [navigate]);

  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAllAnswered = answers.every(answer => answer !== '');
       if (!isAllAnswered) {
        alert('모든 질문에 답해주세요 (Please answer all questions).');
        return;
       }

    try {
      const response = await fetch(`${MY_URL}/api/users/survey-ip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, answers }),
      });

      if (response.ok) {
        alert('Survey submitted successfully.');
        navigate('/2/instruction-page'); 
      } else {
        alert('Failed to submit survey.');
      }
    } catch (error) {
      console.error('Error during survey submission:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const renderSurveyQuestions = () => {
    let questionNumber = 1;

    return surveyQuestions.map((q, index) => {

      const mainQuestion = (
        <div key={index} className="survey-question-container">
          <p>{questionNumber}. {q.question}</p>
          {q.type === 'options' && (
            <select
              value={answers[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
              style={{ width: '50%' }}
            >
              <option value="">선택</option>
              {q.options.map((option, optionIndex) => (
                <option key={optionIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {q.type === 'likertScale' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '10px 20px',
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '5px',
              }}
            >
              {q.scaleLabels.map((label, labelIndex) => (
                <label key={labelIndex} className="survey-label" style={{ flex: '1', textAlign: 'center', margin: '10 10px' }}>
                  <input
                    type="radio"
                    name={`likertScale_${index}`}
                    value={label}
                    onChange={() => handleInputChange(index, label)}
                  />
                  <br />
                  {label}
                </label>
              ))}
            </div>
          )}
        </div>
      );

      questionNumber++;

      return (
        <React.Fragment key={index}>
          {mainQuestion}
          {index < surveyQuestions.length - 1 && <hr style={{ borderBottom: '1px solid #ccc', margin: '20px 0' }} />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="survey-container">
      <h2>Survey 3</h2>
      <form onSubmit={handleSubmit}>
        {renderSurveyQuestions()}
        <div>
         <button className='survey-button' type="submit" style={{ width: '400px' }}>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default InvestmentSurvey;
