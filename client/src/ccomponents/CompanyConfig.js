import React, { useState } from 'react';
import axios from 'axios';

const CompanyConfig = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedCompanyDetails, setSavedCompanyDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Authentication token not found. Please log in again.');
      return;
    }

    const data = {
      name: companyName,
      details: companyDetails,
    };

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:3000/companydetails', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Data saved successfully! Launch an Email Campaign now!');
      setCompanyName('');
      setCompanyDetails('');
    } catch (error) {
      setMessage('Error saving company details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch saved company details
  const fetchSavedCompanyDetails = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Authentication token not found. Please log in again.');
      return;
    }

    try {
      // Send the token and company name to the backend
      const response = await axios.get('http://localhost:3000/getCompanyDetiles', {
        headers: { Authorization: `Bearer ${token}` },
        params: { name: companyName }, // Send companyName as query param to fetch specific details
      });
      setSavedCompanyDetails(response.data);
      setIsModalOpen(true);
    } catch (error) {
      setMessage('Error fetching company details.');
    }
  };

  // Remove company details
  const removeCompanyDetails = async (companyName) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Authentication token not found. Please log in again.');
      return;
    }

    try {
      // Send the company name to the backend to delete the company
      const response = await axios.delete('http://localhost:3000/removeCompany', {
        headers: { Authorization: `Bearer ${token}` },
        data: { companyName }, // Send company name to backend for removal
      });

      // After successful removal, filter the company from the savedCompanyDetails state
      setSavedCompanyDetails(savedCompanyDetails.filter(company => company.name !== companyName));

      setMessage(`Company "${companyName}" removed successfully.`);
    } catch (error) {
      setMessage('Error removing company details.');
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        {!isModalOpen ? (
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: '#1a1a1a',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0px 4px 6px rgba(255, 255, 255, 0.1)',
              width: '100%',
            }}
          >
            <h2 style={{ marginBottom: '20px' }}>Enter Company Details</h2>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="companyName" style={{ display: 'block', marginBottom: '5px' }}>
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  backgroundColor: '#333',
                  color: '#fff',
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="companyDetails" style={{ display: 'block', marginBottom: '5px' }}>
                Company Details
              </label>
              <textarea
                id="companyDetails"
                value={companyDetails}
                onChange={(e) => setCompanyDetails(e.target.value)}
                placeholder="Write about your company..."
                style={{
                  width: '100%',
                  height: '100px',
                  padding: '10px',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  backgroundColor: '#333',
                  color: '#fff',
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
            {message && (
              <p
                style={{
                  marginTop: '15px',
                  color: message.includes('successfully') ? '#28a745' : '#dc3545',
                }}
              >
                {message}
              </p>
            )}
            <button
              type="button"
              onClick={fetchSavedCompanyDetails}
              style={{
                marginTop: '15px',
                width: '100%',
                padding: '10px',
                backgroundColor: '#17a2b8',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Fetch Saved Companies
            </button>
          </form>
        ) : (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: '#1a1a1a',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0px 4px 6px rgba(255, 255, 255, 0.1)',
                maxWidth: '600px',
                width: '100%',
                overflowY: 'auto',
              }}
            >
              <h2 style={{ marginBottom: '20px' }}>Saved Company Names</h2>
              {savedCompanyDetails.length > 0 ? (
                <div>
                  {savedCompanyDetails.map((company) => (
                    <div
                      key={company.name}
                      style={{
                        marginBottom: '15px',
                        padding: '10px',
                        backgroundColor: '#333',
                        borderRadius: '5px',
                      }}
                    >
                      <h3>{company.name}</h3>
                      <button
                        onClick={() => removeCompanyDetails(company.name)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={closeModal}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#6c757d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginTop: '20px',
                    }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <p>No saved company names found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyConfig;
