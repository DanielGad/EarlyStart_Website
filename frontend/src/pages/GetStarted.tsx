import React, { useEffect, useState } from "react";
import "../assets/styles/GetStarted.css";
import Footer from "../components/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import ArrowDropRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; // Import your Firebase configuration
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

const GetStarted = () => {
  const [selectedDays, setSelectedDays] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [childInfo, setChildInfo] = useState<string>("");
  const [specificFocus, setSpecificFocus] = useState<string>("");
  const [parentName, setParentName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [childName, setChildName] = useState<string>("");

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDays(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTimeSlot(e.target.value);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
  
    if (!user) {
      alert("You must be logged in to submit this form.");
      navigate("/login");
      return;
    }
  
    if (
      !selectedDays ||
      !selectedTimeSlot ||
      !childName ||
      !childInfo ||
      !specificFocus ||
      !parentName ||
      !email ||
      !phone
    ) {
      alert("All fields are required.");
      return;
    }
  
    try {
      // Query Firestore for the document with the matching user.uid
      const userRef = collection(db, "EarlyStartData");
      const q = query(userRef, where("userId", "==", user.uid)); // Assuming you store the user.uid as a field
  
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // If we find the document with the user's uid, check if 'getstarted' field exists
        querySnapshot.forEach(async (docSnap: { id: any; data: () => any }) => {
          const docId = docSnap.id; // Get the document ID
          const userDocRef = doc(db, "EarlyStartData", docId);
  
          // Check if the 'getstarted' field exists
          const docData = docSnap.data();
          if (docData.getstarted) {
            alert("Information has already been provided!");
          } else {
            // Prepare the data to be saved inside the 'getstarted' field
            const updatedData = {
              getstarted: {
                childName,
                preferredDays: selectedDays,
                preferredTimeSlot: selectedTimeSlot,
                childInfo,
                specificFocus,
                parentName,
                email,
                phone,
              }
            };
  
            // Update the document with 'getstarted' field
            await updateDoc(userDocRef, updatedData);
            alert("Information updated successfully!");
            navigate("/"); // Navigate to homepage or other page after successful submission
          }
        });
      } else {
        // If no document is found, create a new one with the user's UID
        const newDocRef = doc(db, "EarlyStartData", user.uid); // Use user.uid as the document ID
        const newData = {
          userId: user.uid,
          getstarted: {
            childName,
            preferredDays: selectedDays,
            preferredTimeSlot: selectedTimeSlot,
            childInfo,
            specificFocus,
            parentName,
            email,
            phone,
          }
        };
  
        // Save new data with the 'getstarted' field
        await setDoc(newDocRef, newData);
        alert("Information saved successfully!");
        navigate(-1); // Navigate to homepage or other page after successful submission
      }
    } catch (error: any) {
      console.error("Error updating Firestore:", error);
      alert(`Failed to save data: ${error.message}`);
    }
  };
  
  

  return (
    <>
      <div className="background-main">
        <div className="serve">We're Here To Serve You</div>
      </div>
      <div className="Get-Started">
        <div className="start-1">Get started with EarlyStart E- Tutors</div>
        <div className="start-2">
          Welcome! We're excited to help customize a personalized learning plan
          tailored specifically for your child's unique needs and educational
          needs.
        </div>
        <div className="start-3">Choose Your Schedule</div>
        <div className="start-4">Select Your Preferred Schedule</div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="start-5">
            <input
              type="radio"
              id="weekdays"
              name="days"
              value="Weekdays"
              checked={selectedDays === "Weekdays"}
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
              checked={selectedDays === "Weekends"}
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
              checked={selectedTimeSlot === "Morning"}
              onChange={handleTimeChange}
            />
            Morning
            <input
              type="radio"
              id="evening"
              name="timeSlot"
              value="Evening"
              checked={selectedTimeSlot === "Evening"}
              onChange={handleTimeChange}
            />
            Evening
          </div>
          <div className="start-6" style={{ marginBottom: "20px" }}>
            Child's Name:
          </div>
          <input
            type="text"
            required
            className="start-7-text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
          />
          <div className="start-6">Tell Us About Your Child:</div>
          <br />
          <textarea
            rows={3}
            className="start-6-text"
            value={childInfo}
            onChange={(e) => setChildInfo(e.target.value)}
          />
          <div className="start-6">
            Please describe any specific area of focus or challenges your child
            is facing.
          </div>
          <br />
          <textarea
            rows={3}
            className="start-6-text"
            value={specificFocus}
            onChange={(e) => setSpecificFocus(e.target.value)}
          />
          <div className="start-6" style={{ marginBottom: "20px" }}>
            Contact Information:
          </div>
          <div className="start-7">Parent/Guidance Name:</div>
          <br />
          <input
            type="text"
            required
            className="start-7-text"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
          />
          <div className="start-7">Email Address:</div>
          <br />
          <input
            type="email"
            required
            className="start-7-text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="start-7">Phone Number:</div>
          <br />
          <input
            type="tel"
            required
            className="start-7-text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </form>
      </div>

      <div className="gt-lower">
        <Link to={"/"}>
          <button className="gt-back">Back</button>
        </Link>
        <button className="gt-choose" onClick={handleSubmit}>
          Submit <ArrowDropRightIcon className="arrow-right" />
        </button>
      </div>

      <Footer />
    </>
  );
};

export default GetStarted;
