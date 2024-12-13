import React, { useEffect, useState } from "react";
import '../assets/styles/GetStarted.css';
import Footer from "../components/Footer/Footer";
import { Link } from "react-router-dom";
import ArrowDropRightIcon from '@mui/icons-material/KeyboardArrowRight';

const GetStarted = () => {
  const [selectedDays, setSelectedDays] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDays(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTimeSlot(e.target.value);
  };

  return (
    <>
      <div className="background-main">
        <div className="serve">We're Here To Serve You</div>
      </div>
      <div className="Get-Started">
        <div className="start-1">Get started with EarlyStart E- Tutors</div>
        <div className="start-2">Welcome! We're excited to help customize a personalized learning plan tailored specifically for your child's unique needs and educational needs. </div>
        <div className="start-3">Choose Your Schedule</div>
        <div className="start-4">Select Your Preferred Schedule</div>
        <form action="">
          <div className="start-5">
            <input
              type="radio"
              id="weekdays"
              name="days"
              value="Weekdays"
              checked={selectedDays === 'Weekdays'}
              onChange={handleDayChange}
            />
            <b>Weekdays:</b> Monday - Thursday
          </div>
          <div className="start-5">
            <input
              type="radio"
              id="weekends"
              name="days"
              value="Weekends"
              checked={selectedDays === 'Weekends'}
              onChange={handleDayChange}
            />
            <b>Weekends:</b> Friday - Sunday
          </div>
          <div className="start-5">
            <b>Time Slots: </b>
            <input
              type="radio"
              id="morning"
              name="timeSlot"
              value="Morning"
              checked={selectedTimeSlot === 'Morning'}
              onChange={handleTimeChange}
            />
            Morning
            <input
              type="radio"
              id="evening"
              name="timeSlot"
              value="Evening"
              checked={selectedTimeSlot === 'Evening'}
              onChange={handleTimeChange}
            />
            Evening
          </div>
          <div className="start-6">Tell Us About Your Child:</div>
          <br />
          <textarea rows={3} className="start-6-text" />
          <div className="start-6">Please describe any specific area of focus or challenges your child is facing.</div>
          <br />
          <textarea rows={3} className="start-6-text" />
          <div className="start-6" style={{ marginBottom: "20px" }}>Contact Information:</div>
          <div className="start-7">Parent/Guidance Name:</div>
          <br />
          <textarea rows={1} required className="start-7-text" />
          <div className="start-7">Email Address:</div>
          <br />
          <textarea rows={1} required className="start-7-text" />
          <div className="start-7">Phone Number:</div>
          <br />
          <textarea rows={1} required className="start-7-text" />
        </form>
      </div>

      <div className="gt-lower">
        <Link to={"/"}>
          <button className="gt-back">Back</button>
        </Link>
        <Link to={"/"}>
          <button className="gt-choose">Submit <ArrowDropRightIcon className='arrow-right' /></button>
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default GetStarted;
