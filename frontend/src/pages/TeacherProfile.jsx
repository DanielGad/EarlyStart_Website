import '../assets/styles/TeacherProfile.css';
import { Link, useParams } from 'react-router-dom';
import Tutor_Data from '../assets/Data/Tutor.json';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Footer from '../components/Footer/Footer';

const TeacherProfile = () => {
  const { id } = useParams();
  const tutor = Tutor_Data.find(t => t.id === parseInt(id))
  return (
    <div className="tp-container" onClick={window.scrollTo(0, 0)}>
      <div className="tp-row-1">
        <div className="tp-image-con">
          <img src={tutor.Image} alt="" width={"20%"}/>
        </div>
        <div className="tp-details-con">
          <p className="tp-name">{tutor.Name}</p>
          <div className="tp-language"><b>Languages:</b> {tutor.Languages}</div>
          <div className="tp-bio"><b>Bio:</b> {tutor.Bio}</div>
          <div className="tp-qua"><b>Qualification:</b> {tutor.Qualifications}</div>
          <div className="tp-avaliability"><b>Avaliability:</b> {tutor.Availablity}</div>
          <div className="tp-review"><b>Reviews:</b> 
            <ul>
              {tutor.Reviews && tutor.Reviews.length > 0 ? (tutor.Reviews.map((review_data, index) => (
              <li key={index}>&quot;{review_data}&quot;</li>
              ))) : (
                <li>No Reviews Available.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="tp-row-2">
        <div className="tp-about-me">
          <div className="tp-about-me-head">About Me</div>
          <p>{tutor.About}</p>
        </div>
        <div className="tp-qua">
          <div className="tp-qua-head">Qualification</div>
        <ul>
              {tutor.FullQualifications && tutor.FullQualifications.length > 0 ? (tutor.FullQualifications.map((review_data, index) => (
              <li key={index}>{review_data}</li>
              ))) : (
                <li>No Qualifications Available.</li>
              )}
            </ul>
        </div>
        <div className="tp-teaching">
          <div className="tp-teach-head">Teaching Style</div>
          <p>{tutor.Style}</p>
        </div>
      </div>

      <div className="tp-lower">
        <Link to={"/get-tutor"}>
        <button className="tp-back">Back</button>
        </Link>
        <Link to={"/"}>
        <button className="tp-choose">Book Now <ArrowDropRightIcon className='arrow-right'/></button>
        </Link>
      </div>

      <Footer />
    </div>
  )
}

export default TeacherProfile