import React, { useState, useEffect } from 'react';
import './BeforeSurvey.css';
import { useNavigate } from 'react-router-dom';
import { MY_URL } from '../../url';


const surveyQuestions = [
  { question: '성별을 선택해 주세요. (Please select your gender):', type: 'options', options: ['남성 (Male)', '여성 (Female)', '기타 (Other)'] },
  { question: '연령대를 선택해 주세요. (Please select your age range):', type: 'options', options: ['18세 미만 (Under 18)', '18-24세 (18-24)', '25-34세 (25-34)', '35-44세 (35-44)', '45-54세 (45-54)', '55-64세 (55-64)', '65세 이상 (65 or above)'] },
  { question: '최종 학력을 선택해 주세요. (Please select your highest level of education):', type: 'options', options: ['고등학교 졸업 이하 (High School or less)', '대학 재학 중 (Some College)', '학사 학위 (Bachelor\'s Degree)', '석사 학위 (Master\'s Degree)', '박사 학위 또는 전문 학위 (Doctorate or Professional Degree)'] },
  { question: '현재 직업을 선택해 주세요. (Please select your current occupation):', type: 'options', options: ['없음 (None)', '학생 (Student)', '회사원 (Office worker)', '교수 (Professor)', '자영업자 (Self-employed)', '프리랜서 (Freelancer)', '기타 (Other)'] },
  // AI 경험 질문
  { question: '귀하의 분야(업무 및 학습 환경 등)에서 AI를 사용해본 경험이 있습니까? (Do you have experience using AI in your field (work or academic environment)?):', type: 'options', options: ['예 (Yes)', '아니오 (No)'] },
  // 아래는 예를 선택했을 때 나오는 꼬리 질문들
  { question: '귀하의 분야에서 AI 사용이 얼마나 도움이 되었습니까? (How helpful was using AI in your field?):', type: 'likertScale', scaleLabels: ['전혀 도움이 되지 않음 (Not Helpful at All)', '조금 도움이 됨 (Slightly Helpful)', '도움이 됨 (Moderately Helpful)', '매우 도움이 됨 (Very Helpful)', '매우 많이 도움이 됨 (Extremely Helpful)'], parent: 4 },
  { question: '귀하의 분야에서 AI를 얼마나 신뢰할 수 있었습니까? (How trustworthy did you find AI in your field?):', type: 'likertScale', scaleLabels: ['전혀 신뢰하지 않음 (Not Trustworthy at All)', '조금 신뢰함 (Slightly Trustworthy)', '신뢰함 (Moderately Trustworthy)', '매우 신뢰함 (Very Trustworthy)', '완전히 신뢰함 (Completely Trustworthy)'], parent: 4 },
  // 투자 AI 질문
  { question: '금융 자산(예: 주식, 채권, 펀드 등)에 투자해본 경험이 있습니까? (Do you have experience in financial asset investment (e.g., stocks, bonds, funds)?):', type: 'options', options: ['예 (Yes)', '아니오 (No)'] },
  { question: '증권사 및 AI 투자 플랫폼 등에서 제공하는 AI 기반 주식 종목 추천 기능을 알고 있습니까? (Are you aware of AI stock recommendation features provided by securities firms, AI investment platforms, etc.?):', type: 'options', options: ['예 (Yes)', '아니오 (No)'] },
  // 아래는 예를 선택했을 때 나오는 꼬리 질문들
  { question: 'AI 기반 주식 종목 추천 기능을 얼마나 신뢰할 수 있습니까? (How much do you trust the current AI stock recommendation feature?):', type: 'likertScale', scaleLabels: ['전혀 신뢰하지 않음 (Not Trustworthy at All)', '조금 신뢰함 (Slightly Trustworthy)', '신뢰함 (Moderately Trustworthy)', '매우 신뢰함 (Very Trustworthy)', '완전히 신뢰함 (Completely Trustworthy)'], parent: 8 },
];


function BeforeSurvey() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(surveyQuestions.map(() => ''));
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userId');
    if (email) {
      setUserEmail(email);
    } else {
      navigate('/1/login');
    }
  }, [navigate]);

  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${MY_URL}/api/users/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, answers }),
      });

      if (response.ok) {
        alert('Survey submitted successfully.');
        navigate('/1/instruction-page');
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
      if (q.parent !== undefined && answers[q.parent] !== '예 (Yes)') {
        return null;
      }

      const mainQuestion = (
        <div key={index} className="survey-question-container">
          <p>{questionNumber}. {q.question}</p>
          {q.type === 'options' && (
            <select
              value={answers[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
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
                padding: '10px',
                borderRadius: '5px',
              }}
            >
              {q.scaleLabels.map((label, labelIndex) => (
                <label key={labelIndex} className="survey-label" style={{ textAlign: 'center' }}>
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
      <h2>Survey</h2>
      <form onSubmit={handleSubmit}>
        {renderSurveyQuestions()}
        <div className='buttonCenter'>
        <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default BeforeSurvey;
