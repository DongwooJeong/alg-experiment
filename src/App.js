import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/1/LoginPage';
import RegisterPage from './pages/1/RegisterPage';
import ForgotPassword from './pages/1/ForgotPassword';
import BeforeSurvey from './pages/1/BeforeSurvey';
import InstructionPage from './pages/1/InstructionPage';
import Round1 from './pages/1/Round1';
import Round2 from './pages/1/Round2';
import Round3 from './pages/1/Round3';
import Round4 from './pages/1/Round4';
import Round5 from './pages/1/Round5';
import Round6 from './pages/1/Round6';
import Round7 from './pages/1/Round7';
import Round8 from './pages/1/Round8';
import Round9 from './pages/1/Round9';
import Round10 from './pages/1/Round10';
import ResultOne from './pages/1/ResultOne';
import ResultTwo from './pages/1/ResultTwo';
import ResultThree from './pages/1/ResultThree';
import ResultFour from './pages/1/ResultFour';
import ResultFive from './pages/1/ResultFive';
import ResultSix from './pages/1/ResultSix';
import ResultSeven from './pages/1/ResultSeven';
import ResultEight from './pages/1/ResultEight';
import ResultNine from './pages/1/ResultNine';
import ResultTen from './pages/1/ResultTen';
import AfterSurvey from './pages/1/AfterSurvey';
import ThankYou from './pages/1/ThankYou';

import LoginPageIO from './pages/2/LoginPageIO';
import RegisterPageIO from './pages/2/RegisterPageIO';
import ForgotPasswordIO from './pages/2/ForgotPasswordIO';
import BeforeSurveyIO from './pages/2/BeforeSurveyIO';
import InstructionPageIO from './pages/2/InstructionPageIO';
import Round1IO from './pages/2/Round1IO';
import Round2IO from './pages/2/Round2IO';
import Round3IO from './pages/2/Round3IO';
import Round4IO from './pages/2/Round4IO';
import Round5IO from './pages/2/Round5IO';
import Round6IO from './pages/2/Round6IO';
import Round7IO from './pages/2/Round7IO';
import Round8IO from './pages/2/Round8IO';
import Round9IO from './pages/2/Round9IO';
import Round10IO from './pages/2/Round10IO';
import ResultOneIO from './pages/2/ResultOneIO';
import ResultTwoIO from './pages/2/ResultTwoIO';
import ResultThreeIO from './pages/2/ResultThreeIO';
import ResultFourIO from './pages/2/ResultFourIO';
import ResultFiveIO from './pages/2/ResultFiveIO';
import ResultSixIO from './pages/2/ResultSixIO';
import ResultSevenIO from './pages/2/ResultSevenIO';
import ResultEightIO from './pages/2/ResultEightIO';
import ResultNineIO from './pages/2/ResultNineIO';
import ResultTenIO from './pages/2/ResultTenIO';
import AfterSurveyIO from './pages/2/AfterSurveyIO';
import ThankYouIO from './pages/2/ThankYouIO';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/1/" element={<LoginPage />} />
        <Route path="/1/register" element={<RegisterPage />} />
        <Route path="/1/forgot-password" element={<ForgotPassword />} />
        <Route path="/1/before-survey" element={<BeforeSurvey />} />
        <Route path="/1/instruction-page" element={<InstructionPage />} />
        <Route path="/1/round-one" element={<Round1 />} />
        <Route path="/1/result-one" element={<ResultOne />} />
        <Route path="/1/round-two" element={<Round2 />} />
        <Route path="/1/result-two" element={<ResultTwo />} />
        <Route path="/1/round-three" element={<Round3 />} />
        <Route path="/1/result-three" element={<ResultThree />} />
        <Route path="/1/round-four" element={<Round4 />} />
        <Route path="/1/result-four" element={<ResultFour />} />
        <Route path="/1/round-five" element={<Round5 />} />
        <Route path="/1/result-five" element={<ResultFive />} />
        <Route path="/1/round-six" element={<Round6 />} />
        <Route path="/1/result-six" element={<ResultSix />} />
        <Route path="/1/round-seven" element={<Round7 />} />
        <Route path="/1/result-seven" element={<ResultSeven />} />
        <Route path="/1/round-eight" element={<Round8 />} />
        <Route path="/1/result-eight" element={<ResultEight />} />
        <Route path="/1/round-nine" element={<Round9 />} />
        <Route path="/1/result-nine" element={<ResultNine />} />
        <Route path="/1/round-ten" element={<Round10 />} />
        <Route path="/1/result-ten" element={<ResultTen />} />
        <Route path="/1/after-survey" element={<AfterSurvey />} />
        <Route path="/1/thank-you" element={<ThankYou />} />

        <Route path="/2/" element={<LoginPageIO />} />
        <Route path="/2/register" element={<RegisterPageIO />} />
        <Route path="/2/forgot-password" element={<ForgotPasswordIO />} />
        <Route path="/2/before-survey" element={<BeforeSurveyIO />} />
        <Route path="/2/instruction-page" element={<InstructionPageIO />} />
        <Route path="/2/round-one" element={<Round1IO />} />
        <Route path="/2/result-one" element={<ResultOneIO />} />
        <Route path="/2/round-two" element={<Round2IO />} />
        <Route path="/2/result-two" element={<ResultTwoIO />} />
        <Route path="/2/round-three" element={<Round3IO />} />
        <Route path="/2/result-three" element={<ResultThreeIO />} />
        <Route path="/2/round-four" element={<Round4IO />} />
        <Route path="/2/result-four" element={<ResultFourIO />} />
        <Route path="/2/round-five" element={<Round5IO />} />
        <Route path="/2/result-five" element={<ResultFiveIO />} />
        <Route path="/2/round-six" element={<Round6IO />} />
        <Route path="/2/result-six" element={<ResultSixIO />} />
        <Route path="/2/round-seven" element={<Round7IO />} />
        <Route path="/2/result-seven" element={<ResultSevenIO />} />
        <Route path="/2/round-eight" element={<Round8IO />} />
        <Route path="/2/result-eight" element={<ResultEightIO />} />
        <Route path="/2/round-nine" element={<Round9IO />} />
        <Route path="/2/result-nine" element={<ResultNineIO />} />
        <Route path="/2/round-ten" element={<Round10IO />} />
        <Route path="/2/result-ten" element={<ResultTenIO />} />
        <Route path="/2/after-survey" element={<AfterSurveyIO />} />
        <Route path="/2/thank-you" element={<ThankYouIO />} />
      </Routes>
    </Router>
  );
}

export default App;