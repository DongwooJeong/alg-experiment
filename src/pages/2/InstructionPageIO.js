import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';

function InstructionPage() {
  const [language, setLanguage] = useState('EN'); // 기본 언어를 영어로 설정

  const instructions = {
    EN: {
      title: "Instructions",
      description: "Thank you for participating in our study! This research is designed to analyze the impact of algorithm-based stock recommendation systems on investment decisions. Participants will go through a total of 10 rounds. In each round, information on five different stocks and key indicators (e.g., Market Capitalization, Dividend Yield etc.) will be provided. Based on the information provided, your task is to select the stock that you anticipate will yield the highest return after three months.",
      procedure: [
        "Information on five different stocks will be provided in each round.",
        "Participants may receive algorithm-based recommendations, which is designed to predict the stocks with the highest potential returns.",
        "Participants in the experiment rank the importance of each indicator based on its potential impact on returns over the next three months. The algorithm then uses these results to calculate and recommend a stock",
        "After each round, you will be able to see the actual returns of the stock you selected after three months, the returns of the algorithm-recommended stock, and the returns of each of the other stocks.",
        "Participants will receive an initial investment fund of $1,000 in the first round.",
        "After making an investment decision each round, the remaining funds will be adjusted based on the returns of the chosen stocks.",
        "The goal of this investment experiment is to have the most funds possible at the end of the 10 rounds.",
        "After completing all rounds, please participate in a brief survey about the experiment."
      ],
      benefits: [
        "All participants will receive a token of appreciation in the form of a gift card.",
        "The participant with the highest amount of money at the end of the experiment will receive a gift card worth 30,000 KRW."
      ],
      notes: ["Each round must be completed within 3 minutes.", "Once a choice is made, it cannot be changed.", "All rounds are independent; the result of one round does not affect the choices in subsequent rounds."],
      please: ["Please refrain from using the back button or refreshing the page that could affect the outcome of the experiment.", "During the experiment, please refrain from visiting other websites or using applications.", "Please refrain from conversing with others during the experiment."]
    },
    
    KR: {
      title: "실험 설명",
      description: "저희 연구에 참여해 주셔서 감사합니다! 이 연구는 알고리즘 기반 주식 종목 추천 시스템이 투자 결정에 미치는 영향을 분석하고자 설계되었습니다. 참가자는 총 10 라운드를 진행하게 됩니다. 각 라운드에서는 다섯 가지의 주식 종목과 주요 지표들(예: 시가총액, 배당수익성 등)이 제공됩니다. 제공된 정보를 바탕으로 3개월 후 가장 높은 수익을 낼 것으로 예상되는 주식을 선택하는 것이 과제입니다.",
      procedure: [
        "각 라운드마다 다섯 가지의 주식에 대한 정보가 제공됩니다.",
        "실험 참가자는 알고리즘 추천을 받을 수 있으며, 이는 가장 높은 수익 잠재력을 가진 주식을 예측하도록 설계되었습니다.",
        "실험 참가자는 각 지표가 3개월 후의 수익률에 미칠 영향에 대한 중요도를 평가하여 순위를 매깁니다. 알고리즘은 이 결과를 기반으로 계산하여 종목을 추천합니다",
        "각 라운드 후에는 선택한 주식의 실제 3개월 후의 수익률, 알고리즘이 추천한 주식의 수익률, 그리고 나머지 각 주식의 수익률을 확인할 수 있습니다.",
        "실험 참가자는 첫 번째 라운드에서 투자 자금 1,000달러를 지급받습니다.",
        "매 라운드에서 투자 결정을 내린 후, 보유하고 있는 자금은 선택한 종목의 수익률을 반영하여 조정됩니다.",
        "10번의 라운드가 모두 끝났을 때 최대한 많은 자금을 보유하는 것이 이번 투자 실험의 과제입니다.",
        "모든 라운드를 완료한 후, 실험에 대한 간단한 설문조사에 참여해 주세요."
      ],
      benefits: [
        "모든 참가자에게는 참여 감사의 표시로 소정의 상품권이 제공됩니다.",
        "실험 종료 시 가장 많은 금액을 보유한 참가자에게는 30,000원 상당의 상품권이 주어집니다!"
      ],
      notes: ["각 라운드는 3분 이내에 종료해야 합니다.", "선택을 한 번 하면 변경할 수 없습니다.", "모든 라운드는 서로 독립적입니다; 한 라운드의 결과가 다음 라운드의 선택에 영향을 미치지 않습니다."],
      please: ["뒤로 가기 버튼이나 새로고침 등 실험 결과에 영향을 미칠 수 있는 행동은 자제해 주십시오.", "실험 도중에는 다른 웹사이트 혹은 다른 애플리케이션을 사용하지 마시기 바랍니다.","실험 동안 주변 사람과의 대화는 자제해 주시기 바랍니다."]
    }    
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="instruction-container">
      <div className="instruction-box">
      <div className="language-switcher">
          <button 
            className={`btn-switch ${language === 'EN' ? 'active' : ''}`} 
            onClick={() => handleLanguageChange('EN')}
          >
            English
          </button>
          <button 
            className={`btn-switch ${language === 'KR' ? 'active' : ''}`} 
            onClick={() => handleLanguageChange('KR')}
          >
            한글
          </button>
        </div>  
        <h2>{instructions[language].title}</h2>
        <p>{instructions[language].description}</p>
        <p><strong>실험 절차 (Experiment Procedure):</strong></p>
        <ol>
          {instructions[language].procedure.map(step => <li key={step}>{step}</li>)}
        </ol>
        <p><strong>참여 혜택 (Participation Benefits):</strong></p>
        <ul>
          {instructions[language].benefits.map(benefit => <li key={benefit}>{benefit}</li>)}
        </ul>
        <p><strong>참고 사항 (Notes):</strong></p>
        <ul>
          <p>{instructions[language].notes.map(notes => <li key={notes}>{notes}</li>)}</p>
        </ul>
        <p><strong>주의 사항 (Please Notes):</strong></p>
        <ul>
          <p>{instructions[language].please.map(please => <li key={please}>{please}</li>)}</p>
        </ul>
      </div>
      <div className="button-box">
        <Link to="/2/round-one">
          <button className="btn-green">Begin Experiment</button>
        </Link>
      </div>
    </div>
  );
}
export default InstructionPage;
