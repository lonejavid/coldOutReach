import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isAuthenticated } = useAuth(); // Extract login and isAuthenticated from context
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/next'); // Redirect to '/next' once authenticated
        }
    }, [isAuthenticated, navigate]); // Dependency on isAuthenticated to re-run when the value changes

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password); // Trigger the login process
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <button type="submit" style={styles.button}>
                    Login
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#000',
        color: '#fff',
    },
    title: {
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        marginBottom: '5px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        width: '100%',
        border: '1px solid #555',
        borderRadius: '5px',
        backgroundColor: '#222',
        color: '#fff',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#444',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Login;
