import React from 'react';
import { Breadcrumbs, Link, Typography, Box, Chip } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

// Map path segments to readable names
const breadcrumbNameMap = {
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/students/add': 'Add Student',
  '/vaccines': 'Vaccines',
  '/vaccines/add': 'Add Vaccine',
  '/drives': 'Vaccination Drives',
  '/drives/add': 'Schedule Drive',
  '/reports': 'Reports',
  '/profile': 'My Profile',
  '/settings': 'Settings',
  '/help': 'Help & Support'
};

const AppBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Handle the case where we're on the dashboard
  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link
          component={RouterLink}
          to="/dashboard"
          color="inherit"
          underline="hover"
        >
          Dashboard
        </Link>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Check if the path is a detail view (like /students/123)
          const isDetailView = !isNaN(value) && index > 0;
          
          // If it's a detail view, use a more descriptive label
          let label;
          if (isDetailView) {
            const parentPath = `/${pathnames[index - 1]}`;
            const entityName = breadcrumbNameMap[parentPath]?.replace(/s$/, '') || '';
            label = `${entityName} Details`;
          } else {
            label = breadcrumbNameMap[to] || value;
          }
          
          return last ? (
            <Typography key={to} color="textPrimary">
              {label}
            </Typography>
          ) : (
            <Link
              key={to}
              component={RouterLink}
              to={to}
              color="inherit"
              underline="hover"
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default AppBreadcrumbs;