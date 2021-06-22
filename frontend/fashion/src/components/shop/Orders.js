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
  Paper
} from "@material-ui/core";

import { UserContext } from "../../App";
import TablePaginationActions from "../TablePaginationActions";

const useStyles = makeStyles(theme => ({
  tableContainer: {
    width: "75%",
    margin: "55px auto"
  },
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

const Orders = () => {
  const classes = useStyles();
  const {
    user: { user }
  } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orders, setOrders] = useState([]);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);

  useEffect(() => {
    axios
      .get("http://localhost:4000/orders", {
        headers: {
          Authorization: "Bearer " + user.token
        }
      })
      .then(({ data: { orders } }) => setOrders(orders))
      .catch(err => console.log(err));
  }, [user.token]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={3} className={classes.title}>
                My Orders
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="center">ORDER DETAILS</TableCell>
              <TableCell align="center">TOTAL PRICE</TableCell>
            </TableRow>
            {(rowsPerPage > 0
              ? orders.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : orders
            ).map(order => (
              <TableRow key={order._id}>
                <TableCell> {order.createdAt.split("", 10)}</TableCell>
                <TableCell align="center">
                  <Table border={1} borderColor="gray" >
                    <TableHead>
                      <TableRow>
                        <TableCell size="small">Product</TableCell>
                        <TableCell size="small">price</TableCell>
                        <TableCell size="small">Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.products.map(product => (
                        <TableRow key={product._id}>
                          <TableCell size="small">{product.name}</TableCell>
                          <TableCell size="small">{product.price}</TableCell>
                          <TableCell size="small">{product.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
                <TableCell align="center">${order.total}</TableCell>
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
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={orders.length}
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

export default Orders;
