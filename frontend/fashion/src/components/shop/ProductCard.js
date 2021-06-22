import { useState, useContext } from "react";
import { UserContext } from "../../App";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Button,
  Typography,
  Box,
  Collapse,
  Chip
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import {
  ExpandMore,
  ShoppingCart,
  RemoveShoppingCart
} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  container: {
    width: "85%",
    margin: "70px auto"
  },
  root: {
    maxWidth: 345,
    width: "30%",
    margin: "30px",
    alignItems: "stretch"
  },
  chip: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    }
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

const ProductCard = props => {
  const {
    user: { user },
    cart: { cart, setCart },
    filter: { setFilter }
  } = useContext(UserContext);
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const { product } = props;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCart = product => {
    setCart(
      cart.some(prod => prod._id === product._id)
        ? cart.filter(prod => prod._id !== product._id)
        : cart.concat({ ...product, quantity: 1 })
    );
  };

  const handleFilter = (type, id) => {
    setFilter(`filter=${type}:${id}`);
  };

  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              P
            </Avatar>
          }
          title={product.name.toUpperCase()}
          subheader={"price: $" + product.price.toFixed(2)}
        />
        <CardMedia
          className={classes.media}
          image={`http://localhost:4000/${product.imageURL}`}
          title={product.name}
        />
        <CardContent>
          <Box className={classes.chip}>
            {product.tags.map(tag => (
              <Chip
                key={tag._id}
                label={tag.name}
                component="a"
                clickable
                onClick={() => handleFilter("tags", tag._id)}
              />
            ))}
          </Box>
        </CardContent>
        <CardActions disableSpacing>
          {user.id ? (
            <Button
              size="small"
              color={
                cart.some(prod => prod._id === product._id)
                  ? "secondary"
                  : "primary"
              }
              startIcon={
                cart.some(prod => prod._id === product._id) ? (
                  <RemoveShoppingCart />
                ) : (
                  <ShoppingCart />
                )
              }
              onClick={() => handleCart(product)}
            >
              {cart.some(prod => prod._id === product._id)
                ? "Remove from Cart"
                : " Add To Cart"}
            </Button>
          ) : (
            "More Details"
          )}
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMore />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Details:</Typography>
            <Typography paragraph>
              {"Price: $" + product.price.toFixed(2)}
              <br />
              Category:{" "}
              <span
                onClick={() =>
                  handleFilter("categoryID", product.categoryID._id)
                }
              >
                {product.categoryID.name}
              </span>
              <br />
              Subcategory:{" "}
              <span
                onClick={() =>
                  handleFilter("subCategoryID", product.subCategoryID._id)
                }
              >
                {product.subCategoryID.name}
              </span>
            </Typography>
            <Typography paragraph>{product.desc}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};
export default ProductCard;
