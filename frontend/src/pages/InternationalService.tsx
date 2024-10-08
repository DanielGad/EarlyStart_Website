import React from "react"
import '../assets/styles/InternationalService.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image from '../assets/images/mother-helping.jpg';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';

const InternationalService = () => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    window.scrollTo(0, 0)
  }
  return (
    <div className="is-container" onClick={handleClick}>
      <div className="is-row-1">
        <div className="is-row-1-col-1">
          <div className="is-row-1-col-1-htext">
            Succeed in International School Enterance with EarlyStart E-Tutors 
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
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga animi deleniti repudiandae voluptatem nihil explicabo magni nostrum unde! Magnam dolor adipisci explicabo nobis blanditiis minus velit error. Impedit, autem dolorem?</p>
            <p>Comprehensive Preparation
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
            <p>Exam Strategies
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
            <p>Personalized Tutoring
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
            <p>Confidence Building
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

export default InternationalService