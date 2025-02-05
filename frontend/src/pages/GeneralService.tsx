import React, { useEffect } from "react"
import '../assets/styles/GeneralService.css'
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image1 from '../assets/images/g-children.png';
import General_Image2 from '../assets/images/g-child.png';
import General_Image3 from '../assets/images/g-happy-child.png';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';
import Action from "../components/Action/Action";

const GeneralService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="gs-container">
      <div className="gs-row-1">
        <div className="gs-row-1-col-1">
          <div className="gs-row-1-col-1-htext">
            Excel in General Knowledge and Vocational Aptitude with EarlyStart E-Tutors.
          </div>
          <div className="gs-row-1-col-1-inner">
            Master essential skills and knowledge to achieve your goals and stand out. <br /> <br />
            Kickstart your preparation with just one Click!
          </div>
          <div>
            <Link to={"/get-started"}>
            <button className="get-started">Get Started Now! <ArrowDropRightIcon className='arrow-right'/></button>
            </Link>
          </div>
        </div>
        <div className="gs-row-1-col-2">
          <div className="gs-image-1">
            <img src={General_Image1} alt="" width={"50%"}/>
          </div>
          <div className="gs-image-2">
            <img src={General_Image2} alt="" width={"50%"}/>
          </div>
        </div>
      </div>

      <div className="lw-row-2">
        <div className="lw-row-2-col-1" style={{width: '35%'}}>
          <img src={General_Image3} alt="" width={"30%"} />
        </div>
        <div className="lw-row-2-col-2">
          <div className="lw-row-2-col-2-htext">
          About general knowledge and Vocational Aptitude test 
          </div>
          <div className="lw-row-2-col-2-text">
            <p>At EarlyStart E-Tutors, we offer targeted preparation for General Knowledge and Vocational Aptitude tests. Our tailored approach helps your child build a strong foundation in essential areas, ensuring they are well-prepared to tackle various assessments with confidence. </p>
            <p>Comprehensive Knowledge Enhancement
              <ul><li>Broad Insights: Develop a well-rounded understanding of general knowledge topics.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Vocational Skills: Acquire practical skills and knowledge relevant to career interests. </li></ul>
            </p>
            <p>Strategies Aptitude Training
              <ul><li>Effective Methods: Learn techniques to tackle different types of questions and problems. </li></ul>
              <ul><li style={{marginTop: "-10px"}}>Time Efficiency: Master strategies for efficient and effective problem-solving.</li></ul>
            </p>
          </div>
        </div>
      </div>

      <Action />
      <Footer />
    </div>
  )
}

export default GeneralService