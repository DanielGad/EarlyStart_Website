import React, { useEffect } from 'react';
import './Footer.css';
import Early_Start_Logo from '../../assets/images/Early Start Logo Light.png';
import Email_Icon from '../../assets/images/Early Start email.png';
import WhatsApp_Icon from '../../assets/images/Early Start whatsapp.png';
import Phone_Icon from '../../assets/images/Early Start phone.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../Context/Context';
import { useUserRole } from '../../hooks/AdminRole';

const Footer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const context = useContext(Context);
  if (!context) {
    throw new Error("Footer must be used within a Context provider");
  }
  const { setMenu, menu, isLoggedIn } = context;
  const { userRole } = useUserRole();
  
  return (
    <div className='footer-container'>
      <div className="top-section-container">
      <div className="footer-left">
        <Link to={"/"} onClick={() => {setMenu("home")}}>
        <img src={Early_Start_Logo} alt="EarlyStart Logo" width={"10%"}/>
        </Link>
        <div className='minds'>
        Empowering Young Minds. Unlocking the Benefits of Personalized Online Tutoring with EarlyStart E-Tutors.
      </div>
      </div>
      
      <div className="footer-middle">
        {/* <div className="footer-menu"> */}
          <Link to={"/"} onClick={() => {setMenu("home")}}>Home</Link>
          <div style={{color: "white"}}>Service</div>
          <Link to={"/call"} onClick={() => {setMenu("call")}}>Call Us</Link>
          <Link to={"/login"} style={{color: menu === "login" ? 'rgb(124,70,164)' : ''}} onClick={() => {setMenu("login")}}>
                    {isLoggedIn ? (
                      // If logged in, show 'Dashboard' and direct to appropriate dashboard
                      <div><Link to={userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'}>
                        Dashboard
                      </Link>
                      </div> 
                    ) : (
                      // If not logged in, show 'Login'
                      <Link to="/login">Login</Link>
                    )}
                    {menu === "login" ? <hr /> : <></>}</Link>
        {/* </div> */}
      </div>

      <div className="footer-right">
        <div className="footer-right-text">
          Have questions about our services?<br />Contact Us today!
        </div>
        <div className='footer-contact'>
        <div className="phone-con">
          <img src={Phone_Icon} alt="Phoner Icon" width={"10%"} />
          <div>08062204348, 09131759673</div>
        </div>
        <div className="whatsapp-con">
          <img src={WhatsApp_Icon} alt="WhatsApp Icon" width={"10%"}/>
          <div>09011318999</div>
        </div>
        <div className="email-con">
          <img src={Email_Icon} alt="Email Icon" width={"10%"}/>
          <div>earlystartetutors@gmail.com</div>
        </div>
        </div>
      </div>
      </div>
      <div className='footer-hr'>
      <div className="footer-lower-section">
        <div className="lower-left">
          2024 EarlyStart E-Tutors
        </div>
        <div className="lower-right">
          <div>Terms of Use</div>
          <div>Privacy Policy</div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Footer