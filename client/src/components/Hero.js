import React from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import appImg from "../img/appImg.webp";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../features/auth/theme";

const Hero = () => {
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#E3ECED",
        }}
      >
        <Container
          sx={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -60%)",
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={6}>
              <Box sx={{ alignContent: "left" }}>
                <Typography noWrap variant="h2" align="left">
                  Test and share
                  <br />
                  your knowledge, in
                  <br />
                  Curriculum App
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  align="left"
                  marginTop={2}
                >
                  Create and collaborate on online knowledge maps.
                </Typography>
              </Box>

              <Stack spacing={2} direction="row" mt={"36px"}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href="/dash/users"
                >
                  For Schools
                </Button>
                <Button
                  variant="outlined"
                  color="text"
                  size="large"
                  // target="_blank"
                  href="/account/login"
                  //   fullWidth
                >
                  Sign in
                </Button>
              </Stack>
              <Stack direction="row" mt={"24px"}>
                <Typography my={"auto"}>Don't have an account?</Typography>
                <Button variant="text" href="/account/register" m={0} p={0}>
                  Sign up for free
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <img
                  src={appImg}
                  alt="appImg"
                  loading="lazy"
                  style={{ width: "100%" }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* <Divider style={{ margin: "60px 0px 0px 0px" }} /> */}
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Hero;
