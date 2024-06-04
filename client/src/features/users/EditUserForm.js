import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "../auth/theme";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  Fab,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetGroupsQuery } from "../groups/groupsApiSlice";

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user.role);
  const [group, setGroup] = useState("");

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRole("");
      //go back
      navigate(-1);
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const handleGroupChange = (e) => setGroup(e.target.value);
  const onRoleChanged = (e) => setRole(e.target.value);


  const { data: groupsData, isLoading: isGroupsLoading } =
    useGetGroupsQuery("groupsList");
  const groupOptions = groupsData?.ids.map((id) => {
    const group = groupsData.entities[id];
    return (
      <MenuItem key={group.id} value={group.id}>
        {group.name}
      </MenuItem>
    );
  });

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (password) {
      await updateUser({
        id: user.id,
        username,
        password,
        role,
        groupId: role === "student" ? group : null,
      });
    } else {
      await updateUser({
        id: user.id,
        username,
        role,
        groupId: role === "student" ? group : null,
      });
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  let canSave = [role].every(Boolean) && !isLoading;

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Edit User
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={onSaveUserClicked}
            sx={{ mt: "8px" }}
          >
            <TextField
              autoFocus
              id="username"
              name="username"
              label="Username"
              margin="normal"
              required
              fullWidth
              value={username}
              onChange={onUsernameChanged}
            />
            <TextField
              id="password"
              label="Password"
              name="password"
              type="password"
              margin="normal"
              fullWidth
              value={password}
              onChange={onPasswordChanged}
            />
            <Select
              fullWidth
              label="Role"
              id="role"
              name="role"
              value={role}
              onChange={onRoleChanged}
              sx={{ mt: 2 }}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </Select>
            {role === "student" && (
              <>
                <InputLabel id="select-group">Group</InputLabel>
                <Select
                  labelId="select-group"
                  id="groupSel"
                  value={group}
                  label="Group"
                  onChange={handleGroupChange}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ marginTop: "24px" }}
                >
                  {groupOptions}
                </Select>
              </>
            )}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={10}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!canSave}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Fab
                  color="secondary"
                  aria-label="delete"
                  size="small"
                  onClick={onDeleteUserClicked}
                >
                  <DeleteIcon />
                </Fab>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EditUserForm;
