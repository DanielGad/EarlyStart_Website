import React from "react"
import '../assets/styles/GetTutor.css';
import Tutors from "../assets/Data/Tutor.json";
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';

const GetTutor = () => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    window.scrollTo(0, 0)
  }
  return (
    <div className="gt-container" onClick={handleClick}>
      <div className="gt-htext">
        Meet Our Teachers
      </div>

      <div className="gt-teachers">
        {Tutors.map((data: { id: React.Key | null | undefined; Image: string | undefined; Name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; Details: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
          <div className="teacher-con" key={data.id}>
            <Link to={`/profile/${data.id}`}>
            <div className="gt-image-con">
              <img src={data.Image} alt="" width={"20%"}/>
            </div>
          <div className="gt-image-htext">
            {data.Name}
          </div>
          </Link>
          <div className="gt-inner-text">
            {data.Details}
          </div>
        </div>
        ))}
      </div>
      <div className="gt-lower">
        <Link to={"/"}>
        <button className="gt-back">Back</button>
        </Link>
        <Link to={"/"}>
        <button className="gt-choose">Let Us Choose for You <ArrowDropRightIcon className='arrow-right'/></button>
        </Link>
      </div>

      <Footer />
    </div>
  )
}

export default GetTutor