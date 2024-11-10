import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.svg';

export const LandingPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <AppBar position="static" color="primary">
        <Toolbar>
          <img src={Logo} alt="App Logo" style={{ width: 40, height: 40, marginRight: 12 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Employee Admin App
          </Typography>
          <Button color="inherit" href="mailto:a.kumar01c@gmail.com">
            Contact Us
          </Button>
          <Button color="secondary" variant="contained" component={Link} to="/login">
            Sign In
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          textAlign: 'center',
          py: 8,
          backgroundColor: '#f8f9fa',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Employee Admin App
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Manage employees, appointments, and much more with ease.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/login"
          sx={{ mt: 3 }}
        >
          Get Started
        </Button>
      </Box>

      <Box id="features" sx={{ width: '100%', py: 8 }}>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="h3">
                Employee Management
              </Typography>
              <Typography color="text.secondary">
                Add, edit, and manage employee data from a single dashboard.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="h3">
                Secure Authentication
              </Typography>
              <Typography color="text.secondary">
                Secure sign-in and sign-up with modern authentication standards.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="h3">
                Appointment Scheduling
              </Typography>
              <Typography color="text.secondary">
                Efficiently schedule and track appointments.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          mt: 8,
          backgroundColor: '#343a40',
          color: '#fff',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Typography variant="body2" color="inherit">
          &copy; 2024 Employee Admin App. All rights reserved.
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Button color="inherit" component={Link} to="#features">Features</Button>
          <Button color="inherit" href="mailto:a.kumar01c@gmail.com">
            Contact Us
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
