import React from 'react';
import UserContextWrapper from "./contexts/UserContext";
import Router from './routers/Router';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <UserContextWrapper>
        <Router />
      </UserContextWrapper>
    </div>
  );
}

export default App;
