import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Typography, Grid, Paper, Button, Divider, Card, CardContent, CardHeader,
  IconButton, Avatar, Skeleton, Chip, Stack, useTheme, CircularProgress, List,
  ListItem, ListItemIcon, ListItemText, ListItemAvatar, ListItemSecondaryAction,
  LinearProgress, Tooltip
} from '@mui/material';
import { 
  People as PeopleIcon,
  MedicalServices as VaccineIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Event as EventIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

// Custom stat card component
const StatCard = ({ title, value, icon, iconColor, change, trend, loading }) => {
  return (
    <Card sx={{ 
      height: '100%',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }
    }} elevation={2}>
      <CardContent sx={{ p: 3, pb: '16px !important' }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="30%" height={60} />
            <Skeleton variant="text" width="40%" />
          </>
        ) : (
          <>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 1 }}>
              <Typography variant="h3" component="div" fontWeight={600}>
                {value}
              </Typography>
              {change && (
                <Chip
                  label={`${trend === 'up' ? '+' : ''}${change}%`}
                  color={trend === 'up' ? 'success' : 'error'}
                  size="small"
                  sx={{ ml: 1, mb: 1, height: 24 }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: `${iconColor}10`,
                    color: iconColor,
                    width: 40,
                    height: 40
                  }}
                >
                  {icon}
                </Avatar>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  {trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'No change'} since last month
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Drive card component
const DriveCard = ({ drive, loading }) => {
  // Calculate percentage of doses used
  const percentUsed = (drive?.doses_used / drive?.doses_available) * 100 || 0;
  
  return (
    <Card sx={{ 
      height: '100%',
      transition: 'transform 0.3s, box-shadow 0.3s',
'&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }
    }} elevation={2}>
      {loading ? (
        <CardContent>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={60} sx={{ my: 2 }} />
          <Skeleton variant="text" width="40%" />
        </CardContent>
      ) : (
        <>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: '#2979ff' }}>
                <EventIcon />
              </Avatar>
            }
            action={
              <IconButton component={Link} to={`/drives/${drive.id}`}>
                <MoreIcon />
              </IconButton>
            }
            title={drive.vaccine_name}
            subheader={format(parseISO(drive.date), 'EEEE, MMMM d, yyyy')}
          />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ my: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Progress: {Math.round(percentUsed)}% ({drive.doses_used} of {drive.doses_available} doses)
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={percentUsed} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  my: 1
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Chip 
                label={`Grades ${drive.applicable_grades}`} 
                size="small" 
                sx={{ bgcolor: '#f1f8fe', color: '#2979ff' }}
              />
              <Button 
                component={Link}
                to={`/drives/${drive.id}`}
                size="small"
                endIcon={<ArrowForwardIcon />}
              >
                Manage
              </Button>
            </Box>
          </CardContent>
        </>
      )}
    </Card>
  );
};

// VaccinationStatusChart component
const VaccinationStatusChart = ({ data, loading }) => {
  const theme = useTheme();
  
  const chartOptions = {
    chart: {
      type: 'donut',
      fontFamily: theme.typography.fontFamily,
      toolbar: {
        show: false
      }
    },
    labels: ['Vaccinated', 'Not Vaccinated'],
    colors: ['#4caf50', '#f44336'],
    legend: {
      position: 'bottom',
      fontSize: '14px'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px'
            },
            value: {
              show: true,
              fontSize: '20px',
              fontWeight: 600
            },
            total: {
              show: true,
              label: 'Total',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 250
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
  
  return (
    <Card sx={{ height: '100%' }} elevation={2}>
      <CardHeader 
        title="Vaccination Status" 
        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
      />
      <CardContent>
        {loading ? (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Chart
            options={chartOptions}
            series={data}
            type="donut"
            height={300}
          />
        )}
      </CardContent>
    </Card>
  );
};

// GradeWiseChart component
const GradeWiseChart = ({ data, loading }) => {
  const theme = useTheme();
  
  const chartOptions = {
    chart: {
      type: 'bar',
      fontFamily: theme.typography.fontFamily,
      toolbar: {
        show: false
      },
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4
      },
    },
    xaxis: {
      categories: data.map(item => `Grade ${item.grade}`),
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Students'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '14px'
    },
    colors: ['#4caf50', '#f44336'],
    dataLabels: {
      enabled: false
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " students"
        }
      }
    },
    fill: {
      opacity: 1
    }
  };
  
  const chartSeries = [
    {
      name: 'Vaccinated',
      data: data.map(item => item.vaccinated)
    },
    {
      name: 'Not Vaccinated',
      data: data.map(item => item.not_vaccinated)
    }
  ];
  
  return (
    <Card sx={{ height: '100%' }} elevation={2}>
      <CardHeader 
        title="Vaccination by Grade" 
        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
      />
      <CardContent>
        {loading ? (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={300}
          />
        )}
      </CardContent>
    </Card>
  );
};

// Recent activity component
const RecentActivities = ({ activities, loading }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'student':
        return <PeopleIcon sx={{ color: '#4caf50' }} />;
      case 'vaccine':
        return <VaccineIcon sx={{ color: '#2979ff' }} />;
      case 'drive':
        return <EventIcon sx={{ color: '#f44336' }} />;
      default:
        return <InfoIcon sx={{ color: '#9e9e9e' }} />;
    }
  };
  
  return (
    <Card sx={{ height: '100%' }} elevation={2}>
      <CardHeader 
        title="Recent Activities" 
        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
        action={
          <Button 
            component={Link} 
            to="/activities"
            size="small"
            endIcon={<ArrowForwardIcon />}
          >
            View All
          </Button>
        }
      />
      <CardContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ px: 2, py: 1 }}>
            {[1, 2, 3, 4].map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <List sx={{ width: '100%', p: 0 }}>
            {activities.map((activity) => (
              <ListItem 
                key={activity.id}
                sx={{ 
                  borderBottom: '1px solid #f0f0f0',
                  '&:hover': { bgcolor: '#f8f9fa' }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${activity.type === 'student' ? '#e8f5e9' : activity.type === 'vaccine' ? '#e3f2fd' : '#ffebee'}` }}>
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.message}
                  secondary={activity.time}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_students: 0,
    vaccinated_students: 0,
    vaccination_percentage: 0,
    upcoming_drives: 0
  });
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [vaccinationByGrade, setVaccinationByGrade] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API calls with setTimeout for demo purposes
        setTimeout(() => {
          // Mock data for demonstration
          setStats({
            total_students: 1250,
            vaccinated_students: 875,
            vaccination_percentage: 70,
            upcoming_drives: 3
          });
          
          setUpcomingDrives([
            {
              id: 1,
              vaccine_name: 'MMR Vaccine',
              date: '2025-05-20',
              doses_available: 200,
              doses_used: 45,
              applicable_grades: '5-6'
            },
            {
              id: 2,
              vaccine_name: 'Polio Vaccine',
              date: '2025-05-25',
              doses_available: 150,
              doses_used: 0,
              applicable_grades: '7-8'
            },
            {
              id: 3,
              vaccine_name: 'Influenza Vaccine',
              date: '2025-06-10',
              doses_available: 300,
              doses_used: 78,
              applicable_grades: '5-8'
            }
          ]);
          
          setVaccinationByGrade([
            { grade: '5', vaccinated: 220, not_vaccinated: 30 },
            { grade: '6', vaccinated: 180, not_vaccinated: 70 },
            { grade: '7', vaccinated: 250, not_vaccinated: 50 },
            { grade: '8', vaccinated: 225, not_vaccinated: 100 },
            { grade: '9', vaccinated: 0, not_vaccinated: 125 }
          ]);
          
          setRecentActivities([
            {
              id: 1,
              type: 'drive',
              message: 'MMR Vaccination drive completed for Grade 5',
              time: '2 hours ago'
            },
            {
              id: 2,
              type: 'student',
              message: '15 new students added to Grade 7',
              time: '1 day ago'
            },
            {
              id: 3,
              type: 'vaccine',
              message: 'Influenza Vaccine stock updated (300 doses)',
              time: '2 days ago'
            },
            {
              id: 4,
              type: 'drive',
              message: 'Polio Vaccination drive scheduled for May 25',
              time: '3 days ago'
            }
          ]);
          
          setLoading(false);
        }, 1500); // Simulate loading delay
        
        // In a real application, you would use actual API calls:
        // const statsResponse = await axios.get('/api/reports/dashboard_stats/');
        // setStats(statsResponse.data);
        // etc.
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Prepare data for vaccination status chart
  const vaccinationStatusData = [
    stats.vaccinated_students,
    stats.total_students - stats.vaccinated_students
  ];
  
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Welcome back! Here's what's happening with vaccinations today.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/reports"
            startIcon={<TrendingUpIcon />}
          >
            View Reports
          </Button>
          <Button 
            variant="contained" 
            component={Link} 
            to="/drives/add"
            startIcon={<AddIcon />}
          >
            New Drive
          </Button>
        </Box>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Students"
            value={stats.total_students}
            icon={<PeopleIcon />}
            iconColor="#2979ff"
            change="5.7"
            trend="up"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Vaccinated Students"
            value={stats.vaccinated_students}
            icon={<VaccineIcon />}
            iconColor="#4caf50"
            change="12.3"
            trend="up"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Vaccination Rate"
            value={`${stats.vaccination_percentage}%`}
            icon={<CheckIcon />}
            iconColor="#ff9800"
            change="3.2"
            trend="up"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Upcoming Drives"
            value={stats.upcoming_drives}
            icon={<CalendarIcon />}
            iconColor="#f44336"
            loading={loading}
          />
        </Grid>
      </Grid>
      
      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <GradeWiseChart data={vaccinationByGrade} loading={loading} />
        </Grid>
        <Grid item xs={12} md={4}>
          <VaccinationStatusChart data={vaccinationStatusData} loading={loading} />
        </Grid>
      </Grid>
      
      {/* Upcoming Drives & Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>Upcoming Vaccination Drives</Typography>
            <Button 
              component={Link} 
              to="/drives" 
              size="small"
              endIcon={<ArrowForwardIcon />}
            >
              View All
            </Button>
          </Box>
          {loading ? (
            <Grid container spacing={2}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} sm={6} key={item}>
                  <DriveCard loading={true} />
                </Grid>
              ))}
            </Grid>
          ) : upcomingDrives.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }} elevation={2}>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                No upcoming vaccination drives scheduled
              </Typography>
              <Button 
                component={Link} 
                to="/drives/add" 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Schedule a Drive
              </Button>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {upcomingDrives.map((drive) => (
                <Grid item xs={12} sm={6} key={drive.id}>
                  <DriveCard drive={drive} loading={loading} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} md={5}>
          <RecentActivities activities={recentActivities} loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;