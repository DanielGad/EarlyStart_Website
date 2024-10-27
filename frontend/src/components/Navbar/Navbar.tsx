import './Navbar.css';
import Early_Start_Logo from '../../assets/images/early-start-logo.png';
import React, { useContext, useState,  useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Context } from '../../Context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const Navbar = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const context = useContext(Context);
  if (!context) {
    throw new Error("Must be used within a Context provider");
  }
  const { isSmallScreen, isMediumScreen, isMenuOpen, setIsMenuOpen, isScrolled, toggleMenu, menu, setMenu, isLoggedIn, setIsLoggedIn, setUserRole, userRole } = context;

  useEffect(() => {
    const savedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const savedUserRole = localStorage.getItem("myUserRole");

    // Set defaults if nothing is in localStorage
    setIsLoggedIn(savedIsLoggedIn || false);
    setUserRole(savedUserRole || "user");

  }, [setIsLoggedIn, setUserRole]);

  // Update localStorage whenever `isLoggedIn` changes
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

  // Update localStorage whenever `userRole` changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem("myUserRole", userRole);
    }
  }, [userRole]);

  console.log(userRole);
  console.log(isLoggedIn);
  

  const [isServiceOpen, setIsServiceOpen] = useState(false);

  const handleServiceClick = () => {
    setIsServiceOpen(!isServiceOpen);
  }

  const closeDropdowns = () => {
    setIsServiceOpen(false);
  }
  
  useEffect(() => {
    const handleResize = () => {
      if (!isMenuOpen) {
        setIsMenuOpen(true);
      }
    };


    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  interface NavLinkProps {
    to: string,
    label: React.ReactNode,
    menuKey: string,
    setMenu: (menu: string) => void,
    setIsMenuOpen: (isOpen: boolean) => void,
    menu: string
  }

  const NavLink:React.FC<NavLinkProps> = ({ to, label, menuKey, setMenu, setIsMenuOpen, menu }) => (
  
    <Link
      to={to}
      style={{ color: menu === menuKey ? 'rgb(124,70,164)' : '' }}
      onClick={() => { setMenu(menuKey); setIsMenuOpen(true); }}
      className='open-menu'
    >
      {label}
      {menu === menuKey && <hr />}
    </Link>
  );

  
  NavLink.propTypes = {
    to: PropTypes.any.isRequired,
    label: PropTypes.any.isRequired,
    menuKey: PropTypes.any.isRequired,
    setMenu: PropTypes.any.isRequired,
    setIsMenuOpen: PropTypes.any.isRequired,
    menu: PropTypes.any.isRequired
  };

  interface DropdownLinkProps {
    to: string,
    label: string,
    closeDropdowns: () => void
  }

  const DropdownLink:React.FC<DropdownLinkProps> = ({ to, label, closeDropdowns }) => (
    <Link
      to={to}
      style={{ textDecoration: 'none' }}
      onClick={closeDropdowns}
    >
      <div>{label}</div>
    </Link>
  );

  DropdownLink.propTypes = {
    to: PropTypes.any.isRequired,
    label: PropTypes.any.isRequired,
    closeDropdowns: PropTypes.any.isRequired
  }

  return (
    <div className="main-navbar-container">
      <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>

      {/* Control Navbar when Screen is at Large  */}
        <Link to={"/"} style={{ textDecoration: 'none', color: menu === "home" ? 'rgb(124,70,164)' : '' }} onClick={() => {setMenu("home")}}>
        <div className="left-nav-container">
          <div className="logo-container">
            <img src={Early_Start_Logo} alt="EarlyStart E-Tutors Logo" width={'150px'}/>
          </div>
        </div>
      </Link>

          <div className="middle-nav-container">
          <SearchIcon style={{cursor: 'pointer'}}/>
          <input type="text" placeholder='What do you want to learn?' />
          <MicIcon style={{cursor: 'pointer'}}/>
        </div>

        {/* Control the screen size at small screen and medium screen */}
        {!isSmallScreen && !isMediumScreen ? (
  <>
    <div className="right-nav-container">
    <Link to={"/"} style={{ textDecoration: 'none', color: menu === "home" ? 'rgb(124,70,164)' : '' }} onClick={() => {setMenu("home")}}>Home{menu === "home" ? <hr /> : <></>}  
    </Link>

      <div className="dropdown" onClick={handleServiceClick} onMouseLeave={() => setIsServiceOpen(false)}>
        <div className="menus" style={{ color: menu === "service" ? 'rgb(124,70,164)' : '' }}>
          Services <ArrowDropDownIcon className='arrow-down' />
          {menu === "service" && <hr />}
        </div>
        {isServiceOpen && (
          <div className="dropdown-content" onClick={() => setMenu("service")}>
            {[
              { to: "/math", label: "Math" },
              { to: "/homework", label: "Home Work" },
              { to: "/letterwork", label: "Letter Work" },
              { to: "/language", label: "Language" },
              { to: "/international", label: "International" },
              { to: "/general", label: "General" },
            ].map(({ to, label }) => (
              <DropdownLink key={to} to={to} label={label} closeDropdowns={closeDropdowns} />
            ))}
          </div>
        )}
      </div>

      <Link to={"/call"} style={{color: menu === "call" ? 'rgb(124,70,164)' : ''}} onClick={() => {setMenu("call")}}>
          Call Us{menu === "call" ? <hr /> : <></>}</Link>

          <Link to={"/login"} style={{color: menu === "login" ? 'rgb(124,70,164)' : ''}} onClick={() => {setMenu("login")}}>
          {isLoggedIn ? (
            // If logged in, show 'Profile' and direct to appropriate dashboard
            <div><Link to={userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'}>
              Profile
            </Link>
            </div> 
          ) : (
            // If not logged in, show 'Login'
            <Link to="/login">Login</Link>
          )}
          {menu === "login" ? <hr /> : <></>}</Link>
    </div>
  </>
) : (
  <div className='menu-container' onClick={toggleMenu}>
    <FontAwesomeIcon icon={isMenuOpen ? faBars : faTimes} className='menu-icon' onClick={() => {
      if (isServiceOpen === true) {
        closeDropdowns();
      }
    }}/>
  </div>
)}
      {/* Control Navbar when Menu is Open */}
      <div className='menu-mode-control'>
      {!isMenuOpen && (
  <div>
    <div className="right-nav-container-small">
      <div className='logo-input-screen'>
        <Link to="/" onClick={() => setIsMenuOpen(true)}>
          <div className="logo-container-screen">
            <img src={Early_Start_Logo} alt="EarlyStart E-Tutors Logo" width={'150px'} />
          </div>
        </Link>

        <div className="middle-nav-container">
          <SearchIcon style={{ cursor: 'pointer' }} className='search-bar' />
          <input type="text" placeholder='What do you want to learn?' />
          <MicIcon style={{ cursor: 'pointer' }} className='mic-bar'/>
        </div>
      </div>

      <div className="content-right-navbar">
        <NavLink to="/" label="Home" menuKey="home" setMenu={setMenu} setIsMenuOpen={setIsMenuOpen} menu={menu} />

        <div className="dropdown" onClick={handleServiceClick}>
          <div
            onClick={() => setMenu("service")}
            className="menus"
            style={{ color: menu === "service" ? 'rgb(124,70,164)' : '' }}
          >
            Services <ArrowDropDownIcon className='arrow-down' />
            {menu === "service" && <hr />}
          </div>
          {isServiceOpen && (
            <div className="dropdown-content">
              {['math', 'homework', 'letterwork', 'language', 'international', 'general'].map((service) => (
                <Link
                  key={service}
                  to={`/${service}`}
                  style={{ textDecoration: 'none' }}
                  onClick={() => setIsMenuOpen(true)}
                >
                  <div>{service.charAt(0).toUpperCase() + service.slice(1)}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <NavLink to="/call" label="Call Us" menuKey="call" setMenu={setMenu} setIsMenuOpen={setIsMenuOpen} menu={menu} />
        <NavLink to="/login" label=
        {isLoggedIn ? (
            // If logged in, show 'Profile' and direct to appropriate dashboard
            <Link to={userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'}>
              Profile
            </Link>
          ) : (
            // If not logged in, show 'Login'
            <Link to="/login">Login</Link>
          )} 
          menuKey="login" setMenu={setMenu} setIsMenuOpen={setIsMenuOpen} menu={menu} />


        <div className="middle-nav-container-down">
          <SearchIcon style={{cursor: 'pointer'}}/>
          <input type="text" placeholder='What do you want to learn?' />
          <MicIcon style={{cursor: 'pointer'}}/>
        </div>
      </div>
      
    </div>
  </div>
)}
      </div>
      
    </div>
    </div>
  )
}

export default Navbar