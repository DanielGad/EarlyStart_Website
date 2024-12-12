import React, { createContext, useState, ReactNode } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface FbDataContextType {
  login: (email: string, password: string) => Promise<{ role: string; status: string; success: boolean }>;
  messageBody: string;
  messageTitle: string;
  messageAction: string;
  isLoading: boolean;
  showModalFb: boolean;
}

export const FbDataContext = createContext<FbDataContextType>({
  login: async () => ({ role: "user", status: "unknown", success: false }),
  messageBody: "",
  messageTitle: "",
  messageAction: "",
  isLoading: false,
  showModalFb: false,
});

export const FbDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messageBody, setMessageBody] = useState<string>("");
  const [messageTitle, setMessageTitle] = useState<string>("");
  const [messageAction, setMessageAction] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModalFb, setShowModal] = useState(false);
  const [userData, setUserData] = useState({})

  const login = async (email: string, password: string): Promise<{ role: string; status: string; success: boolean }> => {
    const auth = getAuth();
    setIsLoading(true);
    try {
      // Attempt to sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Query Firestore for additional user data based on the authenticated user's ID
      const userRef = collection(db, "EarlyStartData");
      const q = query(userRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User data found in Firestore
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setUserData(userDoc.data());

        // Set role and status from Firestore data if available
        const role = userData?.userRole?.toLowerCase() || "user"; // Default to 'user' if role is not defined
        const status = userData?.status?.toLowerCase() || "active"; // Default to 'active' if status is not defined

        setShowModal(true); // Show modal when login is successful
        return { role, status, success: true };
      } else {
        // No user data found for this authenticated user in Firestore
        setMessageBody("User data not found.");
        setShowModal(true);
        return { role: "user", status: "unknown", success: false };
      }
    } catch (error: any) {
      // Handle Firebase authentication errors
      handleFirebaseErrors(error);
      return { role: "user", status: "unknown", success: false };
    } finally {
      // Stop the loading indicator once the login process is complete
      setIsLoading(false);
    }
  };
  


  // Function to handle different Firebase authentication errors
  const handleFirebaseErrors = (error: any) => {
    if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      setMessageTitle("Invalid Entry");
      setMessageBody("Invalid email or password.");
      setMessageAction("Try Again");
    } else if (error.code === "auth/invalid-credential") {
      setMessageTitle("Invalid Credentials");
      setMessageBody("Invalid credentials provided.");
      setMessageAction("Try Again");
    } else if (error.code === "auth/network-request-failed") {
      setMessageTitle("Network Error");
      setMessageBody("Check your internet connection.");
      setMessageAction("Try Again");
    } else {
      setMessageTitle("Unexpected Error");
      setMessageBody("An unexpected error occurred.");
      setMessageAction("Try Again");
    }
    setShowModal(true); // Display error modal
  };

  return (
    <FbDataContext.Provider value={{ login, messageBody, messageTitle, messageAction, isLoading, showModalFb, }}>
      {children}
    </FbDataContext.Provider>
  );
};
