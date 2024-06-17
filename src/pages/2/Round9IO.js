import React, { useState, useEffect } from 'react';
import containerStyles from './ContainerStyles';
import { MY_URL } from '../../url';
import '../style.css';

function RoundNine() { // 라운드 수정 1
  const [financialData, setFinancialData] = useState([]);
  const [isRecommendationVisible, setIsRecommendationVisible] = useState(false);
  const [recommendedStock, setRecommendedStock] = useState(null);
  const [selectedStock, setSelectedStock] = useState('');
  const [isUPRecommendationVisible, setIsUPRecommendationVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [profits, setProfits] = useState({ beginning: 0 });
  const [timer, setTimer] = useState(120); // 120초로 설정
  const [timerActive, setTimerActive] = useState(true); // 타이머 활성 상태
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const round = 9; // 라운드 수정 2
  
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
      window.location.href = '/2/result-nine'; // 라운드 수정 3 // 사이트 수정 1
    }

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [timer, timerActive]);
  
  // AI 추천 종목 표시 및 클릭 이벤트 핸들러
  const handleRecommendationClick = () => {
    const round = 9; // 라운드 수정 4
    // 이미 AI 추천이 보이는 상태일 경우 아무 작업도 수행하지 않음
    if (isRecommendationVisible) return;
  
    // AI 추천을 보겠냐는 alert 메시지 출력
    const wantsRecommendation = window.confirm("AI 추천을 확인하시겠습니까? (Do you want to see the AI recommendation?)");
  
    if (wantsRecommendation) {
      // 사용자가 'Yes'를 선택한 경우
      setLoading1(true);
      setIsButtonVisible(false); // 다른 버튼 숨기기
      setTimeout(() => {
        setIsRecommendationVisible(true); // AI 추천을 보여줌
        setLoading1(false); // 로딩 상태 비활성화
    }, 5000);
      saveResponseToDB(true, round, 'AI'); 
  } else {
    saveResponseToDB(false, round, ''); // 사용자가 AI 추천을 보지 않음
    }
  };


  const handleUserPreferenceClick = () => {
    const round = 9; // 라운드 수정 5
    if (isUPRecommendationVisible) return;

    const wantUPR = window.confirm("당신의 선호도에 기반한 AI 추천을 보시겠습니까? (Do you want to see the AI recommendation based on your preference?)");
    
    if (wantUPR) {
      // 사용자가 'Yes'를 선택한 경우
      setLoading2(true); // 로딩 상태 활성화
      setIsButtonVisible(false);
      setTimeout(() => {
        setIsUPRecommendationVisible(true); // 추천 결과 표시
        setLoading2(false); // 로딩 상태 비활성화
    }, 5000);
      saveResponseToDB(true, round, 'USER_PREF'); 
    } else {
      saveResponseToDB(false, round, ''); // 사용자가 선호도 조사를 진행하지 않음
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
                  round: 9, // 라운드 수정 6
              }),
          });
          alert('Investment decision saved successfully.');
          window.location.href = '/2/result-nine'; // 라운드 수정 7 // 사이트 수정 2
      } catch (error) {
          console.error('Error saving investment decision:', error);
      }
  }
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
      <h2>Round 9</h2> {/* 라운드 수정 8 */}
        <div style={containerStyles(false)}>
        <p>투자금 (Beginning Balance): {profits?.profit_8 ?? 'Loading...'}</p> {/* 라운드 수정 9 */}
          <div className="timer">
            남은 시간 (Time left): {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
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
                <div>
                    <p>아래의 두 가지 주식 종목 추천 방식 중에 <strong>한 가지</strong>를 선택하여 확인할 수 있습니다. 왼쪽은 높은 수익률을 낼 종목을 <strong> 알고리즘이 직접 예측하여 종목을 추천</strong>하고, 오른쪽은 앞선 투자 성향에 대한 설문 결과를 반영하여 <strong> 투자자의 투자 성향이 반영된 알고리즘의 계산 결과에 기반한 종목을 추천</strong>합니다.</p>
                </div>
                <div className="button-container">
                    <div className='divStyle'>
                      {isButtonVisible && (
                        <button className = "recButtonRound" onClick={handleRecommendationClick}>AI 추천 종목 확인하기<br></br>(See AI Recommended Stock)</button>
                        )}
                        {loading1 && <p>Loading recommendation...</p>}
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
                        
                        {loading2 && <p>Loading recommendation...</p>}
                        {!loading2 && isUPRecommendationVisible && ( // 로딩이 끝나고, 추천 결과가 준비되었을 때만 결과를 표시
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

export default RoundNine;