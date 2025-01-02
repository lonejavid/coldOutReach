import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasSentToken = useRef(false); // Ref to track if the request has been sent
  const [message, setMessage] = useState(""); // State to hold the message
  const [status, setStatus] = useState(""); // State to hold the status (success or failed)

  const publicDomains = [ "yahoo.com", "yandex.com"]; // Add more domains here if needed

  const isPublicDomain = (email) => {
    // Extract domain from the email
    const emailDomain = email.split('@')[1];
    return publicDomains.includes(emailDomain);
  };

  const handleClose = () => {
    // Close the message card and navigate to the next step
    navigate("/next");
  };

  useEffect(() => {
    const sendTokenToBackend = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");
      const email = queryParams.get("email");
      const authToken = localStorage.getItem("token");

      if (token && email && authToken && !hasSentToken.current) {
        if (isPublicDomain(email)) {
          // If the email belongs to a public domain, show a failure message and don't send the token
          setMessage("Public service email domains (e.g. gmail.com, yahoo.com) are not accepted.");
          setStatus("failed");
          return; // Prevent sending the token
        }

        hasSentToken.current = true; // Mark as sent
        try {
          const response = await axios.post(
            "http://localhost:3000/saveToken",
            { token, email },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Token successfully sent to backend:", response.data);
          setMessage("Verification Successful!");
          setStatus("success");
        } catch (error) {
          console.error("Error sending token to backend:", error);
          setMessage("Error sending token to the backend.");
          setStatus("failed");
        }
      } else if (!token || !authToken) {
        console.error("Missing token or authToken. Cannot send to backend.");
        setMessage("Missing token or authorization. Please try again.");
        setStatus("failed");
      }
    };

    sendTokenToBackend();

  }, [navigate, location]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full screen height
        backgroundColor: "#121212", // Dark background for the whole screen
        color: "#fff", // Text color white for contrast
        margin: "0", // Remove default margin
      }}
    >
      <div
        style={{
          background: status === "success" ? "#4CAF50" : "#F44336", // Green for success, Red for failure
          color: "#fff",
          borderRadius: "10px",
          padding: "40px",
          width: "90%",
          maxWidth: "600px", // Maximum width for large screens
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          fontFamily: "'Arial', sans-serif", // Use a clean font
        }}
      >
        <h2>{status === "success" ? "Verification Successful!" : "Verification Failed!"}</h2>
        <p>{message}</p>
        <button
          onClick={handleClose}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "18px",
            marginTop: "20px",
            transition: "background-color 0.3s",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default VerificationSuccess;
