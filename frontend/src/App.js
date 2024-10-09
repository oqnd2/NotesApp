import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/login' Component={Login} />
        <Route path='/register' Component={Register} />
      </Routes>
    </Router>
  );
}

export default App;
