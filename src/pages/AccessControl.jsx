import * as React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  listGrantedReadRequests,
  listPendingReadRequests,
  listGrantedWriteRequests,
  listPendingWriteRequests,
} from "../actions/AccessControlActions";
import GrantedReadRequestsTable from "../components/AccessControls/GrantedReadRequestsTable";
import GrantedWriteRequestsTable from "../components/AccessControls/GrantedWriteRequestsTable";
import PendingReadRequestsTable from "../components/AccessControls/PendingReadRequestsTable";
import PendingWriteRequestsTable from "../components/AccessControls/PendingWriteRequestsTable";

const AccessControl = () => {
  const dispatch = useDispatch();

  // On initial page load get all resources that belong to this user
  useEffect(() => {
    dispatch(listGrantedReadRequests());
    dispatch(listGrantedWriteRequests());
    dispatch(listPendingReadRequests());
    dispatch(listPendingWriteRequests());
  }, [dispatch]);

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={6}>
          <GrantedWriteRequestsTable />
        </Grid>
        <Grid item xs={6} md={6}>
          <GrantedReadRequestsTable />
        </Grid>
        <Grid item xs={6} md={6}>
          <PendingWriteRequestsTable />
        </Grid>
        <Grid item xs={6} md={6}>
          <PendingReadRequestsTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccessControl;
