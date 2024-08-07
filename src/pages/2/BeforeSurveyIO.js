import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css'
import { MY_URL } from '../../url';


const surveyQuestions = [
  { question: '성별을 선택해 주세요. (Please select your gender):', type: 'options', options: ['남성 (Male)', '여성 (Female)', '기타 (Other)'] },
  { question: '연령대를 선택해 주세요. (Please select your age range):', type: 'options', options: ['18세 미만 (Under 18)', '18-24세 (18-24)', '25-34세 (25-34)', '35-44세 (35-44)', '45-54세 (45-54)', '55-64세 (55-64)', '65세 이상 (65 or above)'] },
  { question: '최종 학력을 선택해 주세요. (Please select your highest level of education):', type: 'options', options: ['고등학교 졸업 이하 (High School or less)', '대학 재학 중 (Some College)', '학사 학위 (Bachelor\'s Degree)', '석사 학위 (Master\'s Degree)', '박사 학위 또는 전문 학위 (Doctorate or Professional Degree)'] },
  { question: '현재 직업을 선택해 주세요. (Please select your current occupation):', type: 'options', options: ['없음 (None)', '학생 (Student)', '회사원 (Office worker)', '교수 (Professor)', '자영업자 (Self-employed)', '프리랜서 (Freelancer)', '기타 (Other)'] },
  { question: '귀하의 분야(업무 및 학습 환경 등)에서 알고리즘 기반 기술(예: 자동 번역, 추천 시스템, ChatGPT 등)을 사용해본 경험이 있습니까? (Have you used algorithm-based technologies such as automated translation, recommendation systems, or ChatGPT in your field (work or academic environment)?):', type: 'options', options: ['예 (Yes)', '아니오 (No)'] },
  { question: '귀하의 분야에서 알고리즘 기반 기술 사용이 얼마나 도움이 되었습니까? (How helpful was using algorithm-based technologies in your field?):', type: 'likertScale', scaleLabels: ['전혀 도움이 되지 않음 (Not Helpful at All)', '조금 도움이 됨 (Slightly Helpful)', '도움이 됨 (Moderately Helpful)', '매우 도움이 됨 (Very Helpful)', '매우 많이 도움이 됨 (Extremely Helpful)'], parent: 4 },
  { question: '귀하의 분야에서 알고리즘 기반 기술을 얼마나 신뢰할 수 있었습니까? (How trustworthy did you find algorithm-based technologies in your field?):', type: 'likertScale', scaleLabels: ['전혀 신뢰하지 않음 (Not Trustworthy at All)', '조금 신뢰함 (Slightly Trustworthy)', '신뢰함 (Moderately Trustworthy)', '매우 신뢰함 (Very Trustworthy)', '완전히 신뢰함 (Completely Trustworthy)'], parent: 4 },
  { question: '금융 자산(예: 주식, 채권, 펀드 등)에 투자해본 경험이 있습니까? (Do you have experience in financial asset investment (e.g., stocks, bonds, funds)?):', type: 'options', options: ['예 (Yes)', '아니오 (No)'] },
  { question: '증권사 및 AI 투자 플랫폼 등에서 제공하는 알고리즘 기반 주식 종목 추천 기능을 알고 있습니까? (Are you aware of algorithm-based stock recommendation features provided by securities firms, AI investment platforms, etc.?):', type: 'options', options: ['예 (Yes)', '아니오 (No)'] },
  { question: '알고리즘 기반 주식 종목 추천 기능이 귀하의 투자 결정에 얼마나 도움이 되었습니까? (How helpful was the algorithm-based stock recommendation feature in your investment decisions?):', type: 'likertScale', scaleLabels: ['전혀 도움이 되지 않음 (Not Helpful at All)', '조금 도움이 됨 (Slightly Helpful)', '도움이 됨 (Moderately Helpful)', '매우 도움이 됨 (Very Helpful)', '매우 많이 도움이 됨 (Extremely Helpful)'], parent: 8 },
  { question: '알고리즘 기반 주식 종목 추천 기능을 얼마나 신뢰할 수 있습니까? (How much do you trust the current algorithm-based stock recommendation feature?):', type: 'likertScale', scaleLabels: ['전혀 신뢰하지 않음 (Not Trustworthy at All)', '조금 신뢰함 (Slightly Trustworthy)', '신뢰함 (Moderately Trustworthy)', '매우 신뢰함 (Very Trustworthy)', '완전히 신뢰함 (Completely Trustworthy)'], parent: 8 },
  { question: '다음의 투자 지표에 대해 얼마나 알고 계십니까? (How familiar are you with the following investment indicators?):', type: 'text' },
  { question: 'PER (주가수익비율)', type: 'likertScale', scaleLabels: ['잘 모름 (Not Familiar)', '들어본 적 있음 (Somewhat Familiar)', '어느 정도 알고 있음 (Moderately Familiar)', '잘 알고 있음 (Very Familiar)'] },
  { question: 'PBR (주가순자산비율)', type: 'likertScale', scaleLabels: ['잘 모름 (Not Familiar)', '들어본 적 있음 (Somewhat Familiar)', '어느 정도 알고 있음 (Moderately Familiar)', '잘 알고 있음 (Very Familiar)'] },
  { question: '배당수익률 (Dividend Yield)', type: 'likertScale', scaleLabels: ['잘 모름 (Not Familiar)', '들어본 적 있음 (Somewhat Familiar)', '어느 정도 알고 있음 (Moderately Familiar)', '잘 알고 있음 (Very Familiar)'] },
  { question: '시가총액 (Market Capitalization)', type: 'likertScale', scaleLabels: ['잘 모름 (Not Familiar)', '들어본 적 있음 (Somewhat Familiar)', '어느 정도 알고 있음 (Moderately Familiar)', '잘 알고 있음 (Very Familiar)'] },
  { question: '베타 (Beta)', type: 'likertScale', scaleLabels: ['잘 모름 (Not Familiar)', '들어본 적 있음 (Somewhat Familiar)', '어느 정도 알고 있음 (Moderately Familiar)', '잘 알고 있음 (Very Familiar)'] }
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

    // const isAllAnswered = answers.every(answer => answer !== '');
    //   if (!isAllAnswered) {
    //     alert('모든 질문에 답해주세요.');
    //     return;
    //   }
    // if (answers[0].trim() === '') {
    //   alert('성별을 입력해주세요.');
    //   return;
    // }

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
        navigate('/2/second-survey');
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
                <label key={labelIndex} style={{ textAlign: 'center' }}>
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
    <div className="survey-container" style={{ width: '1000px' }}>
      <h2>Survey 1</h2>
      <form onSubmit={handleSubmit}>
        {renderSurveyQuestions()}
        <div>
          <button className='survey-button'>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default BeforeSurvey;
