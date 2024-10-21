import React, { useState, useEffect } from "react";
import "../assets/styles/SignUp.css";
import { db } from "../firebase"; // Firebase Firestore instance
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"; // Firestore methods
import bcrypt from 'bcryptjs';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Firebase auth
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const SignUp = () => {
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");

  const auth = getAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    setShowModal(false);
    if (modalTitle === "Success!") {
      navigate("/login"); // Navigate to login on success
    }
  };

  const validatePassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValidLength = password.length >= 6;

    if (!isValidLength) {
      return "Password must be at least 6 characters long.";
    }
    if (!hasUppercase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    return "";
  };

  const checkUserExists = async (username: string, email: string) => {
    const usersRef = collection(db, "EarlyStartData");
    const usernameQuery = query(usersRef, where("username", "==", username));
    const emailQuery = query(usersRef, where("email", "==", email));

    const [usernameSnapshot, emailSnapshot] = await Promise.all([
      getDocs(usernameQuery),
      getDocs(emailQuery),
    ]);

    return {
      usernameTaken: !usernameSnapshot.empty,
      emailExists: !emailSnapshot.empty,
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let errorMessage = "";

    const passwordError = validatePassword(password);
    if (passwordError) {
      errorMessage += passwordError + "\n";
    }

    if (password !== confirmPassword) {
      errorMessage += "Passwords do not match.\n";
    }

    if (fullName === "" || username === "" || email === "" || password === "") {
      errorMessage += "Please fill in all fields.\n";
    }

    if (errorMessage) {
      setModalTitle("Error");
      setModalMessage(errorMessage.trim());
      setButtonLabel("Close");
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    try {
      const { usernameTaken, emailExists } = await checkUserExists(username, email);

      if (usernameTaken) {
        setModalTitle("Username Taken");
        setModalMessage("Username already taken, please use a different username.");
        setButtonLabel("Close");
        setShowModal(true);
        setIsLoading(false);
        return;
      }

      if (emailExists) {
        setModalTitle("Email Exists");
        setModalMessage("Email already exists, kindly use a different email.");
        setButtonLabel("Close");
        setShowModal(true);
        setIsLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const hashedPassword = bcrypt.hashSync(password, 10);

      const userRef = collection(db, "EarlyStartData");
      await addDoc(userRef, {
        fullName,
        username,
        email,
        password: hashedPassword,
        userId: user.uid,
        createdAt: new Date(),
      });

      setModalTitle("Success!");
      setModalMessage("Account created successfully!");
      setButtonLabel("Continue");
      setShowModal(true);
      setIsLoading(false);

    } catch (error: any) {
      setModalTitle("Error");
      setModalMessage(error.message);
      setButtonLabel("Close");
      setShowModal(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  return (
    <div className="signup-container">
      <Modal 
        showModal={showModal} 
        message={modalMessage} 
        buttonLabel={buttonLabel} 
        onClose={handleContinue} 
        title={modalTitle}
      />
      <div className="signup-divide">
        <div className="signup-left">
          <h2 className="signup-head">Create Your Account</h2>
          {!isOnline && (
            <p className="error-message">
              No internet connection. Please check your network.
            </p>
          )}
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

            <div className="button-control">
              <button
                type="submit"
                className="signup-button"
                disabled={!isOnline || isLoading}
              >
                {isLoading ? "Creating..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
