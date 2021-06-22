import { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { TextField, Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      padding: "0",
      width: "85%"
    }
  },
  box: {
    width: "25%",
    border: "1px solid #e0e0e0",
    margin: "2em auto",
    textAlign: "center"
  },
  center: {
    width: "100%",
    fontSize: "4em",
    margin: "18px auto 0px"
  },

  btn: {
    margin: "20px auto 25px"
  }
}));

const Register = props => {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState({
    value: "",
    error: false,
    helper: ""
  });
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
  const [confirm, setConfirm] = useState({
    value: "",
    error: false,
    helper: ""
  });

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/users/register", {
        username: username.value,
        email: email.value,
        password: password.value,
        confirmation: confirm.value
      })
      .then(res => setSuccess(true))
      .catch(err => {
        console.log(err);
        err.response.data.data.forEach(error => {
          switch (error.param) {
            case "username":
              setUsername({
                value: error.value,
                error: true,
                helper: error.msg
              });
              break;

            case "email":
              setemail({
                value: error.value,
                error: true,
                helper: error.msg
              });
              break;

            case "password":
              setPassword({
                value: "",
                error: true,
                helper: error.msg
              });
              break;
            case "confirmation":
              setConfirm({
                value: "",
                error: true,
                helper: error.msg
              });
              break;
            default:
              break;
          }
        });
      });
  };

  return success ? (
    <Redirect
      to={{
        pathname: "/login",
        state: { message: "Congrats, your account created successfully." }
      }}
    />
  ) : (
    <>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={e => handleSubmit(e)}
      >
        <Box className={classes.box} boxShadow={2}>
          <AccountCircle className={classes.center} color="primary" />
          <TextField
            required
            label="Username"
            name="username"
            autoComplete="off"
            value={username.value}
            onChange={e =>
              setUsername({ value: e.target.value, error: false, helper: "" })
            }
            error={username.error}
            helperText={username.helper}
          />
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
          <TextField
            required
            label="Confirm password"
            type="password"
            autoComplete="current-password"
            name="confirmation"
            value={confirm.value}
            onChange={e =>
              setConfirm({ value: e.target.value, error: false, helper: "" })
            }
            error={confirm.error}
            helperText={confirm.helper}
          />
          <Button
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            className={classes.btn}
          >
            Sign Up
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Register;
