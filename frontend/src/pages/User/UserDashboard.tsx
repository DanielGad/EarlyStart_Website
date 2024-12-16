import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "../../assets/styles/UserDashboard.css";
import Modal from "../Modal";
import { Context } from "../../Context/Context";

const UserDashboard: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const context = useContext(Context);
  
  if (!context) {
    throw new Error("Context has not been provided.");
  }

  const { isLoggedIn, setIsLoggedIn } = context;

  // Display modal if not logged in when component mounts
  useEffect(() => {
    if (isLoggedIn === false) {
      setShowModal(true);
    }
  }, [isLoggedIn]);

  const fetchUserData = async (uid: string) => {
    try {
      const usersCollectionRef = collection(db, "EarlyStartData");
      const userQuery = query(usersCollectionRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(userQuery);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserData(userDoc.data());
      } else {
        setErrorMessage("No user data found. Please check your profile.");
      }
    } catch (error) {
      setErrorMessage("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
        setUsername(user.displayName || "User");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
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
  }, [db]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

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

  const handleLoginRedirect = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className="user-homepage-container">
      <Modal
        showModal={showModal}
        title="Access Denied!"
        message="Please log in to access the Dashboard"
        buttonLabel="Log In"
        onClose={handleLoginRedirect} // Redirect on button click
      />
      
      {isLoggedIn && (
        <>
          <div className="welcome-section">
            <h1>Welcome, {userData ? userData.username : "User"}!</h1>
            <p className="user-email">{userData?.email}</p>
          </div>
          <div className="navigation-section">
            <Link to="/profile" className="nav-link">View Profile</Link>
            <Link to="/messages" className="nav-link">Messages</Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
          <div className="user-dashboard">
            <h2>Your Dashboard</h2>
            <p>Here you can see your recent activities, updates, and more.</p>
            {userData && (
              <div className="user-details">
                <p>Full Name: {userData.fullName}</p>
                <p>Email: {userData.email}</p>
                <p>Joined Date: {formatDateWithSuffix(userData.createdAt?.toDate())}</p>
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
                  <p>
                <strong>Posted by:</strong> {blog.postedBy || "Management"}
              </p>

                  <span>
                {`${formatDateWithSuffix(blog.createdAt.toDate())}, ${blog.createdAt
                  .toDate()
                  .toLocaleTimeString()}`}</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
