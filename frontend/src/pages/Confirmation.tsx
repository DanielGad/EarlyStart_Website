import React, { useEffect } from "react"
import '../assets/styles/Confirmation.css';
import Tick from '../assets/images/tick.png';
import { Link } from 'react-router-dom';

const Confirmation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className='confirm-container'>
      <img src={Tick} alt="green tick" width={"200px"}/>
      <p className='p-head'>Thank You!</p>
      <p className='p-message'>Thank You for getting started with our tutoring program! If you haven't heard from us within 24 hours, please don't hesitate to send a follow-up email to support@earlystartetutors.com. We appreciate your patience and look forward to helping your child succeed.</p>
      <Link to={"/"} className='backhome'>Back to homepage</Link>
    </div>
  )
}

export default Confirmation