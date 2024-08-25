import '../assets/styles/MathService.css';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import General_Image from '../assets/images/mother-helping.jpg';
import Footer from '../components/Footer/Footer';

const MathService = () => {
  return (
    <div className="math-service-container" onClick={window.scrollTo(0, 0)}>
      <div className="math-row-1">
        <div className="column-1-left">
          <div className="head-text">Mastering Math Made Easy Achieve More, Learn Faster, and Excel!</div>
          <div className="head-inner-text">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quod saepe minus adipisci dignissimos distinctio impedit tenetur debitis a, illum cumque reiciendis culpa dolorem ut neque tempore ipsum corrupti quam. <br />Get Started Now with just a Click!
          </div>
          <div><button className="get-started-button">Get Started Now <ArrowDropRightIcon className='arrow-right'/></button></div>
          
        </div>
        <div className="column-1-right">
          <div className="math-image-1">
            <img src={General_Image} alt="" width={"20%"} />
          </div>
          <div className="math-image-2">
          <img src={General_Image} alt="" width={"20%"} />
          </div>
          <div className="math-image-3">
          <img src={General_Image} alt="" width={"20%"} />
          </div>
          <div className="math-image-4">
          <img src={General_Image} alt="" width={"20%"} />
          </div>
        </div>
      </div>

      <div className="math-row-2">
        <div className="math-2-image">
          <img src={General_Image} alt="" width={"50%"}/>
        </div>
        <div className="math-2-inner">
          <div className="math-2-head-text">
            About Our Math Support
          </div>
          <div className='math-2-inner-con'>
          <div className="math-2-inner-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio illum assumenda eligendi! Itaque rerum rem voluptas ex labore repellat laborum quis dolor alias repudiandae consectetur sit, corrupti libero deleniti ut.
          </div>
          <div className="math-2-inner-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio illum assumenda eligendi! Itaque rerum rem voluptas ex labore repellat laborum quis dolor alias repudiandae consectetur sit, corrupti libero deleniti ut.
          </div>
          <div className="math-2-inner-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio illum assumenda eligendi! Itaque rerum rem voluptas ex labore repellat laborum quis dolor alias repudiandae consectetur sit, corrupti libero deleniti ut.
          </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default MathService