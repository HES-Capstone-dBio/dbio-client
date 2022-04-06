import React, { useState, useEffect } from "react";
import TorusSdk from "@toruslabs/customauth";
import { verifierMap, GOOGLE } from "../constants/constants";
import * as IronWeb from "@ironcorelabs/ironweb";
import {
  initializeIroncoreUser,
  getTestGroupDetails,
} from "../ironcore/Initialization";
import showSnackBar from "../components/UI/Snackbar/Snackbar";
import axios from "axios";
import { setGroup } from "../actions/GroupActions";
import { useDispatch } from "react-redux";
import { GROUP_ID_STORAGE_KEY } from "../ironcore/Utils";
import snackbar from "../components/UI/Snackbar/Snackbar";

const BACKEND_ENDPOINT = "http://localhost:8080";

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
  const dispatch = useDispatch();

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
        showSnackBar("Failed to initialize torus SDK", "error");
      }
    })();
  }, []);

  const logoutHandler = () => {
    // Change all states to false
    setCreateResource(false);
    setIsLoggedIn(false);

    // Remove user ID from storage
    localStorage.removeItem("USER_ID");

    // Remove group ID from storage
    localStorage.removeItem(GROUP_ID_STORAGE_KEY);

    // Remove Ethereum public address from local storage
    localStorage.removeItem("ETH_ADDR");

    // Clean up local storage
    localStorage.removeItem("isLoggedIn");

    try {
      if (IronWeb.isInitialized) {
        // Deauthorize IronCore SDK on logout
        IronWeb.user.deauthorizeDevice();
      }
    } catch (error) {
      snackbar("Unable to initialize IronCore SDK", "error");
    }
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
          const ironcoreInitResult = await initializeIroncoreUser(
            idToken,
            privKey
          );

          // Store user ID in local storage. This will be used to create a unique
          // test group for a user.
          localStorage.setItem("USER_ID", ironcoreInitResult.user.id);

          // Store user public Ethereum address in local storage. This will be used
          // for making backend API calls.
          localStorage.setItem("ETH_ADDR", loginDetails.publicAddress);

          // Set the default group for the user (find this in Initialization.js)
          const testGroupDetails = await getTestGroupDetails();

          dispatch(setGroup(testGroupDetails));
        } catch (error) {
          if (error.code === IronWeb.ErrorCodes.USER_PASSCODE_INCORRECT) {
            showSnackBar(
              "Unable to initialize Ironcore SDK: Incorrect user passcode",
              "error"
            );
          } else if (
            error.code === IronWeb.ErrorCodes.USER_VERIFY_API_REQUEST_FAILURE
          ) {
            showSnackBar("Unable to initialize Ironcore: Invalid JWT", "error");
          } else {
            showSnackBar(`${error.message}`, "error");
          }
        }
      }

      // At this point the user is logged in via TORUS and IronCore SDK is initialized.
      // Now we need to check if the user exists in the backend.
      axios
        .get(
          `${BACKEND_ENDPOINT}/dbio/users/email/${localStorage.getItem(
            "USER_ID"
          )}`
        )
        .catch((error) => {
          // If we receive a 500 error it means that this user isn't
          // currently registered with dBio thus we need to make a
          // post request to add them
          if (error.response.status === 500) {
            axios
              .post(`${BACKEND_ENDPOINT}/dbio/users`, {
                eth_public_address: localStorage.getItem("ETH_ADDR"),
                email: localStorage.getItem("USER_ID"),
              })
              .then(
                (response) => {
                  showSnackBar("Thank you for registering with dBio", "success");
                },
                (error) => {
                  console.log(error);
                }
              );
          }
        });
    } catch (error) {
      showSnackBar("Unable to log in to dBio");
    }

    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };

  const createResourceHandler = () => {
    setCreateResource(true);
  };

  /**
   * The homeHandler should set the state of all other visual-component
   * states to false, thus rendering the home page in App.js. For the time
   * being the only other component state we need to manage is the
   * createResource state.
   */
  const homeHandler = () => {
    setCreateResource(false);
  };

  return (
    <AuthContext.Provider
      value={{
        createResource: createResource,
        createResourceHandler,
        homeHandler,
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
