import React, { useState, useEffect } from 'react';
import {
  Drawer, Box, Typography, IconButton, Divider, Tabs, Tab, List,
  ListItem, ListItemText, ListItemIcon, Badge, Tooltip, Fab, Avatar,
  ListItemAvatar, Button
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon
} from '@mui/icons-material';
import axios from 'axios';

// Notification bell component that floats over the content
export const NotificationBell = ({ onClick, count }) => {
  return (
    <Tooltip title="Open notification center">
      <Fab
        color="primary"
        size="medium"
        onClick={onClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <Badge badgeContent={count} color="error">
          <NotificationsIcon />
        </Badge>
      </Fab>
    </Tooltip>
  );
};

// Main notification center component
const NotificationCenter = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);
  
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        setNotifications([
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
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'drive':
        return <Avatar sx={{ bgcolor: '#e3f2fd' }}><CalendarIcon color="primary" /></Avatar>;
      case 'student':
        return <Avatar sx={{ bgcolor: '#e8f5e9' }}><PeopleIcon color="success" /></Avatar>;
      case 'report':
        return <Avatar sx={{ bgcolor: '#fff3e0' }}><AssessmentIcon color="warning" /></Avatar>;
      default:
        return <Avatar sx={{ bgcolor: '#f5f5f5' }}><NotificationsIcon color="action" /></Avatar>;
    }
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Notifications</Typography>
        <Box>
          {unreadCount > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton onClick={markAllAsRead} sx={{ mr: 1 }}>
                <MarkReadIcon />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Divider />
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2 }}>
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              All
              {unreadCount > 0 && (
                <Badge 
                  badgeContent={unreadCount} 
                  color="error" 
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          } 
        />
        <Tab label="Unread" />
      </Tabs>
      
      <Divider />
      
      <List sx={{ p: 0 }}>
        {notifications
          .filter(notification => tabValue === 0 || !notification.read)
          .map((notification) => (
            <ListItem 
              key={notification.id}
              sx={{ 
                py: 2,
                px: 2,
                borderLeft: notification.read ? 'none' : '3px solid #2979ff',
                bgcolor: notification.read ? 'transparent' : 'rgba(41, 121, 255, 0.05)',
              }}
            >
              <ListItemAvatar>
                {getNotificationIcon(notification.type)}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="textPrimary" gutterBottom>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {notification.time}
                    </Typography>
                  </>
                }
                primaryTypographyProps={{ variant: 'subtitle2' }}
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItem>
          ))}
      </List>
      
      {notifications.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No notifications to display
          </Typography>
        </Box>
      )}
      
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Button fullWidth>View All Notifications</Button>
      </Box>
    </Drawer>
  );
};

export default NotificationCenter;