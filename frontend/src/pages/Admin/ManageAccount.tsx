import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const ManageAccount = () => {
  // Initialize the navigate function
  const navigate = useNavigate();

  // Function to handle going back
  const handleGoBack = () => {
    navigate(-1); // This takes the user to the previous page in history
  };

  return (
    <div style={{textAlign: "center"}}>
      <h1>Manage Account</h1>
      <p>No user accounts to manage!</p>
      <Link to="">
      <b style={{fontSize: "larger"}} onClick={handleGoBack}>Go Back</b>
      </Link>
    </div>
  );
};

export default ManageAccount;
