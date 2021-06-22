import { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
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
  TextField,
  IconButton,
  Avatar,
  Button,
  Typography
} from "@material-ui/core";
import { Delete, ShoppingBasketSharp } from "@material-ui/icons";

import { UserContext } from "../../App";
import TablePaginationActions from "../TablePaginationActions";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 500
  },
  title: {
    fontWeight: "bolder",
    fontSize: "larger",
    color: "black"
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
}));

const Cart = () => {
  const classes = useStyles();
  const {
    user: { user },
    cart: { cart, setCart }
  } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [makeOrder, setMakeOrder] = useState(false);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, cart.length - page * rowsPerPage);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleQuantity = (e, id) => {
    setCart(
      cart.map(prod =>
        prod._id === id
          ? {
              ...prod,
              quantity: e.target.value
            }
          : prod
      )
    );
  };

  const handleDelete = id => {
    setCart(cart.filter(prod => prod._id !== id));
  };

  const countTotalPrice = cart => {
    return cart.reduce((accumulator, prod) => {
      return accumulator + prod.price * prod.quantity;
    }, 0);
  };

  const handleSubmit = () => {
    axios
      .post(
        "http://localhost:4000/orders/create",
        { products: cart },
        {
          headers: {
            Authorization: "Bearer " + user.token
          }
        }
      )
      .then(() => {
        setCart([]);
        setMakeOrder(true);
      })
      .catch(err => console.log(err));
  };

  return makeOrder ? (
    <Redirect to="/orders" />
  ) : (
    <>
      <TableContainer
        component={Paper}
        style={{ width: "65%", margin: "55px auto" }}
      >
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} className={classes.title}>
                My Cart
              </TableCell>
              <TableCell colSpan={2} align="right">
                <Button
                  variant="contained"
                  color="default"
                  onClick={handleSubmit}
                  startIcon={<ShoppingBasketSharp />}
                >
                  {" "}
                  Make Order
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>PRODUCT</TableCell>
              <TableCell>PRICE</TableCell>
              <TableCell>CATEGORY</TableCell>
              <TableCell>QUANTITY</TableCell>
              <TableCell>REMOVE</TableCell>
            </TableRow>
            {(rowsPerPage > 0
              ? cart.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : cart
            ).map(product => (
              <TableRow key={product._id}>
                <TableCell align="right">
                  <Avatar
                    className={classes.large}
                    alt={product.name}
                    src={`http://localhost:4000/${product.imageURL}`}
                  />
                </TableCell>
                <TableCell> {product.name}</TableCell>
                <TableCell> ${product.price}</TableCell>
                <TableCell>{product.categoryID.name}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={product.quantity}
                    onChange={e => handleQuantity(e, product._id)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(product._id)}
                    style={{ marginRight: "20px" }}
                  >
                    <Delete color="error" />
                  </IconButton>
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
                <Typography>
                  {`Total Price : ${countTotalPrice(cart)}`}
                </Typography>
              </TableCell>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={5}
                count={cart.length}
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
    </>
  );
};

export default Cart;
