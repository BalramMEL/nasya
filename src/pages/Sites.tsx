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
  IconButton,
  Input,
  TablePagination,
  Paper,
  Typography,
  InputAdornment,
} from '@mui/material';
import { Edit, Delete, Search as SearchIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';

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

const Sites = () => {
  const [sites, setSites] = useState<Site[]>(() => {
    const savedSites = localStorage.getItem('sites');
    return savedSites
      ? JSON.parse(savedSites)
      : [
          {
            id: 1,
            image: 'https://dummyimage.com/skyscraper/f0f/f',
            name: 'Supermarket',
            address: '123 Main St FC road',
            city: 'Pune',
            state: 'MH',
            country: 'IND',
            postalCode: '10001',
          },
        ];
  });
  const [open, setOpen] = useState(false);
  const [editSite, setEditSite] = useState<Site | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Site>();

  useEffect(() => {
    localStorage.setItem('sites', JSON.stringify(sites));
  }, [sites]);

  const handleOpen = (site?: Site) => {
    if (site) {
      setEditSite(site);
      setValue('image', site.image);
      setValue('name', site.name);
      setValue('address', site.address);
      setValue('city', site.city);
      setValue('state', site.state);
      setValue('country', site.country);
      setValue('postalCode', site.postalCode);
    } else {
      setEditSite(null);
      reset();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditSite(null);
    reset();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: Site) => {
    if (editSite) {
      setSites(sites.map((s) => (s.id === editSite.id ? { ...s, ...data } : s)));
    } else {
      setSites([...sites, { ...data, id: sites.length + 1 }]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setSites(sites.filter((s) => s.id !== id));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredSites = sites.filter((site) =>
    Object.values(site).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Layout title="Sites Management">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Add Site Button */}
        <Button
          variant="contained"
          onClick={() => handleOpen()}
          sx={{
            borderRadius: 2,
            padding: '10px 20px',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)', // Gradient background
            boxShadow: '0 3px 6px rgba(0,0,0,0.1)', // Subtle shadow
            textTransform: 'none', // Remove uppercase
            fontWeight: 500, // Semibold text
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #2196f3 90%)', // Darker gradient on hover
              transform: 'translateY(-2px)', // Slight lift on hover
              boxShadow: '0 5px 10px rgba(0,0,0,0.15)', // Enhanced shadow on hover
            },
          }}
        >
          Add Site
        </Button>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search sites..."
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
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Postal Code</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSites
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.id}</TableCell>
                  <TableCell>
                    {site.image ? (
                      <img
                        src={site.image}
                        alt={site.name}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>{site.address}</TableCell>
                  <TableCell>{site.city}</TableCell>
                  <TableCell>{site.state}</TableCell>
                  <TableCell>{site.country}</TableCell>
                  <TableCell>{site.postalCode}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(site)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(site.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSites.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editSite ? 'Edit Site' : 'Add Site'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Input
              type="file"
              fullWidth
              inputProps={{ accept: 'image/*' }}
              onChange={handleImageUpload}
              sx={{ mb: 2 }}
            />
            {errors.image && (
              <Typography color="error" variant="body2">
                {errors.image.message}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              margin="normal"
              {...register('address', { required: 'Address is required' })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
            <TextField
              fullWidth
              label="City"
              variant="outlined"
              margin="normal"
              {...register('city', { required: 'City is required' })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
            <TextField
              fullWidth
              label="State"
              variant="outlined"
              margin="normal"
              {...register('state', { required: 'State is required' })}
              error={!!errors.state}
              helperText={errors.state?.message}
            />
            <TextField
              fullWidth
              label="Country"
              variant="outlined"
              margin="normal"
              {...register('country', { required: 'Country is required' })}
              error={!!errors.country}
              helperText={errors.country?.message}
            />
            <TextField
              fullWidth
              label="Postal Code"
              variant="outlined"
              margin="normal"
              {...register('postalCode', { 
                required: 'Postal Code is required',
                // pattern: {
                //   value: /^\d{5}(-\d{4})?$/,
                //   message: 'Invalid postal code format'
                // }
              })}
              error={!!errors.postalCode}
              helperText={errors.postalCode?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editSite ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
};

export default Sites;