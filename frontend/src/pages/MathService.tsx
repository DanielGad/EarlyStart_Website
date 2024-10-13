import React, { useEffect } from 'react';
import '../assets/styles/MathService.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image from '../assets/images/mother-helping.jpg';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';
import Action from '../components/Action/Action';

const MathService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="math-service-container">
      <div className="math-row-1">
        <div className="column-1-left">
          <div className="head-text">Mastering Math Made Easy Achieve More, Learn Faster, and Excel!</div>
          <div className="head-inner-text">
          Unlock 24/7 support from EarlyStart E-Tutors. Our expert tutors help kids excel in Number Work, Quantitative Reasoning, and Mathematics, ensuring homework is done correctly and preparing them for exams. <br /> <br />Get Started Now with just a Click!
          </div>
          <Link to={"/get-started"}>
            <div className='gs-button-control'><button className="get-started-button">Get Started Now <ArrowDropRightIcon className='arrow-right'/></button></div>
          </Link>

        </div>
        <div className="column-1-right">
          <div className="math-image-1">
            <img src={General_Image} alt="" width={"20%"} />
          </div>
          <div className="math-image-2">
          <img src={General_Image} alt="" width={"20%"} />
          </div>
          <div className="math-image-3">
          <img src={General_Image} alt="" width={"20%"} />
          </div>
          <div className="math-image-4">
          <img src={General_Image} alt="" width={"20%"} />
          </div>
        </div>
      </div>

      <div className="math-row-2">
        <div className="math-2-image">
          <img src={General_Image} alt="" width={"50%"}/>
        </div>
        <div className="math-2-inner">
          <div className="math-2-head-text">
            About Our Math Support
          </div>
          <div className='math-2-inner-con'>
          <div className="math-2-inner-text">
          Give your child the focused attention they need to excel in Number Work, Quantitative Reasoning, and Mathematics with EarlyStart E-Tutors. Our specialized services ensure your child builds a solid foundation in these essential subjects. 
          </div>
          <div className="math-2-inner-text">
          If you are a busy parent, our program offers more than just academic support. We teach crucial study skills and problem-solving techniques to help your child succeed and develop interest for learning. 
          </div>
          <div className="math-2-inner-text">
          EarlyStart E-Tutors offers personalized, interactive tutoring designed specifically for primary school students, provided by expert educators in Number Work, Quantitative Reasoning, and Mathematics. Elevate your child's learning experience with EarlyStart E-Tutors.
          </div>
          </div>
        </div>
      </div>

      <Action />

      <Footer />
    </div>
  )
}

export default MathService