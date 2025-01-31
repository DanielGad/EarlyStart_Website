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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../assets/styles/ProfilePage.css";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
        setUserData({ ...userDoc.data(), id: userDoc.id });
        setFormData(userDoc.data());
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

  // Update user profile
  const handleFormSubmit = async () => {
    if (!userData || !userData.id) return;

    try {
      setFormLoading(true);
      const userDocRef = doc(db, "EarlyStartData", userData.id);
      await updateDoc(userDocRef, formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle editing mode
  const toggleEditMode = () => {
    setIsEditing((prevState) => !prevState);
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

  return (
    <div className="profile-page-container">
      <h2>Your Profile</h2>

      {userData && (
        <form className="profile-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              disabled
            />
          </div>

            <div className="form-group">
            <label htmlFor="joined">Joined on:</label>
            <input
              type="text"
              id="joined"
              name="joined"
              value={formatDateWithSuffix(formData.createdAt.toDate()) || ""}
              disabled
            />
            </div>

            <div className="form-group">
            <label htmlFor="role">Role:</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.userRole || "User"}
              disabled
            />
            </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
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
              value={formData.dob || ""}
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
              value={formData.phoneNumber || ""}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              disabled={!isEditing}
            />
          </div>

          <button
            type="button"
            onClick={isEditing ? handleFormSubmit : toggleEditMode}
            className="edit-button"
            disabled={formLoading}
          >
            {isEditing ? (formLoading ? "Updating..." : "Save Changes") : "Edit Profile"}
          </button>
          <Link to={""}>
          <b className="back-button" 
          style={{fontSize: "larger", marginTop: "30px"}}
          onClick={() => navigate(-1)}>
            Go Back
          </b>
      </Link>
        </form>
      )}
      
    </div>
  );
};

export default ProfilePage;
