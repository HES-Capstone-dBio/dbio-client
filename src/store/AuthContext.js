import React, { useState, useEffect } from "react";
import TorusSdk, { RedirectResult } from "@toruslabs/customauth";
import { verifierMap, GOOGLE } from "../constants/constants";

export const AuthContext = React.createContext({
  isLoggedIn: false,
  torusDirectSdk: null,
  onLogout: () => {},
  onLogin: () => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [torusDirectSdk, setTorusDirectSdk] = useState(null);
  const [loginTriggered, setLoginTriggered] = useState(false);
  const [loginDetails, setLoginDetails] = useState(null);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const torusSDK = new TorusSdk({
          baseUrl: `${window.location.origin}/serviceworker`,
          enableLogging: true,
          network: "testnet",
        });
        await torusSDK.init({ skipSw: false });
        
        setTorusDirectSdk(torusSDK);
      
      } catch (error) {
        console.log("failed to initialize torus sdk");
      }
    })();
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  const loginHandler = async () => {
    console.log("Attempting to log in");

    try {
      const jwtParams = { domain: "https://dbio.us.auth0.com" };
      const { typeOfLogin, clientId, verifier } = verifierMap[GOOGLE];

      setLoginDetails(
        await torusDirectSdk.triggerLogin({
          typeOfLogin,
          verifier,
          clientId,
          jwtParams,
        })
      );
    } catch (error) {
      console.error(error, "login caught");
    }

    localStorage.setItem("isLoggedIn", "1");
    console.log("hello world")
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
        torusDirectsdk: torusDirectSdk,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
