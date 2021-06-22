import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Button,
  Typography
} from "@material-ui/core";
import { AccountCircle, LocalOffer, Category, Store } from "@material-ui/icons";

export const links = [
  {
    cat: "Users",
    component: AccountCircle
  },
  {
    cat: "Categories",
    component: Category
  },
  {
    cat: "Products",
    component: Store
  },
  {
    cat: "Tags",
    component: LocalOffer
  }
];

const useStyles = makeStyles({
  root: {
    maxWidth: 450,
    margin: "30px",
    display: "inline-block"
  }
});

const DashBoard = props => {
  const classes = useStyles();
  return (
    <>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        margin="20px"
      >
        {links.map(element => (
          <Card className={classes.root} key={element.cat}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h1">
                  <element.component fontSize="large" /> {element.cat}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                <Link
                  to={`/admin/list/${element.cat}`}
                  style={{ textDecoration: "none" }}
                >
                  {element.cat} page
                </Link>
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default DashBoard;
