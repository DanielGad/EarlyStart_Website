import React, { useEffect, useState } from "react";
import "../assets/styles/Login.css";
import Background from "../assets/images/customer-care.jpg";
import Footer from "../components/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Ensure correct firebase import

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Clear error message after a short delay
  const clearErrorAfterDelay = () => {
    setTimeout(() => setError(""), 1500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Start loading when form is submitted
  
    // Validate form inputs
    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false); // Stop loading after validation error
      clearErrorAfterDelay();
      return;
    }
  
    try {
      // Authenticate user using Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Query Firestore to get the user's role and status
      const userRef = collection(db, "EarlyStartData");
      const q = query(userRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const userRole = userData?.userRole?.toLowerCase(); // Get user role
        const userStatus = userData?.status?.toLowerCase() || "active"; // Get user status, default to "active" if undefined
  
        // Check if the user's account is disabled
        if (userStatus === "disabled") {
          setError("Your account is disabled. Please contact support.");
          clearErrorAfterDelay();
          setIsLoading(false);
          return;
        }
  
        // Show login success alert
        alert("Login Success!");
  
        // Redirect based on user role
        if (userRole === "admin") {
          console.log("Redirecting to Admin Dashboard");
          navigate("/admin-dashboard"); // Redirect to admin dashboard if user is an admin
        } else {
          console.log("Redirecting to User Home Page");
          navigate("/success"); // Redirect to user homepage if not an admin
        }
      } else {
        setError("User data not found.");
        clearErrorAfterDelay();
      }
    } catch (error) {
      // Handle authentication error
      setError("Invalid email or password");
      clearErrorAfterDelay();
    } finally {
      setIsLoading(false); // Stop loading after completion (success or failure)
    }
  };  
  

  return (
    <div className="login-container">
      <div className="login-divide">
        <div className="login-left">
          <p className="login-head">Welcome to EarlyStart E-Tutor</p>
          <p className="login-sub">Unlocking Knowledge, One Click at a Time</p>

          <form onSubmit={handleSubmit}>
            <h2 className="login-title">Login</h2>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="error-text">{error}</p>} {/* Display error message */}

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
