import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MY_URL } from '../../url';
import '../style.css';

const surveyQuestions = [
  { question: '실험을 통한 최종 수익에 AI 추천과 본인의 판단 중 어느 것이 더 큰 기여를 했습니까? (Which contributed more to your final profits through the experiment: AI recommendations or your own judgment?)', 
    type: 'likertScale', 
    scaleLabels: ['AI가 훨씬 더 많이 기여함 (AI much more)', 'AI가 약간 더 많이 기여함 (AI slightly more)', '둘 다 비슷함 (Equally)', '본인 판단이 약간 더 많이 기여함 (Myself slightly more)', '본인 판단이 훨씬 더 많이 기여함 (Myself much more)'] },

  { question: '실험이 끝난 후 AI를 얼마나 신뢰하게 되었습니까? (How much do you trust AI after completing the experiment?)', 
    type: 'likertScale', 
    scaleLabels: ['전혀 신뢰하지 않음 (Not at all)', '약간 신뢰함 (Slightly)', '신뢰함 (Moderately)', '매우 신뢰함 (Very)', '완전히 신뢰함 (Completely)'] },

  { question: 'AI의 조언이 투자 수익 창출에 얼마나 도움이 되었습니까? (How helpful was AI advice in generating investment returns?)', 
    type: 'likertScale', 
    scaleLabels: ['매우 도움이 되지 않음 (Very unhelpful)', '도움이 되지 않음 (Unhelpful)', '보통 (Neutral)', '도움이 됨 (Helpful)', '매우 도움이 됨 (Very helpful)'] },

  { question: '투자 성향 설문조사 결과에 기반한 AI 추천 종목이 일반 AI 추천 종목보다 유용했습니까? (Was the AI recommendation based on your investment preference survey more helpful than the regular AI recommendation?)', 
    type: 'likertScale', 
    scaleLabels: ['훨씬 더 유용함 (Much more)', '약간 더 유용함 (Slightly more)', '비슷함 (About the same)', '덜 유용함 (Less helpful)', '잘 모르겠음 (Not applicable)'] },

  { question: 'AI 추천을 따랐을 때와 그렇지 않았을 때의 경제적 성과에는 어떤 차이가 있었습니까? (What was the difference in economic outcomes when following AI advice versus not?)', 
    type: 'likertScale', 
    scaleLabels: ['매우 긍정적 (Very positive)', '긍정적 (Positive)', '중립적 (Neutral)', '부정적 (Negative)', '매우 부정적 (Very negative)'] },

  { question: 'AI를 사용한 후 투자 결정에 대한 자신감이 어떻게 변했습니까? (How has your confidence in making investment decisions changed after using AI?)', 
    type: 'likertScale', 
    scaleLabels: ['매우 증가함 (Increased significantly)', '증가함 (Increased)', '변화 없음 (No change)', '감소함 (Decreased)', '매우 감소함 (Decreased significantly)'] },

  { question: '향후 비슷한 AI 기반 도구를 사용할 의향이 어느 정도입니까? (How willing are you to use similar AI-based tools in the future?)', 
    type: 'likertScale', 
    scaleLabels: ['매우 높음 (Very likely)', '높음 (Likely)', '보통 (Neutral)', '낮음 (Unlikely)', '매우 낮음 (Very unlikely)'] }
];


function AfterSurvey() {
        const navigate = useNavigate();
        const [answers, setAnswers] = useState(surveyQuestions.map(() => ''));
        const [userEmail, setUserEmail] = useState('');
        
      useEffect(() => {
          const email = localStorage.getItem('userId');
          if (email) {
            setUserEmail(email);
          } else {
            // 사용자 이메일이 없는 경우 로그인 페이지로 리다이렉트
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
            const response = await fetch(`${MY_URL}/api/users/survey2`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userEmail, answers }),
            });
        
            if (response.ok) {
              alert('설문이 성공적으로 제출되었습니다. (Survey submitted successfully.)');
              // 성공적으로 데이터를 보낸 후 다음 페이지로 이동할 수 있습니다.
              navigate('/1/thank-you');
            } else {
              alert('설문 제출에 실패했습니다. (Failed to submit survey.)');
            }
          } catch (error) {
            console.error('설문 제출 중 오류가 발생했습니다: ', error);
            alert('오류가 발생했습니다. 나중에 다시 시도해 주세요. (An error occurred. Please try again later.)');
          }
        };
      
        const renderSurveyQuestions = () => {
          return surveyQuestions.map((q, index) => (
            <div key={index} className="survey-question-container">
              <p>{index + 1}. {q.question}</p>
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
              {index < surveyQuestions.length - 1 && <hr style={{ borderBottom: '1px solid #ccc', margin: '20px 0' }} />}
            </div>
          ));
        };
      
        return (
          <div className="survey-container" style={{width: '1200px'}}>
            <h2>최종 설문 (Final Survey)</h2>
            <form onSubmit={handleSubmit}>
              {renderSurveyQuestions()}
              <div>
                <button className='survey-button' type="submit" style={{ width: '400px' }}>Submit</button>
              </div>
            </form>
          </div>
        );
}

export default AfterSurvey;
