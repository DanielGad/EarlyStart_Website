// AdminDashboard.tsx

import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "../../assets/styles/AdminDashboard.css";
import BlogModal from "./BlogModal";
import AdminAction from "./AdminAction";
import Modal from "../Modal";
import { Context } from "../../Context/Context";
import Footer from "../../components/Footer/Footer";

const AdminDashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const context = useContext(Context);
  if (!context) {
    throw new Error("Context has not been provided.");
  }

  // Separate state for each modal
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isAdminActionOpen, setIsAdminActionOpen] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

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
        const userInfo = userDoc.data();
        setUserData(userInfo);
        if (userInfo.userRole !== "admin") {
          setModalMessage("Access Denied. You do not have the necessary permissions.");
          setShowModal(true);
        }
      } else {
        setErrorMessage("No user data found. Please try again or Reload.");
      }
    } catch (error) {
      setErrorMessage("Failed to load user data. Please try again later or Reload.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setModalMessage("Please log in to access the Dashboard.");
        setShowModal(true);
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

  // Real-time fetching of blogs
  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const blogsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setBlogs(blogsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteBlog = async (blogId: string) => {
    try {
      const blogDocRef = doc(db, "blogs", blogId);
      await deleteDoc(blogDocRef);
      setBlogs(blogs.filter(blog => blog.id !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
      setModalMessage("Failed to delete the blog. Please try again.");
      setShowModal(true);
    }
  };

  const openDeleteConfirmation = (blogId: string) => {
    setSelectedBlogId(blogId);
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedBlogId(null);
    setIsDeleteConfirmationOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (selectedBlogId) {
      deleteBlog(selectedBlogId);
      closeDeleteConfirmation();
    }
  };

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

    const getDaySuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  return (
    <><div className="admin-dashboard-container">
      {showModal ? (
        <Modal
          showModal={true}
          title="Access Denied"
          message={modalMessage}
          buttonLabel="Go to Login"
          onClose={() => navigate("/login")} />
      ) : (
        <div>
          <nav className="admin-navbar">
            <ul className="nav-links">
              <div>
                <Link to="" onClick={openBlogModal} className="nav-link">
                  Create Blog
                </Link>
              </div>
              <BlogModal isOpen={isBlogModalOpen} onClose={closeBlogModal} />

              <div>
                <Link to="" className="nav-link" onClick={openAdminActionModal}>
                  Admin Actions
                </Link>
              </div>
              <AdminAction isOpen={isAdminActionOpen} onClose={closeAdminActionModal} />

              <div>
                <Link to="/send-message" className="nav-link">
                  Send Messages
                </Link>
              </div>

              <div>
                <Link to="/manage-accounts" className="nav-link">
                  Manage Accounts
                </Link>
              </div>
              <div>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </div>
              <div>
                <button className="nav-link" onClick={handleLogout} style={{ border: "none", cursor: "pointer" }}>
                  Logout
                </button>
              </div>
            </ul>
          </nav>

          <div className="admin-dashboard">
            <h2>Welcome Admin, {userData ? userData.username : "Loading..."}!</h2>
            <p>Manage users, create blogs, and send messages.</p>

            {userData && (
              <div className="user-details">
                <p><b>Full Name:</b> {userData.fullName}</p>
                <p><b>Email:</b> {userData.email}</p>
                <p><b>Username:</b> {userData.username}</p>
                <p><b>Role:</b> {userData.userRole || "User"}</p>
                <p><b>Status:</b> {userData.status || "active"}</p>
              </div>
            )}
          </div>

          <h2>Latest Blog Posts</h2>
          {blogs.length === 0 ? (
            <p>No blogs available.</p>
          ) : (blogs.map((blog) => (
            <div key={blog.id} className="blog-post">
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
              <p>
                <strong>Posted by:</strong> {blog.postedBy || "Management"}
              </p>
              <div className="blog-date">
                {`${formatDateWithSuffix(blog.createdAt.toDate())}, ${blog.createdAt
                  .toDate()
                  .toLocaleTimeString()}`}
              </div>
              <button
                className="delete-button"
                onClick={() => openDeleteConfirmation(blog.id)}
              >
                Delete Blog
              </button>
            </div>
          )))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationOpen && (
        <Modal
          showModal={true}
          title="Confirm Deletion"
          message="Are you sure you want to delete this blog post?"
          buttonLabel="Cancel"
          onClose={closeDeleteConfirmation}
          onConfirm={handleDeleteConfirmed} />
      )}
    </div><Footer /></>
  );
};

export default AdminDashboard;