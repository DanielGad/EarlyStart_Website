import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Modal from "../pages/Modal";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async (user: User) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const usersCollection = collection(db, "EarlyStartData");
        const userQuery = query(usersCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserRole(userData.userRole || "user"); // Default to "user" if no role found
        } else {
          console.warn("No matching user document found for userId:", user.uid);
          setUserRole("user"); // Default role
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("user"); // Default in case of an error
      }

      setLoading(false);
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserRole(user);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { userRole, loading };
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userRole, loading } = useUserRole();
  const [showModal, setShowModal] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!loading && userRole !== "admin") {
      setShowModal(true);
    }
  }, [loading, userRole]);

  const handleConfirm = () => {
    setShowModal(false);
    setRedirect(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userRole) {
    return <Navigate to="/login" />; // Redirect if user is not authenticated
  }

  if (redirect) {
    return <Navigate to="/user-dashboard" />;
  }

  if (showModal) {
    return (
      <Modal
        showModal={showModal}
        title="Unauthorized Access"
        message="You do not have permission to access this page."
        buttonLabel="OK"
        onClose={handleConfirm}
      />
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
