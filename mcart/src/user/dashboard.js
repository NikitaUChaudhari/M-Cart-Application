import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useHistory } from 'react-router';
import Avatar from "@mui/material/Avatar";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CategoryIcon from '@mui/icons-material/Category';

const drawerWidth = 230;

export default function Dashboard() {
    const history=useHistory();



  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>

        <Typography variant="h4" noWrap component="div">
          M-Cart
        </Typography>

        <div className='header-img'>
         <h5>Welcome {localStorage.getItem("uname")} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h5> 
         <Avatar alt={localStorage.getItem("uname")}  src={process.env.PUBLIC_URL + `/uploads/${localStorage.getItem("uimg")}`} />
        </div>

       
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
        
      >
        <Toolbar />
        <List>
        <Divider />
           <ListItem button onClick={()=>history.push("/product")} >
              <ListItemIcon>
                <ManageAccountsIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <Divider />
            <ListItem button onClick={()=>history.push("/profile")} >
              <ListItemIcon>
                <ManageAccountsIcon />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            <Divider />
            <ListItem button onClick={()=>history.push("/myorder")} >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="My Orders" />
            </ListItem>
            <Divider />
            <ListItem button onClick={()=>history.push("/cart")} >
              <ListItemIcon>
                <ManageAccountsIcon />
              </ListItemIcon>
              <ListItemText primary="My Cart" />
            </ListItem>
            <Divider />
            <ListItem button onClick={()=>history.push("/wishlist")} >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Wish List" />
            </ListItem>
            <Divider />
            <ListItem button onClick={()=>history.push("/logout")} >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </ListItem>
        </List>
        <Divider />
        
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
}
