import React from "react";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Tooltip
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../JS/actions/userActions";
import { useDispatch } from "react-redux";

const pages = [
  { label: "Home", path: "/" },
  { label: "Calendar", path: "/calendar" }
];

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData") || "null");
  const token = localStorage.getItem("token");

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Logo (LEFT) */}
          <Typography
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              textDecoration: "none",
            }}
          >
            <img src="/logo.png" alt="Logo" style={{ height: 60 }} />
          </Typography>

          {/* MOBILE MENU */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={(e) => setAnchorElNav(e.currentTarget)}>
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={() => setAnchorElNav(null)}>
                  <Link
                    to={page.path}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {page.label}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* DESKTOP MENU (RIGHT) */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end"
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.label}
                component={Link}
                to={page.path}
                sx={{ color: "white", mx: 1 }}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          {/* USER MENU */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Account settings">
              <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)}>
                <Avatar alt={userData?.user?.fullName || "User"} />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
            >
              {token ? (
                <>
                  <MenuItem disabled>
                    Welcome, {userData?.user?.fullName}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      dispatch(logout(navigate));
                      setAnchorElUser(null);
                    }}
                  >
                    Logout
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem component={Link} to="/login">Login</MenuItem>
                  <MenuItem component={Link} to="/register">Register</MenuItem>
                </>
              )}
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
