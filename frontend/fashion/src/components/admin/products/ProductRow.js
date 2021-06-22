import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  InputLabel,
  Select,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Chip
} from "@material-ui/core";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Delete,
  Edit
} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      borderBottom: "unset"
    }
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  input: {
    width: "48%",
    display: "inline-block",
    margin: "10px"
  },
  select: {
    width: "100%",
    margin: "12px 0"
  },
  chip: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    }
  }
}));

const CategoryRow = props => {
  const classes = useStyles();
  const { row } = props;
  const [openUpdate, setOpenUpdate] = useState(false);
  const [product, setProduct] = useState({
    id: row._id,
    name: row.name,
    desc: row.desc,
    price: row.price,
    categoryID: row.categoryID._id,
    subCategoryID: row.subCategoryID._id,
    imageURL: "",
    tags: row.tags
  });

  const handleChange = (e, key) => {
    setProduct(prod => ({
      ...prod,
      [key]: e.target.value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newProduct = {
      ...product,
      tags: product.tags.map(tag => tag._id)
    };
    props.handleSubmit(newProduct, true);
    setOpenUpdate(false);
  };

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell width={1}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenUpdate(!openUpdate)}
          >
            {openUpdate ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Avatar
            className={classes.large}
            alt={row.name}
            src={`http://localhost:4000/${row.imageURL}`}
          />
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>
          {row.desc.length > 16 ? row.desc.substr(0, 16) + "..." : row.desc}
        </TableCell>
        <TableCell>{row.price}</TableCell>
        <TableCell>{row.categoryID.name}</TableCell>
        <TableCell>{row.subCategoryID.name}</TableCell>
        <TableCell align="center">
          <Box className={classes.chip}>
            {row.tags && row.tags.length > 0
              ? row.tags.map((tag, i) => (
                  <Chip
                    label={tag.name}
                    key={i}
                    onDelete={() =>
                      props.handleTagsModification({
                        id: row._id,
                        tagID: tag._id
                      })
                    }
                    color="primary"
                    variant="outlined"
                  />
                ))
              : null}
          </Box>
        </TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => props.handleDelete(row._id)}>
            <Delete color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={openUpdate} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <form onSubmit={e => handleSubmit(e)}>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    <TableRow className={classes.root}>
                      {/*edit form */}
                      <TableCell>
                        <Box align="center">
                          <TextField
                            className={classes.input}
                            label="Name"
                            value={product.name}
                            onChange={e => handleChange(e, "name")}
                            autoComplete="off"
                            margin="dense"
                            fullWidth
                            required
                          />
                          <TextField
                            className={classes.input}
                            label="description"
                            value={product.desc}
                            onChange={e => handleChange(e, "desc")}
                            autoComplete="off"
                            margin="dense"
                            fullWidth
                            required
                          />
                          <TextField
                            className={classes.input}
                            label="Price"
                            type="number"
                            value={product.price}
                            onChange={e => handleChange(e, "price")}
                            autoComplete="off"
                            margin="dense"
                            fullWidth
                            required
                          />
                          <TextField
                            className={classes.input}
                            label="Image"
                            type="file"
                            id="file"
                            onChange={e =>
                              setProduct(state => ({
                                ...state,
                                imageURL: e.target.files[0]
                              }))
                            }
                          />
                          <Box className={classes.input}>
                            <InputLabel
                              htmlFor="category"
                              style={{ margin: "25px 0 5px" }}
                            >
                              Category
                            </InputLabel>
                            <Select
                              className={classes.select}
                              native
                              value={product.categoryID}
                              onChange={e => handleChange(e, "categoryID")}
                              inputProps={{
                                id: "category"
                              }}
                            >
                              <option aria-label="None" value="" />
                              {props.categories &&
                                props.categories.map(cat => (
                                  <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                  </option>
                                ))}
                            </Select>
                          </Box>
                          <Box className={classes.input}>
                            <InputLabel
                              htmlFor="subcategory"
                              style={{ margin: "25px 0 5px" }}
                            >
                              Subcategory
                            </InputLabel>
                            <Select
                              className={classes.select}
                              native
                              value={product.subCategoryID}
                              onChange={e => handleChange(e, "subCategoryID")}
                              inputProps={{
                                id: "subcategory"
                              }}
                            >
                              <option aria-label="None" value="" />
                              {row.categoryID &&
                                props.categories.map(cat =>
                                  cat._id === product.categoryID
                                    ? cat.subCategories.map(sub => (
                                        <option key={sub._id} value={sub._id}>
                                          {sub.name}
                                        </option>
                                      ))
                                    : null
                                )}
                            </Select>
                          </Box>
                          <Box
                            border={1}
                            borderColor="grey.500"
                            padding={1}
                            margin={3}
                          >
                            <Typography>Tags</Typography>
                            {props.tags.map(tag => (
                              <FormControlLabel
                                key={tag._id}
                                control={
                                  <Checkbox
                                    checked={product.tags.some(
                                      t => t._id === tag._id
                                    )}
                                    onChange={e => {
                                      setProduct(product => ({
                                        ...product,
                                        tags: e.target.checked
                                          ? [...product.tags.concat(tag)]
                                          : [
                                              ...product.tags.filter(
                                                t => t._id !== tag._id
                                              )
                                            ]
                                      }));
                                    }}
                                  />
                                }
                                label={tag.name}
                              />
                            ))}
                          </Box>
                          <Button
                            type="submit"
                            variant="contained"
                            color="default"
                            size="small"
                            className={classes.btn}
                            startIcon={<Edit />}
                          >
                            Edit product
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </form>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CategoryRow;
