import Home from "./components/Homepage/Home";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MathService from "./pages/MathService";
import HomeworkService from "./pages/HomeWorkService";
import LetterworkService from "./pages/LetterworkService";
import LanguageService from "./pages/LanguageService";
import InternationalService from "./pages/InternationalService";
import GeneralService from "./pages/GeneralService";
import CallUs from "./pages/CallUs";
import Login from "./pages/Login";

function App() {
  

  return (
    <>
      <div className="app">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/math" element={<MathService />} />
            <Route path="/homework" element={<HomeworkService />} />
            <Route path="/letterwork" element={<LetterworkService />} />
            <Route path="/language" element={<LanguageService />} />
            <Route path="/international" element={<InternationalService />} />
            <Route path="/general" element={<GeneralService />} />
            <Route path="/call" element={<CallUs />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
