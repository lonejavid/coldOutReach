import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './ccomponents/routes/RoutesComponent';
import { AuthProvider } from './ccomponents/contexts/AuthContext';

const App = () => (
  <AuthProvider>
    <Router>
      <RoutesComponent />
    </Router>
  </AuthProvider>
);

export default App;
