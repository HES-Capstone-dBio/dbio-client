import React, { useState, useEffect } from "react";
import TorusSdk from "@toruslabs/customauth";
import { verifierMap, GOOGLE } from "../constants/constants";
import * as IronWeb from "@ironcorelabs/ironweb";
import { initializeIroncoreUser } from "../ironcore/Initialization";

export const AuthContext = React.createContext({
  isLoggedIn: false,
  createResource: false,
  torusDirectSdk: null,
  onLogout: () => {},
  onLogin: () => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [createResource, setCreateResource] = useState(false);
  const [torusDirectSdk, setTorusDirectSdk] = useState(null);

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
    setCreateResource(false);
    setIsLoggedIn(false);
  };

  const loginHandler = async () => {

    try {
      const jwtParams = { domain: "https://dbio.us.auth0.com" };
      const { typeOfLogin, clientId, verifier } = verifierMap[GOOGLE];

      const loginDetails = await torusDirectSdk.triggerLogin({
        typeOfLogin,
        verifier,
        clientId,
        jwtParams,
      });

      // Pull ID token from login details
      const idToken = loginDetails.userInfo.idToken;

      // Pull user private key from login details, this will be used
      // as the passcode for ironcore SDK calls
      const privKey = loginDetails.privateKey;

      // Initialize the ironcore SDK
      if (!IronWeb.isInitialized()) {
        try {
          const ironcoreInitResult = await initializeIroncoreUser(idToken, privKey);
          console.log(`Initialized SDK as user ${ironcoreInitResult.user.id}`)
          // @TODO Implement correct error handling to bubble up to UI
        } catch(error) {
          if (error.code === IronWeb.ErrorCodes.USER_PASSCODE_INCORRECT) {
            console.log('Unable to initialize Ironcore: Incorrect user password');
          } else if (error.code === IronWeb.ErrorCodes.USER_VERIFY_API_REQUEST_FAILURE) {
            console.log('Unable to initialize Ironcore: Invalid JWT');
          } else {
            console.log(`error code is ${error.code.toString()}`);
          }
        }
      }
    } catch (error) {
      console.error(error, "login caught");
    }

    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };

  const createResourceHandler = () => {

    setCreateResource(true);
  };

  return (
    <AuthContext.Provider
      value={{
        createResource: createResource,
        createResourceHandler,
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
