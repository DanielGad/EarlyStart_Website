import React, { useEffect, useState } from "react";
import "../assets/styles/GetStarted.css";
import Footer from "../components/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import ArrowDropRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { db } from "../firebase"; 
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import Modal from "../pages/Modal";

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
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [countries, setCountries] = useState<string[]>([]);
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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        setCountries(data.map((country: any) => country.name.common).sort());
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
  };

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
      !phone ||
      !state ||
      !country
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

          if (docData.getstarted && docData.getstarted.preferredDays && docData.getstarted.preferredTimeSlot) {
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
                state,
                country,
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

            ///////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////
             const auth = getAuth();
                try {
                  const email = "danieladeyemi19@gmail.com"
                  await sendPasswordResetEmail(auth, email);
                  console.log('Password reset email sent to:', email);
                } catch (error) {
                  console.error('Error sending password reset email:', error);
                } finally {
                  setLoading(false);
                }
                //////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////
                
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
          tailored specifically for your child's unique and educational
          needs. <br /> <br />
          <b style={{fontFamily: "quicksand", color: "#443655"}}>Registration Fee - $3</b>
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
            <b>Time Schedule: </b>
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

          <div className="start-6">Location:</div>
          <div className="country-div">
            <div className="set-location" style={{fontSize: "18px"}}>Select Your Country:</div>
          <select className="set-country" value={country} onChange={handleCountryChange}>
          <option value="">Select a country</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
          </select>
        <div className="set-location" style={{fontSize: "18px"}}>City:</div>
          <input type="text" className="set-state" value={state} onChange={(e) => setState(e.target.value)} />
          </div>

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
