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

import { useState, type MouseEvent } from "react";

import { type User } from "../service/auth/auth.types";

import BasicTabs from "./BasicTabs";

interface HeaderProps {
  user: User | null;
  tabs: string[];
  tab: number | false;
  onTabChange: (value: number) => void;
  onShowProfile: () => void;
  onLogout: () => Promise<void>;
}

const settings = ["Profile", "Logout"];

export default function Header({ user, tabs, tab, onTabChange, onShowProfile, onLogout }: HeaderProps) {
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleShowProfile = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onShowProfile();
    setAnchorElUser(null);
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
    await onLogout();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleShowProfile}
              aria-label="Open profile"
              color="inherit"
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            >
              <AdbIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              onClick={handleShowProfile}
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
              aria-label="Open navigation menu"
              aria-controls={anchorElNav ? "navigation-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorElNav)}
              color="inherit"
              onClick={(event) => setAnchorElNav(event.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="navigation-menu"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {user && tabs.map((label, index) => (
                <MenuItem
                  key={label}
                  selected={tab === index}
                  onClick={() => {
                    onTabChange(index);
                    setAnchorElNav(null);
                  }}
                >
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <IconButton
            onClick={handleShowProfile}
            aria-label="Open profile"
            color="inherit"
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          >
            <AdbIcon />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            onClick={handleShowProfile}
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
          <Box sx={{ flexGrow: 1, minWidth: 0, display: { xs: "none", md: "block" } }}>
            {user && <BasicTabs labels={tabs} value={tab} onChange={onTabChange} />}
          </Box>
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
                    setting === "Logout" ? handleLogout : handleShowProfile
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
  );
}
