import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Box, Typography, Container, IconButton, Button, Avatar, Menu, MenuItem,
  Drawer, List, ListItem, ListItemText, Divider, Badge, Tooltip, useMediaQuery,
  AppBar, Toolbar, useTheme, styled, alpha, InputBase, Stack, Chip, Collapse,
  ListItemIcon, Paper, CircularProgress, LinearProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Healing as HealingIcon,
  CalendarMonth as CalendarIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  AccountCircle as AccountIcon,
  ExitToApp as ExitIcon,
  Settings as SettingsIcon,
  Bookmark as BookmarkIcon,
  HelpOutline as HelpIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

// Color tokens
const colors = {
  primary: {
    main: '#2979ff',
    light: '#75a7ff',
    dark: '#004ecb',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#00e5ff',
    light: '#6effff',
    dark: '#00b2cc',
    contrastText: '#000000'
  },
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
    accent: '#f1f8fe'
  },
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    accent: '#2979ff'
  },
  success: {
    main: '#4caf50',
    light: '#80e27e',
    dark: '#087f23'
  },
  warning: {
    main: '#ff9800',
    light: '#ffc947',
    dark: '#c66900'
  },
  error: {
    main: '#f44336',
    light: '#ff7961',
    dark: '#ba000d'
  },
  neutral: {
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  }
};

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  backgroundColor: colors.background.default,
  '&:hover': {
    backgroundColor: alpha(colors.neutral[300], 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.text.secondary
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: colors.text.primary,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  borderRadius: 10,
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: active ? 600 : 400,
  color: active ? colors.primary.main : colors.text.primary,
  backgroundColor: active ? alpha(colors.primary.main, 0.05) : 'transparent',
  '&:hover': {
    backgroundColor: alpha(colors.primary.main, 0.1),
  },
  justifyContent: 'flex-start',
  width: '100%',
  marginBottom: theme.spacing(0.5)
}));

const MobileNavButton = styled(Button)(({ theme, active }) => ({
  borderRadius: 0,
  padding: theme.spacing(1.5, 2),
  textTransform: 'none',
  fontWeight: active ? 600 : 400,
  color: active ? colors.primary.main : colors.text.primary,
  backgroundColor: active ? alpha(colors.primary.main, 0.05) : 'transparent',
  justifyContent: 'flex-start',
  width: '100%'
}));

const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: colors.background.default,
  minHeight: 'calc(100vh - 64px)',
  paddingTop: 64, // AppBar height
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(3)
}));

// Notification bell with wave animation
const AnimatedBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1
    },
    '50%': {
      transform: 'scale(1.1)',
      opacity: 0.7
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1
    },
  }
}));

// Main Layout Component
const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  
  // Handle page transition loading state
  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Navigation items structure
  const navigationItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
      active: isActive('/dashboard')
    },
    {
      title: 'Students',
      path: '/students',
      icon: <GroupIcon />,
      active: isActive('/students')
    },
    {
      title: 'Vaccination',
      icon: <HealingIcon />,
      submenu: true,
      active: isActive('/vaccines') || isActive('/drives'),
      children: [
        {
          title: 'Vaccines',
          path: '/vaccines',
          active: isActive('/vaccines')
        },
        {
          title: 'Vaccination Drives',
          path: '/drives',
          active: isActive('/drives')
        }
      ]
    },
    {
      title: 'Calendar',
      path: '/calendar',
      icon: <CalendarIcon />,
      active: isActive('/calendar')
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: <AssessmentIcon />,
      active: isActive('/reports')
    }
  ];
  
  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: 'Upcoming Vaccination Drive',
      message: 'Polio vaccination drive tomorrow for grades 5-7',
      time: '2 hours ago',
      read: false,
      type: 'drive'
    },
    {
      id: 2,
      title: 'New Students Added',
      message: '15 new students have been added to grade 6',
      time: '1 day ago',
      read: true,
      type: 'student'
    },
    {
      id: 3,
      title: 'Vaccination Report Ready',
      message: 'Monthly vaccination status report is now available',
      time: '2 days ago',
      read: true,
      type: 'report'
    }
  ];
  
  // Get unread notifications count
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileNavOpen(false);
    }
  };
  
  // Handle submenu toggle
  const handleSubmenuToggle = (index) => {
    setExpandedSubmenu(expandedSubmenu === index ? null : index);
  };
  
  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery('');
    }
  };
  
  // Handle user menu
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  // Handle notifications
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate('/login');
  };
  
  // Determine notification icon color based on type
  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'drive': return colors.primary.main;
      case 'student': return colors.success.main;
      case 'report': return colors.warning.main;
      default: return colors.neutral[600];
    }
  };
  
  // Render desktop navigation
  const renderDesktopNavigation = () => (
    <Stack 
      direction="row" 
      spacing={1} 
      sx={{ 
        flexGrow: 1, 
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        ml: 2
      }}
    >
      {navigationItems.map((item, index) => 
        item.submenu ? (
          <Box key={index} sx={{ position: 'relative' }}>
            <NavButton
              active={item.active}
              onClick={() => handleSubmenuToggle(index)}
              startIcon={item.icon}
              endIcon={expandedSubmenu === index ? <ArrowUpIcon /> : <ArrowDownIcon />}
            >
              {item.title}
            </NavButton>
            <Collapse in={expandedSubmenu === index}>
              <Paper 
                elevation={3} 
                sx={{ 
                  position: 'absolute', 
                  width: 220, 
                  zIndex: 100,
                  mt: 0.5,
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                {item.children.map((child, childIndex) => (
                  <NavButton
                    key={childIndex}
                    active={child.active}
                    onClick={() => handleNavigation(child.path)}
                    sx={{ borderRadius: 0 }}
                  >
                    {child.title}
                  </NavButton>
                ))}
              </Paper>
            </Collapse>
          </Box>
        ) : (
          <NavButton
            key={index}
            active={item.active}
            onClick={() => handleNavigation(item.path)}
            startIcon={item.icon}
          >
            {item.title}
          </NavButton>
        )
      )}
    </Stack>
  );
  
  // Render mobile drawer navigation
  const renderMobileNavigation = () => (
    <Drawer
      anchor="left"
      open={mobileNavOpen}
      onClose={() => setMobileNavOpen(false)}
      sx={{ 
        '& .MuiDrawer-paper': { 
          width: '80%', 
          maxWidth: 300,
          boxSizing: 'border-box',
        } 
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: colors.primary.main, mr: 2 }}>
          <HealingIcon />
        </Avatar>
        <Typography variant="h6" noWrap component="div">
          Vaccination Portal
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Logged in as
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.username || 'School Coordinator'}
          </Typography>
        </Box>
        <InputBase
          placeholder="Search..."
          startAdornment={<SearchIcon sx={{ mr: 1, fontSize: 20 }} />}
          sx={{ 
            bgcolor: colors.background.accent,
            p: 1,
            borderRadius: 1,
            width: '100%',
            mb: 2
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
        />
      </Box>
      <Divider />
      <List sx={{ width: '100%', p: 0 }}>
        {navigationItems.map((item, index) => 
          item.submenu ? (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <MobileNavButton
                  active={item.active}
                  onClick={() => handleSubmenuToggle(index)}
                  startIcon={item.icon}
                  endIcon={expandedSubmenu === index ? <ArrowUpIcon /> : <ArrowDownIcon />}
                >
                  {item.title}
                </MobileNavButton>
              </ListItem>
              <Collapse in={expandedSubmenu === index}>
                <List component="div" disablePadding>
                  {item.children.map((child, childIndex) => (
                    <ListItem key={childIndex} disablePadding>
                      <MobileNavButton
                        active={child.active}
                        onClick={() => handleNavigation(child.path)}
                        sx={{ pl: 4 }}
                      >
                        {child.title}
                      </MobileNavButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem key={index} disablePadding>
              <MobileNavButton
                active={item.active}
                onClick={() => handleNavigation(item.path)}
                startIcon={item.icon}
              >
                {item.title}
              </MobileNavButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <MobileNavButton onClick={handleLogout} startIcon={<ExitIcon />}>
            Logout
          </MobileNavButton>
        </ListItem>
      </List>
    </Drawer>
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: colors.background.paper,
          color: colors.text.primary,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileNavOpen(true)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo */}
          <Box 
            component={Link} 
            to="/dashboard" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: 'inherit' 
            }}
          >
            <Avatar 
              sx={{ 
                backgroundColor: colors.primary.main,
                mr: 1,
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              <HealingIcon />
            </Avatar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                fontWeight: 600, 
                background: `linear-gradient(90deg, ${colors.primary.main}, ${colors.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              School Vaccination Portal
            </Typography>
          </Box>
          
          {/* Desktop Navigation */}
          {!isMobile && renderDesktopNavigation()}
          
          {/* Search Bar - Desktop */}
          <Search sx={{ display: { xs: 'none', md: 'block' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
          </Search>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Right side elements: Notifications & Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                onClick={handleNotificationsOpen}
                size="large"
                aria-label={`${unreadNotifications} new notifications`}
              >
                <AnimatedBadge badgeContent={unreadNotifications} color="error">
                  <NotificationsIcon />
                </AnimatedBadge>
              </IconButton>
            </Tooltip>
            
            {/* User menu */}
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Account settings">
                <Box
                  onClick={handleUserMenuOpen}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    borderRadius: 20,
                    '&:hover': { bgcolor: alpha(colors.neutral[300], 0.1) },
                    p: 0.5,
                    pl: 1
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: colors.primary.main,
                      fontSize: '0.9rem'
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: 1, 
                      fontWeight: 500,
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {user?.username || 'User'}
                  </Typography>
                  <ArrowDownIcon 
                    sx={{ 
                      fontSize: 18, 
                      ml: 0.5,
                      display: { xs: 'none', sm: 'block' }
                    }} 
                  />
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
        {pageLoading && <LinearProgress color="primary" sx={{ height: 2 }} />}
      </AppBar>
      
      {/* Mobile Navigation Drawer */}
      {renderMobileNavigation()}
      
      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            borderRadius: 2,
            minWidth: 200,
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.username || 'School Coordinator'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user?.email || 'coordinator@school.edu'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>
        <MenuItem onClick={() => { handleUserMenuClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        <MenuItem onClick={() => { handleUserMenuClose(); navigate('/help'); }}>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Help & Support" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            borderRadius: 2,
            width: 320,
            maxHeight: 400,
            overflow: 'auto',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          <Chip 
            label={`${unreadNotifications} new`} 
            size="small" 
            color="primary" 
            sx={{ display: unreadNotifications ? 'flex' : 'none' }}
          />
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <>
            {notifications.map((notification) => (
              <Box 
                key={notification.id}
                sx={{ 
                  px: 2, 
                  py: 1.5,
                  borderLeft: notification.read ? 'none' : `3px solid ${getNotificationTypeColor(notification.type)}`,
                  bgcolor: notification.read ? 'transparent' : alpha(colors.primary.light, 0.05),
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha(colors.primary.light, 0.1),
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: getNotificationTypeColor(notification.type),
                      mr: 1.5,
                      mt: 0.7
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {notification.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {notification.time}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            <Divider />
            <Box sx={{ p: 1.5, textAlign: 'center' }}>
              <Button 
                size="small" 
                onClick={() => { 
                  handleNotificationsClose(); 
                  navigate('/notifications'); 
                }}
                endIcon={<ChevronRightIcon />}
              >
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
      
      {/* Main Content */}
      <PageContainer>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </PageContainer>
    </Box>
  );
};

export default Layout;