import React from "react"
import '../assets/styles/CallUs.css';
import Background from '../assets/images/customer-care.jpg';
import { Label } from "@mui/icons-material";
import Footer from "../components/Footer/Footer";
const CallUs = () => {
  return (
      <>
      <div className="get-s-container">
        <div className="contact-us">Contact Us</div>
      </div>
      <div className="get-s-container-main">
        <div className="get-s-tmain">Feel free to contact us for Inquiries and Updates.</div>
        <div className="goal">Our goal is to respond to all inquiries within 48 hours. For details information about our program, please explore the full app directory using our sitemap. </div>

        <div className="contact-line">Contact us by email</div>
        <hr className="hr-contact-line"/>

        <div className="instruction">Please complete the form below with your details, and we will strive to respond to you as promptly as we can.</div>
      <div className="section-divide">
        <div className="contact-form">
          <form action="">
            <label>Full Name</label><br />
          <textarea rows={1} required/>
          <br />
          <label>Email Address</label><br />
          <textarea rows={1} required/>
          <br />
          <label>Message</label><br />
          <textarea rows={4} required/>
          <div className="button-controll"><button className="contact-submit">Submit</button></div>
          
          </form>
          
        </div>
        <div className="contact-image">
          <img src={Background} alt="contact-image" />
        </div>
      </div>

      </div>

      <Footer />
      </>
  )
}

export default CallUs