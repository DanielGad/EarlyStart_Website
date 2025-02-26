import React, { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Modal from "../pages/Modal";

const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        localStorage.setItem("lastActivity", Date.now().toString());
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const auth = getAuth();
  const inactivityLimit = 5 * 60 * 1000; // 1 minute

  // Logout function
  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log("User logged out due to inactivity.");
      setShowModal(true);
      localStorage.removeItem("lastActivity");
    });
  };

  // Reset inactivity timer
  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleLogout, inactivityLimit);
    localStorage.setItem("lastActivity", Date.now().toString());
  };

  // Handle when the page becomes visible or hidden
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity && Date.now() - parseInt(lastActivity) > inactivityLimit) {
        handleLogout();
      } else {
        resetTimer();
      }
    }
  };

  useEffect(() => {
    const lastActivity = localStorage.getItem("lastActivity");
    if (lastActivity && Date.now() - parseInt(lastActivity) > inactivityLimit) {
      handleLogout();
    }

    if (!loading && user) {
      localStorage.setItem("lastActivity", Date.now().toString());

      // Activity listeners
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keypress", resetTimer);
      window.addEventListener("scroll", resetTimer);
      window.addEventListener("click", resetTimer);
      document.addEventListener("visibilitychange", handleVisibilityChange); 
      resetTimer(); 
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("click", resetTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, loading]);

  useEffect(() => {
    if (!loading && !user) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [loading, user]);

  const handleConfirm = () => {
    setShowModal(false);
    setRedirect(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (redirect) {
    return <Navigate to="/login" />;
  }

  if (!user && !loading) {
    return (
      <Modal
        showModal={showModal}
        title="Authentication Required"
        message="You are not logged in!"
        buttonLabel="Login"
        onClose={handleConfirm}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;