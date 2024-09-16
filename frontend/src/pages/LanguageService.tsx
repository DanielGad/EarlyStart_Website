import React from 'react';
import '../assets/styles/Languages.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image from '../assets/images/mother-helping.jpg';
import Languages from '../assets/Data/Language.json';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';

const LanguageService = () => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    window.scrollTo(0, 0)
  }
  return (
    <div className="lg-container" onClick={handleClick}>
      <div className="lg-row-1-col-2">
          <img src={General_Image} alt="" width={"50%"}/>
        </div>
        <div className="lg-row-1">
        <div className="lg-row-1-col-1">
          <div className="lg-row-1-col-1-htext">
            Fluency in Languages Made Easy
          </div>
          <div className="lg-row-1-col-1-inner">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
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
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga animi deleniti repudiandae voluptatem nihil explicabo magni nostrum unde! Magnam dolor adipisci explicabo nobis blanditiis minus velit error. Impedit, autem dolorem?</p>
            <p>French
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
            <p>English
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
            <p>Yoruba
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
            <p>Igbo
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
            <p>Hausa
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

export default LanguageService