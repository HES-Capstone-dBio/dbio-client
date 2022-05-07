import { useSelector } from "react-redux";
import { Typography, Grid, Container, Box, Divider } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "../components/auth/Login";
import { userSelector } from "../store/UserSlice";
import showSnackbar from "../components/UI/Snackbar/Snackbar";
import web3 from "../assets/decentralized.svg";
import record from "../assets/landingrecord.svg";
import security from "../assets/security.svg";
import store from "../store";

const Landing = () => {
  const { isLoggedIn, isError } = useSelector(userSelector);
  const { isAuthenticated } = useAuth0();

  const errorMessage = store.getState().user.errorMessage;

  if ((!isAuthenticated && isLoggedIn) || (!isAuthenticated && isError)) {
    localStorage.clear();
    sessionStorage.clear();
    if (isError) {
      showSnackbar(`${errorMessage}`, "error");
    }
  }

  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      sx={{ mt: 16 }}
    >
      <Grid item xs={6} md={6} columnSpacing={3}>
        <Container sx={{ mt: 5, pb: 12 }}>
          <Typography
            color={"primary"}
            style={{ display: "inline-block" }}
            sx={{
              pl: 4,
              fontFamily: "Barlow, Roboto",
              fontWeight: 700,
              fontSize: {
                lg: "3.6rem",
                md: "2.8rem",
                sm: "2rem",
              },
            }}
          >
            Take Control of Your
          </Typography>
          <Typography
            color={"secondary"}
            style={{ display: "inline-block" }}
            sx={{
              pl: 4,
              fontFamily: "Barlow, Roboto",
              fontWeight: 700,
              fontSize: {
                lg: "3.6rem",
                md: "2.8rem",
                sm: "2rem",
              },
            }}
          >
            Healthcare Data
          </Typography>
        </Container>
      </Grid>
      <Grid item xs={6} md={6}>
        <Container sx={{ textAlign: "center" }}>
          <Typography
            color={"primary"}
            sx={{
              pr: 4,
              fontFamily: "Roboto",
              fontWeight: 500,
              fontSize: {
                lg: "1.65rem",
                md: "1.35rem",
                sm: "1.2rem",
              },
            }}
          >
            Get Started with dBio Today
          </Typography>
          <Login />
          <Divider />
        </Container>
      </Grid>
      <Grid item xs={4} md={4} columnSpacing={0} sx={{ pt: 22 }}>
        <Box sx={{ maxWidth: "80px", m: "auto" }}>
          <img
            src={record}
            alt="Record Icon"
            sx={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>
        <Typography
          color={"primary"}
          textAlign="center"
          sx={{
            mt: 2,
            fontFamily: "Barlow, Roboto",
            fontWeight: 400,
            fontSize: {
              lg: "1.6rem",
              md: "1.3rem",
              sm: "1rem",
            },
          }}
        >
          Your Medical Records all
          <br />
          in One Place
        </Typography>
      </Grid>
      <Grid item xs={4} md={4} columnSpacing={0} sx={{ pt: 22 }}>
        <Box
          alignItems="center"
          justifyContent="center"
          sx={{ maxWidth: "74px", m: "auto" }}
        >
          <img
            src={security}
            alt="Security Icon"
            sx={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>
        <Typography
          color={"primary"}
          textAlign="center"
          sx={{
            mt: 2,
            fontFamily: "Barlow, Roboto",
            fontWeight: 400,
            fontSize: {
              lg: "1.6rem",
              md: "1.3rem",
              sm: "1rem",
            },
          }}
        >
          Proxy Re-Encryption for
          <br /> Maximum Security
        </Typography>
      </Grid>
      <Grid item xs={4} md={4} columnSpacing={0} sx={{ pt: 22 }}>
        <Box sx={{ maxWidth: "80px", m: "auto" }}>
          <img
            src={web3}
            alt="web 3 Icon"
            sx={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>
        <Typography
          color={"primary"}
          textAlign="center"
          sx={{
            mt: 2,
            fontFamily: "Barlow, Roboto",
            fontWeight: 400,
            fontSize: {
              lg: "1.6rem",
              md: "1.3rem",
              sm: "1rem",
            },
          }}
        >
          Decentralized Technology for
          <br /> Web3 Integration
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Landing;
