import React from 'react'
import {BrowserRouter,Route,Routes} from "react-router-dom";
import HomePage from './pages/homePage/homePage';
import Profie from './pages/profile/profie';
import Items from './pages/items/items';
import MyState from './context/data/myState';
import Signup from './pages/registration/signUp';
import { ToastContainer, toast } from 'react-toastify';
import Login from './pages/registration/login';
import ChatPage from './pages/messaging/messaging';
import { ChatContextProvider } from './context/data/chatContext';


function App() {
  return (
    <MyState>
      <ChatContextProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/items" element={<Items/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<ProtectedRoutes><Profie/></ProtectedRoutes>} />
        <Route path="/chat" element={<ProtectedRoutes><ChatPage/></ProtectedRoutes>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
    </ChatContextProvider>
    </MyState>
    
  )
}

export default App

export const ProtectedRoutes = ({ children }) => {
  if (localStorage.getItem('user')) {
    return children
  }
  else {
    return <Navigate to='/login' />
  }
}