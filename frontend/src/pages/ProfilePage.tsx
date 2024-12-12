import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface UserData {
  fullName: string;
  username: string;
  email: string;
  userRole: string;
  bio?: string;
  phoneNumber?: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "EarlyStartData", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
            console.log(data);
            
            setBio(data.bio || "");
            setPhoneNumber(data.phoneNumber || "");
          } else {
            setMessage("User data not found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setMessage("An error occurred. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (user && userData) {
      try {
        const userDocRef = doc(db, "EarlyStartData", user.uid);
        await updateDoc(userDocRef, { bio, phoneNumber });
        setMessage("Profile updated successfully.");
      } catch (error) {
        console.error("Error updating profile:", error);
        setMessage("Failed to update profile. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>Profile Information</h2>
      {loading ? (
        <p>Loading user data...</p>
      ) : (
        <>
          {message && <p>{message}</p>}
          {userData ? (
            <div>
              <p><strong>Full Name:</strong> {userData.fullName || "Not Available"}</p>
              <p><strong>Username:</strong> {userData.username || "Not Available"}</p>
              <p><strong>Email:</strong> {userData.email || "Not Available"}</p>
              <p><strong>User Role:</strong> {userData.userRole || "Not Available"}</p>
    
              <h3>Edit Profile</h3>
              <label>
                Bio:
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </label>
              <br />
              <label>
                Phone Number:
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </label>
              <br />
              <button onClick={handleSave}>Save Changes</button>
            </div>
          ) : (
            <p>No user data available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
