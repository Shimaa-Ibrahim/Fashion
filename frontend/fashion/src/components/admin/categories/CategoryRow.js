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
  Button,
  Chip
} from "@material-ui/core";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Delete,
  Edit,
  AddBox
} from "@material-ui/icons";

import CreationModal from "../CreationModal";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      borderBottom: "unset"
    }
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
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState({
    id: row._id,
    name: row.name,
    details: row.details
  });
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e, key) => {
    setCategory(cat => ({
      ...cat,
      [key]: e.target.value
    }));
  };

  const handleUpdate = e => {
    e.preventDefault();
    props.handleUpdate(category);
    setOpenUpdate(false);
  };

  const handleSubmit = subcategory => {
    props.handleSubmit(subcategory, true);
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
          {row.name}
        </TableCell>
        <TableCell>{row.details}</TableCell>
        <TableCell align="center">
          <Box className={classes.chip}>
            {row.subCategories && row.subCategories.length > 0
              ? row.subCategories.map((sub, i) => (
                  <Chip
                    label={sub.name}
                    key={i}
                    onDelete={() => props.handleDelete(sub._id, true)}
                    color="primary"
                    variant="outlined"
                  />
                ))
              : "No Subcategories"}
          </Box>
        </TableCell>
        <TableCell align="right">
          <IconButton size="small" onClick={() => props.handleDelete(row._id)}>
            <Delete color="error" />
          </IconButton>
        </TableCell>
        <TableCell />
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openUpdate} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <form onSubmit={e => handleUpdate(e)}>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    <TableRow className={classes.root}>
                      <TableCell>
                        <TextField
                          label="name"
                          value={category.name}
                          onChange={e => handleChange(e, "name")}
                          autoComplete="off"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="details"
                          value={category.details}
                          onChange={e => handleChange(e, "details")}
                          autoComplete="off"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<AddBox />}
                          variant="outlined"
                          color="primary"
                          onClick={handleOpen}
                        >
                          new subcategory
                        </Button>
                      </TableCell>
                      <TableCell>
                        <IconButton type="submit">
                          <Edit color="action" />
                        </IconButton>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </form>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <CreationModal
        open={open}
        handleClose={handleClose}
        type="Subcategory"
        handleSubmit={handleSubmit}
        state={{ name: "", categoryID: row._id }}
        data={row.name}
      />
    </>
  );
};

export default CategoryRow;
