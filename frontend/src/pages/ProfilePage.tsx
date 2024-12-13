import React, { useEffect, useState, useContext } from "react";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../assets/styles/ProfilePage.css'
import { Link, useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track editing mode

  const auth = getAuth();
  const db = getFirestore();

  const handleGoBack = () => {
    navigate(-1); 
  };

  const fetchUserData = async (uid: string) => {
    try {
      const usersCollectionRef = collection(db, "EarlyStartData");
      const userQuery = query(usersCollectionRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userInfo = userDoc.data();
        setUserData(userInfo);
        setFormData(userInfo);
      } else {
        setErrorMessage("No user data found. Please reload or try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddField = () => {
    setCustomFields([...customFields, { name: "", value: "" }]);
  };

  const handleCustomFieldChange = (index: number, key: string, value: string) => {
    const updatedFields = customFields.map((field, i) =>
      i === index ? { ...field, [key]: value } : field
    );
    setCustomFields(updatedFields);
  };

  const renderCustomFields = () =>
    customFields.map((field, index) => (
      <div key={index} className="form-group">
        <input
          type="text"
          placeholder="Field Name"
          value={field.name}
          onChange={(e) =>
            handleCustomFieldChange(index, "name", e.target.value)
          }
          disabled={!isEditing}
        />
        <input
          type="text"
          placeholder="Field Value"
          value={field.value}
          onChange={(e) =>
            handleCustomFieldChange(index, "value", e.target.value)
          }
          disabled={!isEditing}
        />
      </div>
    ));

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      setFormLoading(true);

      const updatedData = {
        ...formData,
        customFields: customFields.reduce((acc, field) => {
          if (field.name && field.value) {
            acc[field.name] = field.value;
          }
          return acc;
        }, {}),
      };

      const userDocRef = doc(db, "EarlyStartData", userData.id);
      await updateDoc(userDocRef, updatedData);

      // Lock the form inputs and update the button text to "Edit Profile"
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing((prevState) => !prevState); // Toggle edit mode
  };

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

      {userData && (
        <form onSubmit={handleFormSubmit} className="profile-form">
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
              onChange={handleInputChange}
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
              onChange={handleTextareaChange}
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

          {renderCustomFields()}

          <button
            type="button"
            onClick={isEditing ? handleFormSubmit : toggleEditMode}
            className="edit-button"
            disabled={formLoading}
          >
            {isEditing ? (formLoading ? "Updating..." : "Update Profile") : "Edit Profile"}
          </button>
        </form>
      )}
      <br />

      <Link to="">
      <b style={{fontSize: "larger", paddingTop: "20px"}} onClick={handleGoBack}>Go Back</b>
      </Link>
    </div>
  );
};


export default ProfilePage;
