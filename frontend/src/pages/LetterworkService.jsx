import '../assets/styles/LetterworkService.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image from '../assets/images/mother-helping.jpg';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';

const LetterworkService = () => {
  return (
    <div className="lw-container" onClick={window.scrollTo(0, 0)}>
      <div className="lw-row-1">
        <div className="lw-row-1-col-1">
          <div className="lw-row-1-col-1-head">
            Enhancing Literacy Skills with EarlyStart E-Tutors
          </div>
          <div className="lw-row-1-col-1-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae modi officia tempora vero eos velit deserunt vel consequuntur minus.
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
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga animi deleniti repudiandae voluptatem nihil explicabo magni nostrum unde! Magnam dolor adipisci explicabo nobis blanditiis minus velit error. Impedit, autem dolorem?</p>
            <p>Letter Work
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
            <p>Word Formation
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
            <p>Phonetics
              <ul><li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis architecto eum qui beatae magnam voluptates</li></ul>
              <ul><li style={{marginTop: "-10px"}}>placeat laborum voluptatem. Quos corporis quod dolores distinctio aut molestiae ipsam assumenda recusandae rem blanditiis!</li></ul>
            </p>
            <p>Verbal Reasoning
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

export default LetterworkService