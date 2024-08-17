import './Navbar.css';
import Early_Start_Logo from '../../assets/images/early-start-logo.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Navbar = () => {

  const [menu, setMenu] = useState("home");

  const [isServiceOpen, setIsServiceOpen] = useState(false);

  const handleServiceClick = () => {
    setIsServiceOpen(!isServiceOpen);
  }

  const closeDropdowns = () => {
    setIsServiceOpen(false);
  }


  return (
    <div className='navbar-container'>
      <div className="left-nav-container">
        <div className="logo-container">
          <img src={Early_Start_Logo} alt="EarlyStart E-Tutors Logo" width={'150px'}/>
        </div>
      </div>

      <div className="middle-nav-container">
        <SearchIcon style={{cursor: 'pointer'}}/>
        <input type="text" placeholder='What do you want to learn?' />
        <MicIcon style={{cursor: 'pointer'}}/>
      </div>

      <div className="right-nav-container">
        <div onClick={() => {setMenu("home")}} className="menus"><Link to={"/"} style={{ textDecoration: 'none', color: menu === "home" ? 'rgb(124,70,164)' : '' }}>Home</Link>{menu === "home" ? <hr /> : <></>}</div>

        <div className="dropdown" onClick={handleServiceClick} onMouseLeave={() => setIsServiceOpen(false)}>
        <div onClick={() => {setMenu("service")}} className="menus" style={{color: menu === "service" ? 'rgb(124,70,164)' : ''}}>Services <ArrowDropDownIcon className='arrow-down'/>{menu === "service" ? <hr /> : <></>}</div>
        {isServiceOpen && (
          <div className="dropdown-content">

            <Link to={"/math"} style={{ textDecoration: 'none' }} onClick={closeDropdowns}><div>Math</div></Link>

            <Link to={"/homework"} style={{ textDecoration: 'none' }} onClick={closeDropdowns}><div>Home Work</div></Link>

            <Link to={"/letterwork"} style={{ textDecoration: 'none' }} onClick={closeDropdowns}><div>Letter Work</div></Link>

            <Link to={"/language"} style={{ textDecoration: 'none' }} onClick={closeDropdowns}><div>Language</div></Link>

            <Link to={"/international"} style={{ textDecoration: 'none' }} onClick={closeDropdowns}><div>International</div></Link>

            <Link to={"/general"} style={{ textDecoration: 'none' }} onClick={closeDropdowns}><div>General</div></Link>
          </div>
        )}
        </div>

        <div onClick={() => {setMenu("call")}} className="menus"><Link to={"/call"} style={{color: menu === "call" ? 'rgb(124,70,164)' : ''}}>Call Us</Link>{menu === "call" ? <hr /> : <></>}</div>

        <div onClick={() => {setMenu("login")}} className="menus"><Link to={"/login"} style={{color: menu === "login" ? 'rgb(124,70,164)' : ''}}>Login</Link>{menu === "login" ? <hr /> : <></>}</div>
      </div>
    </div>
  )
}

export default Navbar