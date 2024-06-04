import { useState, React } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import {
  Toolbar,
  Typography,
  IconButton,
  Box,
  Divider,
  List,
  Container,
  Button,
  backdropClasses,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import MenuIcon from "@mui/icons-material/Menu";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SideBar from "./SideBar";
import GroupsIcon from "@mui/icons-material/Groups";
import BallotIcon from "@mui/icons-material/Ballot";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../features/auth/theme";
import { styled, useTheme } from "@mui/material/styles";
import useAuth from "../hooks/useAuth";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
//ListItem
import ListItem from "@mui/material/ListItem";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SchoolIcon from "@mui/icons-material/School";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";

const DASH_REGEX = /^\/dash(\/)?$/;
const COMMITS_REGEX = /^\/dash\/commits(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  //DRAWER
  // const theme = useTheme
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { username, status } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const onLogoutClicked = () => sendLogout();

  if (isLoading) return <p>Logging Out...</p>;
  if (isError) return <p>Error: {error.data?.message}</p>;

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    // !COMMITS_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  const content = (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            height: "64px",
            maxHeight: "64px",
            boxShadow: 0,
            bgcolor: "#0F171F",
            backgroundImage: "none",
          }}
          open={open}
        >
          <Container maxWidth={false} disableGutters>
            <Toolbar
              disableGutters
              variant="regular"
              sx={{
                height: "64px",
                maxHeight: "64px",
                //   border: "1px solid red",
                m: 0,
                px: "24px",
                py: "8px",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  color: "primary",
                  // px: "8px",
                }}
              >
                <IconButton
                  color="primary"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                    marginRight: 5,

                    ...(open && { display: "none" }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Button
                  disableRipple
                  size="large"
                  edge="start"
                  color="primary"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                  href="/dash"
                >
                  <AccountTreeIcon sx={{ fontSize: "40px" }} color="primary" />

                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    color="primary"
                    fontSize={"30px"}
                    fontWeight={"400"}
                    letterSpacing={"0.15px"}
                    sx={{ ml: "8px" }}
                    fontFamily={"Share Tech Mono"}
                  >
                    {status} Dashboard
                  </Typography>
                </Button>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box
                sx={{
                  alignItems: "center",
                  display: { xs: "none", md: "flex" },
                }}
              >
                <IconButton
                  size="large"
                  aria-label="show new notifications"
                  color="primary"
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  color="primary"
                  sx={{ ml: 2, display: { xs: "none", sm: "block" } }}
                >
                  {username}
                </Typography>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  // aria-controls={menuId}
                  aria-haspopup="true"
                  // onClick={handleProfileMenuOpen}
                  color="primary"
                >
                  <AccountCircle />
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="logout"
                  onClick={onLogoutClicked}
                  color="primary"
                  href="/"
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Drawer
          variant="permanent"
          open={open}

          // make drawer transparent when open
          // sx={{
          //   "& .MuiDrawer-paper": {
          //     backgroundColor: "transparent",
          //     opacity: 0.5,
          //     // blur
          //     filter: "blur(2px)",
          //   },
          // }}
        >
          <DrawerHeader
          // sx={{
          //   backgroundColor: "#0F171F",
          // }}
          >
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon sx={{ color: "#fcba03" }} />
              ) : (
                <ChevronLeftIcon sx={{ color: "#fcba03" }} />
              )}
            </IconButton>
          </DrawerHeader>

          <Divider />
          <List
          //  sx={{
          //   bgcolor: "#10162f",
          //   opacity: 0.5,
          //   // blur
          //   // filter: "blur(2px)",
          // }}
          >
            {status.toUpperCase() === "TEACHER" &&
              ["My Projects", "Starred", "Send email", "Drafts"].map(
                (text, index) => (
                  <ListItem key={text} disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "#fcba03",
                        }}
                      >
                        {index === 0 ? <BallotIcon /> : <MailIcon />}

                        {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                )
              )}
          </List>
          <Divider />
          <List>
            {status.toUpperCase() === "ADMIN" &&
              [
                "Home",
                "Manage Groups",
                "Manage Students",
                "Manage Teachers",
              ].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    href={
                      [
                        "/dash",
                        "/dash/groups",
                        "/dash/users/students",
                        "/dash/users/teachers",
                      ][index]
                    }
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "#fcba03",
                      }}
                    >
                      {index === 0 && <HomeIcon />}
                      {index === 1 && <GroupsIcon />}
                      {index === 2 && <SchoolIcon />}
                      {index === 3 && <LocalLibraryIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Drawer>
        {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
          Convallis convallis tellus id interdum velit laoreet id donec ultrices.
          Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
          nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
          leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
          feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
          sapien faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
          eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
          neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
          tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
          sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
          tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
          gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
          et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
          tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </Box> */}
      </Box>
    </ThemeProvider>
  );
  return content;
};

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  color: "#fcba03",
  backgroundColor: "rgba(15, 23, 31,0.9)",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: "#0F171F",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,

  backgroundColor: "#0F171F",
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
    // "& .MuiDrawer-paper": {
    //   backgroundColor: "transparent",
    //   opacity: 0.5,
    //   // blur
    //   filter: "blur(2px)",
    // },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default DashHeader;
