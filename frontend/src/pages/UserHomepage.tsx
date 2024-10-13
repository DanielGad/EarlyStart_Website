import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/UserHomepage.css";

interface UserHomepageProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

const UserHomepage: React.FC<UserHomepageProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // Scroll to the top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="user-homepage-container">
      <div className="welcome-section">
        <h1>Welcome, {user.name}!</h1>
        <p className="user-email">{user.email}</p>
      </div>

      <div className="navigation-section">
        <Link to="/profile" className="nav-link">
          View Profile
        </Link>
        <Link to="/settings" className="nav-link">
          Account Settings
        </Link>
        <Link to="/login">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </Link>
        
      </div>

      <div className="user-dashboard">
        <h2>Your Dashboard</h2>
        <p>Here you can see your recent activities, updates, and more.</p>
        {/* Additional user-specific content goes here */}
      </div>
    </div>
  );
};

export default UserHomepage;
