import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  InputLabel,
  Box
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const CreationModal = props => {
  const [state, setstate] = useState(props.state);
  const handleChange = (e, key) => {
    setstate(state => ({
      ...state,
      [key]: e.target.value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.handleSubmit(state);
    // to clear inputs
    setstate(props.state);
    props.handleClose();
  };

  function handleModalBody(type, data = null) {
    let body;
    switch (type) {
      case "Category":
        body = (
          <>
            <TextField
              label="name"
              value={state.name}
              onChange={e => handleChange(e, "name")}
              autoComplete="off"
              autoFocus
              margin="dense"
              fullWidth
              required
            />
            <TextField
              label="details"
              value={state.details}
              onChange={e => handleChange(e, "details")}
              autoComplete="off"
              margin="dense"
              fullWidth
              required
            />
          </>
        );

        break;
      case "Subcategory":
        body = (
          <>
            <TextField
              label="name"
              value={state.name}
              autoComplete="off"
              onChange={e => handleChange(e, "name")}
              autoFocus
              margin="dense"
              fullWidth
              required
            />
            <Typography>{`Add subcategory to ${props.data} `}</Typography>
          </>
        );
        break;
      case "Tag":
        body = (
          <TextField
            label="name"
            value={state.name}
            onChange={e => handleChange(e, "name")}
            autoComplete="off"
            autoFocus
            margin="dense"
            fullWidth
            required
          />
        );
        break;
      case "User":
        body = (
          <>
            <TextField
              label="Username"
              value={state.username}
              onChange={e => handleChange(e, "username")}
              autoComplete="off"
              margin="dense"
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={state.email}
              onChange={e => handleChange(e, "email")}
              autoComplete="off"
              margin="dense"
              fullWidth
              required
            />
            <TextField
              label="Passsword"
              type="password"
              autoComplete="current-password"
              value={state.password}
              onChange={e => handleChange(e, "password")}
              margin="dense"
              fullWidth
              required
            />
            <TextField
              label="Confirm password"
              autoComplete="current-password"
              type="password"
              value={state.confirmation}
              onChange={e => handleChange(e, "confirmation")}
              margin="dense"
              fullWidth
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.isAdmin}
                  onChange={e => {
                    setstate(state => ({
                      ...state,
                      isAdmin: e.target.checked
                    }));
                  }}
                  name="isAdmin"
                />
              }
              label="isAdmin"
            />
          </>
        );
        break;
      case "Product":
        body = (
          <>
            <TextField
              label="Name"
              value={state.name}
              onChange={e => handleChange(e, "name")}
              autoComplete="off"
              margin="dense"
              fullWidth
              required
            />
            <TextField
              label="description"
              value={state.desc}
              onChange={e => handleChange(e, "desc")}
              autoComplete="off"
              margin="dense"
              fullWidth
              required
            />
            <TextField
              label="Price"
              type="number"
              value={state.price}
              onChange={e => handleChange(e, "price")}
              autoComplete="off"
              margin="dense"
              fullWidth
              required
            />

            <InputLabel htmlFor="file" style={{ margin: "15px 0 5px" }}>
              Image
            </InputLabel>
            <input
              type="file"
              id="file"
              onChange={e =>
                setstate(state => ({
                  ...state,
                  imageURL: e.target.files[0]
                }))
              }
            />
            <InputLabel htmlFor="category" style={{ margin: "25px 0 5px" }}>
              Category
            </InputLabel>
            <Select
              style={{ width: "100%" }}
              native
              value={state.categoryID}
              onChange={e => handleChange(e, "categoryID")}
              inputProps={{
                id: "category"
              }}
            >
              <option aria-label="None" value="" />
              {props.data.categories &&
                props.data.categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </Select>
            <InputLabel htmlFor="subcategory" style={{ margin: "25px 0 5px" }}>
              Subcategory
            </InputLabel>
            <Select
              style={{ width: "100%" }}
              native
              value={state.subCategoryID}
              onChange={e => handleChange(e, "subCategoryID")}
              inputProps={{
                id: "subcategory"
              }}
            >
              <option aria-label="None" value="" />
              {state.categoryID &&
                props.data.categories.map(cat =>
                  cat._id === state.categoryID
                    ? cat.subCategories.map(sub => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))
                    : null
                )}
            </Select>
            <Box border={1} borderColor="grey.500" padding={1}>
              <Typography>Tags</Typography>
              {props.data.tags.map(tag => (
                <FormControlLabel
                  key={tag._id}
                  control={
                    <Checkbox
                      checked={state.tags.includes(tag._id)}
                      onChange={e => {
                        setstate(state => ({
                          ...state,
                          tags: state.tags.includes(tag._id)
                            ? [...state.tags.filter(t => t !== tag._id)]
                            : [...state.tags.concat(tag._id)]
                        }));
                      }}
                    />
                  }
                  label={tag.name}
                />
              ))}
            </Box>
          </>
        );
        break;

      default:
        break;
    }
    return body;
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={e => handleSubmit} encType="multipart/form-data">
        <DialogTitle>{`New ${props.type}`}</DialogTitle>
        <DialogContent>{handleModalBody(props.type)}</DialogContent>
        <DialogActions style={{ margin: "18px 10px 10px" }}>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {`Create ${props.type}`}
          </Button>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreationModal;
