import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "../constants/constants";

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = AUTH0_DOMAIN;
  const clientId = AUTH0_CLIENT_ID;

  const history = useHistory();

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={`${window.location.origin}/home`}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
