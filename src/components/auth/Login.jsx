import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  const loginButtonHandler = () => {
    loginWithRedirect();
  };

  return (
    <Button
      onClick={loginButtonHandler}
      color={"primary"}
      variant="contained"
      sx={{
        m: 3,
        mt: 6,
        maxWidth: "12em",
        maxHeight: "4em",
        minWidth: "10em",
        minHeight: "3em",
      }}
    >
      Login/Sign Up
    </Button>
  );
};

export default Login;
