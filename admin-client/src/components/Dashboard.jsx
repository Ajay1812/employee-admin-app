import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Menu, MenuItem, Avatar } from '@mui/material';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import logo from '../assets/Logo.svg'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { CreateEmployee } from './CreateEmployee.jsx';
import { EmployeeList } from './EmployeeList.jsx';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config.js';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const NAVIGATION = [
  {
    segment: 'employeelist',
    title: 'Employee List',
    icon: <VisibilityOutlinedIcon />,
  },
  {
    segment: 'createemployee',
    title: 'Add Employee',
    icon: <PersonAddIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  // colorSchemes: { light: true, dark: true },
  colorSchemes: { light: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  if (pathname === '/createemployee') {
    return <CreateEmployee />;
  }
  if (pathname === '/employeelist') {
    return <EmployeeList />;
  }
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export function Dashboard(props) {
  const { window } = props;
  const navigator = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [username, setUsername] = React.useState('')

  const router = useDemoRouter('/employeelist');
  const demoWindow = window !== undefined ? window() : undefined;
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = () => {
    localStorage.removeItem('token')
    toast.success("Admin Logout!", {
      position: "top-center",
      autoClose: 1000,
    });
    setTimeout(() => {
      navigator('/login')
    }, 1000)
    handleMenuClose();
  };

  React.useEffect(() => {
    const fetchProfileName = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching profile name:", error);
      }
    };
    fetchProfileName();
  }, []);

  return (
    <AppProvider
      branding={{
        logo: <img style={{ color: "blue" }} src={logo} alt="logo" />,
        title: 'Dealsdray',
      }}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <IconButton onClick={handleMenuClick}>
            <Avatar sx={{ width: 32, height: 32 }}>{username.toUpperCase()[0]}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem>{username ? `${username}` : "Loading..."}</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Logout')}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
      <ToastContainer />
    </AppProvider>
  );
}

Dashboard.propTypes = {
  window: PropTypes.func,
};

