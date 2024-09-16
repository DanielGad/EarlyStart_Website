import React, { useState, useEffect, createContext, ReactNode } from "react";
import useMediaQuery from './useMediaQuery';

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
}

export const Context = createContext<ContextProps | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  const [menu, setMenu] = useState<string>("home");

  // control hamburger menu and small screen
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

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Control the slide effect
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.slide-in');
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          element.classList.add('visible');
        } else {
          element.classList.remove('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Context.Provider value={{
      isSmallScreen, isMenuOpen, isScrolled, isVisible, isMediumScreen, menu, setMenu, toggleMenu, setIsMenuOpen
    }}>
      {children}
    </Context.Provider>
  );
};
