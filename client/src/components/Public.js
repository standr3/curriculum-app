import Hero from "./Hero.js";

import AppAppBar from "./AppAppBar.js";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../features/auth/theme";

const Public = () => {
  const content = (
    <ThemeProvider theme={theme}>
      <AppAppBar />
      <Hero />
    </ThemeProvider>
  );
  return content;
};
export default Public;
