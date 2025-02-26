import React, { useState } from 'react';
import "../../assets/styles/Payment.css";
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Modal from '../Modal';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const [accessCode, setAccessCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({
    showModal: false,
    title: '',
    message: '',
    buttonLabel: '',
    onClose: () => {},
    onConfirm: undefined
  });
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleAccessCodeSubmit = async () => {
    setLoading(true);
    if (!user) {
      setMessage('User not logged in.');
      return;
    }

    try {
      const userDocRef = doc(db, 'EarlyStartData', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.generated === accessCode) {
          await updateDoc(userDocRef, { access: accessCode });
          setModalData({
            showModal: true,
            title: "Success!",
            message: "Access Validated.",
            buttonLabel: "Continue",
            onClose: () => navigate("/user-dashboard"),
            onConfirm: undefined
          });
          setLoading(false);
          setAccessCode('');
        } else {
          setModalData({
            showModal: true,
            title: "Error!",
            message: "Invalid Access Code, Please check the code and try again.",
            buttonLabel: "Try again",
            onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
            onConfirm: undefined
          });
        }
        setLoading(false);
        setAccessCode('');
      } else {
        setModalData({
          showModal: true,
          title: "Error!",
          message: "User document not found.",
          buttonLabel: "Close",
          onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
          onConfirm: undefined
        });
      }
    } catch (error) {
      console.error('Error verifying access code:', error);
      setModalData({
        showModal: true,
        title: "Error!",
        message: "Failed to verify access code. Please try again.",
        buttonLabel: "Try again",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
    }
  };

  return (
    <div className='payment-container'>
      <Modal {...modalData} />
      <h2>Registration Fee!</h2>
      <p>Proceed to pay the registration fee to continue accessing your learning journey through the bank details below:</p>
      <div className='bank-details' style={{fontFamily: 'Paleway'}}>
        <p><strong>Registration Fee:</strong> $3</p>
        <p><strong>Bank Name:</strong> First Bank Nigeria Plc</p>
        <p><strong>Account Number:</strong> 3105288265</p>
        <p><strong>Account Name:</strong> Awe Christianah Yemisi</p>
      </div>

      <b>Payment Successful? Contact an admin for access code.</b>
      <div className='access-code-input'>
        <label htmlFor='accessCode'>Enter Access Code:</label>
        <input
          type='text'
          id='accessCode'
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
        />
        <button onClick={handleAccessCodeSubmit}>{!loading ? "Submit & Continue" : "Validating"}</button>
      </div>
      {message && <p className='message'>{message}</p>}
    </div>
  );
};

export default Payment;