import React, { useEffect, useState } from "react";
import '../assets/styles/Login.css';
import Background from '../assets/images/customer-care.jpg';
import Footer from "../components/Footer/Footer";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

const Login: React.FC<LoginFormProps> = ({ onLogin }) => {
  // Scroll to the top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // States for form inputs and error handling
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    onLogin(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-divide">
        {/* Left side with form and text */}
        <div className="login-left">
          <p className="login-head">Welcome to EarlyStart E-Tutor</p>
          <p className="login-sub">Unlocking Knowledge, One Click at a Time</p>

          <form onSubmit={handleSubmit}>
            <h2 className="login-title">Login</h2>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="button-control">
              <button type="submit" className="login-button">Login</button>
            </div>
          </form>
        </div>

        {/* Right side with image */}
        <div className="login-right">
          <img src={Background} alt="Customer Care" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
