import React, { useContext, useEffect, useState } from "react";
import "../assets/styles/Login.css";
import Background from "../assets/images/login.png";
import Footer from "../components/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import Modal from "../pages/Modal";
import { Context } from "../Context/Context";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContinue = () => {
    setShowModal(false);
    if (isLoginSuccessful) {
      navigate(userRole === "admin" ? "/admin-dashboard" : "/user-dashboard");
    }
  };

  const context = useContext(Context);
  if (!context) {
    throw new Error("Context has not been provided.");
  }
  const { login } = context;

  // Regular email/password login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      setModalMessage("Please fill in all fields.");
      setModalTitle("Information Required!");
      setButtonLabel("Try Again!");
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = collection(db, "EarlyStartData");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const role = userData?.userRole?.toLowerCase() || "user";
        const status = userData?.status?.toLowerCase() || "active";
        setUserRole(role);

        if (status === "disabled") {
          setModalMessage("Your account is disabled. Please contact support.");
          setModalTitle("Account Disabled!");
          setButtonLabel("Okay");
          setShowModal(true);
          setIsLoading(false);
          return;
        }

        login(role);
        setModalMessage("Login Successful!");
        setModalTitle("Success!");
        setButtonLabel("Continue");
        setShowModal(true);
        setIsLoginSuccessful(true);
      }
    } catch (error: any) {
      if (error.code === "auth/network-request-failed") {
        setModalTitle("Network Error");
        setModalMessage("No Internet, Please check your internet connection and try again.");
        setButtonLabel("Try Again");
      } else {
        setModalMessage("Incorrect email or password.");
        setModalTitle("Invalid Error!");
        setButtonLabel("Try Again");
      }
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      if (!googleUser || !googleUser.email) {
        throw new Error("Google authentication failed.");
      }

      const userRef = collection(db, "EarlyStartData");
      const q = query(userRef, where("email", "==", googleUser.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If user does not exist, create a new record
        const newUser = {
          userId: googleUser.uid,
          Id: googleUser.uid,
          email: googleUser.email,
          fullName: googleUser.displayName,
          photoURL: googleUser.photoURL,
          status: "active",
          username: "user",
          createdAt: new Date(),
          userRole: "user",
          access: "",
          generated: "",
        };
        await setDoc(doc(db, "EarlyStartData", googleUser.uid), newUser);
        login(userRole);
        setModalMessage("Sign-In Successful!");
        setModalTitle("Success!");
        setButtonLabel("Continue");
        setShowModal(true);
        setIsLoginSuccessful(true);
        navigate("/set-password");
      } else {
        // If user exists, fetch the role
        const existingUserData = querySnapshot.docs[0].data();
        const role = existingUserData?.userRole?.toLowerCase() || "user";
        setUserRole(role);
      }

      login(userRole);
      setModalMessage("Sign-In Successful!");
      setModalTitle("Success!");
      setButtonLabel("Continue");
      setShowModal(true);
      setIsLoginSuccessful(true);
    } catch (error: any) {
      if (error.code === "auth/network-request-failed") {
        setModalTitle("Network Error");
        setModalMessage("No Internet, Please check your internet connection and try again.");
        setButtonLabel("Try Again");
      } else {
        setModalMessage("Sign-In Failed. Please try again.");
        setModalTitle("Error!");
        setButtonLabel("Try Again");
      }
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Modal 
        showModal={showModal} 
        message={modalMessage} 
        buttonLabel={buttonLabel} 
        onClose={handleContinue} 
        title={modalTitle}
      />

      <div className="login-divide">
        <div className="login-left">
          <p className="login-head">Welcome to EarlyStart E-Tutor</p>
          <p className="login-sub">Unlocking Knowledge, One Click at a Time</p>

          <form onSubmit={handleSubmit} className="form-table">
            <h2 className="login-title">Login</h2>

            <div className="form-group-login">
              <label htmlFor="email">Email:</label>
              <input
                style={{ padding: "15px" }}
                type="email"
                id="email"
                placeholder="Enter your email address:"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group-login">
              <label htmlFor="password">Password:</label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter your Password:"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="password-control-toggle">
            <button type="button" className="hideshow" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            <Link to={"/reset-password"} style={{
              color: "#7C46A4",
              fontWeight: "bold",
              textDecoration: "underline",
              fontSize: "14px",
              textAlign: "right",
              display: "block",
              margin: "10px 0",
              marginRight: "25px",
            }}>Forgotten Password</Link>
            </div>

            <div className="button-control">
              <button type="submit" className="login-button">
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {/* <div><Hr /></div> */}

          <div className="google-signin">
            <button onClick={handleGoogleSignIn} className="google-button">
              <FaGoogle style={{ width: "20px" }} />
              Sign in with Google
            </button>
          </div>

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