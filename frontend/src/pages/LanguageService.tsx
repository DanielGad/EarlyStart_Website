import React, { useEffect } from 'react';
import '../assets/styles/Languages.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image from '../assets/images/mother-helping.jpg';
import Languages from '../assets/Data/Language.json';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';
import Action from '../components/Action/Action';

const LanguageService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="lg-container">
      <div className="lg-row-1-col-2">
          <img src={General_Image} alt="" width={"50%"}/>
        </div>
        <div className="lg-row-1">
        <div className="lg-row-1-col-1">
          <div className="lg-row-1-col-1-htext">
            Fluency in Languages Made Easy
          </div>
          <div className="lg-row-1-col-1-inner">
          Achieve Proficiency, Communicate Confidently, and Excel.<br /> <br />
            Begin Now with a quick click!
          </div>
          <Link to={"/get-started"}>
            <div>
          <button className="get-started">Get Started Now <ArrowDropRightIcon className='arrow-right'/></button>
          </div>
          </Link>
        </div>
      </div>

      <div className="lg-row-2">
        <div className="lg-row-2-head">
          Languages Category
        </div>
        <div className="lg-row-2-grid-1">
        {Languages.map((data: { Image: string | undefined; Language: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; Description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => (
          <div className="lg-grid-1-col-1" key={i}>
            <img src={data.Image} alt="" width={"20%"}/>
            <div className="lg-grid-1-col-1-htext">
              {data.Language}
            </div>
            <div className="lg-grid-1-col-1-text">
              {data.Description}
            </div>
          </div>
          ))}
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
            <p>At EarlyStart E-Tutors, we help your child excel in French, English, Yoruba, Igbo, and Hausa. Our specialized services build a solid foundation in these essential languages.</p>
            <p>French:
              <ul><li>Vocabulary and Grammar: Expand vocabulary and understand grammar rules. Conversational</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Practice: Improve speaking and listening skills.</li></ul>
            </p>
            <p>English:
              <ul><li>Reading and Writing: Enhance comprehension and writing skills.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Pronunciation: Focus on correct pronunciation and phonetics.</li></ul>
            </p>
            <p>Yoruba:
              <ul><li>Basics and Culture: Teach fundamental vocabulary with cultural lessons.</li></ul>
              <ul><li style={{marginTop: "-10px"}}>Speaking Practice: Use real-life scenarios to boost fluency. </li></ul>
            </p>
            <p>Igbo:
              <ul><li>Introduction and Culture: Cover basic vocabulary and cultural elements. </li></ul>
              <ul><li style={{marginTop: "-10px"}}>Interactive Sessions: Engage in activities to improve speaking skills. </li></ul>
            </p>
            <p>Hausa:
              <ul><li>Fundamentals and Culture: Build a strong foundation in vocabulary and grammar with cultural integration. </li></ul>
              <ul><li style={{marginTop: "-10px"}}>Conversational Exercises: Practice speaking and listening skills.</li></ul>
            </p>
          </div>
        </div>
      </div>
      
      <Action />
      <Footer />
    </div>
  )
}

export default LanguageService