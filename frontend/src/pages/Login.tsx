import React, { useContext, useEffect, useState } from "react";
import "../assets/styles/Login.css";
import Background from "../assets/images/customer-care.jpg";
import Footer from "../components/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Modal from "../pages/Modal";
import { Context } from "../Context/Context";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to handle modal continue action
  const handleContinue = () => {
    setShowModal(false);

    // Redirect only if login is successful
    if (isLoginSuccessful) {
      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  };

  const context = useContext(Context);

  if (!context) {
    throw new Error("Context has not been provided.");
  }

  const { login } = context;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!email || !password) {
      setError("Please fill in all fields.");
      setModalMessage("Please fill in all fields.");
      setModalTitle("Information Required!");
      setButtonLabel("Try Again!");
      setShowModal(true);
      setIsLoading(false);
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const userRef = collection(db, "EarlyStartData");
      const q = query(userRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const role = userData?.userRole?.toLowerCase() || "user";
        const status = userData?.status?.toLowerCase() || "active";
  
        setUserRole(role);  // Store the role
  
        const user = userData;
  
        if (user) {
          const userRole = user?.userRole || "user";
          login(userRole); // Update context with the role
        }
  
        if (status === "disabled") {
          setError("Your account is disabled. Please contact support.");
          setModalMessage("Your account is disabled. Please contact support.");
          setModalTitle("Account Disabled!");
          setButtonLabel("Okay");
          setShowModal(true);
          setIsLoading(false);
          setIsLoginSuccessful(false); // Login unsuccessful, don't redirect
          return;
        }
  
        // If login is successful, set success state and show success modal
        setModalMessage("Login Successful!");
        setModalTitle("Success!");
        setButtonLabel("Continue");
        setShowModal(true);
        setIsLoginSuccessful(true); // Mark login as successful
      } else {
        setError("User data not found.");
        setModalTitle("Error!");
        setModalMessage("User data not found.");
        setButtonLabel("Try Again");
        setShowModal(true);
        setIsLoginSuccessful(false); // Login unsuccessful, don't redirect
      }
    } catch (error: any) {  
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        setError("Invalid email or password");
        setModalTitle("Error!");
        setModalMessage("Invalid email or password");
        setButtonLabel("Try Again");
      } else if (error.code === "auth/invalid-credential") {
        setError("Invalid credentials provided.");
        setModalTitle("Invalid Credentials");
        setModalMessage("The credentials provided are invalid. Please try again.");
        setButtonLabel("Try Again");
      } else if (error.code === "auth/network-request-failed") {
        setError("Network error, please check your internet connection.");
        setModalTitle("Network Error");
        setModalMessage("Please check your internet connection and try again.");
        setButtonLabel("Try Again");
      } else {
        // Handle other errors
        setError("An unexpected error occurred.");
        setModalTitle("Error");
        setModalMessage("Something went wrong. Please try again.");
        setButtonLabel("Try Again");
      }
  
      // Show the modal with the error message
      setShowModal(true);
      setIsLoginSuccessful(false);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="login-container">
      <Modal 
        showModal={showModal} 
        message={modalMessage} 
        buttonLabel={buttonLabel} 
        onClose={handleContinue} 
        title={modalTitle}
      />

      <div className="login-divide">
        <div className="login-left">
          <p className="login-head">Welcome to EarlyStart E-Tutor</p>
          <p className="login-sub">Unlocking Knowledge, One Click at a Time</p>

          <form onSubmit={handleSubmit}>
            <h2 className="login-title">Login</h2>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
              style={{padding: "15px"}}
                type="email"
                id="email"
                placeholder="Enter your email address:"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
              style={{padding: "15px"}}
                type="password"
                id="password"
                placeholder="Enter your Password:"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="button-control">
              <button type="submit" className="login-button">
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <div className="sign-control">
            <div>Or</div>
            <Link to={"/signup"}>
              <button className="sign-up">Sign Up</button>
            </Link>
            <div>If you don't have an account.</div>
          </div>
        </div>

        <div className="login-right">
          <img src={Background} alt="Customer Care" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;