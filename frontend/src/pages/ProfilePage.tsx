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
import { getAuth, onAuthStateChanged, updatePassword } from "firebase/auth";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import "../assets/styles/ProfilePage.css";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [buttonLabel, setButtonLabel] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const auth = getAuth();
  const db = getFirestore();

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
  
      // Update password in Firebase Authentication if a new one is provided
      if (formData.password) {
        const user = auth.currentUser;
        if (user) {
          await updatePassword(user, formData.password); // Update Firebase Authentication password
          updatedData.password = await hashPassword(formData.password); // Still hash & store in Firestore (optional)
        } else {
          alert("User session expired. Please log in again.");
          return;
        }
      } else {
        delete updatedData.password; // Remove password field if empty
      }
  
      await updateDoc(userDocRef, updatedData);
      setIsEditing(false);
      setModalMessage("Profile updated successfully!");
      setButtonLabel("Continue");
      setModalTitle("Success!");
      setShowModal(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setModalMessage("Failed to update profile. Please try again.");
      setButtonLabel("Close");
      setModalTitle("Error");
      setShowModal(true);
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

  const handleContinue = () => {
    setShowModal(false);
    navigate(-1);
  };

  return (
    <div className="profile-page-container">
      <h2>Your Profile</h2>
      <Modal 
        showModal={showModal} 
        message={modalMessage} 
        buttonLabel={buttonLabel} 
        onClose={handleContinue} 
        title={modalTitle}
      />

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

          {/* Password with show toggle */}
          <div className="form-group">
            <label htmlFor="password">Change Password:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter new password"
              />
              <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="button" onClick={isEditing ? handleFormSubmit : toggleEditMode} className="edit-button" disabled={formLoading}>
            {isEditing ? (formLoading ? "Updating..." : "Save Changes") : "Edit Profile"}
          </button>

          <Link to={""}>
            <b className="back-button" style={{ fontSize: "larger", marginTop: "30px" }} onClick={() => navigate(-1)}>
              Go Back
            </b>
          </Link>
        </form>
      )}


    </div>
  );
};

export default ProfilePage;
