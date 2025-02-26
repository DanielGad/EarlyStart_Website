import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "../../assets/styles/UserDashboard.css";
import Modal from "../Modal";
import { Context } from "../../Context/Context";
import Footer from "../../components/Footer/Footer";

const UserDashboard: React.FC = () => {
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

  const { isLoggedIn } = context;

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
        const userDocData = userDoc.data();
        setUserData(userDocData);

        // Check if the 'getstarted' object exists in the user's document
        if (!userDocData.getstarted) {
          setShowModal(true); // Show the modal if 'getstarted' is missing
          return;
        }

        if (!userDocData.access) {
          navigate("/payment");
          return;
        }
        
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
    return <div className="loading-screen">Loading...</div>;
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
    return `${day}${getDaySuffix(day)} of ${month} ${year}`;
  };

  const handleLoginRedirect = () => {
    setShowModal(false);
    navigate("");
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate("/get-started");
  };

  return (
    <><div className="dashboard-container">
      {/* Modal for 'Get Started' */}
      <Modal
        showModal={showModal}
        title={`Welcome ${userData ? userData.username : "User"}!`}
        message="Get Started to Schedule Right Away."
        buttonLabel="Later"
        onClose={handleLoginRedirect}
        onConfirm={handleModalConfirm} />

      {isLoggedIn && (
        <>
          <div className="dashboard-header">
            <h1>Welcome, {userData ? userData.username : "User"}!</h1>
            <p className="user-email">{userData?.email}</p>
          </div>

          <div className="navigation-bar">
            <Link to="/profile" className="nav-link1">View Profile</Link>
            <Link to="/messages" className="nav-link1">Messages</Link>
            <Link to="/login" className="nav-link1" onClick={handleLogout}>Logout</Link>
          </div>

          <div className="user-details-section">
            <h2>Your Dashboard</h2>
            <p>Here you can see your recent activities, updates, and more.</p>
            {userData && (
              <div className="user-details-card">
                <p><strong>Full Name:</strong> {userData.fullName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Joined Date:</strong> {formatDateWithSuffix(new Date(userData.createdAt))}</p>
                <p><strong>Username:</strong> {userData.username}</p>
              </div>
            )}
          </div>

          <div className="blog-section">
            <h2>Latest Blog Posts</h2>
            {blogs.length === 0 ? (
              <p>No blogs available.</p>
            ) : (
              blogs.map((blog) => (
                <div key={blog.id} className="blog-post-card">
                  <h3>{blog.title}</h3>
                  <p>{blog.content}</p>
                  <p><strong>Posted by:</strong> {blog.postedBy || "Management"}</p>
                  <p className="blog-date">
                    {`${formatDateWithSuffix(blog.createdAt.toDate())}, ${blog.createdAt
                      .toDate()
                      .toLocaleTimeString()}`}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div><Footer /></>
  );
};

export default UserDashboard;
