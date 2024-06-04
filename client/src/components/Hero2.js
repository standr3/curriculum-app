import * as React from "react";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from '@mui/material/styles';
import theme from '../features/auth/theme';

export default function Hero() {
  return (
    <ThemeProvider theme={theme}>
    <Box
      id="hero"
      sx={{
        width: "100%",
        backgroundImage: "linear-gradient(180deg,#E3F2FD 0%,#FFF0E5 100%)",
        backgroundSize: "100% 20%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignSelf: "center",
              textAlign: "center",
              fontSize: "clamp(2.5rem, 4vw, 4rem)",
            }}
          >
            Welcome to&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "primary.main"
                    : "primary.light",
              }}
            >
              CurriculumApp
            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}
          >
            Your collaborative tool for creating and sharing knowledge maps.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}
          >
            <TextField
              id="outlined-basic"
              hiddenLabel
              size="small"
              variant="outlined"
              aria-label="School email address"
              placeholder="School email address"
              inputProps={{
                autoComplete: "off",
                "aria-label": "School email address",
              }}
            />
            <Button variant="contained" color="primary">
              Register
            </Button>
          </Stack> 
          <Typography
            variant="caption"
            textAlign="center"
            sx={{ opacity: 0.8 }}
          >
            Get an school account by pressing &quot;Register&quot; or &nbsp;
            <Link href="/login/admin" color="primary">
              Sign in
            </Link>
            .

            <Link href="/m" color="primary">
              TEST HERE
            </Link>
          </Typography> 
        </Stack>
        <Box
          id="image"
          sx={{
            mt: { xs: 8, sm: 10 },
            alignSelf: "center",
            height: { xs: 1100, sm: 1100 }, // moddddd
            width: "100%",
            backgroundImage:'url("/static/images/templates/templates-images/hero-light.png")',
            backgroundSize: "cover",
            borderRadius: "10px",
            outline: "1px solid",
            outlineColor: alpha("#BFCCD9", 0.5),
            boxShadow:`0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`,
          }}
        />
      </Container>
    </Box>
    </ThemeProvider>
  );
}
