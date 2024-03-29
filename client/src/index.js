import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App/App.js'
import Account from './pages/Account/index.jsx'
import Register from './pages/Register/Register.js'
import reportWebVitals from './reportWebVitals'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import EmailVerify from './pages/EmailVerify/index.jsx'
import { AuthContextProvider } from './context/AuthContext.js'
import { MatchContextProvider } from './context/MatchContext.js'
import ProfileSettings from './pages/ProfileSettings/index.jsx'
import Chat from './pages/Chat/index.jsx'


const route = createBrowserRouter([
  {
    path: "register",
    element: <Register />
  },
  {
    path: "account",
    element: <Account />
  },
  {
    path: "chat",
    element: <Chat />
  },
  {
    path: "monprofil",
    element: <ProfileSettings />
  },
  {
    path: "users/verify/:id/:token",
    element: <EmailVerify /> 
  },
  {
    path:"/*",
    element: <App />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <MatchContextProvider>
      <RouterProvider router={route} />
    </MatchContextProvider>
  </AuthContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
