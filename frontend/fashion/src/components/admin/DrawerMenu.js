import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  Button,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import { MenuOpen, FeaturedPlayList, Dashboard } from "@material-ui/icons";

import { links } from "./Dashboard";

const useStyles = makeStyles({
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  }
});

const DrawerMenu = () => {
  const classes = useStyles();
  const [state, setState] = useState({ left: false });

  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = anchor => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button>
          <ListItemIcon>
            <MenuOpen />
          </ListItemIcon>
          <ListItemText primary="MENU" />
        </ListItem>
      </List>

      <Divider />
      <ListItem button>
        <ListItemIcon>
          <Dashboard />
        </ListItemIcon>
        <Link
          to="/admin/dashboard"
          style={{ textDecoration: "none", color: "black" }}
        >
          <ListItemText primary="DASHBOARD" />
        </Link>
      </ListItem>
      <Divider />
      <List>
        {links.map(e => (
          <ListItem button key={e.cat}>
            <ListItemIcon>
              <e.component />
            </ListItemIcon>
            <Link
              to={`/admin/list/${e.cat}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemText primary={e.cat} />
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <>
        <Button onClick={toggleDrawer("left", true)}>
          <FeaturedPlayList style={{ color: "#1565c0" }} fontSize="large" />
        </Button>
        <Drawer
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </>
    </div>
  );
};

export default DrawerMenu;
