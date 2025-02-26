import React, { useEffect, useState } from "react";
import '../assets/styles/CallUs.css';
import Background from '../assets/images/customer-care.jpg';
import Footer from "../components/Footer/Footer";
import { addDoc, collection } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { FaWhatsapp } from "react-icons/fa";

const CallUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const contactUsRef = collection(db, "ContactUs");

      const formData = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date(),
      };

      // Log the formData
      console.log("Form Data:", formData);

      await addDoc(contactUsRef, formData);

      navigate("/contact-confirm")
    } catch (error) {
      console.error("Error saving data: ", error);

      if (error instanceof Error) {
        alert(`Error occurred: ${error.message}`);
      } else {
        alert("An unknown error occurred while sending your message.");
      }
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "How do you charge?",
      answer: "We charge per hour."
    },
    {
      question: "What curriculum do you use?",
      answer: "We use Nigeria and British curriculum. We can also work with the school curriculum of the learner."
    },
    {
      question: "Why do I have to pay $3 before I meet my tutor?",
      answer: "$3 is a one-off registration fee you have to pay."
    },
    {
      question: "For how long do your classes run?",
      answer: "We run from Monday to Sunday depending on your schedule with us."
    }
  ];

  return (
    <>
      <div className="get-s-container">
        <div className="contact-us">Contact Us</div>
      </div>
      <div className="get-s-container-main">
        <div className="get-s-tmain">Feel free to contact us for Enquiries and Updates.</div>
        <div className="goal">Our goal is to respond to all enquiries within 48 hours. For details information about our program, please explore the full app directory using our sitemap. </div>

        <div className="contact-line">Contact us by email</div>
        <hr className="hr-contact-line"/>

        <div className="instruction">Please complete the form below with your details, and we will strive to respond to you as promptly as we can. </div>
        <div className="section-divide">
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <label>Full Name</label><br />
              <textarea 
                rows={1} 
                required
                id="name"
                typeof="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br />
              <label>Email Address</label><br />
              <textarea 
                rows={1} 
                required
                typeof="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <label>Message</label><br />
              <textarea 
                rows={4} 
                required
                typeof="text"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="button-controll">
                <button className="contact-submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>

            <div style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginTop: "20px",
            }}>Or Send a Direct Message to us through WhatsApp.</div>
            <Link to={"https://wa.me/2349011318999?text=Hello,%20I'm%20reaching%20out%20to%20you%20from%20EarlyStart%20E-Tutors%20Website.%20My%20name%20is%20"} target="_blank">
              <div className="whatsapp">
                <FaWhatsapp style={{fontSize: "24px"}}/>
                WhatsApp Us
              </div>
            </Link>
          </div>
          <div className="contact-image">
            <img src={Background} alt="contact-image" />
          </div>
        </div>
      </div>
      <div className="faq-container">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>Question: {faq.question}</h3>
            <p>Answer: {faq.answer}</p>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}

export default CallUs;