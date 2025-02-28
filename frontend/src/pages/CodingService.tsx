import React, { useEffect } from 'react';
import '../assets/styles/LetterworkService.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Coding1 from '../assets/images/coding1.jpg';
import COding2 from '../assets/images/coding2.png';
import Coding3 from '../assets/images/coding4.jpeg';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';
import Action from '../components/Action/Action';

const CodingService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="lw-container">
      <div className="lw-row-1">
        <div className="lw-row-1-col-1">
          <div className="lw-row-1-col-1-head">
          Coding for Children: Unlocking the Future with Fun & Creativity!
          </div>
          <div className="lw-row-1-col-1-text">
            Give your child a head start in the digital world with EarlyStart E-Tutors. Our coding classes are designed to introduce children to the basics of programming and computer science with fun and interactive session.
          <br />
            Join us now with a simple click!
          </div>
          <Link to={"/get-started"}>
            <div>
          <button className="get-started">Get Started Now <ArrowDropRightIcon className='arrow-right'/></button></div>
          </Link>
        </div>
        <div className="lw-row-1-col-2">
          <div className='lw-row-1-col-2-image-1'>
          <img src={Coding1} alt="" width={"50%"} />
          </div>
          <div className='lw-row-1-col-2-image-2'>
          <img src={COding2} alt="" width={"50%"}/>
          </div>
        </div>
      </div>

      <div className="lw-row-2">
        <div className="lw-row-2-col-1">
          <img src={Coding3} alt="" width={"50%"}/>
        </div>
        <div className="lw-row-2-col-2">
          <div className="lw-row-2-col-2-htext">
            About Our Basic Coding for Children
          </div>
          <div className="lw-row-2-col-2-text">
            <p>
            Coding is the language of the future! Just like learning to read and write, understanding how technology works is an essential skill for today’s children. Through coding, kids can build games, create animations, design websites, and even develop their own apps—all while having fun!
            </p>
            <p><b>Why should Kids learn to Code?:</b>
              <ul><li>Boosts Problem-Solving Skills: Coding teaches kids to break down complex problems into smaller steps, helping them develop critical thinking and analytical skills.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Enhances Creativity & Imagination: Through coding, kids can create games, animations, and apps, turning their ideas into reality while expressing their creativity.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Prepares Kids for Future Careers: In today’s digital world, coding is a valuable skill that opens doors to future career opportunities in technology, engineering, and beyond.</li></ul>
              <ul><li style={{marginTop: "-10px"}}> Teaches Logical Thinking & Innovation: Coding encourages kids to think logically, experiment, and develop innovative solutions to challenges.</li></ul>
            </p>
            <p><b>What We Offer in Our Coding Program:</b>
              <ul><li>What We Offer in Our Coding Program: Our courses are designed for kids with no prior coding experience, making learning easy and fun.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Fun & Interactive Activities: Kids engage in hands-on projects, coding games, animations, and interactive challenges to keep learning exciting.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Step-by-Step Guidance: Our experienced instructors provide personalized support, ensuring kids learn at their own pace and gain confidence in coding.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Safe Online Learning: We provide a secure and kid-friendly learning environment where children can explore, code, and collaborate safely.</li></ul>
            </p>
          </div>
        </div>
      </div>
      <Action />
      <Footer />
    </div>
  )
}

export default CodingService;
