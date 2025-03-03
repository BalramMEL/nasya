import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Avatar, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, Select, MenuItem as DropdownItem, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dashboard as DashboardIcon, People as PeopleIcon, LocationOn as LocationIcon, Assignment as AssignmentIcon, Settings as SettingsIcon } from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const drawerWidth = 72;

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    handleClose();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Sites', icon: <LocationIcon />, path: '/sites' },
    { text: 'Roles', icon: <AssignmentIcon />, path: '/roles' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
            borderRight: 'none',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)', 
            borderRadius: '0 16px 16px 0', 
            overflow: 'hidden',
          },
        }}
      >
        {/* Logo Area */}
        <Box
          sx={{
            pt: 3,
            pb: 4,
            display: 'flex',
            justifyContent: 'center', 
            alignItems: 'center',
            height: 80
          }}
        >
                  <Typography
                      onClick={() => navigate('/dashboard')}
            variant="h5"
                      sx={{
                cursor: 'pointer',
              color: '#1976d2',
              fontWeight: 'bold',
              letterSpacing: 1,
              fontSize: '1.8rem',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)', // Gradient text
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}
          >
            Z
          </Typography>
        </Box>

        {/* Menu Items */}
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <Tooltip key={item.text} title={item.text} placement="right" arrow>
              <ListItem
                      component="button"
                onClick={() => navigate(item.path)}
                      sx={{
                    justifyContent: 'center',
                  py: 1.8,
                          borderRadius: 2,
                  border: 'none',
                  transition: 'all 0.3s ease',
                  backgroundColor: location.pathname === item.path ? '#e3f2fd' : 'transparent',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    justifyContent: 'center',
                    color: location.pathname === item.path ? '#1976d2' : '#757575',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#1976d2',
                    },
                    fontSize: '1.5rem',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent', color: 'text.primary' }}>
          <Toolbar>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
              <Select
                defaultValue="All Locations"
                sx={{ height: 40, borderRadius: 2, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                displayEmpty
              >
                <DropdownItem value="All Locations">All Locations</DropdownItem>
                <DropdownItem value="Mumbai">Mumbai</DropdownItem>
                <DropdownItem value="Delhi">Delhi</DropdownItem>
              </Select>
              <Select
                defaultValue="Past 7 Days"
                sx={{ height: 40, borderRadius: 2, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                displayEmpty
              >
                <DropdownItem value="Past 7 Days">Past 7 Days</DropdownItem>
                <DropdownItem value="Past 30 Days">Past 30 Days</DropdownItem>
                <DropdownItem value="Past 90 Days">Past 90 Days</DropdownItem>
              </Select>
            </Box>
            <IconButton onClick={handleMenu}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : title.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;