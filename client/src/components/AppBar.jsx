import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Menu,
  Typography,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";
import { MenuItem } from "react-mui-sidebar";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Buttons from "./button/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useLocation } from "react-router";
import CreateDialog from "./createDialog/CreateDialog";
import Routing from "../Routing";

const Navbar = ({isCollapse, setIsCollapse}) => {
  const isMobile = useMediaQuery("(max-width:500px)");
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [btnName, setBtnName] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const settings = [
    {
      id: 1,
      icon: <PersonPinRoundedIcon fontSize="small" />,
      name: "Profile",
    },

    {
      id: 2,
      icon: <AccountCircleRoundedIcon fontSize="small" />,
      name: "Account",
    },
    {
      id: 3,
      icon: <ExitToAppRoundedIcon fontSize="small" />,
      name: "Logout",
    },
  ];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSidebar = () => {
    setIsCollapse((prev) => !prev);
  };

  const location = useLocation();
  useEffect(() => {
    const btnName = location.pathname.replace("/", ""); // remove / from url
    const capitalName = btnName.charAt(0).toUpperCase() + btnName.slice(1); // make first word cap
    setBtnName(capitalName);
  }, [location]);

  return (
    <div className="w-full">
  
    <AppBar
      position="static"
      className="bg-white shadow-sm w-full nav-bar"
      elevation={0}
      // style={{ background: "white" }}
    >
      <Toolbar className="flex justify-between w-full">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {/* Links */}
          {/* <div className="hidden md:flex space-x-4 text-gray-700">
            <a href="#apps" className="hover:text-blue-500">Apps</a>
            <a href="#chat" className="hover:text-blue-500">Chat</a>
            <a href="#calendar" className="hover:text-blue-500">Calendar</a>
            <a href="#email" className="hover:text-blue-500">Email</a>
          </div> */}
          <div className="hide-icon">
          <IconButton onClick={handleSidebar}>
          <MenuOutlinedIcon
            className={`text-gray-700 z-10 ${
              isCollapse ? "rotate-180" : "transition-transform duration-300"
            } `}
          />
        </IconButton>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* only this pages should display below section */}
          {["/clients", "/region", "/worker", "/team", "/user"].includes(
            location.pathname
          ) && (
            <>
              {/* Create button to open dialog */}
              <Buttons
                text={`Add New ${
                  location.pathname === "/clients" ? "Client" : btnName
                }`}
                type="primary"
                size={isMobile ? "medium" : "large"}
                icon={<AddCircleIcon sx={{ fontSize: isMobile ? 18 : 22 }} />}
                styling={"linearGradient"}
                onClick={() => setIsDialogOpen(true)}
              />
              {/* Dialog */}
              <CreateDialog
                title={`Add New ${
                  location.pathname === "/clients" ? "Client" : btnName
                }`}
                isDialogOpen={isDialogOpen}
                handleDialogClose={() => setIsDialogOpen(false)}
                path={location.pathname}
              />
            </>
          )}
          {/* hide below section on mobile (500px) */}
          {!isMobile && (
            <>
              {/* Language Icon */}
              <IconButton>
                <LanguageIcon className="text-gray-700" />
              </IconButton>

              {/* Cart Icon */}
              <IconButton>
                <Badge badgeContent={0} color="error">
                  <ShoppingCartIcon className="text-gray-700" />
                </Badge>
              </IconButton>
            </>
          )}
          {/* Notifications */}
          <IconButton>
            <Badge variant="dot" color="primary">
              <NotificationsIcon className="text-gray-700" />
            </Badge>
          </IconButton>

          {/* hide below section on mobile (500px) */}
          {!isMobile && (
            <>
              {/* Avatar */}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Remy Sharp"
                    src="https://modernize-react.adminmart.com/assets/user-1-CznVQ9Sv.jpg"
                  />
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
                    icon={setting.icon}
                    key={setting.id}
                    onClick={handleCloseUserMenu}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
    <div className="mx-5"> 
            <Routing />
          </div>
    </div>

  );
};

export default Navbar;
