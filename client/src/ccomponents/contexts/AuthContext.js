import React, { createContext, useState, useContext, useEffect } from 'react';

// AuthContext to manage authentication state globally
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if token exists when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true); // Token found, user is authenticated
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setUser(storedUser);
            }
        }
        setLoading(false); // Loading is done
    }, []);

    // Login function to send credentials and get a token
    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
    
            const data = await response.json();
            const { token, user } = data; // Destructuring the response to get the token and user details
    
            // Log the entire response object
            
    
            // Store the token in localStorage
             localStorage.setItem('token', token);
             localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
    
            setIsAuthenticated(true); // Mark the user as authenticated
        } catch (error) {
            console.error('Login error:', error);
            setIsAuthenticated(false);
            // Handle error message here (e.g., show error on the UI)
        }
    };
    
    // Logout function to clear the token and unauthenticate the user
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null); // Clear user data
    };

    if (loading) {
        return <div>Loading...</div>; // Can be replaced with a loading spinner or placeholder
    }
    return (
        <AuthContext.Provider value={{ isAuthenticated,user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
// Custom hook to access authentication state
export const useAuth = () => useContext(AuthContext);




