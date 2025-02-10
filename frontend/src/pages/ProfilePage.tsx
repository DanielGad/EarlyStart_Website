import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import bcrypt from "bcryptjs";
import "../assets/styles/ProfilePage.css";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUserRole } from "../hooks/AdminRole";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
  });
  const [modalData, setModalData] = useState({
        showModal: false,
        title: "",
        message: "",
        buttonLabel: "Close",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined as (() => void) | undefined,
      });

  const auth = getAuth();
  const db = getFirestore();

  const { userRole } = useUserRole();

  const handleContinue = () => {
    if (userRole === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const usersCollectionRef = collection(db, "EarlyStartData");
      const userQuery = query(usersCollectionRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setUserData({ ...userData, id: userDoc.id });

        // Ensure missing fields are set as empty strings
        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          createdAt: userData.createdAt || "",
          userRole: userData.userRole || "User",
          username: userData.username || "",
          bio: userData.bio || "",
          dob: userData.dob || "",
          phoneNumber: userData.phoneNumber || "",
          password: "", // Password field is empty for security reasons
        });
      } else {
        setErrorMessage("No user data found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewPassword(value);
    setPasswordCriteria({
      length: value.length >= 6,
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
    });
  };

  // Hash password before updating Firestore
  const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };

  // Update user profile
  const handleFormSubmit = async () => {
    if (!userData || !userData.id) return;
  
    try {
      setFormLoading(true);
      const userDocRef = doc(db, "EarlyStartData", userData.id);
      const updatedData = { ...formData };
  
      // Verify current password and update new password in Firebase Authentication if provided
      if (newPassword) {
        const user = auth.currentUser;
        if (user && currentPassword) {
          try {
            await signInWithEmailAndPassword(auth, user.email!, currentPassword);
            await updatePassword(user, newPassword); // Update Firebase Authentication password
            updatedData.password = await hashPassword(newPassword); // Still hash & store in Firestore (optional)
          } catch (error) {
            setModalData({
              showModal: true,
              title: "Error!",
              message: "Current password is incorrect.",
              buttonLabel: "Close",
              onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
              onConfirm: undefined
            });
            setFormLoading(false);
            return;
          }
        } else {
          alert("User session expired. Please log in again.");
          return;
        }
      } else {
        delete updatedData.password; // Remove password field if empty
      }
  
      await updateDoc(userDocRef, updatedData);
      setIsEditing(false);
      setModalData({
        showModal: true,
        title: "Success!",
        message: "Profile Updated Successfully!",
        buttonLabel: "Continue",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setModalData({
        showModal: true,
        title: "Error!",
        message: "Failed to update profile. Please try again.",
        buttonLabel: "Close",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle editing mode
  const toggleEditMode = () => {
    setIsEditing((prevState) => !prevState);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Fetch data on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setErrorMessage("Please log in to access the Profile Page.");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }



  return (
    <div className="profile-page-container">
      <h2>Your Profile</h2>
      <Modal {...modalData}/>

      {userData && (
        <form className="profile-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} disabled />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              typeof="text"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          {/* Current Password */}
          {isEditing && (
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password:</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>
          )}

          {/* New Password with show toggle */}
          <div className="form-group">
            <label htmlFor="password">Change Password:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={newPassword}
                onChange={handlePasswordChange}
                disabled={!isEditing}
                placeholder="Enter new password"
              />
              <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <div className="password-control-n">
            {isEditing && newPassword && (!passwordCriteria.length) && (
              <div className="password-alert">
              <p className="password-criteria-check">
              Password must be at least 6 characters!
              </p>
              </div>
            )}
              {isEditing && newPassword && (!passwordCriteria.length) && (
              <div className="password-alert">
              <p className="password-criteria-check">Password must contain at least one uppercase letter!</p>
              </div>
            )}
             {isEditing && newPassword && (!passwordCriteria.number) && (
              <div className="password-alert">
              <p className="password-criteria-check">
              Password must contain at least one number
              </p>
              </div>
            )}
              
            </div>
          </div>

          <button type="button" onClick={isEditing ? handleFormSubmit : toggleEditMode} className="edit-button" disabled={formLoading}>
            {isEditing ? (formLoading ? "Updating..." : "Save Changes") : "Edit Profile"}
          </button>

          <button className="back-button" onClick={() => handleContinue()} style={{ textAlign: 'center', marginRight: 'auto', marginLeft: 'auto', display: 'block' }}>
            Go Back
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;