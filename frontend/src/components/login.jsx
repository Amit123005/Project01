import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');

    try {
      const response = await axios.post('http://163.125.102.142:5000/api/login_new', {
        username,
        password
      });
      // console.log(response);

      if (response.data.status === 'success') {
        login(
          response.data.user_id,
          response.data.access_level,
          response.data.department,
          response.data.username,   // 👈 make sure your API returns this
          response.data.name,       // 👈 and this
          response.data.email       // 👈 and this
        );
        if (response.data.department ==='Production' ||response.data.department ==='All' ||response.data.department ==='Digitalization')
          navigate('/'); 
        else if ( response.data.department ==='PPC')
          navigate('/plans')
        else if ( response.data.department ==='Maintenance')
          navigate('/usdt')
        else if ( response.data.department ==='Quality')
          navigate('/dbdef')
      } else {
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #a0768c, #5c678c)',
        p: 2,
      }}
    >

      <Box
        component="img"
        src="/assets/omlogo.png"
        alt="Software Logo"
        sx={{
          mb: 4,
          mt: -20,
          height: 'auto',
          maxHeight: 150,
          display: 'block',
        }}
      />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          backgroundColor: 'rgba(170, 179, 204, 0.4)', // Semi-transparent background for the box
          borderRadius: 2,
          boxShadow: 3,
          py: 5, // Padding
          color: 'white',
        }}
      >
        <Box
            component="img"
            src="/assets/logo.jpg" // Path to your company logo
            alt="Company Logo"
            sx={{
              mb: 3, // Margin bottom to space out from the form below
              height: 'auto',
              maxHeight: 70, // Limit the height of the logo
              display: 'block',
              mx: 'auto', // Center the logo horizontally
            }}
          />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h3" color="inherit">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Typography component="h1" variant="h5" color="inherit" mb="-10px">
            Username
          </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              name="username"
              autoComplete="username"
              autoFocus
              InputLabelProps={{ style: { color: 'white' } }} // White label color
              InputProps={{ style: { color: 'white' } }} // White text color
            />
            <Typography component="h1" variant="h5" color="inherit" mb="-10px">
            Password
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              InputLabelProps={{ style: { color: '#43648e' } }} // White label color
              InputProps={{
                style: { color: 'white' }, // White text color
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ backgroundColor: 'inherit', color: 'white' }} // White icon color
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {error && <Typography color="error">{error}</Typography>}
            <FormControlLabel
              control={<Checkbox value="remember" sx={{ color: '#00FF66' }} />} // Electric Green checkbox
              label="Remember me"
              sx={{ color: 'white' }} // White label color
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#43648e' }} // Deep Blue button
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
