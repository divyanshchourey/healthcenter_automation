import React from 'react';
import Dashboard from './pages/Dashboard';

const App = ({ user, onLogout }) => {
  return <Dashboard user={user} onLogout={onLogout} />;
};

export default App;

