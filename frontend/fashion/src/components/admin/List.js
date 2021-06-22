import { Route } from "react-router-dom";
import DrawerMenu from "./DrawerMenu";
import Users from "./users/Users";
import Categories from "./categories/Categories";
import Products from "./products/Products";
import Tags from "./tags/Tags";
import { Box } from "@material-ui/core";

const List = props => {
  return (
    <>
      <DrawerMenu />
      <Box width="80%" margin="auto">
        <Route path="/admin/list/Users" component={Users} />
        <Route path="/admin/list/Categories" component={Categories} />
        <Route path="/admin/list/Products" component={Products} />
        <Route path="/admin/list/Tags" component={Tags} />
      </Box>
    </>
  );
};

export default List;
