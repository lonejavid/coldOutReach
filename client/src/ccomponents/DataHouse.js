import React, { useState } from 'react';
import axios from 'axios';

const DataHouse = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authentication token is missing. Please log in.');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching the data from the server');
      const response = await axios.get('https://emailmarketing-1dfc22840d6a.herokuapp.com/api/datahouse', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data.data); // Assume that the response contains a data field with the emails
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#121212',
        color: '#e0e0e0',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflowY: 'auto',
      }}
    >
      <h1 style={{ marginTop: '20px', fontSize: '28px', color: '#fff' }}>
        Data House
      </h1>

      <button
        onClick={handleFetchData}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          color: '#fff',
          backgroundColor: '#6200ea',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
        disabled={loading}
      >
        {loading ? 'Fetching data...' : 'Fetch Saved Data'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      {data && data.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            textAlign: 'left',
            padding: '10px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #333',
            borderRadius: '4px',
            maxWidth: '100%',
            wordWrap: 'break-word',
            maxHeight: '700px',
            overflowY: 'scroll',
          }}
        >
          <h2 style={{ color: '#fff', fontSize: '22px' }}>Saved Data:</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {data.map((item, index) => (
              <li
                key={index}
                style={{
                  color: '#e0e0e0',
                  padding: '12px 0',
                  fontSize: '18px',
                  borderBottom: '1px solid #333',
                }}
              >
                <p>
                  <strong>Email:</strong> {item.email || 'N/A'}
                </p>
                <p>
                  <strong>Website:</strong>{' '}
                  <a
                    href={item.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#03dac6' }}
                  >
                    {item.url || 'N/A'}
                  </a>
                </p>
                <p>
                  <strong>Status:</strong> {item.disposition || 'N/A'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data && data.length === 0 && (
        <p style={{ color: '#e0e0e0', marginTop: '20px' }}>
          No saved data found.
        </p>
      )}
    </div>
  );
};

export default DataHouse;
