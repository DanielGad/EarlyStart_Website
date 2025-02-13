import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import '../assets/styles/ForgottenPassword.css';
import Modal from './Modal';

const ForgottenPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({
        showModal: false,
        title: "",
        message: "",
        buttonLabel: "Close",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined as (() => void) | undefined,
      });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!navigator.onLine) {
      setModalData({
        showModal: true,
        title: "Network Error!",
        message: "No Internet, Please check your internet connection and try again",
        buttonLabel: "Try Again",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
      setLoading(false);
      return;
    }

    const db = getFirestore();
    const auth = getAuth();
    const usersCollectionRef = collection(db, "EarlyStartData");

    try {
      // Check if the email exists in the Firestore collection
      const userQuery = query(usersCollectionRef, where("email", "==", email));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        // Email exists, send password reset email
        await sendPasswordResetEmail(auth, email);
        setModalData({
          showModal: true,
          title: "Success!",
          message: "Password reset email sent. Please check your inbox.",
          buttonLabel: "Okay",
          onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
          onConfirm: undefined
        });
      } else {
        setModalData({
          showModal: true,
          title: "Error!",
          message: "Email address not found. Please check the email entered.",
          buttonLabel: "Okay",
          onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
          onConfirm: undefined
        });
      }
    } catch (error: any) {
      if (error.code === "auth/network-request-failed") {
        setModalData({
          showModal: true,
          title: "Network Error!",
          message: "No Internet, Please check your internet connection and try again",
          buttonLabel: "Try Again",
          onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
          onConfirm: undefined
        });
    } else {
      setModalData({
        showModal: true,
        title: "Error!",
        message: "Failed to send password reset email. Please try again.",
        buttonLabel: "Okay",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
    }
      console.error('Error sending password reset email:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgotten-password-container">
      <Modal {...modalData}/>
      <h2>Forgotten Password</h2>
      <form onSubmit={handleSubmit} className="forgotten-password-form">
        <div className="form-group1">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            placeholder='Enter your email address'
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input1"
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Sending...' : 'Send Password Reset Email'}
        </button>
      </form>
    </div>
  );
};

export default ForgottenPassword;