import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import useMediaQuery from './useMediaQuery';
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; // Import User type from Firebase

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
  user: User | null; // Added user to context
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
      if (window.scrollX > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  const login = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user); // Set the Firebase user object
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [auth]);

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
        userRole,
        login,
        logout,
        user, // Added user to the context provider
      }}
    >
      {children}
    </Context.Provider>
  );
};
