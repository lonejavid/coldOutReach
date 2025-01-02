import React, { useState, useEffect } from "react";
import axios from 'axios';

const TaskDashboard = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [progress, setProgress] = useState(0); // Progress starts at 0
  const [isCampaignRunning, setIsCampaignRunning] = useState(false); // To track if campaign is running
  const [emailPreview, setEmailPreview] = useState(
    "Subject: Welcome to Our Campaign!\n\nHi [Name],\n\nThank you for being part of our email campaign. Stay tuned for updates!"
  );

  // Fetch email preview every second
  useEffect(() => {
    const interval = setInterval(() => {
      handleEmailPreview();
    }, 500); // Call backend every second

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Fetch progress every second
  useEffect(() => {
    const interval = setInterval(() => {
      handleProgress();
    }, 1000); // Call backend every second to get progress

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleEmailPreview = async () => {
    try {
      const response = await axios.get("https://emailmarketing-1dfc22840d6a.herokuapp.com/emailPreview", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      // Ensure the response is in the correct format (subject and body)
      const { subject, body } = response.data;
      if (subject && body) {
        const formattedEmailPreview = `Subject: ${subject}\n\n${body}`;
        setEmailPreview(formattedEmailPreview); // Update the preview with the response
      } else {
        console.log("Email preview not available.");
      }
    } catch (error) {
      console.error("Error fetching email preview:", error);
    }
  };

  // Fetch progress from backend and update progress state
  const handleProgress = async () => {
    try {
      const response = await axios.get("https://emailmarketing-1dfc22840d6a.herokuapp.com/getProgress", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      



      const  progressValue = response.data.percent; // Assuming the backend returns { progressValue: number }
      
      if (progressValue >= 0 && progressValue <= 100) {
        setProgress(progressValue); // Update the progress state
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  return (
    <div style={{ padding: "20px", color: "#e0e0e0", backgroundColor: "#1c1c1c", height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "white" }}>
        Email Campaign Task Dashboard
      </h1>

      {/* Running Task Section */}
      <div style={{ ...sectionStyle, flex: 1 }}>
        <h2 style={titleStyle}>Running Task</h2>
        <div style={circleContainerStyle}>
          <div
            style={{
              ...circleStyle,
              animation: isAnimating ? "rotate 2s linear infinite" : "none",
            }}
          ></div>
        </div>
        <span style={{ fontSize: "16px", color: "#fff" }}>{progress}%</span> {/* Displaying the progress */}
      </div>

      {/* Email Preview Section */}
      <div style={{ ...sectionStyle, flex: 7 }}>
        <h3 style={{ fontSize: "18px", marginTop: "0px", color: "#4CAF50" }}>Email Preview</h3>
        <div style={emailPreviewStyle}>
          <textarea
            style={{ fontSize: "14px", color: "#b0b0b0", width: "100%", height: "100%", backgroundColor: "#222", color: "#fff", borderRadius: "8px", padding: "10px" }}
            value={emailPreview}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

// Styles
const sectionStyle = {
  marginBottom: "20px", // Reduced bottom margin for compact layout
  padding: "10px", // Reduced padding for compactness
  borderRadius: "8px",
  backgroundColor: "#333",
  textAlign: "center",
};

const titleStyle = {
  fontSize: "18px", // Reduced title size
  marginBottom: "10px",
};

const circleContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "10px 0", // Reduced margin
};

const circleStyle = {
  width: "80px", // Smaller circle
  height: "80px",
  borderRadius: "50%",
  border: "8px solid transparent",
  borderTop: "8px solid #4CAF50",
  borderRight: "8px solid #FF9800",
  borderBottom: "8px solid #2196F3",
  borderLeft: "8px solid #F44336",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const emailPreviewStyle = {
  marginTop: "10px",
  padding: "10px",
  border: "1px solid #444",
  borderRadius: "8px",
  backgroundColor: "#222",
  textAlign: "left",
  height: "100%", // Ensures the email preview takes up more space
};

// CSS Keyframe for rotation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`,
  styleSheet.cssRules.length
);

export default TaskDashboard;
