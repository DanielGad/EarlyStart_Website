import React, { useContext, useEffect, useState } from "react";
import "../assets/styles/Login.css";
import Background from "../assets/images/customer-care.jpg";
import Footer from "../components/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../pages/Modal";
import { FbDataContext } from "../Context/FbData"; // Import your FbDataContext

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const navigate = useNavigate();

  // Get the login function, error, and loading state from context
  const context = useContext(FbDataContext);
  if (!context) throw new Error("FbDataContext has not been provided.");
  const { login, messageAction, messageBody, messageTitle, isLoading } = context;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContinue = () => {
    setShowModal(false);
    if (isLoginSuccessful) {
      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setModalMessage("Please fill in all fields.");
      setModalTitle("Information Required!");
      setButtonLabel("Try Again!");
      setShowModal(true);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      if (result.status === "disabled") {
        setModalMessage("Your account is disabled. Please contact support.");
        setModalTitle("Account Disabled!");
        setButtonLabel("Okay");
        setShowModal(true);
        setIsLoginSuccessful(false);
      } else {
        setModalMessage("Login Successful!");
        setModalTitle("Success!");
        setButtonLabel("Continue");
        setShowModal(true);
        setIsLoginSuccessful(true);
        setUserRole(result.role); // Store the role for further redirection
      }
    } else {
      setModalTitle(messageTitle);
      setModalMessage(messageBody);
      setButtonLabel(messageAction);
      setShowModal(true);
      setTimeout(() => setShowModal(true), 0);
      setIsLoginSuccessful(false);
    }
  };

  return (
    <div className="login-container">
      {modalTitle && modalMessage && buttonLabel && (
        <Modal
          showModal={showModal}
          message={modalMessage}
          buttonLabel={buttonLabel}
          onClose={handleContinue}
          title={modalTitle}
        />
      )}

      <div className="login-divide">
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

            <div className="button-control">
              <button type="submit" className="login-button">
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <div className="sign-control">
            <div>Or</div>
            <Link to={"/signup"}>
              <button className="sign-up">Sign Up</button>
            </Link>
            <div>If you don't have an account.</div>
          </div>
        </div>

        <div className="login-right">
          <img src={Background} alt="Customer Care" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
