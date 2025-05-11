import React from 'react';
import { Box, Typography, Button, Tooltip, IconButton, Divider } from '@mui/material';
import AppBreadcrumbs from './AppBreadcrumbs';
import { QuestionMark as HelpIcon } from '@mui/icons-material';

const PageHeader = ({
  title,
  subtitle,
  actionButton,
  actionIcon,
  actionText,
  actionLink,
  helpText,
  children
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <AppBreadcrumbs />
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            {helpText && (
              <Tooltip title={helpText}>
                <IconButton size="small" sx={{ ml: 1, mt: -1 }}>
                  <HelpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          {subtitle && (
            <Typography variant="subtitle1" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {(actionButton || actionText) && (
          <Box>
            {actionButton || (
              <Button 
                variant="contained" 
                to={actionLink}
                startIcon={actionIcon}
              >
                {actionText}
              </Button>
            )}
          </Box>
        )}
      </Box>
      
      {children && (
        <Box sx={{ mt: 2 }}>
          {children}
        </Box>
      )}
      
      <Divider sx={{ mt: 3 }} />
    </Box>
  );
};

export default PageHeader;