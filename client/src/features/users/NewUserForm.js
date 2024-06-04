import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice"; // Assumed to be available in your API slice
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
} from "@mui/material";

const NewUserForm = () => {
  const [createUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRole("");
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onRoleChanged = (e) => setRole(e.target.value);

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (username && password && role) {
      await createUser({ username, password, role });
    }
  };

  let canSave = [username, password, role].every(Boolean) && !isLoading;

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
            New User Form
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
              required
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
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </Select>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!canSave}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default NewUserForm;
