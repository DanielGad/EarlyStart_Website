import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import bcrypt from 'bcryptjs';
import { db } from "../firebase";
import Modal from "../pages/Modal";
import "../assets/styles/SetPassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinLength, setIsMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [ButtonLabel, setButtonLabel] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const validatePassword = (password: string) => {
    setIsMinLength(password.length >= 6);
    setHasUppercase(/[A-Z]/.test(password));
    setHasNumber(/\d/.test(password));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      setModalTitle("Error");
      setModalMessage("Passwords do not match.");
      setShowModal(true);
      setButtonLabel("Close");
      setIsLoading(false);
      return;
    }

    const unmetCriteria = [];
    if (!isMinLength) unmetCriteria.push("Password must be at least 6 characters.");
    if (!hasUppercase) unmetCriteria.push("Password must contain at least one uppercase letter.");
    if (!hasNumber) unmetCriteria.push("Password must contain at least one number.");

    if (unmetCriteria.length > 0) {
      setModalTitle("Password Criteria Not Met");
      setModalMessage(unmetCriteria.join(" "));
      setShowModal(true);
      setButtonLabel("Close");
      setIsLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found.");
      }
      await updatePassword(user, password);

      const hashedPassword = bcrypt.hashSync(password, 10);

      const userDocRef = doc(db, "EarlyStartData", user.uid);
      await updateDoc(userDocRef, { password: hashedPassword });
    } catch (error: any) {
      setModalTitle("Error");
      setModalMessage(error.message);
      setShowModal(true);
      setButtonLabel("Close");
    } finally {
      setIsLoading(false);
    }
    setModalTitle("Success!");
    setModalMessage("Password has been set successfully.");
    setShowModal(true);
    setButtonLabel("Continue");
    navigate("/user-dashboard");
  };

  return (
    <div className="set-password-container">
      <h2>Set Your Password</h2>
      <Modal
        showModal={showModal}
        title={modalTitle}
        message={modalMessage}
        buttonLabel={ButtonLabel}
        onClose={() => setShowModal(false)}
      />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="toggle-password-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="password-control">
          <p>
            <input type="checkbox" checked={isMinLength} readOnly /> 
            Password must be at least 6 characters
          </p>
          <p>
            <input type="checkbox" checked={hasUppercase} readOnly /> 
            Password must contain at least one uppercase letter
          </p>
          <p>
            <input type="checkbox" checked={hasNumber} readOnly /> 
            Password must contain at least one number
          </p>
        </div>
        <button type="submit" disabled={isLoading} className="set-password-button">
          {isLoading ? "Setting Password..." : "Set Password"}
        </button>
      </form>
    </div>
  );
};

export default SetPassword;
