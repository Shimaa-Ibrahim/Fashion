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
  Button
} from "@material-ui/core";
import { AddBox } from "@material-ui/icons";

import { UserContext } from "../../../App";
import TablePaginationActions from "../../TablePaginationActions";
import CategoryRow from "./CategoryRow";
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

const Categories = props => {
  const classes = useStyles();
  const {
    user: { user }
  } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, categories.length - page * rowsPerPage);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/categories")
      .then(res => setCategories(res.data.categories))
      .catch(err => console.log(err));
  }, []);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = (category, sub = false) => {
    const url = sub
      ? "http://localhost:4000/categories/addSubCategory"
      : "http://localhost:4000/categories/addCategory";
    axios
      .post(url, category, {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(({ data: { category } }) => {
        sub
          ? setCategories(
              categories.map(cat =>
                cat._id === category.categoryID
                  ? {
                      ...cat,
                      subCategories: cat.subCategories.concat(category)
                    }
                  : cat
              )
            )
          : setCategories(categories.concat(category));
      })
      .catch(err => console.log(err.response));
  };

  const handleUpdate = category => {
    axios
      .put("http://localhost:4000/categories/update", category, {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(({ data: { category } }) => {
        setCategories(
          categories.map(cat =>
            cat._id === category._id ? (cat = category) : cat
          )
        );
      })
      .catch(err => console.log(err.response));
  };

  const handleDelete = (id, subCategory = false) => {
    axios
      .delete(`http://localhost:4000/categories/delete/${id}`, {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(({ data: { category } }) => {
        let newCategories;
        if (subCategory) {
          newCategories = categories.map(cat => {
            if (cat._id === category.categoryID) {
              cat.subCategories = cat.subCategories.filter(
                sub => sub._id !== id
              );
            }
            return cat;
          });
        } else {
          newCategories = categories.filter(cat => cat._id !== id);
        }

        setCategories(newCategories);
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={6} className={classes.title}>
                CATEGORIES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>UBDATE</TableCell>
              <TableCell>NAME</TableCell>
              <TableCell>DETAILS</TableCell>
              <TableCell align="center">SUBCATEGORIES</TableCell>
              <TableCell align="right">DELETE</TableCell>
              <TableCell />
            </TableRow>
            {(rowsPerPage > 0
              ? categories.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : categories
            ).map(category => (
              <CategoryRow
                key={category._id}
                row={category}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                handleSubmit={handleSubmit}
              />
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell align="left" colSpan={2}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddBox />}
                  onClick={handleOpen}
                >
                  Add Category
                </Button>
              </TableCell>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={4}
                count={categories.length}
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
        type="Category"
        handleSubmit={handleSubmit}
        state={{ name: "", details: "" }}
      />
    </>
  );
};

export default Categories;
