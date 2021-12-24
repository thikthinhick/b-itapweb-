import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from 'prop-types';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './styles.scss';
import Slide from '../slide/slide';
import Citizen from '../all-citizen/Citizen';
import Manage from '../manage/main/manage';
import { useLocation } from 'react-router-dom';
import logoUrl from '../../constants/images/logo.png';
import Tasks from '../tasks/main/TaskHome';
import CensusForm from '../census/census'
import Cookies from 'js-cookie';
import UpdatePass from './updatePass'
import Dialog from '@mui/material/Dialog';

const drawerWidth = '20vw';

HomePage.propTypes = {
  HomePage: PropTypes.array.isRequired,
};

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#f5f7ff',
    height: '100%',
    width: '100%',
    marginLeft: `-${drawerWidth}`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    minWidth: `calc(100vw - ${drawerWidth})`,
    marginLeft: `${drawerWidth}`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function HomePage({ listItems }) {
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const toggleSideBar = () => {
    setOpen(!open);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const toggleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const toggleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const [openD, setOpenD] = React.useState(false);

  const handleClickOpen = () => {
    setAnchorEl(null);
    setOpenD(true);
  };

  const handleClose = () => {
    setOpenD(false);
  };
  const Logout = () => {
      Cookies.remove('user');
      Cookies.remove('role');
      Cookies.remove('token')
      window.location.reload()
  }


  const sideList = () => (
    <Box className="menu-container" component="div">
      <Divider />
      <List disablePadding>
        {listItems.map((listItem, index) => (
          <NavLink to={listItem.url} className="link" key={index}>
          <ListItem button key={index}>      
              <ListItemText primary={listItem.listText} />
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Box>
  );

  const render = () => {
    if (location.pathname === '/trangchu') return <Slide />;
    if (location.pathname === '/danso') return <Citizen />;
    if (location.pathname === '/congviec') return <Tasks />;
    if (location.pathname === '/quanly') return <Manage />;  
    if (location.pathname === '/nhaplieu') return <CensusForm/>
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Dialog open={openD} onClose={handleClose} fullWidth>
        <UpdatePass handleClose = {handleClose}/>
      </Dialog>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            id="toggle-button"
            color="inherit"
            onClick={toggleSideBar}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <div className="logo-and-name">
            
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              fontWeight={600}
              fontSize="16px"
            >
              <i style={{color: 'black'}}>CITIZENV</i>
            </Typography>
          </div>
          <IconButton
            size="large"
            color="inherit"
            className="accountIcon"
            onClick={toggleUserClick}
          >
            <AccountCircleIcon fontSize="inherit" />
          </IconButton>
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
        className="appbar"
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={toggleSideBar}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {sideList()}
      </Drawer>

      <Main open={open} className="">
        <DrawerHeader />
        {render()}
      </Main>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={toggleCloseUserMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClickOpen} className="menuItem">
          Thay đổi mật khẩu
        </MenuItem>
        <MenuItem onClick={Logout} className="menuItem">
          Đăng xuất
        </MenuItem>
      </Menu>
    </Box>
  );
}
