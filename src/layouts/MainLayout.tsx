import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState, type MouseEvent } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logout from "../service/auth/logout";
import { ROUTES } from "../config";
import { type User } from "../service/auth/auth.types";
import getUser from "../service/auth/get-user";

const settings = ["Profile", "Logout"];

function MainLayout() {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const respnse = await getUser();
      setUser(respnse ?? null);
    };
    fetchUser();
  }, []);

  return (
    <React.Fragment>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {user?.role?.toUpperCase() ?? ""}
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {user?.role?.toUpperCase() ?? ""}
            </Typography>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, bgcolor: "primary.main", color: "white" }}
                >
                  {user?.firstName?.toUpperCase() ?? ""}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={
                      setting === "Logout" ? handleLogout : handleCloseUserMenu
                    }
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />

      {user && (
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                src={user.data?.profileImage || user.data?.image}
                alt={`${user.firstName} ${user.lastName || ""}`.trim()}
                sx={{ bgcolor: "primary.main", width: 56, height: 56 }}
              />
              <Box>
                <Typography variant="h6">
                  {user.firstName} {user.lastName}
                  <Typography variant="body2" color="text.secondary">
                    {user.role}
                  </Typography>
                </Typography>
              </Box>
            </Box>
            {[
              { label: "First name", value: user.firstName },
              { label: "Last name", value: user.lastName },
              { label: "Email", value: user.email },
              { label: "Personal ID", value: user.data?.pid },
              { label: "Phone number", value: user.data?.phoneNumber },
              {
                label: "Address",
                value: user.data?.street || (
                  typeof user.data?.address === "string"
                    ? user.data.address
                    : user.data?.address?.street
                ),
              },
              { label: "Vehicle", value: user.data?.vehicle },
            ].map(({ label, value }) => value && (
              <Box key={label} sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography sx={{ overflowWrap: "anywhere" }}>{value}</Typography>
              </Box>
            ))}
          </Paper>
        </Container>
      )}
    </React.Fragment>
  );
}
export default MainLayout;
