import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MY_URL } from '../../url';
import '../style.css';

const surveyQuestions = [
    { question: '단순한 문제보다 복잡한 문제를 선호합니다. (I would prefer complex to simple problems.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '생각을 많이 해야 하는 상황에서 책임을 맡는 것을 좋아합니다. (I like to have the responsibility of handling a situation that requires a lot of thinking.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '생각하는 활동이 즐거운 편이 아닙니다. (Thinking is not my idea of fun.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '생각을 많이 요구하지 않는 활동을 선호합니다. (I would rather do something that requires little thought than something that is sure to challenge my thinking abilities.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '깊이 생각해야 하는 상황을 미리 예상해서 피하려고 합니다. (I try to anticipate and avoid situations where there is likely a chance I will have to think in depth about something.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '오랫동안 깊이 생각하며 문제를 해결하는 것에서 만족을 느낍니다. (I find satisfaction in deliberating hard and for long hours.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '딱 필요한 만큼만 생각하기를 원합니다. (I only think as hard as I have to.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '장기적인 프로젝트보다 단기적이고 일상적인 문제를 해결하는 것을 선호합니다. (I prefer to think about small, daily projects to long-term ones.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '일단 배우면 별도의 사고 과정을 요하지 않고 수행할 수 있는 일을 선호합니다. (I like tasks that require little thought once I’ve learned them.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '정상에 오르기 위해 사고력을 많이 사용하는 것에 매력을 느낍니다. (The idea of relying on thought to make my way to the top appeals to me.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '새로운 문제 해결책을 찾아내는 일을 정말 즐깁니다. (I really enjoy a task that involves coming up with new solutions to problems.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '새로운 사고 방식을 배우는 것이 별로 흥미롭지 않습니다. (Learning new ways to think doesn’t excite me very much.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '제 삶이 해결해야 할 수수께끼로 가득 차 있기를 선호합니다. (I prefer my life to be filled with puzzles that I must solve.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '추상적 사고가 매력적입니다. (The notion of thinking abstractly is appealing to me.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '지적으로 어렵고 중요한 일을 하기를 선호합니다. (I would prefer a task that is intellectual, difficult, and important to one that is somewhat important but does not require much thought.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '많은 정신적 노력을 요구하는 일을 마친 후 만족스러움보다는 안도감을 느낍니다. (I feel relief rather than satisfaction after completing a task that required a lot of mental effort.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '어떻게 작동하는지 신경 쓰지 않고 일이 처리되면 그것으로 충분합니다. (It’s enough for me that something gets the job done; I don’t care how or why it works.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] },
    { question: '직접적인 영향이 없는 문제에 대해서도 종종 깊게 생각합니다. (I usually end up deliberating about issues even when they do not affect me personally.)', type: 'likertScale', scaleLabels: ['1 - 전혀 아니다 (Not at all)', '2 - 아니오 (No)', '3 - 보통 (Neutral)', '4 - 예 (Yes)', '5 - 매우 그렇다 (Definitely)'] }
];
  

function NC() {
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
        alert('모든 질문에 답해주세요. (Please answer all of the questions.)');
        return;
    }

    try {
      const response = await fetch(`${MY_URL}/api/users/survey-nc`, {
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
                <label key={labelIndex}  style={{ flex: '1', textAlign: 'center', margin: '10 10px' }}>
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
    <div className="survey-container" style = {{ width : '1200px'}}>
      <h2>Survey 2</h2>
      <form onSubmit={handleSubmit}>
        {renderSurveyQuestions()}
        <div>
         <button className='survey-button' type="submit" style={{ width: '400px' }}>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default NC;
