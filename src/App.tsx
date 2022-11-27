import React from 'react';
import UserContextWrapper from "./contexts/UserContext";
import Router from './routers/Router';

function App() {
  return (
    <div className="App">
      <UserContextWrapper>
        <Router />
      </UserContextWrapper>
    </div>
  );
}

export default App;
