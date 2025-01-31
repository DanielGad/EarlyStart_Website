import React, { useEffect, useState } from "react";
import "../assets/styles/GetStarted.css";
import Footer from "../components/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import ArrowDropRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; 
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import Modal from "../pages/Modal"; // Importing the Modal component

const GetStarted = () => {
  const [selectedDays, setSelectedDays] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [childInfo, setChildInfo] = useState<string>("");
  const [specificFocus, setSpecificFocus] = useState<string>("");
  const [parentName, setParentName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [childName, setChildName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalData, setModalData] = useState({
    showModal: false,
    title: "",
    message: "",
    buttonLabel: "Close",
    onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
    onConfirm: undefined as (() => void) | undefined,
  });

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
      setModalData({
        showModal: true,
        title: "Login Required",
        message: "You must be logged in to submit this form.",
        buttonLabel: "Go to Login",
        onClose: () => navigate("/login"),
        onConfirm: undefined
      });
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
      setModalData({
        showModal: true,
        title: "Missing Information",
        message: "All fields are required.",
        buttonLabel: "OK",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
      return;
    }

    setLoading(true);
  
    try {
      const userRef = collection(db, "EarlyStartData");
      const q = query(userRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnap) => {
          const docId = docSnap.id; 
          const userDocRef = doc(db, "EarlyStartData", docId);
          const docData = docSnap.data();

          if (docData.getstarted.preferredDays && docData.getstarted.preferredTimeSlot) {
            setModalData({
              showModal: true,
              title: "Already Submitted",
              message: "Information has already been provided!",
              buttonLabel: "Go Back",
              onClose: () => navigate(-1),
              onConfirm: undefined
            });
            setLoading(false);
          } else {
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
              },
            };

            await updateDoc(userDocRef, updatedData);
            setModalData({
              showModal: true,
              title: "Success!",
              message: "Information updated successfully!",
              buttonLabel: "Continue",
              onClose: () => navigate("/confirm"),
              onConfirm: undefined
            });
            setLoading(false);
          }
        });
      }
    } catch (error: any) {
      setModalData({
        showModal: true,
        title: "Submission Failed",
        message: `Failed to save data: ${error.message}`,
        buttonLabel: "Try Again",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
      setLoading(false);
    }
  };

  return (
    <>
      <div className="background-main">
        <div className="serve">We're Here To Serve You</div>
      </div>
      <div className="Get-Started">
        <div className="start-1">Get started with EarlyStart E-Tutors</div>
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
              name="timeSlot"
              value="Morning"
              checked={selectedTimeSlot === "Morning"}
              onChange={handleTimeChange}
            />
            Morning
            <input
              type="radio"
              name="timeSlot"
              value="Evening"
              checked={selectedTimeSlot === "Evening"}
              onChange={handleTimeChange}
            />
            Evening
          </div>
          <div className="start-6">Child's Name:</div>
          <input type="text" className="start-7-text" value={childName} onChange={(e) => setChildName(e.target.value)} />
          <div className="start-6">Tell Us About Your Child:</div>
          <textarea rows={3} className="start-6-text" value={childInfo} onChange={(e) => setChildInfo(e.target.value)} />
          <div className="start-6">Specific Areas of Focus:</div>
          <textarea rows={3} className="start-6-text" value={specificFocus} onChange={(e) => setSpecificFocus(e.target.value)} />
          <div className="start-6">Parent/Guardian Name:</div>
          <input type="text" className="start-7-text" value={parentName} onChange={(e) => setParentName(e.target.value)} />
          <div className="start-7">Email Address:</div>
          <input type="email" className="start-7-text" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="start-7">Phone Number:</div>
          <input type="tel" className="start-7-text" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </form>
      </div>

      <div className="gt-lower">
        <Link to={"#"} onClick={() => navigate(-1)}>
          <button className="gt-back">Back</button>
        </Link>
        <button className="gt-choose" onClick={handleSubmit} disabled={loading}>{loading ? "Submitting..." : "Submit"}<ArrowDropRightIcon className="arrow-right" /></button>
      </div>

      <Footer />

      {/* Modal Component */}
      <Modal {...modalData} />
    </>
  );
};

export default GetStarted;
