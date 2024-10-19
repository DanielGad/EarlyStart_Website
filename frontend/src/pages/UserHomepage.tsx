import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "../assets/styles/UserHomepage.css";

const UserHomepage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  // Fetch user data from Firestore where userId field matches the authenticated user's UID
  const fetchUserData = async (uid: string) => {
    try {
      console.log("Fetching user data for userId:", uid); // Log userId being searched for
      
      const usersCollectionRef = collection(db, "EarlyStartData");
      const userQuery = query(usersCollectionRef, where("userId", "==", uid)); // Update query to use "userId"
      const querySnapshot = await getDocs(userQuery);
      
      // Log the entire querySnapshot to inspect the documents
      console.log("Query snapshot:", querySnapshot);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Get the first matching document
        console.log("Document found:", userDoc.data()); // Log the document data to verify
        setUserData(userDoc.data()); // Set user data from Firestore
      } else {
        console.error(`No document found for userId: ${uid}`);
        setErrorMessage("No user data found. Please check your profile.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Listen to authentication state and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid); // Fetch user data using UID
        setUsername(user.displayName || "User"); // Set username (or fallback to "User")
      } else {
        navigate("/login"); // Redirect to login if no user is authenticated
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [auth, navigate]);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page after sign-out
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setBlogs(blogsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error message if no document is found
  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  return (
    <div className="user-homepage-container">
      <div className="welcome-section">
        <h1>Welcome, {userData.username}!</h1>
        <p className="user-email">{userData?.email}</p>
      </div>

      <div className="navigation-section">
        <Link to="/profile" className="nav-link">View Profile</Link>
        <Link to="/settings" className="nav-link">Account Settings</Link>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="user-dashboard">
        <h2>Your Dashboard</h2>
        <p>Here you can see your recent activities, updates, and more.</p>
        {userData && (
          <div className="user-details">
            <p>Full Name: {userData.fullName}</p>
            <p>Email: {userData.email}</p>
            <p>Joined Date: {userData.createdAt?.toDate().toLocaleString()}</p> {/* Adjust for timestamp */}
            <p>Username: {userData.username}</p>
          </div>
        )}

      <h2>Latest Blog Posts</h2>
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className="blog-post">
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <span>{blog.createdAt.toDate().toLocaleDateString()}</span>
          </div>
        ))
      )}
      </div>
    </div>
  );
};

export default UserHomepage;
