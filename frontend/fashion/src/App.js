import { useState } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import React from "react";

import Nav from "./components/Nav";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Home from "./components/shop/Home";
import Dashboard from "./components/admin/Dashboard";
import List from "./components/admin/List";
import Orders from "./components/shop/Orders";
import Cart from "./components/shop/Cart";

export const UserContext = React.createContext();

const App = () => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const isAdmin = localStorage.getItem("isAdmin");
  const [filter, setFilter] = useState("");
  const [user, setUser] = useState({
    token,
    id,
    isAdmin
  });
  const [cart, setCart] = useState([]);
  // const referrer = props.location.state ? props.location.state.referrer : "/";
  return (
    <UserContext.Provider
      value={{
        user: {
          user,
          setUser
        },
        cart: {
          cart,
          setCart
        },
        filter: {
          filter,
          setFilter
        }
      }}
    >
      <div className="App">
        <Nav />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/register">
            {user.id ? <Redirect to="/" /> : <Register />}
          </Route>
          <Route path={["/login", "/admin/login"]}>
            {user.id ? <Redirect to="/" /> : <Login />}
          </Route>

          <Route path="/products" component={Home} />
          <Route path="/orders">
            {user.id ? <Orders /> : <Redirect to="/" />}
          </Route>
          <Route path="/cart">{user.id ? <Cart /> : <Redirect to="/" />}</Route>

          <Route path="/admin/dashboard">
            {user.isAdmin ? <Dashboard /> : <Redirect to="/" />}
          </Route>
          <Route path="/admin/list">
            {user.isAdmin ? <List /> : <Redirect to="/" />}
          </Route>
        </Switch>
      </div>
    </UserContext.Provider>
  );
};

export default withRouter(App);
