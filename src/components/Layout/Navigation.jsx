import React, { useRef } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import logo from "../../assets/logo.svg";
import { Slide } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import recordIcon from "../../assets/medicalrecord.svg";
import accessIcon from "../../assets/access.svg";
import homeIcon from "../../assets/home.svg";
import Logout from "../auth/Logout";
import { Link as RouterLink } from "react-router-dom";

const drawerWidth = 240;

const Navigation = ({ children }) => {
  const { isAuthenticated } = useAuth0();
  const containerRef = useRef(null);

  return (
    <Box
      sx={{
        display: isAuthenticated ? "flex" : "inline",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      ref={containerRef}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Box
            component="img"
            sx={{ height: 45, display: { xs: "flex", md: "flex" } }}
            alt="Your logo."
            src={logo}
          />
        </Toolbar>
      </AppBar>
      <Slide
        direction="right"
        in={isAuthenticated}
        container={containerRef.current}
      >
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItem button key="home" component={RouterLink} to="/home">
                <ListItemIcon>
                  <img src={homeIcon} alt="Home Icon" height={25} width={25} />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem
                button
                key="records"
                component={RouterLink}
                to="/records"
              >
                <ListItemIcon>
                  <img
                    src={recordIcon}
                    alt="Records Icon"
                    height={25}
                    width={25}
                  />
                </ListItemIcon>
                <ListItemText primary="Medical Records" />
              </ListItem>
              <ListItem
                button
                key="access"
                component={RouterLink}
                to="/access-control"
              >
                <ListItemIcon>
                  <img
                    src={accessIcon}
                    alt="Access Control Icon"
                    height={25}
                    width={25}
                  />
                </ListItemIcon>
                <ListItemText primary="Access Control" />
              </ListItem>
              <Logout />
            </List>
          </Box>
        </Drawer>
      </Slide>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Navigation;
