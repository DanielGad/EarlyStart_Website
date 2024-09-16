import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Tutor_Data from '../assets/Data/Tutor.json';
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Footer from '../components/Footer/Footer';
import '../assets/styles/TeacherProfile.css';

// Define the TypeScript interface for the tutor data
interface Tutor {
  id: number;
  Name: string;
  Image: string;
  Languages: string;
  Bio: string;
  Qualifications: string;
  Availablity: string;
  Reviews?: string[];
  About: string;
  FullQualifications?: string[];
  Style: string;
}

const TeacherProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Ensure that id exists and is a valid string before parsing it
  const tutor = id ? Tutor_Data.find((t: Tutor) => t.id === parseInt(id, 10)) : undefined;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    window.scrollTo(0, 0);
  };

  // Handle the case where tutor is not found or id is not provided
  if (!tutor) {
    return <div>Tutor not found</div>;
  }

  return (
    <div className="tp-container" onClick={handleClick}>
      <div className="tp-row-1">
        <div className="tp-image-con">
          <img src={tutor.Image} alt={`Profile of ${tutor.Name}`} width="20%" />
        </div>
        <div className="tp-details-con">
          <p className="tp-name">{tutor.Name}</p>
          <div className="tp-language"><b>Languages:</b> {tutor.Languages}</div>
          <div className="tp-bio"><b>Bio:</b> {tutor.Bio}</div>
          <div className="tp-qua"><b>Qualification:</b> {tutor.Qualifications}</div>
          <div className="tp-avaliability"><b>Availability:</b> {tutor.Availablity}</div>
          <div className="tp-review"><b>Reviews:</b> 
            <ul>
              {tutor.Reviews && tutor.Reviews.length > 0 ? (tutor.Reviews.map((review_data: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
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
          <div className="tp-qua-head">Qualifications</div>
          <ul>
            {tutor.FullQualifications && tutor.FullQualifications.length > 0 ? (tutor.FullQualifications.map((qualification: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
              <li key={index}>{qualification}</li>
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
        <Link to="/get-tutor">
          <button className="tp-back">Back</button>
        </Link>
        <Link to="/">
          <button className="tp-choose">Book Now <ArrowDropRightIcon className='arrow-right'/></button>
        </Link>
      </div>

      <Footer />
    </div>
  );
}

export default TeacherProfile;
