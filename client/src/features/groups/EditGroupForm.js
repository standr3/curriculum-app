import { useState, useEffect } from "react";
import {
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} from "./groupsApiSlice";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Paper,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const GROUP_REGEX = /^[a-zA-Z0-9_.-]{3,20}$/;

const EditGroupForm = ({ group }) => {
  const [updateGroup, { isLoading, isSuccess, isError, error }] =
    useUpdateGroupMutation();

  const [
    deleteGroup,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteGroupMutation();

  const navigate = useNavigate();

  const [name, setName] = useState(group.name);
  const [validName, setValidName] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    setValidName(GROUP_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setName("");
      navigate("/dash/groups");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);

  const onSaveGroupClicked = async () => {
    await updateGroup({ id: group.id, name });
    setOpenSnackbar(true);
  };

  const onDeleteGroupClicked = async () => {
    await deleteGroup({ id: group.id });
    setOpenSnackbar(true);
  };

  let canSave = [validName].every(Boolean) && !isLoading;

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Edit Group
        </Typography>

        {errContent && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errContent}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Group Name"
            variant="outlined"
            value={name}
            onChange={onNameChanged}
            error={!validName && name !== ""}
            helperText={
              !validName && name !== ""
                ? "Group name must be 3-20 characters long"
                : ""
            }
            required
          />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={onSaveGroupClicked}
              disabled={!canSave}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDeleteGroupClicked}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Operation successful!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditGroupForm;
