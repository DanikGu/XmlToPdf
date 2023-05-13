import { useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import './index.css'
import LoginPage from './pages/login/LoginPage';
import EditorPage from './pages/editor/EditorPage';
import useToken from './utils/useToken';

function App() {

  const { token, setToken } = useToken();


  if(!token) {
    return <LoginPage setToken={setToken} />
  }
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" Component={EditorPage}></Route>
        </Routes>
    </Router>
    
    </div>
  )
}

export default App
