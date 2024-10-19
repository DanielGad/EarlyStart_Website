import React, { useState } from "react";
import "../assets/styles/SignUp.css";
import { db } from "../firebase"; // Firebase Firestore instance
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"; // Firestore methods
import bcrypt from 'bcryptjs';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Firebase auth
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const auth = getAuth();
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password); // Check for uppercase letter
    const hasNumber = /\d/.test(password); // Check for number
    const isValidLength = password.length >= 6; // Check for length of 6 or more characters

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

  const clearErrorAfterDelay = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 1500);
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

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      clearErrorAfterDelay();
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      clearErrorAfterDelay();
      return;
    }

    if (fullName === "" || username === "" || email === "" || password === "") {
      setError("Please fill in all fields");
      setIsLoading(false);
      clearErrorAfterDelay();
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Check if username or email already exists
      const { usernameTaken, emailExists } = await checkUserExists(username, email);
      
      if (usernameTaken) {
        setError("Username already taken, please use a different username.");
        setIsLoading(false);
        clearErrorAfterDelay();
        return;
      }

      if (emailExists) {
        setError("Email already exists, kindly use a different email.");
        setIsLoading(false);
        clearErrorAfterDelay();
        return;
      }

      // Step 2: Authenticate the user using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 3: Hash the password before saving to Firestore (optional, since password is handled by Firebase Auth)
      const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password using bcryptjs

      // Step 4: Save the user's details to Firestore
      const userRef = collection(db, "EarlyStartData"); // Replace with your collection name
      await addDoc(userRef, {
        fullName,
        username,
        email,
        password: hashedPassword, // Save hashed password
        userId: user.uid, // Reference the authenticated user
        createdAt: new Date(), // Add a timestamp
      });

      setSuccess("Account created successfully!");
      setIsLoading(false);
      alert("Account Created Successfully!");
      navigate("/login");

    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
      clearErrorAfterDelay();
    }
  };

  return (
    <div className="signup-container">
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

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

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
