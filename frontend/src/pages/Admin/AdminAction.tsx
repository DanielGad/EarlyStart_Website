import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../firebase';
import '../../assets/styles/AdminAction.css';
import Modal from '../Modal';

interface AdminActionProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminAction: React.FC<AdminActionProps> = ({ isOpen, onClose }) => {
  const [targetEmailStatus, setTargetEmailStatus] = useState<string>('');
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [targetEmail, setTargetEmail] = useState<string>('');
  const [loadingStatusToggle, setLoadingStatusToggle] = useState<boolean>(false);
  const [loadingAdmin, setLoadingAdmin] = useState<boolean>(false);
  const [loadingStatusUpdate, setLoadingStatusUpdate] = useState<boolean>(false); // New state for enabling/disabling
  const [errorStatusToggle, setErrorStatusToggle] = useState<string | null>(null);
  const [errorAdmin, setErrorAdmin] = useState<string | null>(null);
  const [modalData, setModalData] = useState({
    showModal: false,
    title: "",
    message: "",
    buttonLabel: "",
    onClose: () => {},
    onConfirm: undefined
  });

  if (!isOpen) return null;

  const toggleUserStatus = async (email: string) => {
    setLoadingStatusToggle(true);
    setErrorStatusToggle(null);
    try {
      const usersCollectionRef = collection(db, 'EarlyStartData');
      const userQuery = query(usersCollectionRef, where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const currentStatus = userData.status || 'active';
        setUserInfo({ ...userData, docId: userDoc.id });

        // Now the status toggle buttons will appear based on current status.
      } else {
        setModalData({
          showModal: true,
          title: "Error!",
          message: `User not found!.`,
          buttonLabel: "Continue",
          onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
          onConfirm: undefined
        });
        setTargetEmailStatus(''); // Clear input if not found
        setUserInfo(null); // Clear user info
      }
    } catch (error) {
      setErrorStatusToggle('Error fetching user info. Please try again.');
      console.error('Error fetching user info:', error);
    } finally {
      setLoadingStatusToggle(false);
    }
  };

  const updateUserStatus = async () => {
    if (!userInfo) return;
    setLoadingStatusUpdate(true); // Start loading for the status update
    try {
      const newStatus = userInfo.status === 'active' ? 'disabled' : 'active';
      await updateDoc(doc(db, 'EarlyStartData', userInfo.docId), { status: newStatus });
      setModalData({
        showModal: true,
        title: "Success!",
        message: `User is now ${newStatus}.`,
        buttonLabel: "Continue",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
      setUserInfo({ ...userInfo, status: newStatus }); // Update user info locally
    } catch (error) {
      setErrorStatusToggle('Error toggling user status. Please try again.');
      console.error('Error toggling user status:', error);
    } finally {
      setLoadingStatusUpdate(false); // End loading after status update
    }
  };

  const changeUserRole = async (newRole: string) => {
    if (!userInfo || !userInfo.docId) return;
    try {
      const userDocRef = doc(db, 'EarlyStartData', userInfo.docId);
      await updateDoc(userDocRef, { userRole: newRole });
      setModalData({
        showModal: true,
        title: "Success!",
        message: `User role changed to ${newRole}.`,
        buttonLabel: "Continue",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
      setUserInfo((prevInfo: any) => ({ ...prevInfo, userRole: newRole }));
    } catch (error) {
      console.error('Error changing user role:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setTargetEmail('');
    setTargetEmailStatus('');
    setUserInfo(null);
    setErrorStatusToggle(null);
    setErrorAdmin(null);
  };

  // const makeAdmin = async (email: string) => {
  //   setLoadingAdmin(true);
  //   setErrorAdmin(null);
  //   try {
  //     const usersCollectionRef = collection(db, 'EarlyStartData');
  //     const userQuery = query(usersCollectionRef, where('email', '==', email));
  //     const querySnapshot = await getDocs(userQuery);

  //     if (!querySnapshot.empty) {
  //       const userDoc = querySnapshot.docs[0];
  //       await updateDoc(doc(db, 'EarlyStartData', userDoc.id), { userRole: 'admin' });
  //       alert('User is now an admin.');
  //     } else {
  //       alert('User not found.');
  //     }
  //   } catch (error) {
  //     setErrorAdmin('Error making user admin. Please try again.');
  //     console.error('Error making user admin:', error);
  //   } finally {
  //     setLoadingAdmin(false);
  //   }
  // };

  return (
    <div className="admin-modal-overlay">
      <Modal {...modalData} />
      <div className="admin-modal-container">
        <h3 className="admin-modal-title">Admin Actions</h3>
        <button className="admin-close-button" onClick={handleClose}>
          X
        </button>

        {/* Status Toggle Error */}
        {errorStatusToggle && <p className="admin-error-message">{errorStatusToggle}</p>}

        <div className="admin-action-section">
          {/* Enable/Disable User Section */}
          <input
            type="email"
            placeholder="Enter user email to take action"
            value={targetEmailStatus}
            onChange={(e) => setTargetEmailStatus(e.target.value)}
            className="admin-email-input"
            onKeyDown={(e) => e.key === 'Enter' && toggleUserStatus(targetEmailStatus)}
            required
          />
          <button
            onClick={() => toggleUserStatus(targetEmailStatus)}
            className="admin-action-button"
            disabled={loadingStatusToggle}
          >
            {loadingStatusToggle ? 'Fetching info...' : 'Take Action'}
          </button>
        </div>

        {/* Display User Info */}
        {userInfo && (
          <div className="user-info-dropdown">
            <h4>User Information</h4>
            <p><strong>Full Name:</strong> {userInfo.fullName || 'N/A'}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Joined on:</strong> {userInfo.createdAt ? new Date(userInfo.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
            <p><strong>Status:</strong> {userInfo.status}</p>
            <p><strong>Role:</strong> {userInfo.userRole}</p>

            {/* Show Enable/Disable Button */}
            <button
              onClick={updateUserStatus}
              className="admin-action-button"
              disabled={loadingStatusUpdate} // Disable the button during status update
            >
              {loadingStatusUpdate
                ? userInfo.status === 'active'
                  ? 'Disabling...'
                  : 'Enabling...'
                : userInfo.status === 'active'
                  ? 'Disable User'
                  : 'Enable User'}
            </button>

            {/* Show Change Role Button */}
            <button
              onClick={() => changeUserRole(userInfo.userRole === 'admin' ? 'user' : 'admin')}
              className="admin-action-button"
            >
              {userInfo.userRole === 'admin' ? 'Change to User' : 'Make Admin'}
            </button>
          </div>
        )}

        {/* Admin Error */}
        {errorAdmin && <p className="admin-error-message">{errorAdmin}</p>}


        
      </div>
    </div>
  );
};

export default AdminAction;