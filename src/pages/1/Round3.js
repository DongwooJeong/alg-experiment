import React, { useState, useEffect } from 'react';
import './Round1.css'; 
import containerStyles from './ContainerStyles';
import { MY_URL } from '../../url';


function RoundThree() { // 수정 1
  const [financialData, setFinancialData] = useState([]);
  const [isRecommendationVisible, setIsRecommendationVisible] = useState(false);
  const [recommendedStock, setRecommendedStock] = useState(null);
  const [selectedStock, setSelectedStock] = useState('');
  const [isUserPreferenceVisible, setIsUserPreferenceVisible] = useState(false);
  const [isUPRecommendationVisible, setIsUPRecommendationVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [option5, setOption5] = useState('');
  const [profits, setProfits] = useState({ beginning: 0 });
  const [timer, setTimer] = useState(120); // 120초로 설정
  const [timerActive, setTimerActive] = useState(true); // 타이머 활성 상태

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const round = 3; // 수정 2
  
    // 재무 정보 가져오기
      fetch(`${MY_URL}/api/financialsRoutes/financials/${round}`)
          .then(response => response.json())
          .then(data => setFinancialData(data))
          .catch(error => console.error('Error fetching financial data:', error));
  
    // ai 추천 주식 정보 가져오기
      fetch(`${MY_URL}/api/financialsRoutes/aiRecommendations/${round}`)
          .then(response => response.json())
          .then(data => {
              setRecommendedStock(data.company);
          })
          .catch(error => console.error('Error fetching ai recommended stock:', error));
      fetch(`${MY_URL}/api/answerRoutes/get-user-profits/${userId}`)
          .then(response => response.json())
          .then(data => setProfits(data))
          .catch(error => console.error('Error fetching recommended stock:', error));
  }, []);

  useEffect(() => {
    let interval = null;

    // 타이머가 활성화 상태일 때만 동작
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1); // 1초마다 타이머 감소
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval); // 타이머 중지
      alert('시간이 만료되었습니다! 다음 페이지로 이동합니다. (Time is up! Moving to the next page.)'); // 사용자에게 알림
      window.location.href = '/1/result-one'; // 페이지 이동
    }

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [timer, timerActive]);
  
  // AI 추천 종목 표시 및 클릭 이벤트 핸들러
  const handleRecommendationClick = () => {
    const round = 3; // 수정 3
    // 이미 AI 추천이 보이는 상태일 경우 아무 작업도 수행하지 않음
    if (isRecommendationVisible) return;
  
    // AI 추천을 보겠냐는 alert 메시지 출력
    const wantsRecommendation = window.confirm("AI 추천을 확인하시겠습니까? (Do you want to see the AI recommendation?)");
  
    if (wantsRecommendation) {
      // 사용자가 'Yes'를 선택한 경우
      setIsRecommendationVisible(true); // AI 추천을 보여줌
      setIsButtonVisible(false); // 다른 버튼 숨기기
      saveResponseToDB(true, round, 'AI'); 
  } else {
    saveResponseToDB(false, round, ''); // 사용자가 AI 추천을 보지 않음
    }
  };


  const handleUserPreferenceClick = () => {
    const round = 3; // 수정 4
    if (isUserPreferenceVisible) return;
  
    const wantSurvey = window.confirm("당신의 선호도에 기반한 AI 추천을 보시겠습니까? (Do you want to take a quick survey to see the AI recommendation based on your preferences?)");
    
    if (wantSurvey) {
      // 사용자가 'Yes'를 선택한 경우
      setIsUserPreferenceVisible(true); // AI 추천을 보여줌
      setIsButtonVisible(false);
      saveResponseToDB(true, round, 'USER_PREF'); 
    } else {
      saveResponseToDB(false, round, ''); // 사용자가 선호도 조사를 진행하지 않음
    }
};

const handleUPRecommendationClick = () => {
    if (isUPRecommendationVisible) return;
  
    const wantUPR = window.confirm("당신의 선호도에 기반한 AI 추천을 보시겠습니까? (Do you want to see the AI recommendation based on your preference?)");
  
    if (wantUPR) {
      // 사용자가 'Yes'를 선택한 경우
      const preferences = collectPreferences();
      sendUserPreferencesToDB(preferences, 3); // 수정 5
      setIsUserPreferenceVisible(false); // Optionally hide the preference UI
      setIsUPRecommendationVisible(true); // Show the recommendation based on user preference
    } 
};

const saveResponseToDB = async (recCheck, round, recType) => {
  const userEmail = localStorage.getItem('userId');
  const timestamp = new Date().toISOString();
  const mysqlTimestamp = timestamp.replace('T', ' ').replace('Z', '').split('.')[0];

  try {
      await fetch(`${MY_URL}/api/answerRoutes/round-actions`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: userEmail,
              round: round,
              action: {
                  recCheck: recCheck,
                  recType: recType,
                  recTimestamp: mysqlTimestamp,
              }
          }),
      });
  } catch (error) {
      console.error('Error saving AI recommendation response:', error);
  }
};

// preference 부분 핸들러
const sendUserPreferencesToDB = async () => {
  const userEmail = localStorage.getItem('userId');
  const timestamp = new Date().toISOString();
  const mysqlTimestamp = timestamp.replace('T', ' ').replace('Z', '').split('.')[0];
  const preferences = {
      preference_1: option1,
      preference_2: option2,
      preference_3: option3,
      preference_4: option4,
      preference_5: option5,
  };

  try {
      await fetch(`${MY_URL}/api/answerRoutes/user-preferences`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: userEmail,
              round: 3, // 수정 6
              preferences: preferences,
              preferenceTimestamp: mysqlTimestamp,
          }),
      });
      // After successful submission, you might want to update UI or state accordingly
      setIsUserPreferenceVisible(false); // Hide the preference form
      setIsUPRecommendationVisible(true); // Show the recommendation based on user preference
  } catch (error) {
      console.error('Error sending user preferences:', error);
  }
};

// 투자 결정 버튼 클릭 핸들러
const handleInvestButtonClick = async () => {
  const confirmation = window.confirm("해당 종목으로의 투자 결정을 진행하시겠습니까? (Are you sure you want to make this investment decision?)");
  setTimerActive(false);

  if (confirmation) {
      const userEmail = localStorage.getItem('userId'); // 로컬 스토리지에서 사용자 이메일 가져오기
      const timestamp = new Date().toISOString(); // 현재 시각을 ISO 형식으로 변환
      const mysqlTimestamp = timestamp.replace('T', ' ').replace('Z', '').split('.')[0]; // MySQL 타임스탬프 형식으로 변환

      try {
          await fetch(`${MY_URL}/api/answerRoutes/invest-decision`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email: userEmail, // 이메일
                  selectedStock: selectedStock, // 선택한 주식
                  decisionTimestamp: mysqlTimestamp, // 결정 시각
                  round: 3, // 수정 7
              }),
          });
          alert('Investment decision saved successfully.');
          window.location.href = '/1/result-three'; // 수정 8
      } catch (error) {
          console.error('Error saving investment decision:', error);
      }
  }
};

const collectPreferences = () => {
  // Collect user preferences from state
  return {
      preference_1: option1,
      preference_2: option2,
      preference_3: option3,
      preference_4: option4,
      preference_5: option5,
  };
};

const handleOption1Change = (event) => {
  setOption1(event.target.value);
};
const handleOption2Change = (event) => {
  setOption2(event.target.value);
};
const handleOption3Change = (event) => {
  setOption3(event.target.value);
};
const handleOption4Change = (event) => {
  setOption4(event.target.value);
};
const handleOption5Change = (event) => {
  setOption5(event.target.value);
};

const handleStockSelectionChange = (event) => {
  setSelectedStock(event.target.value);
};

function formatNumber(num) {
    const isNegative = num < 0; // 음수인지 확인
    const absoluteNum = Math.abs(num); // 절대값 사용

    let formattedNumber;
    if (absoluteNum >= 1000000000) {
        formattedNumber = (absoluteNum / 1000000000).toFixed(2) + 'B';
    } else if (absoluteNum >= 1000000) {
        formattedNumber = (absoluteNum / 1000000).toFixed(2) + 'M';
    } else {
        formattedNumber = absoluteNum.toString();
    }

    // 음수였다면 결과 앞에 '-' 추가
    return isNegative ? `-${formattedNumber}` : formattedNumber;
}

return (
    <div className='exp-container'>
      <h2>Round 3</h2> {/* 수정 9 */}
        <div style={containerStyles(false)}>
        <p>투자금 (Beginning Balance): {profits?.profit_2 ?? 'Loading...'}</p> {/* 수정 10 */}
          <div className="timer">
            Time left: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
          </div>
            <div>
                <div>
                    <table className='financialTable'>
                        <thead>
                            <tr>
                              <th>회사명 (Company)</th>
                              <th>종가 (Closing Price)</th>
                              <th>총이익 (Gross Profit)</th>
                              <th>이자, 세금, 감가상각 전 이익 <br></br>(EBITDA)</th>
                              <th>영업이익 (Operating Income)</th>
                              <th>순이익 (Net Income)</th>
                              <th>주당순이익 (EPS)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {financialData.map((stock, index) => (
                            <tr key={index}>
                                <td>{stock.company}</td>
                                <td>${stock.base_price}</td>
                                <td>${formatNumber(stock.grossProfit)}</td>
                                <td>${formatNumber(stock.ebitda)}</td>
                                <td>${formatNumber(stock.operatingIncome)}</td>
                                <td>${formatNumber(stock.netIncome)}</td>
                                <td>{stock.eps.toFixed(2)}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="button-container">
                    <div className='divStyle'>
                      {isButtonVisible && (
                        <button className = "recButtonRound" onClick={handleRecommendationClick}>AI 추천 종목 확인하기<br></br>(See AI Recommended Stock)</button>
                        )}
                        {isRecommendationVisible && (
                          <div>
                            <h3>AI 추천 종목<br></br> (AI Recommended Stock)</h3>
                            <p>{recommendedStock}</p>
                          </div>
                        )}
                      </div>
                    <div className='divStyle'>
                    {isButtonVisible && (
                      <button className = "recButtonRound" onClick={handleUserPreferenceClick}>투자자 선호도 기반 AI 종목 추천<br></br>(AI Recommendation based on User Preference)</button>
                      )}
                        {isUserPreferenceVisible && (
                          <div>
                            <h3>다음의 질문에 답해주세요 (Answer the following questions):</h3>
                            <fieldset>
                                <div className="question">
                                    <label>1. 주식 시장이 크게 하락할 때 당신의 행동은 어떻습니까? (What do you do when the stock market experiences a significant downturn?)</label>
                                    <div className="radio-options">
                                        <label className='parallel'>
                                            <input
                                                type="radio"
                                                className="radio"
                                                name="marketVolatilityResponse"
                                                value="Invest more"
                                                id="InvestMore"
                                                onChange={handleOption1Change}
                                            />
                                            <label>추가 투자하기 (Invest more)</label>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                className="radio"
                                                name="marketVolatilityResponse"
                                                value="Hold steady"
                                                id="HoldSteady"
                                                onChange={handleOption1Change}
                                            />
                                            <label>현 상태 유지 (Hold steady)</label>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                className="radio"
                                                name="marketVolatilityResponse"
                                                value="Sell some"
                                                id="SellSome"
                                                onChange={handleOption1Change}
                                            />
                                            <label>일부 매도 (Sell some)</label>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                className="radio"
                                                name="marketVolatilityResponse"
                                                value="Sell most"
                                                id="SellMost"
                                                onChange={handleOption1Change}
                                            />
                                            <label>대부분 매도 (Sell most)</label>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                className="radio"
                                                name="marketVolatilityResponse"
                                                value="Sell all"
                                                id="SellAll"
                                                onChange={handleOption1Change}
                                            />
                                            <label>전부 매도 (Sell all)</label>
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="question">
                                    <label>2. 과거에 투자에서 손실을 경험한 적이 있습니까? 그 경험이 지금 당신의 투자 성향에 어떤 영향을 미쳤습니까? (Have you ever experienced a loss in your investments? How did that experience influence your current investment tendencies?)</label>
                                    <select
                                        onChange={handleOption2Change}
                                    >
                                        <option value="">Select your experience</option>
                                        <option value="No prior loss experience">손실 경험 없음 (No prior loss experience)</option>
                                        <option value="No effect">영향 없음 (No effect)</option>
                                        <option value="Slightly more conservative">약간 보수적이게 됨 (Slightly more conservative)</option>
                                        <option value="Much more conservative">많이 보수적이게 됨 (Much more conservative)</option>
                                        <option value="Stopped investing">투자를 중단함 (Stopped investing)</option>
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="question">
                                    <label>3. 투자가 예상보다 빠르게 손실을 보이기 시작하면 어떻게 하시겠습니까? (What would you do if your investments start losing value more quickly than expected?)</label>
                                    <select
                                        onChange={handleOption3Change}
                                    >
                                        <option value="">Select your response</option>
                                        <option value="Sell immediately to minimize losses">즉시 매도하여 손실 최소화 (Sell immediately to minimize losses)</option>
                                        <option value="Wait and watch">상황을 지켜보며 기다림 (Wait and watch)</option>
                                        <option value="Invest more to lower the average cost">추가 투자로 평균 매입 가격 낮춤 (Invest more to lower the average cost)</option>
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="question">
                                    <label>4. 투자에서 손실이 발생했을 때 감정적으로 어떻게 반응하십니까? (How do you emotionally react when you incur a loss in your investments?)</label>
                                    <select
                                        onChange={handleOption4Change}
                                    >
                                        <option value="">Select your emotional reaction</option>
                                        <option value="Very anxious">매우 불안해함 (Very anxious)</option>
                                        <option value="Somewhat anxious">다소 불안해함 (Somewhat anxious)</option>
                                        <option value="Not much affected">별로 영향받지 않음 (Not much affected)</option>
                                        <option value="Not affected at all">전혀 영향받지 않음 (Not affected at all)</option>
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="question">
                                    <label>5. 높은 수익 기회를 제공하지만 손실 위험도 큰 투자 상품에 대한 당신의 관심도는? (What is your level of interest in investment products that offer high return opportunities but also come with a high risk of loss?)</label>
                                    <select
                                        onChange={handleOption5Change}
                                    >
                                        <option value="">Select your interest level</option>
                                        <option value="Very interested">매우 높음 (Very interested)</option>
                                        <option value="Interested">관심 있음 (Interested)</option>
                                        <option value="Neutral">보통 (Neutral)</option>
                                        <option value="Not very interested">별로 관심 없음 (Not very interested)</option>
                                        <option value="Not interested at all">전혀 관심 없음 (Not interested at all)</option>
                                    </select>
                                </div>
                            </fieldset>

                            <button onClick={handleUPRecommendationClick}>투자자의 선호도가 반영된 AI 추천 종목 확인 (Check AI Recommendation based on your preference)</button>
                          </div>
                          
                        )}
                        {isUPRecommendationVisible && (
                                      <div>
                                      <h3>AI Recommendation:</h3>
                                      <p>{recommendedStock}</p>
                                      </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <div className='choice-container'>
            <h3>투자할 종목 선택하기 (Choose a stock to invest in)</h3>
            <div>
                <table className="invisible-table">
                    <tbody>
                        {financialData.map((stock, index) => (
                            <tr key={index}>
                                <td>
                                    <label htmlFor={stock.company}>{stock.company}</label>
                                </td>
                                <td>
                                    <input
                                    type="radio"
                                    id={stock.company}
                                    name="stockSelection"
                                    value={stock.company}
                                    checked={selectedStock === stock.company}
                                    onChange={handleStockSelectionChange}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div>
            <button className = "recButton" onClick={handleInvestButtonClick}>투자 결정하기 (Make Invest Decision)</button>
        </div>
    </div>
    );
}

export default RoundThree;