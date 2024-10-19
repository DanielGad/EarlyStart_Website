import React, { useEffect, useState } from 'react';
import Home from "./components/Homepage/Home";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from 'react-router-dom';  // No need for BrowserRouter here
import MathService from "./pages/MathService";
import HomeworkService from "./pages/HomeworkService";
import LetterworkService from "./pages/LetterworkService";
import LanguageService from "./pages/LanguageService";
import InternationalService from "./pages/InternationalService";
import GeneralService from "./pages/GeneralService";
import CallUs from "./pages/CallUs";
import Login from "./pages/Login";
import GetTutor from "./pages/GetTutor";
import TeacherProfile from "./pages/TeacherProfile";
import GetStarted from "./pages/GetStarted";
import Confirmation from "./pages/Confirmation";
import ContactConfirm from "./pages/ContactConfirm";
import UserHomepage from './pages/UserHomepage';
import SignUp from './pages/SignUp';
import { useNavigate } from "react-router-dom";
import { Logout } from '@mui/icons-material';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';

interface User {
  email: string;
  // Add any other fields if necessary, e.g., fullName: string;
}

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    // Update the user state with the logged-in user's information
    setUser({ email });

    // Redirect after successful login
    navigate("/success", { state: { user: { email } } });
  };

  const handleLogout = () => {
    setUser(null);  // Clear the user state
  };

  return (
    <>
      <div className="app">
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
          <Route path="/get-tutor" element={<GetTutor />} />
          <Route path="/profile/:id" element={<TeacherProfile />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/confirm" element={<Confirmation />} />
          <Route path="/contact-confirm" element={<ContactConfirm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/success" element={<UserHomepage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* <Route path="/user-dashboard" element={<UserDashboard />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
