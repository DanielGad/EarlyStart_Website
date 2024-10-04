import React, { useState } from "react";
import '../assets/styles/Login.css';
import Background from '../assets/images/customer-care.jpg';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

const Login: React.FC<LoginFormProps> = ({ onLogin }) => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    onLogin(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <p className="login-head">Welcome to EarlyStart E-Tutor</p>
        <p className="login-sub">Unlocking Knowledge, One Click at a Time</p>
        
        <form onSubmit={handleSubmit}>
      <h2 className="llogin">Login</h2>

      <div className="eemail">
        <label htmlFor="email">Email:</label>
        <br />
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="ppass">
        <label htmlFor="password">Password:</label>
        <br />
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

      <button type="submit" className="login-button">Login</button>
    </form>
      </div>

      <div className="login-right">
        <img src={Background} alt="Login Image" />
      </div>
    </div>
  )
}

export default Login