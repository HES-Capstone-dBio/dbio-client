import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
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
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { getComparator, stableSort } from "../../Utils/TableUtils";
import ResourcesTableHead from "./ResourcesTableHead";
import { resourcesSelector } from "../../store/ResourcesSlice";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { claimResource } from "../../actions/ResourceActions";
import showSnackbar from "../UI/Snackbar/Snackbar";
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
];

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0
          ? {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }
          : {
              bgcolor: "rgba(69, 63, 181, 0.35)",
            }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {props.tableTitle}
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Claim Record">
          <IconButton onClick={props.claimResourceHandler}>
            <CheckCircle />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const ResourcesTable = (props) => {
  const dispatch = useDispatch();
  const {
    unclaimedResources,
    isError: resourceError,
    errorMessage: resourceErrorMessage,
  } = useSelector(resourcesSelector);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("createdTime");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = unclaimedResources.map((n) => {
        return {
          id: n.id,
          creatorEthAddress: n.creatorEthAddress,
          resourceType: n.resourceType,
        };
      });
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id, creatorEthAddress, resourceType) => {
    const selectedIndex = selected.map((e) => e.id).indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, {
        id,
        creatorEthAddress,
        resourceType,
      });
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const claimResourceHandler = () => {
    // Remap resources to claim
    const resourcesToClaim = selected.map((resource) => {
      return {
        fhirResourceId: resource.id,
        resourceType: resource.resourceType,
        creatorEthAddress: resource.creatorEthAddress,
      };
    });

    dispatch(claimResource({ resources: resourcesToClaim }));

    setSelected([]);
  };

  const isSelected = (id) => selected.map((e) => e.id).indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - unclaimedResources.length)
      : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          tableTitle="Unclaimed Records"
          numSelected={selected.length}
          claimResourceHandler={claimResourceHandler}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 300 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <ResourcesTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={unclaimedResources.length}
              tableType="unclaimed"
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(unclaimedResources, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClick(
                          event,
                          row.id,
                          row.creatorEthAddress,
                          row.resourceType
                        )
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.resourceType}
                      </TableCell>
                      <TableCell align="left">
                        {row.creatorEthAddress}
                      </TableCell>
                      <TableCell align="left">{row.createdTime}</TableCell>
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
          count={unclaimedResources.length}
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
