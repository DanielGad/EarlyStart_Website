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

const AdminDashboard: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetEmail, setTargetEmail] = useState<string>("");
  const [targetEmailStatus, setTargetEmailStatus] = useState<string>("");
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  const makeAdmin = async (email: string) => {
    try {
      const usersCollectionRef = collection(db, "EarlyStartData");
      const userQuery = query(usersCollectionRef, where("email", "==", email));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "EarlyStartData", userDoc.id), {
          userRole: "admin",
        });
        alert(`${email} has been made an admin.`);
        setTargetEmail("");
      } else {
        alert("User not found.");
        setTargetEmail("");
      }
    } catch (error) {
      console.error("Error making user admin:", error);
    }
  };

  const toggleUserStatus = async (email: string) => {
    try {
      const usersCollectionRef = collection(db, "EarlyStartData");
      const userQuery = query(usersCollectionRef, where("email", "==", email));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const currentStatus = userDoc.data().status || "active";
        const newStatus = currentStatus === "active" ? "disabled" : "active";

        await updateDoc(doc(db, "EarlyStartData", userDoc.id), { status: newStatus });
        alert(`${email} is now ${newStatus}.`);
        setTargetEmailStatus("");
      } else {
        alert("User not found.");
        setTargetEmailStatus("");
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
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

  return (
    <div className="admin-dashboard-container">
      <nav className="admin-navbar">
        <ul className="nav-links">
          <li>
            <Link to="" onClick={openModal} className="nav-button">Create Blog</Link>
          </li>
          <BlogModal isOpen={isModalOpen} onClose={closeModal} />
          <li>
            <Link to="/send-message" className="nav-link">Send Messages</Link>
          </li>
          <li>
            <Link to="/make-admin" className="nav-link">Make Admin</Link>
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
        <h2>Welcome Admin, {userData.username}!</h2>
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

      <div className="admin-actions">
        <h3>Admin Actions</h3>

        {/* Make Admin Section */}
        <div className="admin-action">
          <input
            type="email"
            placeholder="Enter user email to make admin"
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            className="email-input"
          />
          <button onClick={() => makeAdmin(targetEmail)} className="admin-button">Make Admin</button>
        </div>

        {/* Enable/Disable User Section */}
        <div className="admin-action">
          <input
            type="email"
            placeholder="Enter user email to enable/disable"
            value={targetEmailStatus}
            onChange={(e) => setTargetEmailStatus(e.target.value)}
            className="email-input"
          />
          <button onClick={() => toggleUserStatus(targetEmailStatus)} className="admin-button">Toggle User Status</button>
        </div>

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

export default AdminDashboard;
