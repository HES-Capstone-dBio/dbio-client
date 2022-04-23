import { Typography, Grid, Container } from "@mui/material";
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";

const Landing = () => {
  return (
    <Grid container spacing={0} direction="row" alignItems="center">
      <Grid item xs={6} md={6} columnSpacing={3}>
        <Container sx={{ ml: 8, mt: 24 }}>
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
            Healthcare
          </Typography>
        </Container>
      </Grid>
      <Grid item xs={4} md={4} sx={{ mr: 2 }}>
        <Container sx={{ml: 4, textAlign: "center"}}>
          <Paper variant="outlined" sx={{ pl: 6, pt: 10, pr: 6, pb: 20, mt: 10, backgroundColor: "rgb(153, 150, 207)", transparency: 0.8}}>
            <Container>
              <Typography
                color={"primary"}
                sx={{ fontFamily: "Roboto", fontWeight: 500, fontSize: "2rem" }}
              >
                Log In or Sign Up for the dBio Today
              </Typography>
            </Container>
            <Button
              color={"primary"}
              variant="contained"
              sx={{
                m: 3,
                maxWidth: "12em",
                maxHeight: "4em",
                minWidth: "10em",
                minHeight: "3em",
              }}
            >
              Login
            </Button>
            <Button
              color={"primary"}
              variant="contained"
              sx={{
                m: 3,
                maxWidth: "12em",
                maxHeight: "4em",
                minWidth: "10em",
                minHeight: "3em",
              }}
            >
              Sign Up
            </Button>
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Landing;
