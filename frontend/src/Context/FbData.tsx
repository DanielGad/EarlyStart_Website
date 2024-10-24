import React, { createContext, useState, ReactNode } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Import Firebase DB

interface FbDataContextType {
  login: (email: string, password: string) => Promise<{ role: string; status: string; success: boolean }>;
  messageBody: string;
  messageTitle: string;
  messageAction: string;
  isLoading: boolean;
  showModalFb: boolean;  // Add showModal to the context
}

export const FbDataContext = createContext<FbDataContextType>({
  login: async () => ({ role: "user", status: "unknown", success: false }),
  messageBody: "",
  messageTitle: "",
  messageAction: "",
  isLoading: false,
  showModalFb: false,  // Initialize with false
});

export const FbDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messageBody, setMessageBody] = useState<string>("");
  const [messageTitle, setMessageTitle] = useState<string>("");
  const [messageAction, setMessageAction] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModalFb, setShowModal] = useState(false);  // New state for modal control

  // Function to handle login and retrieve user role and status
  const login = async (email: string, password: string): Promise<{ role: string; status: string; success: boolean }> => {
    const auth = getAuth();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = collection(db, "EarlyStartData");
      const q = query(userRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const role = userData?.userRole?.toLowerCase() || "user";
        const status = userData?.status?.toLowerCase() || "active";

        // Return role and status along with a success flag
        return { role, status, success: true };
      } else {
        setMessageBody("User data not found.");
        setShowModal(true); // Show modal on error
        return { role: "user", status: "unknown", success: false };
      }
    } catch (error: any) {
      handleFirebaseErrors(error);
      return { role: "user", status: "unknown", success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Firebase authentication errors
  const handleFirebaseErrors = (error: any) => {
    if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      setMessageTitle("Error!!! Invalid Entry");
      setMessageBody("Invalid email or password.");
      setMessageAction("Try Again");
    } else if (error.code === "auth/invalid-credential") {
      setMessageTitle("Error!!!");
      setMessageBody("Invalid credentials provided.");
      setMessageAction("Try Again");
    } else if (error.code === "auth/network-request-failed") {
      setMessageTitle("Network Error!");
      setMessageBody("Network error, please check your internet connection.");
      setMessageAction("Try Again");
    } else {
      setMessageTitle("Error!!!");
      setMessageBody("An unexpected error occurred.");
      setMessageAction("Try Again");
    }
    setShowModal(true);  // Show modal when errors are set
  };

  return (
    <FbDataContext.Provider value={{ login, messageBody, messageTitle, messageAction, isLoading, showModalFb }}>
      {children}
    </FbDataContext.Provider>
  );
};
