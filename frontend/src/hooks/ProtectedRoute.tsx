import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Modal from "../pages/Modal";

const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowModal(true);
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

  if (!user) {
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