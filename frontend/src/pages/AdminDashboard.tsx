import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "../assets/styles/AdminDashboard.css";
import BlogModal from "./BlogModal";
import AdminAction from "./AdminAction";

const AdminDashboard: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  // Separate state for each modal
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isAdminActionOpen, setIsAdminActionOpen] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);

  const openBlogModal = () => {
    setIsBlogModalOpen(true);
  };

  const closeBlogModal = () => {
    setIsBlogModalOpen(false);
  };

  const openAdminActionModal = () => {
    setIsAdminActionOpen(true);
  };

  const closeAdminActionModal = () => {
    setIsAdminActionOpen(false);
  };

  const fetchUserData = async (uid: string) => {
    try {
      const usersCollectionRef = collection(db, "EarlyStartData");
      const userQuery = query(usersCollectionRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserData(userDoc.data());
      } else {
        setErrorMessage("No user data found.");
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
        setUsername(user.displayName || "Admin");
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

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
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  const formatDateWithSuffix = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
  
    // Determine the correct suffix for the day
    const getDaySuffix = (day: number) => {
      if (day > 3 && day < 21) return "th"; // Special case for 11th to 20th
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
  
    return `${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  return (
    <div className="admin-dashboard-container">
      <nav className="admin-navbar">
        <ul className="nav-links">
          <li>
            <Link to="" onClick={openBlogModal} className="nav-link">Create Blog</Link>
          </li>
          {/* Blog modal controlled by its own state */}
          <BlogModal isOpen={isBlogModalOpen} onClose={closeBlogModal} />

          <li>
            <Link to="" className="nav-link" onClick={openAdminActionModal}>Admin Actions</Link>
          </li>
          {/* AdminAction modal controlled by its own state */}
          <AdminAction isOpen={isAdminActionOpen} onClose={closeAdminActionModal} />
          
          <li>
            <Link to="/send-message" className="nav-link">Send Messages</Link>
          </li>
          
          <li>
            <Link to="/manage-accounts" className="nav-link">Manage Accounts</Link>
          </li>
          <li>
            <Link to="/profile" className="nav-link">Profile</Link>
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>

      <div className="admin-dashboard">
        <h2>Welcome Admin, {userData ? userData.username : "Loading..."}!</h2>
        <p>Manage users, create blogs, and send messages.</p>

        {userData && (
          <div className="user-details">
            <p>Full Name: {userData.fullName}</p>
            <p>Email: {userData.email}</p>
            <p>Username: {userData.username}</p>
            <p>Role: {userData.userRole || "User"}</p>
            <p>Status: {userData.status || "active"}</p>
          </div>
        )}
      </div>

      <h2>Latest Blog Posts</h2>
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className="blog-post">
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <span>{formatDateWithSuffix(blog.createdAt.toDate())}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
