import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
// const USER_REGEX = /^[A-z]{3,20}$/;
// const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

import { Fab, Menu, Select, ThemeProvider } from "@mui/material";
import theme from "../auth/theme";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { FormControlLabel, Checkbox } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";

const EditUserForm = ({ user }) => {
  // alert(user.username + " " + user.role);
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  // const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  // const [validPassword, setValidPassword] = useState(false);
  const [role, setRole] = useState(user.role);

  // useEffect(() => {
  //   setValidUsername(username);
  //   // setValidUsername(USER_REGEX.test(username));
  // }, [username]);

  // useEffect(() => {
  //   setValidPassword(password);
  //   // setValidPassword(PWD_REGEX.test(password));
  // }, [password]);

  console.log("OUT- isSuccess: ", isSuccess);
  console.log("OUT- isLoad: ", isLoading);
  useEffect(() => {
    console.log("IN- isSuccess: ", isSuccess);
    console.log("IN- isLoad: ", isLoading);
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRole("");
      navigate("/dash/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onRoleChanged = (e) => {
    setRole(e.target.value);
  };  

  // const onActiveChanged = () => setActive((prev) => !prev);

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (password) {
      await updateUser({ id: user.id, username, password, role });
    } else {
      await updateUser({ id: user.id, username, role });
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  // const options = Object.values(ROLES).map((role) => {
  //   return (
  //     <option key={role} value={role}>
  //       {" "}
  //       {role}
  //     </option>
  //   );
  // });

  let canSave = [role].every(Boolean) && !isLoading;
  // if (password) {
  //   canSave = [role, validUsername, validPassword].every(Boolean) && !isLoading;
  // } else {
  //   canSave = [role, validUsername].every(Boolean) && !isLoading;
  // }

  // const errClass = isError || isDelError ? "errmsg" : "offscreen";
  // const validUserClass = !validUsername ? "form__input--incomplete" : "";
  // const validPwdClass =
  //   password && !validPassword ? "form__input--incomplete" : "";

  // const validRoleClass = !Boolean(role.length) ? "form__input--incomplete" : "";

  // const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      {/* <p className={errClass}>{errContent}</p> */}
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
              EDIT FORM
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={(e) => e.preventDefault()}
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
                onChange={onPasswordChanged}

              />
              <Select
                fullWidth
                label="Role"
                id="role"
                name="role"
                size="3"
                value={role}
                onChange={onRoleChanged}

              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
              </Select>
              <Grid container spacing={"24px"}>
                <Grid item xs={10}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, padding: "8px" }}
                    onClick={onSaveUserClicked}
                    disabled={!canSave}
>
                    Save
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  {/* Delete button floating top right */}
                  <Fab
                    color="secondary"
                    aria-label="delete"
                    size="small"
                    sx={{ mt: 3, padding: "8px" }}
                    // sx={{
                    //   position: "absolute",
                    //   top: "8px",
                    //   right: "8px",
                    // }}
                    // onClick={onDeleteUserClicked}
                  >
                    <DeleteIcon />
                  </Fab>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>

      {/* <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[empty = no change]</span>{" "}
          <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />

        <label className="form__label" htmlFor="role">
          ASSIGNED ROLE:
        </label>
        <select
          id="role"
          name="role"
          className={`form__select ${validRoleClass}`}
          multiple={true}
          size="3"
          value={role}
          // onChange={onRoleChanged}
        >
          {options}
        </select>
      </form> */}
    </>
  );

  return content;
};
export default EditUserForm;
