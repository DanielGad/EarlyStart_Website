import React, { useState, useEffect, createContext, useContext, ReactNode, SetStateAction } from "react";
import useMediaQuery from './useMediaQuery';
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Define the context props
interface ContextProps {
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isMenuOpen: boolean;
  isScrolled: boolean;
  isVisible: boolean;
  menu: string;
  setMenu: (menu: string) => void;
  toggleMenu: () => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  userRole: string | null;
  login: (role: string) => void;
  logout: () => void;
  user: User | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserRole: React.Dispatch<SetStateAction<string | null>>;
}

// Create the context with default value as undefined
export const Context = createContext<ContextProps | undefined>(undefined);

// Custom hook to use the context safely
export const useAppContext = (): ContextProps => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAppContext must be used within a Provider");
  }
  return context;
};

// Define provider props
interface ProviderProps {
  children: ReactNode;
}

// The provider component
export const Provider: React.FC<ProviderProps> = ({ children }) => {
  const [menu, setMenu] = useState<string>("home");

  // Control hamburger menu and screen sizes
  const isSmallScreen = useMediaQuery("(max-width: 414px)");
  const isMediumScreen = useMediaQuery("(max-width: 1024px)");
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Control the menu when scrolled
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Control slide-in effect
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // User authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [userRole, setUserRole] = useState<string | null>(
    localStorage.getItem("userRole") || null
  );
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  // Login and logout functions that update localStorage
  const login = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    signOut(auth).catch((error) => console.error("Error signing out:", error));
  };

  // Firebase auth state change effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");

        if (!localStorage.getItem("userRole")) {
          const userDoc = await getDoc(doc(db, "EarlyStartData", user.uid));
          const role = userDoc.exists() ? userDoc.data().userRole : "user";
          setUserRole(role);
          localStorage.setItem("userRole", role);
        } else {
          setUserRole(localStorage.getItem("userRole"));
        }
      } else {
        logout();
      }
    });
    return () => unsubscribe();
  }, []);

  // Inactivity timer logic
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.log("User inactive. Logging out...");
        logout();
      }, INACTIVITY_LIMIT);
    };

    const activityEvents = ["mousemove", "keypress", "click", "scroll"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // Initialize the timer

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [logout]);

  return (
    <Context.Provider
      value={{
        isSmallScreen,
        isMenuOpen,
        isScrolled,
        isVisible,
        isMediumScreen,
        menu,
        setMenu,
        toggleMenu,
        setIsMenuOpen,
        isLoggedIn,
        setIsLoggedIn,
        setUserRole,
        userRole,
        login,
        logout,
        user,
      }}
    >
      {children}
    </Context.Provider>
  );
};
