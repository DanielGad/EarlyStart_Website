import React from "react"
import '../assets/styles/HomeworkService.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image from '../assets/images/mother-helping.jpg';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';

const HomeworkService = () => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    window.scrollTo(0, 0)
  }
  return (
    <div className="homework-container" onClick={handleClick}>
      <div className="homework-row-1">
        <div className="circle">00</div>
        <div className="circle-2">00</div>
        <div className="circle-3">00</div>
        <div className="circle-4">00</div>
        <div className="homework-col-1">
          <div className="homework-col-1-head-text">
            Simplifying Homework Help
          </div>
          <div className="homework-col-1-inner-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero nam corrupti consectetur iure officia ipsum? Quas quisquam numquam modi, nostrum necessitatibus ipsa nesciunt eveniet provident, temporibus sequi tenetur dolore vel! <br />
            Get Started Today with just a Click!
          </div>
          <Link to={"/get-started"}>
            <div><button className="homework-col-1-button">Get Started Now <ArrowDropRightIcon className='arrow-right'/></button></div>
          </Link>
        </div>
        <div className="homework-col-2">
          <img src={General_Image} alt="" width={"50%"}/>
        </div>
      </div>

      <div className="homework-row-2">
        <div className="homework-col-2-image">
          <img src={General_Image} alt="" width={"50%"} />
        </div>
        <div className="homework-col-2-text">
          <div className="homework-col-2-head-text">
            About Our Homework Support
          </div>
          <div className="homework-col-2-inner-text">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum, ipsum! Ipsam rem doloremque et fuga perferendis ipsa beatae, omnis ullam delectus, autem saepe quae reprehenderit aliquam eaque quis quibusdam architecto.</p>
            <p>Our Homework/School Assignment Support Services includes</p>
            <p>1. Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum vero voluptatibus dolorum aliquam ea hic voluptatum eos.</p>
            <p>2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, ipsa porro accusamus veniam.</p>
            <p>3. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis ex, voluptatum minus sapiente officia.</p>
            <p>4. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis ex, voluptatum minus sapiente officia.</p>
            <p>5. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis ex, voluptatum minus sapiente officia.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum ex, aliquid eaque neque, nobis natus veritatis perspiciatis doloremque voluptatibus facilis ipsa exercitationem beatae! Maiores minima aspernatur enim atque, culpa nisi.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default HomeworkService