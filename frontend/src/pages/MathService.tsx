import React, { useEffect } from 'react';
import '../assets/styles/MathService.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Child1 from '../assets/images/m-boy-1.png';
import Child2 from '../assets/images/m-lady-1.png';
import Child3 from '../assets/images/m-girl-1.png';
import Child4 from '../assets/images/m-boy-2.png';
import Child5 from '../assets/images/img6.jpg';
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
          <div className="head-text">Mastering Mathematics Made Easy, Learn Faster, and Excel!</div>
          <div className="head-inner-text">
          Unlock 24/7 support from EarlyStart E-Tutors. Our expert tutors help kids excel in Number Work, Quantitative Reasoning, and Mathematics, ensuring homework is done correctly and preparing them for examination. <br /> <br />Get Started Now with just a Click!
          </div>
          <Link to={"/get-started"}>
            <div className='gs-button-control'><button className="get-started-button">Get Started Now <ArrowDropRightIcon className='arrow-right'/></button></div>
          </Link>

        </div>
        <div className="column-1-right">
          <div className="math-image-1">
            <img src={Child1} alt="" width={"20%"} />
          </div>
          <div className="math-image-2">
          <img src={Child2} alt="" width={"20%"} />
          </div>
          <div className="math-image-3">
          <img src={Child3} alt="" width={"20%"} />
          </div>
          <div className="math-image-4">
          <img src={Child4} alt="" width={"20%"} />
          </div>
        </div>
      </div>

      <div className="math-row-2">
        <div className="math-2-image">
          <img src={Child5} alt="" width={"50%"}/>
        </div>
        <div className="math-2-inner">
          <div className="math-2-head-text">
            About Our Math Support
          </div>
          <div className='math-2-inner-con'>
          <div className="math-2-inner-text">
          Give your child the focused attention they need to excel in Number Work, Quantitative Reasoning, and Mathematics with EarlyStart E-Tutors. Our specialized services ensure your child builds a solid foundation in these essential subject(s). 
          </div>
          <div className="math-2-inner-text">
          If you are a busy parent, our program offers more than just academic support. We teach crucial study skills and problem-solving techniques to help your child succeed and develop interest for learning. 
          </div>
          <div className="math-2-inner-text">
          EarlyStart E-Tutors offers personalized, interactive tutoring designed specifically for beginners and elementary school pupils, provided by expert educators in Number Work, Quantitative Reasoning, and Mathematics. Improve your child's learning experience with EarlyStart E-Tutors.
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