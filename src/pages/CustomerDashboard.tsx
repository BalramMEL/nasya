import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableHead, TableRow, TextField, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';

interface Leave {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Site {
  id: number;
  image: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

const StatCard: React.FC<{ title: string; value: number; change?: string; subText?: string }> = ({ title, value, change, subText }) => (
  <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
    <CardContent>
      <Typography variant="subtitle1" color="text.secondary">{title}</Typography>
      <Typography variant="h4" sx={{ mb: 1 }}>{value}</Typography>
      {change && (
        <Typography variant="body2" color={change.startsWith('+') ? 'success.main' : 'error.main'}>{change}</Typography>
      )}
      {subText && (
        <Typography variant="body2" color="text.secondary">{subText}</Typography>
      )}
    </CardContent>
  </Card>
);

const CustomerDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const sites = JSON.parse(localStorage.getItem('sites') || '[]');
  const [leaves, setLeaves] = useState<Leave[]>(() => JSON.parse(localStorage.getItem(`leaves_${currentUser.id}`) || '[]'));
  const [open, setOpen] = useState(false);
  const [editLeave, setEditLeave] = useState<Leave | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Leave>();
  const mappedSite: Site | undefined = sites.find((s: Site) => s.id === currentUser.siteId);

  useEffect(() => {
    localStorage.setItem(`leaves_${currentUser.id}`, JSON.stringify(leaves));
  }, [leaves, currentUser.id]);

  const handleOpen = (leave?: Leave) => {
    if (leave) {
      setEditLeave(leave);
      setValue('type', leave.type);
      setValue('startDate', leave.startDate);
      setValue('endDate', leave.endDate);
      setValue('description', leave.description);
    } else {
      setEditLeave(null);
      reset();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditLeave(null);
    reset();
  };

  const onSubmit = (data: Leave) => {
    if (editLeave) {
      setLeaves(leaves.map((l) => (l.id === editLeave.id ? { ...l, ...data } : l)));
    } else {
      setLeaves([...leaves, { ...data, id: leaves.length + 1 }]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setLeaves(leaves.filter((l) => l.id !== id));
  };

  return (
    <Layout title="Customer Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color="text.secondary">Welcome, {currentUser.fullName}</Typography>
      </Box>

      {/* Cards Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <StatCard
            title="Total Leaves"
            value={leaves.length}
            change="+2 from the previous 7 days"
            subText="On average, 1 leave per week."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard
            title="Site Visits"
            value={Math.floor(Math.random() * 10)} // Dummy data
            change="+3 from the previous 7 days"
            subText="On average, 2 visits per week."
          />
        </Grid>
      </Grid>

      {/* Mapped Site Section */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
            Mapped Site Details
          </Typography>
          {mappedSite ? (
            <Grid container spacing={3}>
              {/* Site Image */}
              <Grid item xs={12} sm={4}>
                {mappedSite.image ? (
                  <Box
                    component="img"
                    src={mappedSite.image}
                    alt={mappedSite.name}
                    sx={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 150,
                      backgroundColor: '#f0f0f0',
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No Image Available
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Site Details */}
              <Grid item xs={12} sm={5}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                  {mappedSite.name}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Address:</strong> {mappedSite.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>City:</strong> {mappedSite.city}, {mappedSite.state}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Country:</strong> {mappedSite.country} - {mappedSite.postalCode}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                      borderColor: '#1565c0',
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                  onClick={() => alert('Feature not implemented: Navigate to site details')}
                >
                  View More Details
                </Button>
              </Grid>

              {/* Simulated Map Preview */}
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    width: '100%',
                    height: 150,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Map Preview (Simulated)
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 20,
                      height: 20,
                      backgroundColor: '#1976d2',
                      borderRadius: '50%',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 8px rgba(0,0,0,0.2)',
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No site assigned
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Leaves List Section */}
      <Box>
        <Button
          variant="contained"
          onClick={() => handleOpen()}
          sx={{
            mb: 2,
            borderRadius: 2,
            padding: '10px 20px',
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
          Add Leave
        </Button>
        <Table sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.type}</TableCell>
                <TableCell>{leave.startDate}</TableCell>
                <TableCell>{leave.endDate}</TableCell>
                <TableCell>{leave.description}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" size="small" onClick={() => handleOpen(leave)} sx={{ mr: 1 }}>Edit</Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(leave.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editLeave ? 'Edit Leave' : 'Add Leave'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Leave Type"
              {...register('type', { required: 'Leave type is required' })}
              error={!!errors.type}
              helperText={errors.type?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('startDate', { required: 'Start date is required' })}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('endDate', { required: 'End date is required' })}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              {...register('description', { required: 'Description is required' })}
              error={!!errors.description}
              helperText={errors.description?.message}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained">{editLeave ? 'Update' : 'Save'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
};

export default CustomerDashboard;