import React, { useState, useEffect, useMemo  } from 'react';
import { MY_URL } from '../../url';
import '../style.css';

function ResultFour() { // 수정 1
    const [selectedStock, setSelectedStock] = useState('');
    const [aiRecommendedStock, setAiRecommendedStock] = useState('');
    const [financialData, setFinancialData] = useState([]);
    const [userProfits, setUserProfits] = useState(null);

    useEffect(() => {
        // 로컬 스토리지에서 사용자 이메일과 현재 라운드 정보 가져오기
        const userId = localStorage.getItem('userId');
        const round = 4; // 수정 2
    
        // 사용자가 선택한 주식 정보를 가져오는 요청 보내기
        fetch(`${MY_URL}/api/financialsRoutes/user-selected-stock/${userId}/${round}`)
            .then(response => response.json())
            .then(data => {
                setSelectedStock(data.stock); // 응답 구조에 따라 변경될 수 있음
            })
            .catch(error => console.error('Error fetching user selected stock:', error));
    
        // 재무 정보 가져오기
        fetch(`${MY_URL}/api/financialsRoutes/financials/${round}`) 
            .then(response => response.json())
            .then(data => {
            setFinancialData(data);
            })
            .catch(error => console.error('Error fetching financial data:', error));
    
        // DB에서 현재 라운드에 해당하는 ai 추천 주식 정보 가져오기
        fetch(`${MY_URL}/api/financialsRoutes/aiRecommendations/${round}`)
            .then(response => response.json())
            .then(data => {
                setAiRecommendedStock(data.company_id); // 응답 구조에 따라 변경될 수 있음
            })
            .catch(error => console.error('Error fetching ai recommended stock:', error));
    
        // 사용자 수익 정보 가져오기
        fetch(`${MY_URL}/api/answerRoutes/get-user-profits/${userId}`)
            .then(response => response.json())
            .then(data => {
                setUserProfits(data);
            })
            .catch(error => console.error('Error fetching user profits:', error));
    }, []);
    

    const calculateDifference = (base, future) => {
        return ((future - base) / base * 100).toFixed(2); // 수익률 계산 및 반환
    };

    // 선택된 주식과 AI 추천 주식 정보 필터링
    const selectedStockData = financialData.find(item => item.company_id === selectedStock);
    const aiRecommendedStockData = financialData.find(item => item.company_id === aiRecommendedStock);

    // 전체 주식 목록을 수익률에 따라 정렬
    const sortedFinancialData = financialData.map(item => ({
        ...item,
        profit: calculateDifference(item.base_price, item.future_price)
    })).sort((a, b) => b.profit - a.profit);

    // 가장 높은 수익률의 주식 찾기
    const highestProfitStock = sortedFinancialData[0]?.company_id;

    // profit 계산
    const finalProfit = useMemo(() => {
        if (!userProfits ) {
            return null;
        }
        
        // 수정 3
        let startingCapital = userProfits.profit_3;
        let profitPercentage = 0;

        // selectedStockData의 base_price와 future_price를 사용하여 수익률 계산
        if (selectedStockData) {
            profitPercentage = parseFloat(calculateDifference(selectedStockData.base_price, selectedStockData.future_price));
        }
        
    
        // 계산된 수익률을 사용하여 최종 수익 계산
        const newProfit = startingCapital * (1 + (profitPercentage / 100));
    
        return newProfit.toFixed(2); // 최종 수익을 소수점 둘째 자리까지 표시
    }, [userProfits, selectedStockData]);

    const saveUserProfit = (finalProfit) => {
        const userId = localStorage.getItem('userId'); // 현재 사용자 이메일
        const round = 4; // 수정 4
    
        // fetch 호출 결과인 Promise를 반환
        return fetch(`${MY_URL}/api/answerRoutes/update-profits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                round: round,
                profit: finalProfit
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); // 성공 메시지 로그 출력
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // 에러를 호출자에게 전파
        });
    };  


    return (
        <div className='result-container'>
            <h2>Round 4 Result</h2> {/* 수정 5 */}
            <div>
                <h3>투자자가 선택한 종목 (Selected Stock): {selectedStockData?.company_id}</h3>
                <p>기존 주가 (Base price): {selectedStockData?.base_price}</p>
                <p>3개월 후 주가 (Price after three months): {selectedStockData?.future_price}</p>
            </div>
            <div>
                <h3>AI 추천 종목 (AI Recommended Stock): {aiRecommendedStockData?.company_id}</h3>
                <p>기존 주가 (Base price): {aiRecommendedStockData?.base_price}</p>
                <p>3개월 후 주가 (Price after three months): {aiRecommendedStockData?.future_price}</p>
            </div>
            <h3>모든 종목의 주가 정보 (All Stocks Performance)</h3>
            <table className='performanceTable'>
                <thead>
                    <tr>
                        <th>회사명 (Company)</th>
                        <th>기존 가격 (Base Price)</th>
                        <th>3개월 후 주가 (Price after three months)</th>
                        <th>수익률 (Profit) (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFinancialData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.company_id}</td>
                            <td>{item.base_price}</td>
                            <td>{item.future_price}</td>
                            <td>{item.profit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <p>가장 높은 수익의 종목 (Highest Profit Stock): {highestProfitStock}</p>
                <p>4라운드 후 투자자의 누적 수익 (Cumulative Profit after Round 4): {finalProfit}</p> {/* 수정 6 */}
            </div>
            <div className='buttonCenter'>
            <button className="btn-green" onClick={() => {
                saveUserProfit(finalProfit).then(() => {
                    window.location.href = '/1/round-five'; // {/* 수정 7 */}
                })
                .catch(error => {
                    // 에러 처리 로직
                    alert("Failed to save profit. Please try again.");
                });
            }}>다음 라운드 (Next Round)</button>
        </div></div>
    );
}

export default ResultFour;
