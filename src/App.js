import {
  BrowserRouter, Router
} from "react-router-dom";
import { ToastContainer } from "react-toastify"
import { useContext, useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { Rings } from "react-loader-spinner";
import { UserContext } from "./context/UserContext";
import './App.scss'
import NavHeader from "./components/Navigation/Nav";

function App() {
  const { user } = useContext(UserContext);

  return (
    <>
      <BrowserRouter>
        {user && user.isLoading ?
          <div className="loading-container">
            <Rings
              height="80"
              width="80"
              radius="9"
              color="#0866ff"
              ariaLabel="loading"
              wrapperStyle
              wrapperClass
            />
            <div>Loading data ...</div>
          </div>

          :
          <>
            <div className="app-header">
              <NavHeader />
            </div>
            <div className="app-container">
              <AppRoutes />
            </div>
          </>
        }
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
