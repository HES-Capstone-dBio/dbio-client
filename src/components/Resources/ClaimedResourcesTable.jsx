import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { getComparator, stableSort } from "../../Utils/TableUtils";
import ResourcesTableHead from "./ResourcesTableHead";
import { Link as RouterLink } from "react-router-dom";
import { resourcesSelector } from "../../store/ResourcesSlice";
import showSnackbar from "../UI/Snackbar/Snackbar";
import { mintNFT } from "../../actions/ResourceActions";
import { resourcesActions } from "../../store/ResourcesSlice";

const headCells = [
  {
    id: "resourceType",
    numeric: false,
    label: "Record Type",
  },
  {
    id: "creatorEthAddress",
    numeric: false,
    label: "Creator Ethereum Address",
  },
  {
    id: "createdTime",
    numeric: false,
    label: "Date Created",
  },
  {
    id: "ipfs",
    numeric: false,
    label: "IPFS Link",
  },
  {
    id: "mintNft",
    numeric: false,
    label: "Mint NFT",
  },
  {
    id: "viewButton",
    numeric: false,
    label: "View Record",
  },
];

const EnhancedTableToolbar = (props) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: "rgba(69, 63, 181, 0.35)",
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {props.tableTitle}
      </Typography>
    </Toolbar>
  );
};

const ResourcesTable = (props) => {
  const {
    claimedResources,
    isError: resourceError,
    errorMessage: resourceErrorMessage,
  } = useSelector(resourcesSelector);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("createdTime");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();

  useEffect(() => {
    if (resourceError) {
      showSnackbar(`${resourceErrorMessage}`, "error");
      // Clear error state
      dispatch(resourcesActions.clearCurrentErrorState());
    }
  }, [resourceError, resourceErrorMessage, dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const mintNftClickHandler = (id, voucher) => {
    // dispatch(mintNFT({id, voucher: JSON.parse(voucher)}));
    dispatch(mintNFT({ id, voucher }));
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - claimedResources.length)
      : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar tableTitle="Claimed Records" />
        <TableContainer>
          <Table
            sx={{ minWidth: 300 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <ResourcesTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={claimedResources.length}
              tableType="claimed"
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(claimedResources, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.resourceType}
                      </TableCell>
                      <TableCell align="left">
                        {row.creatorEthAddress}
                      </TableCell>
                      <TableCell align="left">{row.createdTime}</TableCell>
                      <TableCell>
                        <Button
                          href={`https://ipfs.io/ipfs/${row.ipfsCid}`}
                          variant="contained"
                          size="small"
                        >
                          View IPFS
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            mintNftClickHandler(row.id, row.ethNftVoucher)
                          }
                        >
                          Mint NFT
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          component={RouterLink}
                          to={`/records/${row.id}`}
                          variant="contained"
                          size="small"
                        >
                          View Record
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={claimedResources.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ResourcesTable;
