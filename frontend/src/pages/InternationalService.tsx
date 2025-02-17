import React, { useEffect } from "react"
import '../assets/styles/InternationalService.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image from '../assets/images/i-children.jpeg';
import General_Imaged from '../assets/images/i-image.png';
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
          Excel in School Enterance Examination with EarlyStart E-Tutors 
          </div>
          <div className="is-row-1-col-1-inner">
            Excel in School Enterance Examination and secure your spot <br /> <br />
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
          <img src={General_Imaged} alt="" width={"50%"}/>
        </div>
        <div className="lw-row-2-col-2">
          <div className="lw-row-2-col-2-htext">
            Preparation for Entrance Examinations
          </div>
          <div className="lw-row-2-col-2-text">
            <p>At EarlyStart E-Tutors, we provide comprehensive preparation for international school entrance examination. Our specialized services cover essential languages, core subjects, and effective examination strategies, ensuring your child is well-equipped for success.</p>
            <p>Comprehensive Preparation
              <ul><li> Core Subjects: Mathematics, English, and Science.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Critical Thinking: Improve problem-solving and analytical skills. </li></ul>
            </p>
            <p>Examination Strategies
              <ul><li>Effective Techniques: Learn strategies for various question types. </li></ul>
              <ul><li style={{marginTop: "-10px"}}>Time Management: Master time management for examination. </li></ul>
            </p>
            <p>Personalized Tutoring
              <ul><li> Tailored Plans: Customized study plans to meet individual needs. </li></ul>
              <ul><li style={{marginTop: "-10px"}}>Expert Educators: Experienced tutors specialized in entrance examination. </li></ul>
            </p>
            <p>Confidence Building
              <ul><li>Continuous Assessment: Simulated tests to build confidence.</li></ul>
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