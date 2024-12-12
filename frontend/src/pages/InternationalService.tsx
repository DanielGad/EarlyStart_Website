import React, { useEffect } from "react"
import '../assets/styles/InternationalService.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image from '../assets/images/mother-helping.jpg';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';
import Action from "../components/Action/Action";

const InternationalService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="is-container">
      <div className="is-row-1">
        <div className="is-row-1-col-1">
          <div className="is-row-1-col-1-htext">
          Excel in International School Enterance with EarlyStart E-Tutors 
          </div>
          <div className="is-row-1-col-1-inner">
            Excel in International Enterance Examination and secure your spot <br /> <br />
            Kickstart your preparation with just one Click!
          </div>
          <Link to={"/get-started"}>
            <div><button className="get-started">Get Started Now! <ArrowDropRightIcon className='arrow-right'/></button></div>  
          </Link>
        </div>
        <div className="is-row-1-col-2">
          <img src={General_Image} alt="" width={"50%"}/>
        </div>
      </div>
      
      <div className="lw-row-2">
        <div className="lw-row-2-col-1">
          <img src={General_Image} alt="" width={"50%"}/>
        </div>
        <div className="lw-row-2-col-2">
          <div className="lw-row-2-col-2-htext">
            About International School Enterance
          </div>
          <div className="lw-row-2-col-2-text">
            <p>At EarlyStart E-Tutors, we provide comprehensive preparation for international school entrance exams. Our specialized services cover essential languages, core subjects, and effective exam strategies, ensuring your child is well-equipped for success.</p>
            <p>Comprehensive Preparation
              <ul><li> Core Subjects: Strengthen Math, English, and Science.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Critical Thinking: Improve problem-solving and analytical skills. </li></ul>
            </p>
            <p>Exam Strategies
              <ul><li>Effective Techniques: Learn strategies for various question types. </li></ul>
              <ul><li style={{marginTop: "-10px"}}>Time Management: Master time management for exams. </li></ul>
            </p>
            <p>Personalized Tutoring
              <ul><li> Tailored Plans: Customized study plans to meet individual needs. </li></ul>
              <ul><li style={{marginTop: "-10px"}}>Expert Educators: Experienced tutors specialized in entrance exams. </li></ul>
            </p>
            <p>Confidence Building
              <ul><li>Mock Exams: Simulated tests to build confidence.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Feedback: Constructive feedback to focus on improvement</li></ul>
            </p>
          </div>
        </div>
      </div>
      <Action />
      <Footer />
    </div>
  )
}

export default InternationalService