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
import ManageAccount from './pages/Admin/ManageAccount';
import SetPassword from './pages/SetPassword';
import ProtectedRoute from './hooks/ProtectedRoute';
import AdminRole from './hooks/AdminRole';
import AdminAction from './pages/Admin/AdminAction';
import ForgottenPassword from './pages/ForgottenPassword';

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
          <Route path="/mathematics" element={<MathService />} />
          <Route path="/homework" element={<HomeworkService />} />
          <Route path="/letterwork" element={<LetterworkService />} />
          <Route path="/language" element={<LanguageService />} />
          <Route path="/international" element={<InternationalService />} />
          <Route path="/general" element={<GeneralService />} />
          <Route path="/call" element={<CallUs />} />
          <Route path="/get-tutor" element={<GetTutor />} />
          <Route path="/profile/:id" element={<TeacherProfile />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

            
            <Route path="/confirm" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
            <Route path="/reset-password" element={<ForgottenPassword />} />
            <Route path="/contact-confirm" element={<ContactConfirm />} />
            <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminRole><AdminDashboard /></AdminRole></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/send-message" element={<ProtectedRoute><AdminRole><SendMessage /></AdminRole></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/manage-accounts" element={<ProtectedRoute><AdminRole><ManageAccount /></AdminRole></ProtectedRoute>} />
            <Route path="/set-password" element={<ProtectedRoute><SetPassword /></ProtectedRoute>} />
            {/* <Route path="/actions" element={<ProtectedRoute><AdminAction /></ProtectedRoute>} /> */}


        </Routes>
      </div>
    </>
  );
}

export default App;
