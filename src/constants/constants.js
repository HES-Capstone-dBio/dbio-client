export const GOOGLE = "google";

export const AUTH_DOMAIN = "https://torus-test.auth0.com";
export const COGNITO_AUTH_DOMAIN = "https://torus-test.auth.ap-southeast-1.amazoncognito.com/oauth2/";
export const BACKEND_ENDPOINT = "http://localhost:8080";

export const verifierMap = {
  [GOOGLE]: {
    name: "Google",
    typeOfLogin: "jwt",
    verifier: "dbio-auth0-testnet",
    clientId: "xIEcOQHJ1jJYClYvPS2EFAcinK0w7R2K",
  }
};
