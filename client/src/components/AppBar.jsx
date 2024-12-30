import React from "react";
import { AppBar, Toolbar, IconButton, Badge, Avatar, Menu, Typography, Tooltip } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";
import { MenuItem } from "react-mui-sidebar";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import PersonPinRoundedIcon from '@mui/icons-material/PersonPinRounded';

const Navbar = () => {

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const settings = [
  {
    id: 1,
    icon: <PersonPinRoundedIcon fontSize="small" />,
    name: "Profile"
  },

  {
    id: 2,
    icon: <AccountCircleRoundedIcon fontSize="small" />,
    name: "Account"
  },
  {
    id: 3,
    icon: <ExitToAppRoundedIcon fontSize="small" />,
    name: "Logout"
  },


  ];


  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar
      position="static"
      className="bg-white shadow-sm"
      elevation={0}
      style={{background: "white"}}
    >
      <Toolbar className="flex justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {/* Links */}
          {/* <div className="hidden md:flex space-x-4 text-gray-700">
            <a href="#apps" className="hover:text-blue-500">Apps</a>
            <a href="#chat" className="hover:text-blue-500">Chat</a>
            <a href="#calendar" className="hover:text-blue-500">Calendar</a>
            <a href="#email" className="hover:text-blue-500">Email</a>
          </div> */}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
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
          
          {/* Notifications */}
          <IconButton>
            <Badge variant="dot" color="primary">
              <NotificationsIcon className="text-gray-700" />
            </Badge>
          </IconButton>

          {/* Avatar */}
         
           <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="https://modernize-react.adminmart.com/assets/user-1-CznVQ9Sv.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem icon={setting.icon}  key={setting.id} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
