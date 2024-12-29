import React from "react";
import { AppBar, Toolbar, IconButton, Badge, Avatar } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";

const Navbar = () => {
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
          <div className="hidden md:flex space-x-4 text-gray-700">
            <a href="#apps" className="hover:text-blue-500">Apps</a>
            <a href="#chat" className="hover:text-blue-500">Chat</a>
            <a href="#calendar" className="hover:text-blue-500">Calendar</a>
            <a href="#email" className="hover:text-blue-500">Email</a>
          </div>
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
          <Avatar
            src="https://modernize-react.adminmart.com/assets/user-1-CznVQ9Sv.jpg"
            alt="Profile"
            className="bg-blue-500"
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
