import { useSelector } from "react-redux";
import { Typography, Grid, Container } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "../components/auth/Login";
import { userSelector } from "../store/UserSlice";
import showSnackbar from "../components/UI/Snackbar/Snackbar";

const Landing = () => {
  const { isLoggedIn, isError } = useSelector(userSelector);
  const { isAuthenticated } = useAuth0();

  if ((!isAuthenticated && isLoggedIn) || (!isAuthenticated && isError)) {
    localStorage.clear();
    sessionStorage.clear();
    if (isError) {
      showSnackbar("Unable to log into dBio at this time", "error");
    }
  }

  return (
    <Grid container spacing={0} direction="row" alignItems="center">
      <Grid item xs={6} md={6} columnSpacing={3}>
        <Container sx={{ mt: 24 }}>
          <Typography
            color={"primary"}
            sx={{
              fontFamily: "Barlow, Roboto",
              fontWeight: 700,
              fontSize: "4rem",
            }}
          >
            Take Control of Your
          </Typography>
          <Typography
            color={"secondary"}
            sx={{
              fontFamily: "Barlow, Roboto",
              fontWeight: 700,
              fontSize: "4rem",
            }}
          >
            Healthcare Data
          </Typography>
        </Container>
      </Grid>
      <Grid item xs={4} md={4} sx={{ mr: 2 }}>
        <Container sx={{ ml: 4, textAlign: "center" }}>
          <Paper
            variant="outlined"
            sx={{
              pl: 6,
              pt: 10,
              pr: 6,
              pb: 20,
              mt: 10,
              backgroundColor: "rgb(153, 150, 207)",
              transparency: 0.8,
            }}
          >
            <Container>
              <Typography
                color={"primary"}
                sx={{
                  fontFamily: "Roboto",
                  fontWeight: 500,
                  fontSize: "2rem",
                  mb: 2,
                }}
              >
                Log In or Sign Up for dBio Today
              </Typography>
            </Container>
            <Login />
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Landing;
