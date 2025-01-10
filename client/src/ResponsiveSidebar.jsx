import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AppSidebar from './AppSidebar';
import Navbar from './components/AppBar';

export default function ResponsiveSidebar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 260 }} role="presentation" onClick={toggleDrawer(false)}>
    <AppSidebar open={open}  />
    </Box>
  );

  return (
    <div className='flex '>
      <button className='h-10 sticky top-0 ' onClick={toggleDrawer(true)}>    
              <MenuOutlinedIcon
          className=" p-1 cursor-pointer mt-5 mx-5 hover:  hover:bg-hoverbgGray rounded-full text-gray-700  hover:text-primary"
        />
        </button>
        <Navbar />

      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
