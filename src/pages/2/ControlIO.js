import React, { useState, useEffect } from 'react';
import './Control.css'; // 스타일 파일을 불러옵니다.
import containerStyles from './ContainerStyles';
import { MY_URL } from '../../url';


function Control() {
  const [financialData, setFinancialData] = useState([]);
  const [isRecommendationVisible, setIsRecommendationVisible] = useState(false);
  const [recommendedStock, setRecommendedStock] = useState(null);
  const [selectedStock, setSelectedStock] = useState('');

  
  useEffect(() => {
      // 백엔드에서 financials 데이터를 가져오는 로직
      fetch(`${MY_URL}/api/financialsRoutes`)
        .then(response => response.json())
        .then(data => setFinancialData(data))
        .catch(error => console.error('Error fetching financial data:', error));
    }, []);
  
  // AI 추천 종목 표시 및 클릭 이벤트 핸들러
  const handleRecommendationClick = () => {
    // 이미 AI 추천이 보이는 상태일 경우 아무 작업도 수행하지 않음
    if (isRecommendationVisible) return;
  
    // AI 추천을 보겠냐는 alert 메시지 출력
    const wantsRecommendation = window.confirm("Do you want to see the AI recommendation?");
  
    if (wantsRecommendation) {
      // 사용자가 'Yes'를 선택한 경우
      // setRecommendedStock('Recommended Stock'); // 예시로 'Recommended Stock'을 설정, 실제 구현에 따라 변경 필요
      setIsRecommendationVisible(true);
      saveResponseToDB('yes');
    } else {
      saveResponseToDB('no');
    }
  };

  const saveResponseToDB = async (response) => {
    const userEmail = localStorage.getItem('userId'); // 로그인된 사용자의 이메일
    try {
      await fetch(`${MY_URL}/api/answerRoutes/ai-recommendation-response`, { // 경로 수정
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, response }),
      });
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };
  // 투자 결정 버튼 클릭 핸들러
  const handleInvestButtonClick = async () => {
    const userEmail = localStorage.getItem('userId'); // 로그인된 사용자의 이메일
    try {
      await fetch(`${MY_URL}/api/answerRoutes/invest-decision`, { // 경로 수정
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, selectedStock }),
      });
      alert('Investment decision saved successfully.');
    } catch (error) {
      console.error('Error saving investment decision:', error);
    }
  };

  const handleRecommendationClick2 = () => {
    setRecommendedStock('Recommended Stock');
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
    <div>
    <div className="exp-container">
      <div>
        <div>
          <h2>Experiment One (Control)</h2>
          <div style={containerStyles(false)}>
            <h3>Stock Prices:</h3>
            <table className='financialTable'>
                        <thead>
                            <tr>
                            <th>Symbol</th>
                            <th>Close</th>
                            <th>Gross Profit</th>
                            <th>EBITDA</th>
                            <th>Operating Income</th>
                            <th>Income Before Tax</th>
                            <th>Net Income</th>
                            <th>EPS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {financialData.map((stock, index) => (
                            <tr key={index}>
                                <td>{stock.symbol}</td>
                                <td>${formatNumber(stock.close)}</td>
                                <td>${formatNumber(stock.grossProfit)}</td>
                                <td>${formatNumber(stock.ebitda)}</td>
                                <td>${formatNumber(stock.operatingIncome)}</td>
                                <td>${formatNumber(stock.incomeBeforeTax)}</td>
                                <td>${formatNumber(stock.netIncome)}</td>
                                <td>{stock.eps.toFixed(2)}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
          </div>
          <div>
            <div>
              <div>
                <div>
                    <button className = "recButton" onClick={handleRecommendationClick}>AI Recommendation</button>
                </div>
              </div>
              {/* Recommendation 버튼 클릭 시 보여지는 내용 */}
              {isRecommendationVisible && (
                <div>
                  <h3>Answer the following questions:</h3>
                  <fieldset>
                  <div className="question">
                    <label>1. Investment Preference:</label>
                    <div className="radio-options">
                      <label>
                        <input
                          type="radio"
                          className="radio"
                          name="investmentPreference"
                          value="Risk"
                          id="Risk"
                          onChange={(e) => handleStockSelectionChange('investmentPreference', e.target.value)}
                        />
                        <label class='word'>Risk</label>
                      </label>
                      <label>
                        <input
                          type="radio"
                          className="radio"
                          name="investmentPreference"
                          value="Safety"
                          id="safety"
                          onChange={(e) => handleStockSelectionChange('investmentPreference', e.target.value)}
                        />
                        <label className='word'>Safety</label>
                      </label>
                    </div>
                  </div>
                  </fieldset>
                  <fieldset>
                  <div className="question">
                    <label>2. Industry Preference:</label>
                    <select
                      onChange={(e) => handleStockSelectionChange('industryPreference', e.target.value)}
                    >
                      <option value="">Select</option>
                      {/* 산업 종류 옵션 추가 */}
                      <option value="a">a</option>
                      <option value="b">b</option>
                      <option value="c">c</option>
                      {/* 나머지 옵션들도 유사하게 추가 */}
                    </select>
                  </div>
                  </fieldset>
                  <fieldset>
                  <div className="question">
                    <label>3. Revenue:</label>
                    <div className="radio-options">
                      <label>
                        <input
                          type="radio"
                          className = "radio"
                          name="revenue"
                          value="High"
                          id="high"
                          onChange={(e) => handleStockSelectionChange('revenue', e.target.value)}
                        />
                        <label className='word'>High</label>
                      </label>
                      <label>
                        <input
                          type="radio"
                          className = "radio"
                          name="revenue"
                          value="Low"
                          id="low"
                          onChange={(e) => handleStockSelectionChange('revenue', e.target.value)}
                        />
                        <label className='word'>Low</label>
                      </label>
                    </div>
                  </div>
                  </fieldset>
                  <fieldset>
                  <div className="question">
                    <label>4. Operating Income:</label>
                    <div className="radio-options">
                      <label>
                        <input
                          type="radio"
                          className = "radio"
                          name="operatingIncome"
                          value="High"
                          id="High"
                          onChange={(e) => handleStockSelectionChange('operatingIncome', e.target.value)}
                        />
                        <label className='word'>High</label>
                      </label>
                      <label>
                        <input
                          type="radio"
                          className = "radio"
                          name="operatingIncome"
                          value="Low"
                          id="low"
                          onChange={(e) => handleStockSelectionChange('operatingIncome', e.target.value)}
                        />
                        <label className='word'>Low</label>
                      </label>
                    </div>
                  </div>
                  </fieldset>
                  <fieldset>
                  <div className="question">
                    <label>5. Market Cap:</label>
                    <div className="radio-options">
                      <label>
                        <input
                          type="radio"
                          className = "radio"
                          name="marketCap"
                          value="High"
                          id="High"
                          onChange={(e) => handleStockSelectionChange('marketCap', e.target.value)}
                        />
                        <label class = 'word'>High</label>
                      </label>
                      <label>
                        <input
                          type="radio"
                          className = "radio"
                          name="marketCap"
                          value="Low"
                          id="Low"
                          onChange={(e) => handleStockSelectionChange('marketCap', e.target.value)}
                        />
                        <label className='word'>Low</label>
                      </label>
                    </div>
                  </div>
                  </fieldset>
                  <button onClick={handleRecommendationClick2}>Check AI Recommendation</button>
                        {isRecommendationVisible && (
                            <div>
                            <h3>AI Recommendation:</h3>
                            <p>{recommendedStock}</p>
                            </div>
                        )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="center-container">
        <button onClick={handleInvestButtonClick}>Make Invest Decision</button>
      </div>
    </div>
  );
}

export default Control;
