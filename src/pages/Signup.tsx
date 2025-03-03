import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper,
  FormControlLabel, 
  Checkbox 
} from '@mui/material';

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  isNotRobot: boolean;
}

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>();
  const navigate = useNavigate();

  const onSubmit = (data: SignupForm) => {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (existingUsers.some((user: SignupForm) => user.email === data.email)) {
      alert('Email already exists!');
      return;
    }

    const newUser = { ...data, role: 'customer' }; // Set role as "customer" by default
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    console.log('User signed up:', data);
    navigate('/dashboard');    
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f5f5f5',
      p: 2
    }}>
      <Box sx={{ 
        maxWidth: 500, 
        mx: 'auto', 
        mt: 4 
      }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Join our platform by filling in your details
          </Typography>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                margin="normal"
                {...register('firstName', { required: 'First Name is required' })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                margin="normal"
                {...register('lastName', { required: 'Last Name is required' })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Box>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="Phone"
              variant="outlined"
              margin="normal"
              {...register('phone', { 
                required: 'Phone is required',
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: 'Phone must be 10 digits starting with 6,7,8, or 9'
                }
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              margin="normal"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <FormControlLabel
              control={
                <Checkbox 
                  {...register('isNotRobot', { required: 'Please confirm you are not a robot' })} 
                />
              }
              label="I am not a robot"
              sx={{ my: 2 }}
            />
            {errors.isNotRobot && (
              <Typography color="error" variant="body2">
                {errors.isNotRobot.message}
              </Typography>
            )}
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              size="large"
              sx={{ 
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                textTransform: 'none',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #2196f3 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 10px rgba(0,0,0,0.15)',
                },
              }}
            >
              Sign Up
            </Button>
          </form>
          
          <Typography 
            variant="body2" 
            align="center" 
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            Already have an account? <a href="/login">Login</a>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Signup;