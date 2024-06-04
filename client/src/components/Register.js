import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../features/auth/authApiSlice";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../features/auth/theme";

import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Grid, Box, Typography, TextField, Button } from "@mui/material";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Select, MenuItem, InputLabel } from "@mui/material";

import { useGetGroupsQuery } from "../features/groups/groupsApiSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [group, setGroup] = useState("");

  const { data: groupsData, isLoading: isGroupsLoading } =
    useGetGroupsQuery("groupsList");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting registration form");
    try {
      await register({
        username,
        password,
        role,
        groupId: role === "student" ? group : null,
      }).unwrap();
      console.log("User registered successfully");
      setUsername("");
      setPassword("");
      setGroup(""); // reset group
      navigate("/"); // Navigate to login or another appropriate page after registration
    } catch (err) {
      if (!err.status) {
        console.log("No Server Response");
      } else if (err.status === 400) {
        console.log("Missing Username or Password");
      } else if (err.status === 409) {
        console.log("Username already taken");
      } else {
        console.log(err.data?.message);
      }
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);
  const handleGroupChange = (e) => setGroup(e.target.value);

  if (isLoading || isGroupsLoading) {
    return <div>Loading...</div>;
  }

  const groupOptions = groupsData?.ids.map((id) => {
    const group = groupsData.entities[id];
    return (
      <MenuItem key={group.id} value={group.id}>
        {group.name}
      </MenuItem>
    );
  });

  const content = (
    <ThemeProvider theme={theme}>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#0F171F",
        }}
      >
        <Container
          sx={{
            display: "flex",
            minHeight: "100vh",
            minWidth: "100vw",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              height: "56%",
              width: "50%",
              padding: "20px",
              pt: "60px",
              borderRadius: "28px",
            }}
          >
            <AccountTreeIcon sx={{ fontSize: "60px" }} color="primary" />

            <Grid
              container
              spacing={2}
              justifyContent="flex-start"
              alignItems="flex-start"
              sx={{ marginTop: "24px" }}
            >
              <Grid item xs={6} sx={{ padding: "0px" }}>
                <Box sx={{ alignContent: "left", padding: "0px" }}>
                  <Typography noWrap variant="h4" align="left">
                    Register your free
                    <br />
                    Curriculum App account
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    align="left"
                    marginTop={2}
                  >
                    Choose a username and password.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={6}
                component="form"
                noValidate
                onSubmit={handleSubmit}
              >
                <TextField
                  label="Username"
                  fullWidth
                  type="text"
                  value={username}
                  onChange={handleUserInput}
                  required
                  variant="outlined"
                />
                <TextField
                  label="Password"
                  fullWidth
                  type="password"
                  value={password}
                  onChange={handlePwdInput}
                  required
                  variant="outlined"
                  sx={{ marginTop: "24px" }}
                />
                <RadioGroup
                  row
                  aria-label="role"
                  name="row-radio-buttons-group"
                  sx={{ marginTop: "24px" }}
                  value={role}
                  onChange={handleRoleChange}
                >
                  <FormControlLabel
                    value="teacher"
                    control={<Radio />}
                    label="Teacher"
                  />
                  <FormControlLabel
                    value="student"
                    control={<Radio />}
                    label="Student"
                  />
                </RadioGroup>
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

                <Button
                  sx={{ float: "right", marginTop: "24px" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </div>
    </ThemeProvider>
  );
  return content;
};

export default Register;
