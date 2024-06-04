import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#fff", //
    },
    primary: {
      main: "#fcba03",
    },
    secondary: {
      main: "#E3ECED", 
    },
    text: {
      primary: "#0F171F",
      main: "#0F171F",
    },
  },
  // components: {
  //   MuiTextField: {
  //     styleOverrides: {
  //       root: {
  //         "& .MuiOutlinedInput-root": {
  //           "& fieldset": {
  //             borderColor: "#555", // Custom border color
  //           },
  //           "&:hover fieldset": {
  //             borderColor: "#3A10E5", // Primary color on hover
  //           },
  //           "&.Mui-focused fieldset": {
  //             borderColor: "#3A10E5", // Primary color when focused
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
  // typography: {
  //   h4: {
  //     fontWeight: 600,
  //   },
  //   body2: {
  //     fontSize: "0.875rem",
  //   },
  // },
});

export default theme;
