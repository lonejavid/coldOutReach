import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    password: '',
    photo: null, // For storing the photo file
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({
        ...formData,
        photo: files[0], // Store the uploaded file
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Prepare form data
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('organization', formData.organization);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo); // Append the photo file
      }

      const response = await fetch('https://emailmarketing-1dfc22840d6a.herokuapp.com/signup', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong!');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSuccessMessage(data.message || 'Signup successful!');
      setLoading(false);
      setFormData({ name: '', organization: '', email: '', password: '', photo: null }); // Reset form

      // After 2 seconds, remove the success message and navigate to home
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/'); // Navigate to home or another page
      }, 3000);
    } catch (error) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="form-container">
        <h2 className="text-center text-white">Sign Up</h2>

        {/* Error or Success Message */}
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && (
          <div className="alert alert-success" style={{ transition: 'opacity 0.5s' }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="organization" className="form-label">Organization</label>
            <input
              type="text"
              className="form-control"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="photo" className="form-label">Upload Profile Photo</label>
            <input
              type="file"
              className="form-control"
              id="photo"
              name="photo"
              onChange={handleChange}
              accept="image/*" // Accept only image files
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

// Styles
const styles = `
  .signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #121212;
  }

  .form-container {
    background-color: #1f1f1f;
    padding: 30px;
    border-radius: 10px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  }

  .form-container h2 {
    margin-bottom: 20px;
  }

  .form-label {
    color: #ccc;
  }

  .form-control {
    background-color: #333;
    color: #fff;
    border: 1px solid #444;
  }

  .form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25);
  }

  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
  }

  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
  }

  .text-center {
    margin-top: 20px;
  }

  /* Media Queries for responsiveness */
  @media (max-width: 768px) {
    .form-container {
      padding: 20px;
    }
  }

  @media (max-width: 576px) {
    .form-container {
      max-width: 350px;
    }

    .signup-container {
      padding: 10px;
    }

    .form-container h2 {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .form-container {
      padding: 15px;
    }

    .form-control {
      font-size: 14px;
    }

    .btn-primary {
      font-size: 14px;
    }
  }
`;

// Append the styles to the document head
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
