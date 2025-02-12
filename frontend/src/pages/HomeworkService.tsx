import React, { useEffect } from "react"
import '../assets/styles/HomeworkService.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BoyDad from '../assets/images/img8.jpg';
import GirlDad from '../assets/images/img17.jpg';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';
import Action from "../components/Action/Action";

const HomeworkService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="homework-container">
      <div className="homework-row-1">
        <div className="circle">00</div>
        <div className="circle-2">00</div>
        <div className="circle-3">00</div>
        <div className="circle-4">00</div>
        <div className="homework-col-1">
          <div className="homework-col-1-head-text">
            Simplifying Homework Help
          </div>
          <div className="homework-col-1-inner-text">
          Access round-the-clock support from EarlyStart E-Tutors. With EarlyStart E-Tutors, your child gets the help they need for school assignments. Our expert tutors ensure comprehension and success in his/her studies. <br /> <br />
            Get Started Today with just a Click!
          </div>
          <Link to={"/get-started"}>
            <div><button className="homework-col-1-button">Get Started Now <ArrowDropRightIcon className='arrow-right'/></button></div>
          </Link>
        </div>
        <div className="homework-col-2">
          <img src={BoyDad} alt="" width={"50%"}/>
        </div>
      </div>

      <div className="homework-row-2">
        <div className="homework-col-2-image">
          <img src={GirlDad} alt="" width={"50%"} />
        </div>
        <div className="homework-col-2-text">
          <div className="homework-col-2-head-text">
            About Our Homework Support
          </div>
          <div className="homework-col-2-inner-text">
            <p>At EarlyStart E-Tutors, we understand that homework/school assignments can be challenging for both children and their parents. That’s why we offer comprehensive support to ensure your child not only completes his/her assignments but also understand the underlying concepts. </p>
            <p>Our Homework/School Assignment Support Service include</p>
            <p>1. Guided Assistance: Expert tutors guide your child through his/her homework, ensuring they understand each step and can apply the concepts independently. </p>
            <p>2. Skill Reinforcement: We focus on reinforcing skills learned in school, ensuring that your child builds a strong foundation in every subject(s).</p>
            <p>3. Time Management and Study Skills: We teach essential time management and study skills, helping your child become more organized and efficient in his/her studies. </p>
            <p>4. Tailored Approach: Recognizing that every child learns differently, our tutors customize their approach to meet the unique needs and learning ability of your child. </p>
            <p>5. Interactive Learning: Our engaging, interactive sessions make learning enjoyable, helping your child develop a positive attitude towards his/her schoolwork.</p>
            <p>Whether your child needs help with daily homework, take home projects, or preparing for specific examination, EarlyStart E-Tutors is here to support him/her. With our dedicated tutors, your child will gain confidence, improve his/her academic performance, and develop a interest for learning.</p>
          </div>
        </div>
      </div>
      <Action />
      <Footer />
    </div>
  )
}

export default HomeworkService