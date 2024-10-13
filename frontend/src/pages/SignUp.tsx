import React, { useState } from "react";
import "../assets/styles/SignUp.css";
import Footer from "../components/Footer/Footer";
import { db } from "../firebase"; // Import the Firebase Firestore instance
import { collection, addDoc } from "firebase/firestore"; // Import Firestore methods
import { Link } from "react-router-dom";

interface SignUpFormProps {
  onSignUp: (fullName: string, username: string, email: string, password: string) => void;
}

const SignUp: React.FC<SignUpFormProps> = ({ onSignUp }) => {
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    if (fullName === '' || username === '' || email === '' || password === '') {
      setError("Please fill in all fields");
      return;
    }
  
    try {
      // Upload user data to Firebase Firestore
      const docRef = await addDoc(collection(db, "EarlyStartData"), {
        fullName,
        username,
        email,
        password, // Typically, you'd want to hash the password before saving!
      });
      
      console.log("Document written with ID: ", docRef.id);
      
      setError("");  // Clear any previous errors
      onSignUp(fullName, username, email, password);  // Trigger sign-up completion actions (e.g., redirect)
  
    } catch (e) {
      console.error("Error adding document: ", e); // This will log the error message in more detail
      setError("Failed to create account. Please try again later."); // Display a user-friendly error
    }
  };
  

  return (
    <div className="signup-container">
      <div className="signup-divide">
        <div className="signup-left">
          <h2 className="signup-head">Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* {error && <p className="error-message">{error}</p>} */}

            <div className="button-control">
              <Link to={"/login"}>
                <button type="submit" className="signup-button">Sign Up</button>
              </Link>
              
            </div>
          </form>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default SignUp;
