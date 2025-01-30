import React, { useContext, useEffect, useState } from "react";
import "../assets/styles/Login.css";
import Background from "../assets/images/customer-care.jpg";
import Footer from "../components/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import Modal from "../pages/Modal";
import { Context } from "../Context/Context";
import { FaGoogle } from "react-icons/fa";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
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
      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
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
      // Check if the user exists in Firestore before signing in
      const userRef = collection(db, "EarlyStartData");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setModalMessage("User does not exist. Please sign up.");
        setModalTitle("Error!");
        setButtonLabel("Sign Up");
        setShowModal(true);
        setIsLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user) {
        throw new Error("User authentication failed.");
      }

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
    } catch (error: any) {
      setModalMessage("Incorrect email or password.");
      setModalTitle("Error!");
      setButtonLabel("Try Again");
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
      const user = result.user;

      if (!user || !user.email) {
        throw new Error("Google authentication failed.");
      }

      const userRef = collection(db, "EarlyStartData");
      const q = query(userRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If user does not exist in Firestore, create a new record
        const newUser = {
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          userRole: "user",
          status: "active",
        };
        await setDoc(doc(db, "EarlyStartData", user.uid), newUser);
      }

      // Fetch the user's role if they already exist
      const existingUserData = querySnapshot.docs[0]?.data();
      const role = existingUserData?.userRole?.toLowerCase() || "user";
      setUserRole(role);

      login(role);
      setModalMessage("Sign-In Successful!");
      setModalTitle("Success!");
      setButtonLabel("Continue");
      setShowModal(true);
      setIsLoginSuccessful(true);
    } catch (error) {
      setModalMessage("Sign-In Failed. Please try again.");
      setModalTitle("Error!");
      setButtonLabel("Try Again");
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

          <form onSubmit={handleSubmit}>
            <h2 className="login-title">Login</h2>

            <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                style={{ padding: "15px" }}
                type="password"
                id="password"
                placeholder="Enter your Password:"
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
