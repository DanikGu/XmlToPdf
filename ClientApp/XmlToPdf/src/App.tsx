import { useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { ConfigProvider } from 'antd';
import LoginPage from './pages/login/LoginPage';
import EditorPage from './pages/editor/EditorPage';
import useToken from './utils/useToken';

function App() {

  const { token, setToken } = useToken();


  if(!token) {
    return (
      <ConfigProvider theme={{ token: { colorPrimary: '#62baab'} }}>
        <LoginPage setToken={setToken} />
      </ConfigProvider>
    )
  }
  return (
    <div className="App">
      <ConfigProvider theme={{ token: { colorPrimary: '#62baab'} }}>
        <Router>
          <Routes>
            <Route path="/" Component={EditorPage}></Route>
          </Routes>
        </Router>
      </ConfigProvider>
    </div>
  )
}

export default App
