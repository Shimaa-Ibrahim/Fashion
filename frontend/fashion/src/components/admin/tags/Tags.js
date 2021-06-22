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
  IconButton,
  TextField
} from "@material-ui/core";
import { AddBox, Delete, Edit } from "@material-ui/icons";

import { UserContext } from "../../../App";
import TablePaginationActions from "../../TablePaginationActions";
import CreationModal from "../CreationModal";

const useStyles = makeStyles({
  table: {
    minWidth: 200
  },
  title: {
    fontWeight: "bolder",
    fontSize: "larger",
    color: "black"
  }
});

const Tags = props => {
  const classes = useStyles();
  const {
    user: { user }
  } = useContext(UserContext);
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, tags.length - page * rowsPerPage);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/tags")
      .then(res => setTags(res.data.tags))
      .catch(err => console.log(err));
  }, []);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = tag => {
    axios
      .post("http://localhost:4000/tags/add", tag, {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(({ data: { tag } }) => {
        setTags(tags.concat(tag));
      })
      .catch(err => console.log(err));
  };

  const handleUpdate = e => {
    e.preventDefault();
    const tag = {
      id: e.target.elements.id.value,
      name: e.target.elements.name.value
    };
    axios
      .put("http://localhost:4000/tags/update", tag, {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(({ data: { tag } }) => {
        setTags(tags.map(t => (t._id === tag._id ? (t = tag) : t)));
      })
      .catch(err => console.log(err));
  };

  const handleDelete = id => {
    axios
      .delete(`http://localhost:4000/tags/delete/${id}`, {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(({ data: { tag } }) => {
        setTags(tags.filter(t => t._id !== tag._id));
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ width: "70%", margin: "auto" }}
      >
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={3} className={classes.title}>
                TAGS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>NAME</TableCell>
              <TableCell align="right">DELETE</TableCell>
            </TableRow>
            {(rowsPerPage > 0
              ? tags.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : tags
            ).map(tag => (
              <TableRow key={tag._id}>
                <TableCell colSpan={2}>
                  <form onSubmit={e => handleUpdate(e)}>
                    <input type="hidden" value={tag._id} name="id" />
                    <TextField
                      name="name"
                      defaultValue={tag.name}
                      required
                      display="inline"
                    />
                    <IconButton size="small" type="submit">
                      <Edit color="action" />
                    </IconButton>
                  </form>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(tag._id)}
                    style={{ marginRight: "20px" }}
                  >
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={3} />
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
                  Add Tag
                </Button>
              </TableCell>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={2}
                count={tags.length}
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
        type="Tag"
        handleSubmit={handleSubmit}
        state={{ name: "" }}
      />
    </>
  );
};

export default Tags;
