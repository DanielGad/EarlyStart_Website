import React, { useEffect } from 'react';
import './Home.css';
import Helping_Mother from '../../assets/images/hp-mother-helping.png';
import CEO from '../../assets/images/CEO.jpeg';
import Smiley_Male from '../../assets/images/PlatformsOnline.jpg';
import Smiley_Female from '../../assets/images/OnlineClass.jpg';
import Tutor1 from '../../assets/images/tutor1.png';
import Tutor2 from '../../assets/images/tutor2.jpg';
import Tutor3 from '../../assets/images/tutor3.jpg';
import Tutor4 from '../../assets/images/tutor4.jpg';
import Tutor5 from '../../assets/images/tutor5.png';
import Tutor6 from '../../assets/images/tutor6.jpg';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import NumberWork from '../../assets/images/hp-numberwork.png';
import HomeWork from '../../assets/images/hp-homework.png';
import LetterWork from '../../assets/images/hp-letterwork.png';
import Language from '../../assets/images/hp-language.png';
import International from '../../assets/images/hp-international.png';
import General from '../../assets/images/hp-general.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../Context/Context';
import Footer from '../Footer/Footer';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useMediaQuery } from 'react-responsive';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const context = useContext(Context);
  if (!context) {
    throw new Error("Must be used within Context provider");
  }
  const { setMenu } = context;

  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 768px)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  return (
    <div>
      <div className="home-container">
        <div className="home-home-1">
          <div className="home-1-left-col">
            <div className='learn'>
              Learn Anywhere, Anytime with EarlyStart E-Tutors
            </div>
            <div className='enhance'>
              Enhance your child&apos;s education with personalized online tutoring from EarlyStart E-Tutors. Connect with experienced teachers for your child to ensure high quality teaching-learning process from the comfort of your home.
            </div>
            <Link to={"/get-started"}>
              <button className="get-tutor-button">Get Started Now! <ArrowDropRightIcon className='arrow-right' /></button>
            </Link>
          </div>

          <div className="home-1-image-cont">
            <img src={Helping_Mother} alt="Helping Mother" />
          </div>
        </div>

        {/* Our Services */}
        <div className="home-services">
          Our Services
        </div>
        <div className="home-2">
          <div className="home-2-con" onClick={() => { setMenu("service") }}>
            <Link to={"/mathematics"}>
              <div className="home-2-icon">
                <img src={NumberWork} alt="text icon" width={"50px"} />
              </div>
              <div className="home-2-texts" style={{fontSize: "14px"}}>
                Number Work/ Quantitative Reasoning/ Mathematics
              </div>
            </Link>
          </div>

          <div className="home-2-con" onClick={() => { setMenu("service") }}>
            <Link to={"/letterwork"}>
              <div className="home-2-icon">
                <img src={LetterWork} alt="text icon" width={"50px"} />
              </div>
              <div className="home-2-texts" style={{fontSize: "14px"}}>
                Letter Work/ Word Formation/ Alphabet Sounds
              </div>
            </Link>
          </div>

          <div className="home-2-con" onClick={() => { setMenu("service") }}>
            <Link to={"/language"}>
              <div className="home-2-icon">
                <img src={Language} alt="text icon" width={"50px"} />
              </div>
              <div className="home-2-texts" style={{fontSize: "14px"}}>
                Languages/ French/ English/ Yoruba/ Igbo/ Hausa
              </div>
            </Link>
          </div>

          <div className="home-2-con" onClick={() => { setMenu("service") }}>
            <Link to={"/homework"}>
              <div className="home-2-icon">
                <img src={HomeWork} alt="text icon" width={"50px"} />
              </div>
              <div className="home-2-texts" style={{fontSize: "14px"}}>
                Home Work/ School Assignment
              </div>
            </Link>
          </div>

          <div className="home-2-con" onClick={() => { setMenu("service") }}>
            <Link to={"/general"}>
              <div className="home-2-icon">
                <img src={General} alt="text icon" width={"50px"} />
              </div>
              <div className="home-2-texts" style={{fontSize: "14px"}}>
                General Knowledge/ Vocational Aptitude
              </div>
            </Link>
          </div>

          <div className="home-2-con" onClick={() => { setMenu("service") }}>
            <Link to={"/international"}>
              <div className="home-2-icon">
                <img src={International} alt="text icon" width={"50px"} />
              </div>
              <div className="home-2-texts" style={{fontSize: "14px"}}>
                International School Entrance Preparation
              </div>
            </Link>
          </div>

          <div className="home-2-con" onClick={() => { setMenu("service") }}>
            <Link to={"/coding"}>
              <div className="home-2-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 18l5-6-5-6M8 6L3 12l5 6M14.5 4l-5 16" stroke="#493A59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              </div>
              <div className="home-2-texts" style={{fontSize: "14px"}}>
                Basic Coding for Children
              </div>
            </Link>
          </div>
        </div>

        {/* Who we are */}
        <div className="home-3">
          <div className="home-3-image-con">
            <img src={CEO} alt="CEO" style={{ height: "auto" }} />
            <div className='ceo'>Christianah Yemisi Awe</div>
            <div className='ceo' style={{ marginTop: "-20px" }}>Proprietor</div>
          </div>
          <div className="home-3-text">
            <div className="who-we-are">
              Who We Are
            </div>
            <div className="home-3-text-cont">
              EarlyStart E-Tutors connects elementary school pupils with expert tutors through personalized, interactive online learning. We specialize in matching learners with qualified educators for individual academic support and specialized programs. Our goal is to enhance each child's educational ability and learning skills from the comfort of home.
            </div>
            <Link to={"/get-started"}>
              <button className="get-tutor-button" style={{ padding: "20px", marginTop: "20px" }}>Get Started Now! <ArrowDropRightIcon className='arrow-right' /></button>
            </Link>
          </div>
        </div>

        <div className="gallery">
          <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            showStatus={false}
            showIndicators={false}
            centerMode
            centerSlidePercentage={isDesktopOrLaptop ? 33.33 : 90}
          >
            <div>
              <img src={Tutor1} alt="Image 1" />
            </div>
            <div>
              <img src={Tutor2} alt="Image 2" />
            </div>
            <div>
              <img src={Tutor3} alt="Image 3" />
            </div>
            <div>
              <img src={Tutor4} alt="Image 4" />
            </div>
            <div>
              <img src={Tutor5} alt="Image 5" />
            </div>
            <div>
              <img src={Tutor6} alt="Image 6" />
            </div>
          </Carousel>
        </div>

        {/* Join Us */}
        <div className="home-4">
          <div className="home-4-image-con-1">
            <img src={Smiley_Male} alt="Smiley Male" />
          </div>
          <div className="join-us-text-con">
            <div className="join-us-text">
              Join EarlyStart E-Tutors and earn money by teaching what you love. Share your expertise and help young learners thrive.
            </div>
            <div style={{ marginTop: "20px", fontSize: "1.4rem" }}>
              To Join?
            </div>
            <div style={{ marginTop: "20px", fontSize: "1.2rem" }}>
              Kindly send your Curriculum Vitae (CV) and a passport photograph attached to <a href="mailto:earlystartetutors@gmail.com" style={{ color: "white", textDecoration: "underline" }}>this email account - earlystartetutors@gmail.com</a>
            </div>
          </div>
          <div className="home-4-image-con-2">
            <img src={Smiley_Female} alt="Smiley Female" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
