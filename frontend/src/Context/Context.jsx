import { useState, useEffect, createContext } from "react";
import { node } from 'prop-types';
import useMediaQuery from './useMediaQuery';

export const Context = createContext();

export const Provider = ({ children }) => {
  const [menu, setMenu] = useState("home");

  // control hamburger menu and small screen
  const isSmallScreen = useMediaQuery("(max-width: 414px)");
  const isMediumScreen = useMediaQuery("(max-width: 1024px)");

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

///////////////////////
// Control the menu when scrolled
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollX > 30) { 
        setIsScrolled(true);
        // setIsMenuOpen(true)
      } else {
        setIsScrolled(false);
        // setIsMenuOpen(true)
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  //////////////////////////
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
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])




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
  )
};

Provider.propTypes = {
  children: node.isRequired
};


