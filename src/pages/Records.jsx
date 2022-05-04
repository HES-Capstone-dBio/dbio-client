import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid, Box } from "@mui/material";
import UnclaimedResourcesTable from "../components/Resources/UnclaimedResourcesTable";
import ClaimedResourcesTable from "../components/Resources/ClaimedResourcesTable";
import { listUnclaimedResources } from "../actions/ResourceActions";
import { listClaimedResources } from "../actions/ResourceActions";

const Records = () => {
  const dispatch = useDispatch();
  // On initial page load get all resources that belong to this user
  useEffect(() => {
    dispatch(listClaimedResources());
    dispatch(listUnclaimedResources());
  }, [dispatch]);

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <ClaimedResourcesTable />
        </Grid>
        <Grid item xs={12} md={12}>
          <UnclaimedResourcesTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Records;
