import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { Toolbar, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import CheckCircle from "@mui/icons-material/CheckCircle";

const PendingTableToolbar = (props) => {
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
        <Tooltip title="Approve">
          <IconButton onClick={props.approveRequestHandler}>
            <CheckCircle />
          </IconButton>
        </Tooltip>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={props.deleteRequestHandler}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

PendingTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default PendingTableToolbar;
