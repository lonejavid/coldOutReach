import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AddFileCustom = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Track file upload status
  const [selectedEmails, setSelectedEmails] = useState([]); // To store selected emails
  const [emailSubject, setEmailSubject] = useState(""); // To store email subject
  const [emailBody, setEmailBody] = useState(""); // To store email body
  const navigate = useNavigate();

  // Retrieve the selected emails, subject, and body from the URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emails = urlParams.get("emails");
    const subject = urlParams.get("subject");
    const body = urlParams.get("body");

    if (emails) {
      setSelectedEmails(JSON.parse(decodeURIComponent(emails))); // Decode and parse emails
    }
    if (subject) {
      setEmailSubject(decodeURIComponent(subject)); // Decode and set email subject
    }
    if (body) {
      setEmailBody(decodeURIComponent(body)); // Decode and set email body
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setLoading(true); // Start loading animation
    setMessage(""); // Clear previous messages

    try {
      const token = localStorage.getItem("token");
      // Create FormData to send file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("emails", JSON.stringify(selectedEmails)); // Send selected emails
      formData.append("subject", emailSubject); // Send subject
      formData.append("body", emailBody); // Send body
      

      // Make the API request with file attachment
      await axios.post("https://emailmarketing-1dfc22840d6a.herokuapp.com/sendMailCustom", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}` 
        },
      });

      setMessage("Your file has been uploaded successfully!");

      // Wait for 4 seconds, then navigate to the /next route
      setTimeout(() => {
        navigate("/next");
      }, 1000);
    } catch (error) {
      setMessage("File upload failed. Please try again.");
    } finally {
      setLoading(false); // Stop loading animation after delay
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <h1 style={styles.title}>Welcome to Your Email Campaign Dashboard</h1>
        <p style={styles.subtitle}>
          Upload an Excel file with recipient email addresses to get started. Our AI and web scraping technology will analyze your list to find the best leads!
        </p>

        <div style={styles.uploadSection}>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          <button
            onClick={handleFileUpload}
            style={{ ...styles.uploadButton, cursor: loading ? "not-allowed" : "pointer" }}
            disabled={loading}
          >
            {loading ? <div style={styles.loader}></div> : "Upload File"}
          </button>
        </div>

        {message && <p style={styles.message}>{message}</p>}
        {loading && (
          <div style={styles.executionText}>
            Uploading...
            <div style={styles.loader}></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styling for the component
const styles = {
  pageBackground: {
    backgroundColor: "#000",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    textAlign: "center",
    padding: "30px",
    backgroundColor: "#333",
    borderRadius: "10px",
    boxShadow: "0px 0px 15px rgba(0,0,0,0.3)",
    maxWidth: "600px",
    color: "#f9f9f9",
  },
  title: {
    fontSize: "28px",
    color: "#f9f9f9",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#ddd",
    marginBottom: "20px",
  },
  uploadSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",
  },
  fileInput: {
    padding: "8px",
    border: "1px solid #666",
    borderRadius: "5px",
    fontSize: "16px",
    backgroundColor: "#333",
    color: "#f9f9f9",
    marginRight: "10px",
  },
  uploadButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
  loader: {
    display: "inline-block",
    width: "30px",
    height: "30px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #4CAF50",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  executionText: {
    fontSize: "16px",
    color: "#4CAF50",
    marginTop: "15px",
    textAlign: "center",
  },
  message: {
    fontSize: "16px",
    color: "#4CAF50",
    marginTop: "15px",
  },
};

// CSS for spinning animation
const spinAnimation = document.createElement("style");
spinAnimation.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinAnimation);

export default AddFileCustom;
