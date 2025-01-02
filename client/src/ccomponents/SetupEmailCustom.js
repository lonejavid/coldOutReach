
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const SetUpEmailCustom = ({ subject, body }) => {

   
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmails, setRegisteredEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showEmailList, setShowEmailList] = useState(false);
  const navigate = useNavigate();

  

  // Handle email registration
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
    
      const response = await axios.get(
        "https://emailmarketing-1dfc22840d6a.herokuapp.com/registerMail",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
       
       window.location=response.data.authUrl
       
       
         
      } else {
        setMessage("Error in verification. Please check your details.");
      }
    } catch (error) {
      setMessage("Network error: Unable to verify.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch registered emails
  const fetchRegisteredEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://emailmarketing-1dfc22840d6a.herokuapp.com/registeredEmails", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("registred emails are ",response.data.registeredEmails)
      setRegisteredEmails(response.data.registeredEmails);
      setShowEmailList(true);  // Show the email list after fetching
    } catch (error) {
      setMessage("Error fetching registered emails.");
    }
  };

  // Handles email selection
  const handleEmailSelect = (email) => {
    setSelectedEmails((prevSelectedEmails) => {
      if (prevSelectedEmails.includes(email)) {
        return prevSelectedEmails.filter((e) => e !== email);
      } else {
        return [...prevSelectedEmails, email];
      }
    });
  };

  // Handles email removal
  const handleRemoveEmail = async (email) => {
    try {
      console.log("email to be deleted",email);
      const token = localStorage.getItem("token");
      const response = await axios.delete("https://emailmarketing-1dfc22840d6a.herokuapp.com/removeEmail", {
        headers: { Authorization: `Bearer ${token}` },
        data: { email },
      });

      if (response.status === 200) {
        setRegisteredEmails(registeredEmails.filter((regEmail) => regEmail.email !== email));
        setMessage(`Email ${email} has been removed.`);
      } else {
        setMessage("Error removing email.");
      }
    } catch (error) {
      setMessage("Network error: Unable to remove email.");
    }
  };

  // Handle "Done" action
  const handleDone = () => {
    if (selectedEmails.length > 0) {
      // Construct the URL with query parameters
      const queryParams = new URLSearchParams({
        emails: JSON.stringify(selectedEmails),
        subject: subject,  // Pass the subject
        body: body         // Pass the body
      });
  
      // Navigate to the AddFileCustom component and pass the parameters
      navigate(`/AddFileCustom?${queryParams.toString()}`);
    } else {
      setMessage("Please select at least one email.");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowEmailList(false);
    setSelectedEmails([]);
  };

  // New logic to determine if custom template is provided
  const shouldUseCustomTemplate = subject && body;

  // Send mail or navigate to email selection
  const handleNext = () => {
    if (selectedEmails.length > 0) {
      // Construct the URL with query parameters
      const queryParams = new URLSearchParams({
        emails: JSON.stringify(selectedEmails),
        subject: subject,  // Pass the subject
        body: body         // Pass the body
      });
  
      // Navigate to the AddFileCustom component and pass the parameters
      navigate(`/AddFileCustom?${queryParams.toString()}`);
    } else {
      setMessage("Please select at least one email.");
    }
  };
  

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      minHeight: "100vh",
      backgroundColor: "#121212",
      color: "white",
      flexDirection: "column",
      textAlign: "center",
      boxSizing: "border-box",
    }}>
      <style>
        {`
          @media (max-width: 768px) {
            h2 { font-size: 18px; }
            p { font-size: 13px; }
            input, button { font-size: 14px; }
          }
          @media (max-width: 480px) {
            h2 { font-size: 16px; }
            p { font-size: 12px; }
            input, button { font-size: 13px; }
          }
        `}
      </style>

      <div style={{
        maxWidth: "600px",
        padding: "30px",
        backgroundColor: "#1e1e1e",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        width: "100%",
      }}>
        <h2>Email Setup Instructions</h2>
        <p style={{ color: "#b0b0b0", fontSize: "14px", lineHeight: "1.8", marginBottom: "20px" }}>
  To set up your email for campaign sending, follow these steps:
  <br />
  <span style={{ display: "block", marginLeft: "20px" }}>1. Enable two-step verification.</span>
 
  <span style={{ display: "block", marginTop: "10px", fontStyle: "italic" }}>Your privacy is our top priority.</span>
</p>


        
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px",
            width: "100%",
            backgroundColor: loading ? "gray" : "#4CAF50",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            boxSizing: "border-box",
          }}
          disabled={loading}
        >
          {loading ? "Processing..." : "Continue With Google"}
        </button>

        {!showEmailList && (
          <button
            onClick={fetchRegisteredEmails}
            style={{
              padding: "12px",
              width: "100%",
              backgroundColor: "#2196F3",
              color: "white",
              borderRadius: "5px",
              border: "none",
              marginTop: "15px",
              cursor: "pointer",
            }}
          >
            View Registered Emails
          </button>
        )}

        {showEmailList && (
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#1e1e1e",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}>
            <h4>Select Registered Emails</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {registeredEmails.map((regEmail) => (
                <li key={regEmail._id} style={{ marginBottom: "10px" }}>
                  <p>{regEmail}</p>
                  
                  {regEmail.email}
                  <button
                    onClick={() => handleRemoveEmail(regEmail)}
                    style={{
                      backgroundColor: "#FF6347",
                      color: "white",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      marginLeft: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f44336",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {message && <p style={{ marginTop: "20px", color: "#FF5722" }}>{message}</p>}
      </div>
    </div>
  );
};

export default SetUpEmailCustom;



