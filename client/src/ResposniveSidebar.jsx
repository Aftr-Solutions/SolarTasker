import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AppSidebar from './AppSidebar';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
    <AppSidebar />
    </Box>
  );

  return (
    <div>
      <button onClick={toggleDrawer(true)}>    
              <MenuOutlinedIcon
          className=" p-1 cursor-pointer mt-5 mx-5 hover:  hover:bg-hoverbgGray rounded-full text-gray-700  hover:text-primary"
        />
        </button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
