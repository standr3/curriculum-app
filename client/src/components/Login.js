import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import usePersist from "../hooks/usePersist";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../features/auth/theme";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Checkbox } from "@mui/material";
import {
  Paper,
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting login form");
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      console.log("accessToken", accessToken);
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        // setErrMsg("No Server Response");
        console.log("No Server Response");
      } else if (err.status === 400) {
        // setErrMsg("Missing Username or Password");
        console.log("Missing Username or Password");
      } else if (err.status === 401) {
        // setErrMsg("Unauthorized");
        console.log("Unauthorized");
      } else {
        // setErrMsg(err.data?.message);
        console.log(err.data?.message);
      }
      // errRef.current.focus();
    }
  };
  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist(prev => !prev)

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              height: "46%",
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
              {/* align top left */}
              <Grid item xs={6} sx={{ padding: "0px" }}>
                {/* align top left */}
                <Box sx={{ alignContent: "left", padding: "0px" }}>
                  <Typography noWrap variant="h4" align="left">
                    Log in to your
                    <br />
                    Curriculum App account
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    align="left"
                    marginTop={2}
                  >
                    {/* Choose an username and password. */}
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
                  autoFocus
                  id="username"
                  name="username"
                  label="Username"
                  fullWidth
                  type="text"
                  value={username}
                  onChange={handleUserInput}
                  autoComplete="off"
                  required
                  variant="outlined"
                />
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  fullWidth
                  type="password"
                  value={password}
                  onChange={handlePwdInput}
                  required
                  variant="outlined"
                  sx={{ marginTop: "24px" }}
                />
                {/* right float button */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    checked={persist}
                    onChange={handleToggle}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  <Typography
                    variant="body2"
                    color="black"
                    sx={{ fontWeight: 400 }}
                    // width={10}
                  >
                    Remember me
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    sx={{ float: "right", marginTop: "24px" }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Sign in
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </div>
    </ThemeProvider>
  );
  return content;
};

export default Login;
