import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy // Import orderBy
} from "firebase/firestore";
import bcrypt from 'bcryptjs';
import "../../assets/styles/ManageAccount.css";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
    createdAt: "", 
    getstarted: {
      childName: "",
      preferredDays: "",
      preferredTimeSlot: "",
      childInfo: "",
      specificFocus: "",
      parentName: "",
      email: "",
      phone: "",
      country: "",
      state: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modalData, setModalData] = useState({
      showModal: false,
      title: "",
      message: "",
      buttonLabel: "Close",
      onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
      onConfirm: undefined as (() => void) | undefined,
    });
  const [documents, setDocuments] = useState<any[]>([]);
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    // Fetch all documents when the component mounts
    const fetchAllDocuments = async () => {
      setLoading(true);
      try {
        const usersCollectionRef = collection(db, "EarlyStartData");
        const q = query(usersCollectionRef, orderBy("createdAt", "desc")); // Order by createdAt field
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setModalData({
          showModal: true,
          title: "Error!",
          message: "Failed to fetch documents. Please try again.",
          buttonLabel: "Okay",
          onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
          onConfirm: undefined
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllDocuments();
  }, [db]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Fetch user data by email
  const fetchUserData = async (email: string) => {
    setLoading(true);
    try {
      const usersCollectionRef = collection(db, "EarlyStartData");
      const userQuery = query(usersCollectionRef, where("email", "==", email));
      const querySnapshot = await getDocs(userQuery);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserData({ ...userDoc.data(), id: userDoc.id });
        const userData = userDoc.data();
        
        setFormData({
          ...userData,
          fullName: userData.fullName || "",
          email: userData.email || "",
          createdAt: userData.createdAt || "",
          userRole: userData.userRole || "User",
          username: userData.username || "",
          bio: userData.bio || "",
          dob: userData.dob || "",
          phoneNumber: userData.phoneNumber || "",
          password: "",
          getstarted: {
            childName: userData.getstarted?.childName || "",
            preferredDays: userData.getstarted?.preferredDays || "",
            preferredTimeSlot: userData.getstarted?.preferredTimeSlot || "",
            childInfo: userData.getstarted?.childInfo || "",
            specificFocus: userData.getstarted?.specificFocus || "",
            parentName: userData.getstarted?.parentName || "",
            email: userData.getstarted?.email || "",
            phone: userData.getstarted?.phone || "",
            country: userData.getstarted?.country || "",
            state: userData.getstarted?.state || "",
          },
        });
        setsearchEmail("");
        setShowList(false);
      } else {
        setModalData({
          showModal: true,
          title: "Error!",
          message: "User not found. Please check the email.",
          buttonLabel: "Okay",
          onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
          onConfirm: undefined
        });
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setModalData({
        showModal: true,
        title: "Error!",
        message: "Failed to fetch user. Please try again.",
        buttonLabel: "Okay",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
      setUserData(null)
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
      
      const updatedFormData: any = { ...formData };
      
      // Remove empty fields from updatedFormData
      Object.keys(updatedFormData).forEach(key => {
        if (updatedFormData[key] === "" || (typeof updatedFormData[key] === 'object' && Object.keys(updatedFormData[key]).length === 0)) {
          delete updatedFormData[key];
        }
      });

      // Update Firestore database
      const userDocRef = doc(db, "EarlyStartData", userData.id);
      await updateDoc(userDocRef, updatedFormData);

      // Update password in Firestore if provided
      if (formData.password) {
        // Hash the new password before saving in Firestore
        const hashedPassword = bcrypt.hashSync(formData.password, 10);
        await updateDoc(userDocRef, { password: hashedPassword });
      }
  
      setIsEditing(false);
      setModalData({
        showModal: true,
        title: "Success!",
        message: "Profile Updated Successfully!",
        buttonLabel: "Okay",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setModalData({
        showModal: true,
        title: "Error!",
        message: "Failed to update profile. Please try again.",
        buttonLabel: "Okay",
        onClose: () => setModalData((prev) => ({ ...prev, showModal: false })),
        onConfirm: undefined
      });
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
    fetchUserData(searchEmail);
  };

  const handleDocumentClick = (email: string) => {
    fetchUserData(email);
  };

  const handleBackClick = () => {
    setUserData(null);
    setShowList(true);
  };

  const handleBackClickSec = () => {
    navigate(-1);
  };

  return (
    <div className="manage-account-container">
      <Modal {...modalData}/>
      <h2>Manage User Account</h2>

      {showList && (
        <>
          {/* Search Bar */}
          {/* <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="email"
              placeholder="Enter user email..."
              value={searchEmail}
              onChange={(e) => setsearchEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form> */}

          {/* List of Documents */}
          <div className="documents-list">
            <h3>All Users</h3>
            {documents.map((doc) => (
              <div key={doc.id} className="document-item" onClick={() => handleDocumentClick(doc.email)}>
                {doc.email} 
                <br />as <br />
                <b>{doc.fullName}</b> <br />
                ({formatDateWithSuffix(new Date(doc.createdAt))})
              </div>
            ))}
                      <button className="back-button" onClick={handleBackClickSec}>
            Go Back
          </button>
          </div>
        </>
      )}

      {!showList && (
        <div>

        </div>
      )}

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
            <input type="text" value={formData.createdAt ? formatDateWithSuffix(new Date(formData.createdAt)) : ""} disabled />
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
              typeof="text"
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
              typeof="text"
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
              type="email"
              name="getstarted.email"
              value={formData.getstarted.email || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Country:</label>
            <input
              type="country"
              name="getstarted.country"
              value={formData.getstarted.country || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>State:</label>
            <input
              type="state"
              name="getstarted.state"
              value={formData.getstarted.state || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Parent's Phone:</label>
            <input
              type="tel"
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
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

          <button
            type="button"
            onClick={isEditing ? handleFormSubmit : () => setIsEditing(true)}
            className="edit-button"
            disabled={formLoading}
          >
            {isEditing ? (formLoading ? "Updating..." : "Save Changes") : "Edit Profile"}
          </button>

          <button className="back-button" onClick={handleBackClick} style={{marginRight: 'auto', marginLeft: 'auto', display: 'block'}}>
            Go Back
          </button>
        </form>
      )}
    </div>
  );
};

export default ManageAccount;