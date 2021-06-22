import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

import { UserContext } from "../../App";
import ProductCard from "./ProductCard";
import CategoryTab from "./CategoryTab";

const useStyles = makeStyles(() => ({
  container: {
    width: "85%",
    margin: "70px auto"
  }
}));

const Home = () => {
  const {
    filter: { filter }
  } = useContext(UserContext);
  const classes = useStyles();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/products?${filter}`)
      .then(({ data: { products } }) => setProducts(products))
      .catch(err => console.log(err));
  }, [filter]);

  return (
    <>
      <CategoryTab />
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        className={classes.container}
      >
        {products.map(product => (
          <ProductCard
            className={classes.root}
            key={product._id}
            product={product}
          />
        ))}
      </Box>
    </>
  );
};
export default Home;
