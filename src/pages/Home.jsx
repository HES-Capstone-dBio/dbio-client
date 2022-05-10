import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../actions/UserActions";
import { userSelector } from "../store/UserSlice";
import { useAuth0 } from "@auth0/auth0-react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Divider, Typography, Button, Fade } from "@mui/material";
import store from "../store";

const Home = () => {
  const dispatch = useDispatch();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [buttonText, setButtonText] = useState("Show Ethereum Private Key");
  const [privateKey, setPrivateKey] = useState("");

  const { name, email, ethAddress, isLoggedIn, isFetching, isError } =
    useSelector(userSelector);

  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    // If user is authenticated but not logged in then dispatch login
    if (isAuthenticated && !isLoggedIn && !isFetching && !isError) {
      dispatch(loginUser({ user, getIdTokenClaims }));
    }
  }, [
    dispatch,
    isAuthenticated,
    isLoggedIn,
    isFetching,
    isError,
    getIdTokenClaims,
    user,
  ]);

  const showKeyHandler = () => {
    if (!showPrivateKey) {
      setButtonText("Hide Ethereum Private Key");
      setPrivateKey(store.getState().user.privateKey);
    } else {
      setButtonText("Show Ethereum Private Key");
      setPrivateKey("");
    }
    setShowPrivateKey(!showPrivateKey);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Typography
            color={"primary"}
            style={{ display: "inline-block" }}
            sx={{
              fontFamily: "Roboto, Helvetica, Arial",
              fontWeight: 400,
              fontSize: "2rem",
              letterSpacing: "0.00938em",
            }}
          >
            Welcome to dBio,
          </Typography>{" "}
          <Typography
            color={"secondary"}
            style={{ display: "inline-block" }}
            sx={{
              fontFamily: "Roboto, Helvetica, Arial",
              fontWeight: 400,
              fontSize: "2rem",
              letterSpacing: "0.00938em",
            }}
          >
            {name}
          </Typography>
          <Grid item xs={12} md={12} sx={{ mt: 1 }}>
            <Divider />
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography
            color={"primary"}
            style={{ display: "inline-block" }}
            sx={{
              fontFamily: "Roboto, Helvetica, Arial",
              fontWeight: 400,
              fontSize: "1.23rem",
              letterSpacing: "0.00938em",
            }}
          >
            Ethereum Address:
          </Typography>
          <Typography
            color={"secondary"}
            style={{ display: "inline-block" }}
            sx={{
              fontFamily: "Roboto, Helvetica, Arial",
              fontWeight: 400,
              fontSize: "1.23rem",
              letterSpacing: "0.00938em",
              pl: 2,
            }}
          >
            {ethAddress}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography
            color={"primary"}
            style={{ display: "inline-block" }}
            sx={{
              fontFamily: "Roboto, Helvetica, Arial",
              fontWeight: 400,
              fontSize: "1.23rem",
              letterSpacing: "0.00938em",
            }}
          >
            Email:
          </Typography>
          <Typography
            color={"secondary"}
            style={{ display: "inline-block" }}
            sx={{
              fontFamily: "Roboto, Helvetica, Arial",
              fontWeight: 400,
              fontSize: "1.23rem",
              letterSpacing: "0.00938em",
              pl: 2,
            }}
          >
            {email}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Button
            variant="contained"
            onClick={showKeyHandler}
            // sx={{ display: "inline-block" }}
          >
            {buttonText}
          </Button>
          <Box sx={{ mt: 2 }}>
            <Fade in={showPrivateKey}>
              <Typography
                color={"secondary"}
                style={{ display: "inline-block" }}
                sx={{
                  fontFamily: "Roboto, Helvetica, Arial",
                  fontWeight: 400,
                  fontSize: "1.23rem",
                  letterSpacing: "0.00938em",
                }}
              >
                {privateKey}
              </Typography>
            </Fade>
            <Fade in={showPrivateKey}>
              <Divider />
            </Fade>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Home;
