

import React, { useState } from 'react';
import axios from 'axios';

const DataCenterSearch = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSaveAll = async () => {
    if (!data || !data.results || data.results.length === 0) {
      alert('No data available to save.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authentication token is missing. Please log in.');
      return;
    }

    try {
      console.log("Data to be sent to the server:", data.results);
      await axios.post('https://emailmarketing-1dfc22840d6a.herokuapp.com/api/save', {
        results: data.results,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('All results have been saved successfully.');
      setQuery('');
      setData(null);
      setError(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save data. Please try again.');
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authentication token is missing. Please log in.');
      setLoading(false);
      return;
    }

    try {
      console.log("query to be sent to the server",query)
      const response = await axios.post('https://emailmarketing-1dfc22840d6a.herokuapp.com/api/datacenter', {
        query,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
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
    }}>
      <h1 style={{
        marginTop: '20px',
        fontSize: '28px',
        color: '#fff',
      }}>Generate Leads</h1>

      <label htmlFor="query" style={{
        fontSize: '18px',
        marginBottom: '10px',
        color: '#fff',
      }}>Enter search query</label>
      <input
        id="query"
        type="text"
        placeholder="Enter search query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '80%',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #333',
          backgroundColor: '#333',
          color: '#fff',
          marginBottom: '20px',
        }}
      />
    <p style={{
  fontSize: '16px',
  fontWeight: '400',
  color: '#333',
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  marginBottom: '20px',
  lineHeight: '1.6',
  textAlign: 'center',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
  marginLeft: 'auto',
  marginRight: 'auto',
}}>
  <strong>Enter the details As:</strong> 
  Please provide information such as industry, location, domains, and other related data. This will help our system understand your needs better and provide the most relevant leads for your campaign.
</p>



      <button
        onClick={handleSearch}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          color: '#fff',
          backgroundColor: '#6200ea',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="spinner" style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #6200ea',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              animation: 'spin 1s linear infinite',
              marginRight: '10px',
            }} />
            Gathering data...
          </>
        ) : 'Search'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      {data && data.results && (
        <div style={{
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
        }}>
          <h2 style={{ color: '#fff', fontSize: '22px' }}>Search Results:</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {data.results.map((result, index) => (
              <li key={index} style={{
                color: '#e0e0e0',
                padding: '12px 0',
                fontSize: '18px',
                borderBottom: '1px solid #333',
              }}>
                
                <p><strong>Email:</strong> {result.email || 'N/A'}</p>
                <p><strong>Website:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" style={{ color: '#03dac6' }}>{result.url || 'N/A'}</a></p>
              </li>
            ))}
          </ul>
          <button
            onClick={handleSaveAll}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              color: '#fff',
              backgroundColor: '#03dac6',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save All
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DataCenterSearch;
