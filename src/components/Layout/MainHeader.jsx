import * as React from "react";
import { Fragment } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import logo from "../../assets/logo.svg";
import Link from "@mui/material/Link";
import { useAuth0 } from "@auth0/auth0-react";

const pages = [
  ["home", "Home"],
  ["records", "Records Dashboard"],
  ["access-control", "Access Control Dashboard"],
];
const settings = ["Profile", "Logout"];

const navStyle = {
  my: 2,
  ml: 6,
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "1.1rem",
  letterSpacing: "1.02px",
  "&:hover": {
    color: "#FFFFFF",
    textDecoration: "underline",
    filter: "brightness(75%)",
  },
  "&:active": {
    color: "#FFFFFF",
    textDecoration: "underline",
    filter: "brightness(75%)",
  },
  color: "#FFFFFF",
  display: "block",
};

const MainHeader = (props) => {
  const { isAuthenticated, logout } = useAuth0();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutHandler = () => {
    logout({ returnTo: "window.location.origin" });
  };

  return (
    <AppBar position="static">
      <Container maxWidth="false" sx={{ mt: 2, mb: 1 }}>
        <Toolbar disableGutters>
          <Box
            component="img"
            sx={{ height: 64, mr: 2, display: { xs: "none", md: "flex" } }}
            alt="Your logo."
            src={logo}
          />
          {true && (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page[0]}
                    component="a"
                    href={`/${page[0]}`}
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">{page[1]}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          <Box
            component="img"
            sx={{
              height: 64,
              mr: 2,
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
            }}
            alt="Your logo."
            src={logo}
          />
          {true && (
            <Fragment>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page, index) => (
                  <Link
                    href={`/${page[0]}`}
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={navStyle}
                  >
                    {page[1]}
                  </Link>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) =>
                    setting.match("Logout") ? (
                      <MenuItem key={setting} onClick={logoutHandler}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ) : (
                      <MenuItem
                        component="a"
                        href="/profile"
                        key={setting}
                        onClick={handleCloseUserMenu}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    )
                  )}
                </Menu>
              </Box>
            </Fragment>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default MainHeader;
