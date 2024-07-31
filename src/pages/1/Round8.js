import React, { useState, useEffect } from 'react';
import containerStyles from './ContainerStyles';
import { MY_URL } from '../../url';
import '../style.css';

function Round8() { // 수정 1
  const [financialData, setFinancialData] = useState([]);
  const [isRecommendationVisible, setIsRecommendationVisible] = useState(false);
  const [recommendedStock, setRecommendedStock] = useState(null);
  const [firstSelectedStock, setFirstSelectedStock] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isFirstDecisionVisible, setIsFirstDecisionVisible] = useState(true);
  const [isFinalDecisionVisible, setIsFinalDecisionVisible] = useState(false);
  const [profits, setProfits] = useState({ beginning: 0 });
  const [timer, setTimer] = useState(180); // 180초로 설정
  const [timerActive, setTimerActive] = useState(true); // 타이머 활성 상태
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const round = 8; // 수정 2
  
    // 재무 정보 가져오기
      fetch(`${MY_URL}/api/financialsRoutes/financials/${round}`)
          .then(response => response.json())
          .then(data => setFinancialData(data))
          .catch(error => console.error('Error fetching financial data:', error));
  
    // 추천 주식 정보 가져오기
      fetch(`${MY_URL}/api/financialsRoutes/aiRecommendations/${round}`)
          .then(response => response.json())
          .then(data => {
              setRecommendedStock(data.company_id);
          })
          .catch(error => console.error('Error fetching recommended stock:', error));
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
      window.location.href = '/1/result-eight'; // 수정 3
    }

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [timer, timerActive]);
  
  // AI 추천 종목 표시 및 클릭 이벤트 핸들러
  const handleRecommendationClick = () => {
    const round = 8; // 수정 3
    // 이미 AI 추천이 보이는 상태일 경우 아무 작업도 수행하지 않음
    if (isRecommendationVisible) return;
  
    // AI 추천을 보겠냐는 alert 메시지 출력
    const wantsRecommendation = window.confirm("알고리즘에 의해 계산된 추천 투자 종목을 확인하시겠습니까? (Would you like to see stock recommended by the algorithm?)");
  
    if (wantsRecommendation) {
      // 사용자가 'Yes'를 선택한 경우
      setLoading(true);
      setIsButtonVisible(false); // 다른 버튼 숨기기
      setTimeout(() => {
        setLoading(false); // 로딩 상태 비활성화
        setIsRecommendationVisible(true); // AI 추천을 보여줌
        saveResponseToDB(true, round); 
    }, 5000);
  } else {
    saveResponseToDB(false, round); // 사용자가 AI 추천을 보지 않음
    }
  };

const saveResponseToDB = async (recCheck, round) => {
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
                  recTimestamp: mysqlTimestamp,
              }
          }),
      });
  } catch (error) {
      console.error('Error saving recommendation response:', error);
  }
};

const handlefirstDecisionClick = async() => {
  const confirmation = window.confirm("해당 종목으로의 투자 결정을 진행하시겠습니까? (Are you sure you want to make this investment decision?)");
  
  if (confirmation) {
    setIsFinalDecisionVisible(true);
    setIsFirstDecisionVisible(false);
  }

  const timestamp = new Date().toISOString();
  const mysqlTimestamp = timestamp.replace('T', ' ').replace('Z', '').split('.')[0];

  try {
      await fetch(`${MY_URL}/api/answerRoutes/first-decision`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: localStorage.getItem('userId'),
              round: 8, // 수정 4
              action: {
                  selectedStock: firstSelectedStock,
                  selectTimestamp: mysqlTimestamp,
              }
          }),
      });
  } catch (error) {
      console.error('Error saving first stock selection:', error);
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
                  round: 8, // 수정 5
              }),
          });
          alert('Investment decision saved successfully.');
          window.location.href = '/1/result-eight'; // 수정 6
      } catch (error) {
          console.error('Error saving investment decision:', error);
      }
  }
};

const handleFirstStockSelectionChange = (event) => {
  setFirstSelectedStock(event.target.value);
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

function formatCurrency(value) {
  const number = parseFloat(value);
  return !isNaN(number) ? `${number.toFixed(2)}` : 'N/A';
}

const toggleVisibility = () => {
  setIsVisible(!isVisible);
};

return (
    <div className='exp-container'>
      <h2>Round 8</h2> {/* 수정 7 */}
        <div style={containerStyles(false)}>
        <p>잔액 (Balance): {profits?.profit_7 ?? 'Loading...'}</p> {/* 수정 8 */}
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
                              <th>베타 (Beta)</th>
                              <th>시가총액 (Market Capitalization)</th>
                              <th>PBR</th>
                              <th>PER</th>
                              <th>배당수익성 (Dividend Yield)</th>
                              <th>지난 3개월 간의 수익 (Past Return)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {financialData.map((stock, index) => (
                            <tr key={index}>
                                <td>{stock.company_id}</td>
                                <td>${stock.base_price}</td>
                                <td>{formatCurrency(stock.Beta)}</td>
                                <td>${formatNumber(stock.Market_Cap)}</td>
                                <td>{formatCurrency(stock.PBR)}</td>
                                <td>{formatCurrency(stock.PER)}</td>
                                <td>{formatCurrency(stock.Dividend_Yield*100)}%</td>
                                <td>${formatCurrency(stock.Past_Return)}</td>
                            </tr>                            
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                <button style={{marginBottom:"10px", backgroundColor: "tan", color:"white", border: 'none'}} onClick={toggleVisibility}>
                  {isVisible ? '테이블 숨기기 (Hide Table)' : '각 지표에 대한 설명 보기 (View description of each indicator)'}
                </button>
                {isVisible && (<table border="1" style={{width:"100%", borderCollapse: "collapse", marginBottom: "10px"}}>
    <tr>
        <th>지표 이름 (Indicator Name)</th>
        <th>한국어 설명 (Description in Korean)</th>
        <th>영어 설명 (Description in English)</th>
    </tr>
    <tr>
        <td>베타 (Beta)</td>
        <td>주식이 시장 전체와 비교하여 얼마나 변동성이 있는지를 나타내는 지표. 시장의 베타는 1로 간주되며, 주식의 베타가 1보다 높으면 시장보다 변동성이 높다는 것을 의미함</td>
        <td>An indicator that measures the volatility of a stock compared to the overall market. The market beta is considered to be 1, meaning that a stock with a beta greater than 1 is more volatile than the market</td>
    </tr>
    <tr>
        <td>시가총액 (Market Capitalization)</td>
        <td>주식 시장에서 회사의 총 가치를 나타내며, 주식의 현재 가격과 발행된 총 주식 수를 곱한 값</td>
        <td>Represents the total value of a company in the stock market, calculated by multiplying the current stock price by the total number of issued shares</td>
    </tr>
    <tr>
        <td>PBR (주가순자산비율, Price to Book Ratio)</td>
        <td>주식 가격 대비 회사의 장부 가치(순자산)의 비율</td>
        <td>The ratio of a stock's price relative to the company's book value (net assets)</td>
    </tr>
    <tr>
        <td>PER (주가수익비율, Price to Earnings Ratio)</td>
        <td>주식 가격 대비 회사의 주당 순이익의 비율</td>
        <td>The ratio of a stock's price compared to the company's earnings per share</td>
    </tr>
    <tr>
        <td>배당수익성 (Dividend Yield)</td>
        <td>회사가 주주에게 지급하는 배당금이 주식 가격에 비해 어느 정도인지를 나타냄</td>
        <td>Indicates how much a company pays out in dividends each year relative to its stock price</td>
    </tr>
    <tr>
        <td>지난 3개월 간의 수익 (Past Return)</td>
        <td>지난 3개월 동안 해당 주식이 얼마나 성과를 냈는지를 나타냄</td>
        <td>Reflects how much a stock has performed over the past three months</td>
    </tr>
</table>
)}
                </div>

          {isFirstDecisionVisible && (
          <div>
          <div className='choice-container'>
            <h3>투자할 종목 선택하기 (Choose a stock to invest in)</h3>
            <div>
                <table className="invisible-table">
                    <tbody>
                        {financialData.map((stock, index) => (
                            <tr key={index}>
                                <td>
                                    <label htmlFor={stock.company_id}>{stock.company_id}</label>
                                </td>
                                <td>
                                    <input
                                    type="radio"
                                    id={stock.company_id}
                                    name="stockSelection"
                                    value={stock.company_id}
                                    checked={firstSelectedStock === stock.company_id}
                                    onChange={handleFirstStockSelectionChange}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
              <div>
                  <button className = "recButton" onClick={handlefirstDecisionClick}>투자 결정하기 (Make Invest Decision)</button>
              </div> 
              </div>
            )}
                
            </div>
        </div> 
        {isFinalDecisionVisible && (
          <div>
            <p>당신이 처음 선택한 투자 종목은 <strong>{firstSelectedStock}</strong>입니다.</p>
            <p>Your initial investment decision is <strong>{firstSelectedStock}</strong>.</p>
            <div className='choice-container' style={{ marginBottom: '30px', width: '500px' }}>
            <p>아래의 버튼을 클릭하면 알고리즘에 의해 계산된 추천 종목을 확인할 수 있습니다. </p>
                <p>Click the button below to view the stock recommendations calculated by the algorithm.</p>
                  <div className="button-container">
                    <div className='divStyle'>
                        
                      {isButtonVisible && (
                        <button className = "recButtonRound" onClick={handleRecommendationClick}>알고리즘 추천 종목 확인하기<br></br>(See Algorithm-Recommended Stock)</button>
                        )}
                        {loading && <p>Loading recommendation...</p>}
                        {isRecommendationVisible && (
                          <div>
                            <h3>알고리즘 추천 종목<br></br> (Algorithm-Recommended Stock)</h3>
                            <p>{recommendedStock}</p>
                          </div> 
                        )}
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
                                    <label htmlFor={stock.company_id}>{stock.company_id}</label>
                                </td>
                                <td>
                                    <input
                                    type="radio"
                                    id={stock.company_id}
                                    name="stockSelection"
                                    value={stock.company_id}
                                    checked={selectedStock === stock.company_id}
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
    )}
    </div>
    );
}

export default Round8;