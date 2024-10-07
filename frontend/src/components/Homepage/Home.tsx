import React from 'react';
import './Home.css';
import Helping_Mother from '../../assets/images/mother-helping.jpg';
import Lady_Pointing from '../../assets/images/woman-showing-copy-space.jpg';
import Smiley_Male from '../../assets/images/smiley-male.jpg';
import Smiley_Female from '../../assets/images/smiley-female.png'
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import document_icon from '../../assets/images/text_snippet.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../Context/Context';
import Footer from '../Footer/Footer';

const Home = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Must be used within Context provider");
  }
  const { setMenu } = context

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    window.scrollTo(0, 0)
  };
  return (
    <div>
    <div className="home-container" onClick={handleClick}>
      <div className="home-home-1">
        <div className="home-1-left-col">
          <div className='learn'>
            Learn Anywhere, Anytime with EarlyStart E-Tutors
          </div>
          <div className='enhance'>
          Enhance your child&apos;s education with personalized online tutoring from EarlyStart E-Tutors. Connect with experienced tutors for your child to ensure high quality teaching-learning process from the comfort of your home.
          </div>
          <Link to={"/get-tutor"} className='get-tutor-buttonn'>
          <button className="get-tutor-button">Get Professional Tutor <ArrowDropRightIcon className='arrow-right' /></button>
          </Link>
        </div>

          <div className="home-1-image-cont">
            <img src={Helping_Mother} alt="Image 1" />
          </div>

      </div>

      {/*Our Services */}
      <div className="home-services">
        Our Services
      </div>
      <div className="home-2">
          <div className="home-2-con" onClick={() => {setMenu("service")}}>
            <Link to={"/math"}>
            <div className="home-2-icon">
              <img src={document_icon} alt="text icon" width={"50px"}/>
            </div>
            <div className="home-2-texts">
              Number Work/ Quantitative Reasoning/ Mathematics
            </div>
            </Link>
          </div>
          
          <div className="home-2-con" onClick={() => {setMenu("service")}}>
            <Link to={"/homework"}>
            <div className="home-2-icon">
              <img src={document_icon} alt="text icon" width={"50px"}/>
            </div>
            <div className="home-2-texts">
              Home Work/ School Assignment
            </div>
            </Link>
          </div>
          <div className="home-2-con" onClick={() => {setMenu("service")}}>
            <Link to={"/letterwork"}>
            <div className="home-2-icon">
              <img src={document_icon} alt="text icon" width={"50px"}/>
            </div>
            <div className="home-2-texts">
              Letter Work/ Word Formation/ Phonetics/ Verbal Reasoning
            </div>
            </Link>
          </div>
          <div className="home-2-con" onClick={() => {setMenu("service")}}>
            <Link to={"/language"}>
            <div className="home-2-icon">
              <img src={document_icon} alt="text icon" width={"50px"}/>
            </div>
            <div className="home-2-texts">
              Languages/ French/ English/ Yoruba/ Igbo/ Hausa
            </div>
            </Link>
          </div>
          <div className="home-2-con" onClick={() => {setMenu("service")}}>
            <Link to={"/international"}>
            <div className="home-2-icon">
              <img src={document_icon} alt="text icon" width={"50px"}/>
            </div>
            <div className="home-2-texts">
              International School Enterance Preparation
            </div>
            </Link>
          </div>
          <div className="home-2-con" onClick={() => {setMenu("service")}}>
            <Link to={"/general"}>
            <div className="home-2-icon">
              
              <img src={document_icon} alt="text icon" width={"50px"}/>
            </div>
            <div className="home-2-texts">
              General Knowledge/ Vocational Aptitude
            </div>
            </Link>
          </div>
        </div>

        {/* Who we are */}
        <div className="home-3">
          <div className="home-3-image-con">
            <img src={Lady_Pointing} alt="Lady Pointing"  />
          </div>
          <div className="home-3-text">
            <div className="who-we-are">
              Who We Are
            </div>
            <div className="home-3-text-cont">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo laborum odit porro laboriosam pariatur delectus molestiae non, quam nobis consequatur fuga repudiandae debitis enim consectetur, velit, praesentium ipsam nesciunt cumque! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa iste harum asperiores odio explicabo, iusto hic, deserunt, quis suscipit quam quaerat dolorem porro facere laborum sint exercitationem perspiciatis rem quasi?
            </div>
            <div className="home-3-text-cont">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Lorem, ipsum dolor. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla error cumque cupiditate. Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
          </div>
        </div>

        {/* Join Us */}
        <div className="home-4">
          <div className="home-4-image-con-1">
          <img src={Smiley_Male} alt="Smiley Male" />
          </div>
          <div className="join-us-text-con">
            <div className="join-us-text">
              Enjoy EarlyStart E-Tutors and earn money by teaching what you love. Share your expertise and help young learners thrive.
            </div>
            <Link to={"/get-started"}>
            <button className="join-us-button">Join Us<ArrowDropRightIcon className='arrow-right' /></button>
            </Link>
          </div>
          <div className="home-4-image-con-2">
            <img src={Smiley_Female} alt="Smiley Female" />
          </div>
        </div>
    </div>
    <Footer />
    </div>
  )
}

export default Home