import React, { useEffect } from "react"
import '../assets/styles/GetStarted.css';
import Footer from "../components/Footer/Footer";
import { Link } from "react-router-dom";
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';

const GetStarted = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
      <>
      <div className="background-main">
        <div className="serve">We're Here To Serve You</div>
      </div>
      <div className="Get-Started">
        <div className="start-1">Get Started With EarlyStart E-Tutors</div>
        <div className="start-2">Welcome! We're excited to help customize a personalized learning plan tailored specifically for your child's unique needs and educational goals. </div>
        <div className="start-3">Choose Your Schedule</div>
        <div className="start-4">Select Your Preferred Schedule</div>
        <form action="">
        <div className="start-5"><input type="checkbox" /> <b>Weekdays:</b> Monday - Thursday</div>
        <div className="start-5"><input type="checkbox" /> <b>Weekends:</b> Friday - Sunday</div>
        <div className="start-5"><b>Time Slots: </b><input type="checkbox" /> Morning <input type="checkbox" /> Evening</div>
        <div className="start-6">Tell Us About Your Child:</div>
        <br />
        <textarea rows={3} className="start-6-text"/>
        <div className="start-6">Please describe any specific area of focus or challenges your child is facing.</div>
        <br />
        <textarea rows={3} className="start-6-text"/>
        <div className="start-6" style={{marginBottom: "20px"}}>Contact Information:</div>
        <div className="start-7">Parent/Guidance Name:</div>
        <br />
        <textarea rows={1} required className="start-7-text"/>
        <div className="start-7">Eamil Address:</div>
        <br />
        <textarea rows={1} required className="start-7-text"/>
        <div className="start-7">Phone Number:</div>
        <br />
        <textarea rows={1} required className="start-7-text"/>
        </form>

      </div>

      <div className="gt-lower">
        <Link to={"/"}>
        <button className="gt-back">Back</button>
        </Link>
        <Link to={"/"}>
        <button className="gt-choose">Submit <ArrowDropRightIcon className='arrow-right'/></button>
        </Link>
      </div>
      

      <Footer />
      </>
  )
}

export default GetStarted