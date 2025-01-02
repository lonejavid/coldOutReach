import React from "react";
import { useNavigate } from "react-router-dom";
import emailSendingImg from "../assets/email-marketingImg.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#101820", color: "#FFFFFF", padding: "0 5%" }}>
      {/* Header */}
      <header style={{ padding: "20px 0", borderBottom: "1px solid #2A2A2A" }}>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>coldOutReach</h1>
          </div>
          <ul style={{ display: "flex", listStyle: "none", gap: "20px", margin: 0, padding: 0 }}>
            <li><a href="#home" style={{ textDecoration: "none", color: "#FFFFFF" }}>Home</a></li>
            <li><a href="#solution" style={{ textDecoration: "none", color: "#FFFFFF" }}>Solution</a></li>
            <li><a href="#about" style={{ textDecoration: "none", color: "#FFFFFF" }}>About</a></li>
            <li><a href="#contact" style={{ textDecoration: "none", color: "#FFFFFF" }}>Contact</a></li>
          </ul>
          <div>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "transparent",
                border: "1px solid #FFFFFF",
                color: "#FFFFFF",
                marginRight: "10px",
                padding: "5px 15px",
                borderRadius: "5px",
              }}
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              style={{
                backgroundColor: "#1E90FF",
                border: "none",
                color: "#FFFFFF",
                padding: "5px 15px",
                borderRadius: "5px",
              }}
            >
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: "60px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: "50%" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Redefining Email Marketing for Your Success</h1>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.8", margin: "20px 0" }}>
            Imagine a world where every email you send resonates deeply with your audience. At coldOutReach, we bring
            this vision to life by combining the power of advanced web scraping and AI-driven email composition to craft
            messages that connect and convert.
          </p>
          <button
            onClick={() => navigate("/signup")}
            style={{
              backgroundColor: "#1E90FF",
              border: "none",
              color: "#FFFFFF",
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "1rem",
            }}
          >
            Get Started
          </button>
        </div>
        <div style={{ maxWidth: "40%" }}>
          <img
            src={emailSendingImg}
            alt="Illustration of email marketing workflow"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </div>
      </section>

      {/* Informative Section */}
      <section style={{ padding: "40px 0" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>Why Choose Us?</h2>
        <p style={{ fontSize: "1rem", lineHeight: "1.8", margin: "20px 0" }}>
          We specialize in empowering businesses to unlock the full potential of email marketing. Our platform leverages
          advanced web scraping to gather the latest news and insights about your clients' industries, ensuring every
          email you send is timely, relevant, and engaging. 
        </p>
        <p style={{ fontSize: "1rem", lineHeight: "1.8", margin: "20px 0" }}>
          Our AI model, trained in human sociology, understands what motivates people. It crafts personalized email
          messages on your behalf, blending empathy with precision to captivate your audience. With coldOutReach, your
          emails don't just inform—they inspire action.
        </p>
        <p style={{ fontSize: "1rem", lineHeight: "1.8", margin: "20px 0" }}>
          We also offer the flexibility for users to send emails directly from their own verified email IDs. This
          personalized approach ensures your campaigns maintain authenticity and trustworthiness, essential for
          cultivating strong client relationships.
        </p>
        <p style={{ fontSize: "1rem", lineHeight: "1.8", margin: "20px 0" }}>
          From AI-powered content generation to data-driven strategies, coldOutReach simplifies email marketing for
          businesses of all sizes. Whether you’re a startup aiming to grow or an established company looking to
          streamline your campaigns, our platform scales with your needs.
        </p>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#333333", color: "#FFFFFF", padding: "20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>coldOutReach</h3>
            <p style={{ fontSize: "1rem" }}>Empowering businesses with smarter email marketing solutions.</p>
          </div>
          <div>
           
          </div>
          <div>
            
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>&copy; {new Date().getFullYear()} coldOutReach. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
