import React from "react"
import '../assets/styles/GeneralService.css'
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image from '../assets/images/mother-helping.jpg';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';

const GeneralService = () => {

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    window.scrollTo(0, 0)
  }
  
  return (
    <div className="gs-container" onClick={handleClick}>
      <div className="gs-row-1">
        <div className="gs-row-1-col-1">
          <div className="gs-row-1-col-1-htext">
            Excel in General Knowledge and Vocational Aptitude with EarlyStart E-Tutors.
          </div>
          <div className="gs-row-1-col-1-inner">
            Master essential skills and knowledge to achieve your goals and stand out. <br />
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
            <img src={General_Image} alt="" width={"50%"}/>
          </div>
          <div className="gs-image-2">
            <img src={General_Image} alt="" width={"50%"}/>
          </div>
        </div>
      </div>

      <div className="lw-row-2">
        <div className="lw-row-2-col-1">
          <img src={General_Image} alt="" width={"50%"}/>
        </div>
        <div className="lw-row-2-col-2">
          <div className="lw-row-2-col-2-htext">
            About Our Language Support
          </div>
          <div className="lw-row-2-col-2-text">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga animi deleniti repudiandae voluptatem nihil explicabo magni nostrum unde! Magnam dolor adipisci explicabo nobis blanditiis minus velit error. Impedit, autem dolorem?</p>
            <p>Comprehensive Knowledge Enhancement
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
            <p>Strategies Aptitude Training
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default GeneralService