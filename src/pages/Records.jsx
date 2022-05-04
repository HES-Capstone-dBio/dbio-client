import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Box } from "@mui/material";
import UnclaimedResourcesTable from "../components/Resources/UnclaimedResourcesTable";
import ClaimedResourcesTable from "../components/Resources/ClaimedResourcesTable";
import {
  listUnclaimedResources,
  listClaimedResources,
} from "../actions/ResourceActions";
import { resourcesSelector } from "../store/ResourcesSlice";
import LinearProgress from "@mui/material/LinearProgress";

const Records = () => {
  const dispatch = useDispatch();
  const { isClaimingResource } = useSelector(resourcesSelector);

  // On initial page load get all resources that belong to this user
  useEffect(() => {
    dispatch(listClaimedResources());
    dispatch(listUnclaimedResources());
  }, [dispatch]);

  return (
    <Box sx={{ flexGrow: 0 }}>
      {isClaimingResource && <LinearProgress />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <ClaimedResourcesTable />
        </Grid>
        {isClaimingResource && <LinearProgress />}
        <Grid item xs={12} md={12}>
          <UnclaimedResourcesTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Records;
