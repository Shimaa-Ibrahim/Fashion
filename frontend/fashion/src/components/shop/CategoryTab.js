import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Button, Divider } from "@material-ui/core";

import { UserContext } from "../../App";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  btn: {
    display: "block"
  }
}));

const CategoryTab = () => {
  const classes = useStyles();
  const {
    filter: { setFilter }
  } = useContext(UserContext);
  const [value, setValue] = useState(0);
  const [categories, setCategories] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/categories")
      .then(({ data: { categories } }) => setCategories(categories))
      .catch(err => console.log(err));
  }, []);

  const handleFilter = (type, id) => {
    setFilter(`filter=${type}:${id}`);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab {...a11yProps(0)} label="categories >" />
          {categories.map((cat, i) => (
            <Tab key={cat._id} {...a11yProps(i + 1)} label={cat.name} />
          ))}
        </Tabs>
      </AppBar>
      <Box boxShadow={2}>
        <TabPanel value={value} index={0} style={{ display: "none" }} />
        {categories.map((cat, i) => (
          <TabPanel key={i} value={value} index={i + 1}>
            <Button
              className={classes.btn}
              color="primary"
              onClick={() => handleFilter("categoryID", cat._id)}
            >
              {cat.name}
            </Button>
            {cat.subCategories.length > 0 && <Divider />}
            {cat.subCategories.map(sub => (
              <Button
                key={sub._id}
                className={classes.btn}
                onClick={() => handleFilter("subCategoryID", sub._id)}
              >
                {sub.name}
              </Button>
            ))}
          </TabPanel>
        ))}
      </Box>
    </div>
  );
};

export default CategoryTab;
