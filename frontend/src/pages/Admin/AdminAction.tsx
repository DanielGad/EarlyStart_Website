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
  const [loadingStatusToggle, setLoadingStatusToggle] = useState<boolean>(false);
  const [loadingStatusUpdate, setLoadingStatusUpdate] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [modalData, setModalData] = useState({
    showModal: false,
    title: "",
    message: "",
    buttonLabel: "",
    onClose: () => {},
    onConfirm: undefined
  });

  const [buttonText, setButtonText] = useState("Copy Code");

  const handleClick = () => {
    setButtonText((prevText) => (prevText === "Copy Code" ? "Copied!" : "Copy Code"));
  };

  if (!isOpen) return null;

  const toggleUserStatus = async (email: string) => {
    setLoadingStatusToggle(true);
    try {
      const usersCollectionRef = collection(db, 'EarlyStartData');
      const userQuery = query(usersCollectionRef, where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setUserInfo({ ...userData, docId: userDoc.id });
        setTargetEmailStatus('');
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
      setModalData({
        showModal: true,
        title: "Error!",
        message: "Error fetching user info. Please try again.",
        buttonLabel: "Continue",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
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
      setModalData({
        showModal: true,
        title: "Error!",
        message: "Error toggling user status. Please try again.",
        buttonLabel: "Continue",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
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

  const generateAccessCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    setGeneratedCode(code);
    return code;
  };

  const saveGeneratedCode = async () => {
    if (!userInfo || !userInfo.docId) return;
    if (userInfo.generated) {
      setModalData({
        showModal: true,
        title: "Error!",
        message: "Access code already generated for this user.",
        buttonLabel: "Continue",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
      return;
    }
    const code = generateAccessCode();
    try {
      const userDocRef = doc(db, 'EarlyStartData', userInfo.docId);
      await updateDoc(userDocRef, { generated: code });
      setModalData({
        showModal: true,
        title: "Success!",
        message: `Access code generated and saved successfully.`,
        buttonLabel: "Continue",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
    } catch (error) {
      setModalData({
        showModal: true,
        title: "Error!",
        message: "Error generating access code. Please try again.",
        buttonLabel: "Continue",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
      console.error('Error generating access code:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setTargetEmailStatus('');
    setUserInfo(null);
    setGeneratedCode('');
  };

  const formatDateWithSuffix = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const getDaySuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
    return `${day}${getDaySuffix(day)} ${month} ${year}`;

  };

  return (
    <div className="admin-modal-overlay">
      <Modal {...modalData} />
      <div className="admin-modal-container">
        <h3 className="admin-modal-title">Admin Actions</h3>
        <button className="admin-close-button" onClick={handleClose}>
          X
        </button>

        <div className="admin-action-section">
          {/* Enable/Disable User Section */}
          {!userInfo && (
            <>
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
            </>
          )}
        </div>

        {/* Display User Info */}
        {userInfo && (
          <div className="user-info-dropdown">
            <h4>User Information</h4>
            <p><strong>Full Name:</strong> {userInfo.fullName || 'N/A'}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Joined on:</strong> {formatDateWithSuffix(new Date(userInfo.createdAt))}</p>
            <p><strong>Status:</strong> {userInfo.status}</p>
            <p><strong>Role:</strong> {userInfo.userRole}</p>
            {userInfo.generated !== "" ? <><p><strong>Access Code:</strong> {userInfo.generated}</p>
            <button
              onClick={() => {navigator.clipboard.writeText(userInfo.generated); handleClick()}}
              className="copy-button"
            >
              {buttonText}
            </button></> : null}

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

            {/* Generate Access Code Button */}
            <button
              onClick={saveGeneratedCode}
              className="admin-action-button"
            >
              Generate Access Code
            </button>

            {/* Display Generated Code */}
            {generatedCode && (
              <div className="generated-code">
                <p><strong>Generated Code:</strong> {generatedCode}</p>
                <button
                  onClick={() => {navigator.clipboard.writeText(generatedCode); handleClick()}}
                  className="copy-button"
                >
                  {buttonText}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAction;