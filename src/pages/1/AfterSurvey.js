import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MY_URL } from '../../url';
import '../style.css';

const surveyQuestions = [
  { question: '실험에서의 최종 수익에 알고리즘 추천과 본인의 판단 중 어느 것이 더 큰 기여를 했습니까? (Which contributed more to your final profits through the experiment: algorithm-based recommendations or your own judgment?)', 
    type: 'likertScale', 
    scaleLabels: ['알고리즘이 훨씬 더 많이 기여함 (Algorithm much more)', '알고리즘이 약간 더 많이 기여함 (Algorithm slightly more)', '둘 다 비슷함 (Equally)', '본인 판단이 약간 더 많이 기여함 (Myself slightly more)', '본인 판단이 훨씬 더 많이 기여함 (Myself much more)'] },
  
  {
    question: '어떤 정보가 투자 결정에 가장 큰 영향을 주었습니까? (Which information had the most influence on your investment decisions?)',
    type: 'likertScale',
    scaleLabels: ['시가총액 (Market Cap)','주가수익비율 (PER)','주가순자산비율 (PBR)','배당수익률 (Dividend Yield)','베타 (Beta)','알고리즘 추천 (Algorithmic Recommendations)']},
  
  {
    question: '제공된 정보가 투자 결정을 내리는 데 있어 충분했습니까? (Was the information provided sufficient for making investment decisions?)',
    type: 'likertScale',
    scaleLabels: ['매우 부족함 (Very insufficient)','부족함 (Insufficient)','보통 (Neutral)','충분함 (Sufficient)','매우 충분함 (Very sufficient)']},
 
  { question: '알고리즘의 조언이 투자 수익 창출에 얼마나 도움이 되었습니까? (How helpful was algorithmic advice in generating investment returns?)', 
    type: 'likertScale', 
    scaleLabels: ['매우 도움이 되지 않음 (Very unhelpful)', '도움이 되지 않음 (Unhelpful)', '보통 (Neutral)', '도움이 됨 (Helpful)', '매우 도움이 됨 (Very helpful)'] },
  
  { question: '실험이 끝난 후 알고리즘을 얼마나 신뢰하게 되었습니까? (How much do you trust algorithm after completing the experiment?)', 
    type: 'likertScale', 
    scaleLabels: ['전혀 신뢰하지 않음 (Not at all)', '약간 신뢰함 (Slightly)', '신뢰함 (Moderately)', '매우 신뢰함 (Very)', '완전히 신뢰함 (Completely)'] },
  
  { question: '알고리즘 추천을 따랐을 때와 그렇지 않았을 때의 경제적 성과에는 어떤 차이가 있었습니까? (What was the difference in economic outcomes when following algorithmic advice versus not?)', 
    type: 'likertScale', 
    scaleLabels: ['매우 긍정적 (Very positive)', '긍정적 (Positive)', '중립적 (Neutral)', '부정적 (Negative)', '매우 부정적 (Very negative)'] },

    { question: "알고리즘의 추천을 이해하고 따르는 과정에서 경험한 정신적 요구와 피로도를 평가해 주십시오. (Please assess the mental demand and fatigue experienced in understanding and following the algorithm's recommendations.):",
      type: 'likertScale',
      scaleLabels: [
          '정신적 요구가 매우 높고 매우 피곤함 (Mentally very demanding and very exhausting)',
          '정신적 요구가 높고 피곤함 (Mentally demanding and exhausting)',
          '정신적 요구가 보통이며 보통 수준의 피로감 (Moderately demanding and moderately exhausting)',
          '정신적 요구가 적고 조금 피곤함 (Mentally undemanding and slightly exhausting)',
          '정신적 요구가 전혀 없고 전혀 피곤하지 않음 (Not mentally demanding and not exhausting at all)'
        ]
      },

  { question: '알고리즘 종목 추천을 사용한 후 투자 결정에 대한 자신감이 어떻게 변했습니까? (How has your confidence in making investment decisions changed after using algorithm?)', 
    type: 'likertScale', 
    scaleLabels: ['매우 증가함 (Increased significantly)', '증가함 (Increased)', '변화 없음 (No change)', '감소함 (Decreased)', '매우 감소함 (Decreased significantly)'] },

  { question: '향후 비슷한 알고리즘 기반 도구를 사용할 의향이 어느 정도입니까? (How willing are you to use similar algorithm-based tools in the future?)', 
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
