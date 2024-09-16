import React from "react"
import '../assets/styles/Confirmation.css';
import Tick from '../assets/images/tick.png';
import { Link } from 'react-router-dom';

const ContactConfirm = () => {
  return (
    <div className='confirm-container'>
      <img src={Tick} alt="green tick" width={"200px"}/>
      <p className='p-head'>Thank You!</p>
      <p className='p-message'>Thank You for getting in touch with Early Start Tutors! We've received your request and are excited to assist you.</p>
      <p className='p-message'>Our team is reviewing your information, and we aim to get back to you within the next 24 hours. If you don't hear from us within that timeframe, please feel free to follow up by sending an email to support@earlystartetutors.com.</p>
      <p className='p-message'>We appreciate your patience and look forward to helping your child achieve their academic goals.</p>
      <p className='p-message'>Best regards, <br />
      The Early Start Tutors Team</p>
      <Link to={"/"} className='backhome' style={{marginBottom: "100px"}}>Back to homepage</Link>
    </div>
  )
}

export default ContactConfirm