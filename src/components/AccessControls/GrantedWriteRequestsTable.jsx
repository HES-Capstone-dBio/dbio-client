import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { useSelector, useDispatch } from "react-redux";
import { accessControlSelector } from "../../store/AccessControlSlice";
import { updateWriteRequest } from "../../actions/AccessControlActions";
import { getComparator, stableSort } from "../../Utils/TableUtils";
import GrantedTableHead from "./GrantedTableHead";
import GrantedTableToolbar from "./GrantedTableToolbar";
import { accessControlActions } from "../../store/AccessControlSlice";
import showSnackbar from "../UI/Snackbar/Snackbar";

const GrantedWriteRequestsTable = () => {
  const dispatch = useDispatch();
  const {
    grantedWriteRequests,
    isError: accessControlError,
    errorMessage: accessControlErrorMessage,
  } = useSelector(accessControlSelector);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("createdTime");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (accessControlError) {
      showSnackbar(`${accessControlErrorMessage}`, "error");
      // Clear error state
      dispatch(accessControlActions.clearCurrentErrorState());
    }
  }, [accessControlError, accessControlErrorMessage, dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = grantedWriteRequests.map((n) => {
        return { id: n.id, ethAddress: n.ethAddress };
      });
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id, ethAddress) => {
    const selectedIndex = selected.map((e) => e.id).indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, { id, ethAddress });
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

  const deleteRequestHandler = () => {
    dispatch(updateWriteRequest({ requests: selected, approve: false }));
    setSelected([]);
  };

  const isSelected = (id) => selected.map((e) => e.id).indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - grantedWriteRequests.length)
      : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <GrantedTableToolbar
          tableTitle="Granted Write Requests"
          numSelected={selected.length}
          deleteRequestHandler={deleteRequestHandler}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 300 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <GrantedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={grantedWriteRequests.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(grantedWriteRequests, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClick(event, row.id, row.ethAddress)
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
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.ethAddress}</TableCell>
                      <TableCell align="left">
                        {new Date(row.createdTime).toLocaleString(undefined, {
                          timeStyle: "short",
                          dateStyle: "short",
                        })}
                      </TableCell>
                      <TableCell align="left">
                        {new Date(row.grantedTime).toLocaleString(undefined, {
                          timeStyle: "short",
                          dateStyle: "short",
                        })}
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
          count={grantedWriteRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default GrantedWriteRequestsTable;
