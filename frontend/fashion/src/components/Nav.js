import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Box, Typography, Toolbar, AppBar } from "@material-ui/core";

import { UserContext } from "../App";

const useStyles = makeStyles(theme => ({
  box: {
    flexGrow: 1
  },
  title: {
    fontWeight: "bold"
  },
  bg: {
    backgroundColor: "#1565c0"
  },
  link: {
    textDecoration: "none",
    color: "white"
  },
  active: {
    fontWeight: "bold"
  }
}));

const Nav = props => {
  const classes = useStyles();
  const {
    user: { user, setUser },
    filter: { setFilter }
  } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("isAdmin");
    setUser({});
  };

  return (
    <AppBar position="static" className={classes.bg}>
      <Toolbar>
        <Box className={classes.box}>
          <Typography variant="h5" display="inline" className={classes.title}>
            Fashion &nbsp; &nbsp;
          </Typography>
          {user.isAdmin && (
            <Button color="inherit">
              <NavLink
                to="/admin/dashboard"
                className={classes.link}
                activeClassName={classes.active}
              >
                admin dashboard
              </NavLink>
            </Button>
          )}
          <Button color="inherit">
            <NavLink
              to="/products"
              className={classes.link}
              activeClassName={classes.active}
              onClick={() => setFilter(null)}
            >
              Products
            </NavLink>
          </Button>
          {user.id ? (
            <>
              <Button color="inherit">
                <NavLink
                  to="/cart"
                  className={classes.link}
                  activeClassName={classes.active}
                >
                  My Cart
                </NavLink>
              </Button>
              <Button color="inherit">
                <NavLink
                  to="/orders"
                  className={classes.link}
                  activeClassName={classes.active}
                >
                  orders
                </NavLink>
              </Button>
            </>
          ) : null}
        </Box>
        {user.id ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button color="inherit">
              <NavLink
                to="/register"
                className={classes.link}
                activeClassName={classes.active}
              >
                Register
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink
                to="/login"
                className={classes.link}
                activeClassName={classes.active}
              >
                Login
              </NavLink>
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
