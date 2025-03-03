import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, UploadFile } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

interface Customer {
  id: number;
  image: string;
  fullName: string;
  siteId: number;
  email: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  role: string;
  currentLocation: string;
  password: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : [];
  });
  const [sites] = useState(() => JSON.parse(localStorage.getItem('sites') || '[]'));
  const [open, setOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
    const [page, setPage] = useState(0);
    const [imagePreview, setImagePreview] = useState<string>('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Customer>();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const handleOpen = (customer?: Customer) => {
    if (customer) {
      setEditCustomer(customer);
        setValue('image', customer.image);
        setImagePreview(customer.image);
      setValue('fullName', customer.fullName);
      setValue('siteId', customer.siteId);
      setValue('email', customer.email);
      setValue('address', customer.address);
      setValue('phone', customer.phone);
      setValue('city', customer.city);
      setValue('state', customer.state);
      setValue('country', customer.country);
      setValue('role', customer.role);
      setValue('currentLocation', customer.currentLocation);
      setValue('password', customer.password);
    } else {
        setEditCustomer(null);
        reset();
        setValue('password', 'default123'); // Default password
        setImagePreview('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
      setEditCustomer(null);
      setImagePreview('');
    reset();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setValue('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: Customer) => {
    if (editCustomer) {
      setCustomers(customers.map((c) => (c.id === editCustomer.id ? { ...c, ...data } : c)));
    } else {
      setCustomers([...customers, { ...data, id: customers.length + 1 }]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  const handleViewDashboard = (customer: Customer) => {
    localStorage.setItem('currentUser', JSON.stringify(customer));
    navigate('/customer-dashboard');
  };

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Layout title="Customers Management">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          onClick={() => handleOpen()}
          sx={{
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
          Add Customer
        </Button>

        <TextField
          variant="outlined"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 500,
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                borderColor: 'rgba(0,0,0,0.1)',
              },
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Site</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>
                    {customer.image ? (
                      <img src={customer.image} alt={customer.fullName} style={{ width: 50, height: 50, borderRadius: 4 }} />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>{customer.fullName}</TableCell>
                  <TableCell>{sites.find((s: any) => s.id === customer.siteId)?.name || 'No Site'}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>{customer.state}</TableCell>
                  <TableCell>{customer.country}</TableCell>
                  <TableCell>{customer.role}</TableCell>
                  <TableCell>{customer.currentLocation}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleOpen(customer)}
                          sx={{
                            color: '#1976d2',
                            '&:hover': {
                              bgcolor: '#e3f2fd',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(customer.id)}
                          sx={{
                            color: '#d32f2f',
                            '&:hover': {
                              bgcolor: '#ffebee',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Dashboard">
                        <IconButton
                          onClick={() => handleViewDashboard(customer)}
                          sx={{
                            color: '#0288d1',
                            '&:hover': {
                              bgcolor: '#e1f5fe',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={imagePreview} sx={{ width: 80, height: 80 }} />
              <Button variant="contained" component="label" startIcon={<UploadFile />}>
                Upload Image
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>
            </Box>
            <TextField fullWidth label="Full Name" {...register('fullName', { required: true })} error={!!errors.fullName} helperText={errors.fullName && 'Required'} margin="normal" />
            <Select fullWidth {...register('siteId', { required: true })} defaultValue={editCustomer?.siteId || ''} sx={{ mt: 2 }}>
              {sites.map((site: any) => (
                <MenuItem key={site.id} value={site.id}>{site.name}</MenuItem>
              ))}
            </Select>
            <TextField fullWidth label="Email" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} error={!!errors.email} helperText={errors.email && 'Invalid email'} margin="normal" />
            <TextField fullWidth label="Address" {...register('address', { required: true })} error={!!errors.address} helperText={errors.address && 'Required'} margin="normal" />
            <TextField fullWidth label="Phone" {...register('phone', { required: true, pattern: /^[6-9]\d{9}$/ })} error={!!errors.phone} helperText={errors.phone && 'Invalid phone'} margin="normal" />
            <TextField fullWidth label="City" {...register('city', { required: true })} error={!!errors.city} helperText={errors.city && 'Required'} margin="normal" />
            <TextField fullWidth label="State" {...register('state', { required: true })} error={!!errors.state} helperText={errors.state && 'Required'} margin="normal" />
            <TextField fullWidth label="Country" {...register('country', { required: true })} error={!!errors.country} helperText={errors.country && 'Required'} margin="normal" />
            <TextField fullWidth label="Role" {...register('role', { required: true })} error={!!errors.role} helperText={errors.role && 'Required'} margin="normal" />
            <TextField fullWidth label="Current Location" {...register('currentLocation', { required: true })} error={!!errors.currentLocation} helperText={errors.currentLocation && 'Required'} margin="normal" />
            <TextField fullWidth label="Password" {...register('password', { required: true })} error={!!errors.password} helperText={errors.password && 'Required'} margin="normal" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained">{editCustomer ? 'Update' : 'Save'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
};

export default Customers;