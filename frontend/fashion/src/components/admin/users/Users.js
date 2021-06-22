import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  Button,
  Typography
} from "@material-ui/core";
import { AddBox, AlarmOff, AlarmOn } from "@material-ui/icons";

import { UserContext } from "../../../App";
import TablePaginationActions from "../../TablePaginationActions";
import CreationModal from "../CreationModal";

const useStyles = makeStyles({
  table: {
    minWidth: 500
  },
  title: {
    fontWeight: "bolder",
    fontSize: "larger",
    color: "black"
  }
});

const Users = props => {
  const classes = useStyles();
  const {
    user: { user }
  } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/users/all", {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(res => setUsers(res.data.users))
      .catch(err => console.log(err));
  }, [user.token]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = newUser => {
    axios
      .post("http://localhost:4000/users/addUser", newUser, {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(({ data: { user } }) => {
        setUsers(users.concat(user));
      })
      .catch(err => console.log(err));
  };

  const handleActivation = id => {
    axios
      .get(`http://localhost:4000/users/disable/${id}`, {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(({ data: { user } }) => {
        setUsers(users.map(u => (u._id === user._id ? (u = user) : u)));
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ width: "85%", margin: "auto" }}
      >
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={4} className={classes.title}>
                USERS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>USERNAME</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">ADMIN</TableCell>
              <TableCell align="right">
                <Typography style={{ marginRight: "55px" }}>ACTIVE</Typography>
              </TableCell>
            </TableRow>
            {(rowsPerPage > 0
              ? users.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : users
            ).map(u => (
              <TableRow key={u._id}>
                <TableCell>{u.username}</TableCell>
                <TableCell> {u.email}</TableCell>
                <TableCell align="right">
                  {u.isAdmin ? "Admin" : "User"}
                </TableCell>
                <TableCell align="right">
                  {user.id !== u._id && (
                    <Button
                      size="small"
                      variant="contained"
                      color={u.isActive ? "secondary" : "default"}
                      startIcon={u.isActive ? <AlarmOff /> : <AlarmOn />}
                      style={{ marginRight: "20px" }}
                      onClick={() => handleActivation(u._id)}
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell align="left">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddBox />}
                  onClick={handleOpen}
                >
                  Add User
                </Button>
              </TableCell>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <CreationModal
        open={open}
        handleClose={handleClose}
        type="User"
        handleSubmit={handleSubmit}
        state={{
          username: "",
          email: "",
          password: "",
          confirmation: "",
          isAdmin: false
        }}
      />
    </>
  );
};

export default Users;
