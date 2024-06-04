import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
const DashLayout = () => {
  return (
    <>
      <DashHeader />
      {/* <div className="dash-container" style={{ marginTop: "64px" }}> */}
      <Box
        component="main"
        sx={{  mt: "64px", ml: "64px", p: "16px", height: "calc(100vh - 64px)" }}
      >
        <Outlet />
      </Box>
      {/* </div> */}
      {/* <DashFooter /> */}
    </>
  );
};
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
export default DashLayout;
