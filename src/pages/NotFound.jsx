import { useEffect } from "react";
import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { Link as RouterLink } from "react-router-dom";
import "./NotFound.scss";

const NotFound = () => {
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    let starContainer = document.querySelector(".stars");

    for (let i = 0; i < 100; i++) {
      starContainer.innerHTML += `<div class="star"></div>`;
    }
  });

  return (
    <div className="wrapper">
      <div className="text_group">
        <p className="text_404">404</p>
        <p className="text_lost">
          The page you are looking for <br />
          has been lost in space.
          {!isAuthenticated && (
            <Button
              variant="text"
              component={RouterLink}
              to="/"
              sx={{ fontSize: "1.2rem" }}
            >
              Take me home!
            </Button>
          )}
        </p>
      </div>
      <div className="window_group">
        <div className="window_404">
          <div className="stars"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
