import "./App.css";
import React, { useContext } from "react";
import MainHeader from "./components/MainHeader/MainHeader";
import AuthContext from "./store/AuthContext";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import SubmitResource from "./components/Resources/SubmitResource";

const App = () => {
  
  // Grab the Auth context to conditionally render components
  // based on whether the user is logged in.
  const ctx = useContext(AuthContext);

  return (
    <React.Fragment>
      <MainHeader onLogout={ctx.logoutHandler} />
      <main>
        {!ctx.isLoggedIn && <Login />}
        {ctx.isLoggedIn && <Home />}
      </main>
    </React.Fragment>
  );
};
export default App;
