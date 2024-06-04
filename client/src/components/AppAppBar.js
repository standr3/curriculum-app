import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  MenuItem,
  Container,
  IconButton
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../features/auth/theme";

function AppAppBar() {
  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        sx={{
          height: "64px",
          maxHeight: "64px",
          boxShadow: 0,
          bgcolor: "#0F171F",
          backgroundImage: "none",
        }}
      >
        <Container maxWidth={false} disableGutters>
          <Toolbar
            disableGutters
            variant="regular"
            sx={{
              // display: "flex",
              // alignItems: "center",
              // justifyContent: "space-between",
              // flexShrink: 0,
              // borderRadius: "25px",
              // bgcolor: "rgba(255, 255, 255, 0.4)",
              // backdropFilter: "blur(24px)",
              // maxHeight: 40,
              height: "64px",
              maxHeight: "64px",
              // border: "1px solid red",
              // borderColor: "divider",
              // boxShadow: `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`,
              // my: "8px",
              // paddingLeft: "8px",
              // paddingRight: "8px",
              // mx: "16px",
              m: 0,
              px: "16px",
              py: "8px",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                color: "primary.main",

                // px: "8px",
              }}
            >
              {/* <IconButton
                size="e
                edge="start"
                color="primary"
                aria-label="open drawer"
                // sx={{ mr: 2 }}
              > */}
              {/* // big icon */}
                <AccountTreeIcon sx={{ fontSize: "36px" }} />
              {/* </IconButton> */}
              <Typography
                variant="h6"
                noWrap
                component="a"
                onClick={() => scrollToSection("/")}
                sx={{
                  ml: 2,
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".2rem",
                  color: "primary.main",
                  // textDecoration: "none",
                }}
              >
                Curriculum App
              </Typography>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <MenuItem
                  onClick={() => scrollToSection("about")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="secondary.main">
                    About
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection("contact")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="secondary.main">
                    Contact
                  </Typography>
                </MenuItem>
              </Box>
            </Box>
            <Box
              sx={{
                // display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <Button
                color="secondary"
                variant="text"
                size="small"
                component="a"
                href="/account/login"
                // target="_blank"
              >
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    fontWeight: 400,
                  }}
                  
                >
                  Sign in
                </Typography>
              </Button>
              <Button
                color="primary"
                variant="outlined"
                size="small"
                component="a"
                href="/dash"
                sx={{ ml: "8px", px: "24px", py: "12px" }}
                // target="_blank"
              >
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Dashboard
                </Typography>
              </Button>
              <Button
                color="primary"
                variant="contained"
                size="small"
                component="a"
                href="/account/register"
                sx={{ ml: "8px", px: "24px", py: "12px" }}
                // target="_blank"
              >
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Sign up
                </Typography>
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default AppAppBar;
