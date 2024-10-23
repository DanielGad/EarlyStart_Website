import React, { useEffect, useState } from 'react';
import Home from "./components/Homepage/Home";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from 'react-router-dom'; 
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
import UserDashboard from './pages/User/UserDashboard';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import SendMessage from './pages/Admin/SendMessage';
import Messages from './pages/User/Messages';

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/send-message" element={<SendMessage />} />
        <Route path="/messages" element={<Messages />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
