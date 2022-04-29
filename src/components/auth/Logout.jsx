import { useAuth0 } from "@auth0/auth0-react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import logoutIcon from "../../assets/logout.svg";

const Logout = () => {
  const { logout } = useAuth0();

  const logoutHandler = () => {
    // Logout of Auth0
    logout({ returnTo: window.location.origin });
  };

  return (
    <ListItem button key="logout" onClick={logoutHandler}>
      <ListItemIcon>
        <img src={logoutIcon} alt="Logout Icon" height={25} width={25} />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItem>
  );
};

export default Logout;
