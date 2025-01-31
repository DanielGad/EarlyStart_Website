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
import bcrypt from 'bcryptjs';
import "../../assets/styles/ManageAccount.css";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { updatePassword } from "firebase/auth";

const ManageAccount: React.FC = () => {
  const navigate = useNavigate();
  const db = getFirestore();
  
  const [searchEmail, setsearchEmail] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    password: "",
    fullName: "",
    email: "",
    userRole: "",
    dob: "",
    username: "",
    phoneNumber: "",
    bio: "",
    createdAt: new Date(),
    getstarted: {
      childName: "",
      preferredDays: "",
      preferredTimeSlot: "",
      childInfo: "",
      specificFocus: "",
      parentName: "",
      email: "",
      phone: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Fetch user data by email
  const fetchUserData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const usersCollectionRef = collection(db, "EarlyStartData");
      const userQuery = query(usersCollectionRef, where("email", "==", searchEmail));
      const querySnapshot = await getDocs(userQuery);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserData({ ...userDoc.data(), id: userDoc.id });
        setFormData({
          ...userDoc.data(),
          password: "", // Clear password field for security
        });
      } else {
        setErrorMessage("User not found. Please check the email.");
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setErrorMessage("Failed to fetch user. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");
  
    if (child) {
      setFormData((prevData: any) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevData: any) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  // Update user profile and password
  const handleFormSubmit = async () => {
    if (!userData || !userData.id) return;
    try {
      setFormLoading(true);
      
      // Update password in Firebase Authentication
      if (formData.password) {
        const auth = getAuth();
        if (!auth.currentUser) {
          alert("No authenticated user found.");
          return;
        }
        await updatePassword(auth.currentUser, formData.password);
      }
  
      // Hash the new password before saving in Firestore
      const hashedPassword = bcrypt.hashSync(formData.password, 10);
      const updatedFormData = {
        ...formData,
        password: hashedPassword,
      };
  
      // Update Firestore database
      const userDocRef = doc(db, "EarlyStartData", userData.id);
      await updateDoc(userDocRef, updatedFormData);
  
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };
  
  const formatDateWithSuffix = (date: Date): string => {
    const day = date.getDate();
    const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
                   (day % 10 === 2 && day !== 12) ? 'nd' :
                   (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if needed
    return `${day}${suffix} of ${month} ${year} at ${formattedHours}:${formattedMinutes}${ampm}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUserData();
  };

  return (
    <div className="manage-account-container">
      <h2>Manage User Account</h2>

      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Enter user email..."
          value={searchEmail}
          onChange={(e) => setsearchEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* User Profile Display */}
      {userData && (
        <form className="profile-form">
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={formData.email || ""} disabled />
          </div>

          <div className="form-group">
            <label>Joined on:</label>
            <input type="text" value={formatDateWithSuffix(formData.createdAt.toDate()) || ""} disabled />
          </div>

          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Bio:</label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleInputChange}
              style={{ resize: 'none' }}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Role:</label>
            <input type="text" value={formData.userRole || ""} disabled />
          </div>

          <div className="form-group">
            <label>Child's Name:</label>
            <input
              type="text"
              name="getstarted.childName"
              value={formData.getstarted.childName || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Preferred Days for learning:</label>
            <input
              type="text"
              name="getstarted.preferredDays"
              value={formData.getstarted.preferredDays || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Preferred Time for learning:</label>
            <input
              type="text"
              name="getstarted.preferredTimeSlot"
              value={formData.getstarted.preferredTimeSlot || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Tell us about your child:</label>
            <textarea
              name="getstarted.childInfo"
              value={formData.getstarted.childInfo || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{ resize: 'none' }}
            />
          </div>

          <div className="form-group">
            <label>Specific Focus:</label>
            <textarea
              name="getstarted.specificFocus"
              value={formData.getstarted.specificFocus || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{ resize: 'none' }}
            />
          </div>

          <div className="form-group">
            <label>Parent's Name:</label>
            <input
              type="text"
              name="getstarted.parentName"
              value={formData.getstarted.parentName || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Parent's Email:</label>
            <input
              type="text"
              name="getstarted.email"
              value={formData.getstarted.email || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Parent's Phone:</label>
            <input
              type="text"
              name="getstarted.phone"
              value={formData.getstarted.phone || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Change Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <button type="button" className="toggle-password1" onClick={togglePasswordVisibility}>
                {showPassword ? "Hide" : "Show"}
              </button>

          <button
            type="button"
            onClick={isEditing ? handleFormSubmit : () => setIsEditing(true)}
            className="edit-button"
            disabled={formLoading}
          >
            {isEditing ? (formLoading ? "Updating..." : "Save Changes") : "Edit Profile"}
          </button>

          <button className="back-button" onClick={() => navigate('/admin-dashboard')}>
            Go Back
          </button>
        </form>
      )}
    </div>
  );
};

export default ManageAccount;