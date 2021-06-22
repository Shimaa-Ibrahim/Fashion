import { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { TextField, Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Alert, AlertTitle } from "@material-ui/lab";

import { UserContext } from "../../App";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      padding: "0",
      width: "85%"
    }
  },
  box: {
    width: "30%",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    margin: "2.5em auto",
    textAlign: "center"
  },
  center: {
    width: "100%",
    fontSize: "4em",
    margin: "18px auto 5px"
  },

  btn: {
    margin: "20px auto 25px"
  }
}));

const Login = props => {
  const classes = useStyles();
  const message = props.location.state ? props.location.state.message : null;
  const { user } = useContext(UserContext);
  const [email, setemail] = useState({
    value: "",
    error: false,
    helper: ""
  });
  const [password, setPassword] = useState({
    value: "",
    error: false,
    helper: ""
  });

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/users/login", {
        email: email.value,
        password: password.value
      })
      .then(res => {
        console.log(res.data);
        const { token, userID, isAdmin } = res.data;
        //store data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("id", userID);
        localStorage.setItem("isAdmin", isAdmin);
        user.setUser({
          token,
          id: userID,
          isAdmin
        });
      })
      .catch(err => {
        console.log(err.response, err);
        const { data } = err.response ? err.response.data : "";
        const { message } = err.response ? err.response.data : "";

        if (data === "email") {
          setemail({
            value: "",
            error: true,
            helper: message
          });
        } else if (data === "password") {
          setPassword({
            value: "",
            error: true,
            helper: message
          });
        }
      });
  };

  return (
    <>
      {message && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Success Alert - <strong>{message}</strong>
        </Alert>
      )}

      <form className={classes.root} onSubmit={e => handleSubmit(e)}>
        <Box className={classes.box}>
          <AccountCircle className={classes.center} color="primary" />
          {props.match.path === "/admin/login" && (
            <Typography variant="h6" display="inline" color="primary">
              ADMIN DASHBOARD
            </Typography>
          )}
          <TextField
            required
            label="Email"
            type="email"
            name="email"
            autoComplete="off"
            value={email.value}
            onChange={e =>
              setemail({ value: e.target.value, error: false, helper: "" })
            }
            error={email.error}
            helperText={email.helper}
          />

          <TextField
            required
            label="Password"
            type="password"
            autoComplete="current-password"
            name="password"
            value={password.value}
            onChange={e =>
              setPassword({ value: e.target.value, error: false, helper: "" })
            }
            error={password.error}
            helperText={password.helper}
          />

          <Button
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            className={classes.btn}
          >
            Login
          </Button>
        </Box>
      </form>
    </>
  );
};

export default withRouter(Login);
