import React, { useEffect } from 'react';
import '../assets/styles/LetterworkService.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image from '../assets/images/mother-helping.jpg';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';
import Action from '../components/Action/Action';

const LetterworkService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="lw-container">
      <div className="lw-row-1">
        <div className="lw-row-1-col-1">
          <div className="lw-row-1-col-1-head">
            Enhancing Literacy Skills with EarlyStart E-Tutors
          </div>
          <div className="lw-row-1-col-1-text">
          Personalized Support for Letter Work, Word Formation, Phonetics, and Verbal Reasoning Join us now with a simple click!
          </div>
          <Link to={"/get-started"}>
            <div>
          <button className="get-started">Get Started Now <ArrowDropRightIcon className='arrow-right'/></button></div>
          </Link>
        </div>
        <div className="lw-row-1-col-2">
          <div className='lw-row-1-col-2-image-1'>
          <img src={General_Image} alt="" width={"50%"} />
          </div>
          <div className='lw-row-1-col-2-image-2'>
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
            About Our Literacy Skills Support
          </div>
          <div className="lw-row-2-col-2-text">
            <p>Give your child the advantage he/she needs with EarlyStart E-Tutors. Our dedicated literacy program is designed to enhance your child's skills in letter work, word formation, phonetics, and verbal reasoning. With our expert tutors, your child will build a strong foundation and develop learning skills and interest.</p>
            <p>Letter Work:
              <ul><li>Alphabet Recognition: Helping children identify and write letters accurately. </li></ul>
              <ul><li style={{marginTop: "-10px"}}>Handwriting Practice: Enhancing fine motor skills and legibility through engaging exercises.</li></ul>
            </p>
            <p>Word Formation:
              <ul><li>Spelling and Vocabulary: Building a robust vocabulary and understanding of word structures.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Word Games: Fun and interactive activities that make learning new words enjoyable.</li></ul>
            </p>
            <p>Phonetics:
              <ul><li>Sound Recognition: Teaching children to identify and pronounce phonetic sounds correctly.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Phonics Practice: Using phonics-based approaches to improve reading and pronunciation.</li></ul>
            </p>
            <p>Verbal Reasoning:
              <ul><li>Critical Thinking: Developing skills in logic, pattern recognition, and problem-solving.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Language Comprehension: Enhancing the ability to understand and analyze verbal information.</li></ul>
            </p>
          </div>
        </div>
      </div>
      <Action />
      <Footer />
    </div>
  )
}

export default LetterworkService