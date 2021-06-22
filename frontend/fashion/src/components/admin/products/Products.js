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
import ProductRow from "./ProductRow";
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

const Products = props => {
  const classes = useStyles();
  const {
    user: { user }
  } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchTags = () => {
    axios
      .get("http://localhost:4000/tags")
      .then(res => setTags(res.data.tags))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/products")
      .then(res => setProducts(res.data.products))
      .catch(err => console.log(err));
    fetchTags();
  }, []);

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

  const handleSubmit = (product, update = false) => {
    const formData = new FormData();
    Object.keys(product).forEach(key => {
      if (key === "tags") {
        formData.append("tags", JSON.stringify(product.tags));
      } else {
        formData.append(key, product[key]);
      }
    });

    const url = update
      ? "http://localhost:4000/products/update"
      : "http://localhost:4000/products/add";
    const method = update ? "PUT" : "POST";
    const headers = {
      Authorization: "Bearer " + user.token,
      "Content-Type": "multipart/form-data"
    };
    axios({
      url,
      method,
      data: formData,
      headers
    })
      .then(({ data: { product } }) => {
        console.log(product);
        update
          ? setProducts(
              products.map(prod =>
                prod._id === product._id ? (prod = product) : prod
              )
            )
          : setProducts(products.concat(product));
      })
      .catch(err => console.log(err));
  };

  const handleTagsModification = ids => {
    axios
      .patch("http://localhost:4000/products/modifyTags", ids, {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(({ data: { product } }) =>
        setProducts(
          products.map(prod =>
            prod._id === product._id ? (prod = product) : prod
          )
        )
      )
      .catch(err => console.log(err));
    fetchTags();
  };

  const handleDelete = id => {
    axios
      .delete(`http://localhost:4000/products/delete/${id}`, {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(({ data: { product } }) =>
        setProducts(products.filter(prod => prod._id !== product._id))
      )
      .catch(err => console.log(err));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={9} className={classes.title}>
                PRODUCTS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>UPDATE</TableCell>
              <TableCell></TableCell>
              <TableCell>NAME</TableCell>
              <TableCell>DESCRIPTION</TableCell>
              <TableCell>PRICE</TableCell>
              <TableCell>CATEGORY</TableCell>
              <TableCell>SUBCATEGORY</TableCell>
              <TableCell align="center">TAGS</TableCell>
              <TableCell>DELETE</TableCell>
            </TableRow>
            {(rowsPerPage > 0
              ? products.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : products
            ).map(product => (
              <ProductRow
                key={product._id}
                row={product}
                tags={tags}
                categories={categories}
                handleDelete={handleDelete}
                handleSubmit={handleSubmit}
                handleTagsModification={handleTagsModification}
              />
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={9} />
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
                  Add Product
                </Button>
              </TableCell>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={7}
                count={products.length}
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
        type="Product"
        handleSubmit={handleSubmit}
        state={{
          name: "",
          desc: "",
          price: 0,
          categoryID: "",
          subCategoryID: "",
          imageURL: "",
          tags: []
        }}
        data={{
          categories,
          tags
        }}
      />
    </>
  );
};

export default Products;
