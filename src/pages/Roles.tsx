// src/pages/Roles.tsx
import React, { useState } from 'react';
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
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  InputAdornment,
} from '@mui/material';
import { Edit, Delete, Search as SearchIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';

interface Role {
  id: number;
  name: string;
  menus: string[];
}

const dummyMenus = ['Dashboard', 'Users', 'Sites', 'Roles', 'Reports', 'Settings'];

// Define a color palette for each menu item
const menuColors: { [key: string]: string } = {
  Dashboard: 'lightblue', 
  Users: 'lightpink',    
  Sites: 'lightcyan',     
  Roles: ' yellow',     
  Reports: 'lightgreen',   
  Settings: 'lightcoral',  
};

const getMenuColor = (menu: string) => {
  return menuColors[menu] || '#e0e0e0'; // Default to light gray if menu not found
};

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: 'Admin', menus: ['Dashboard', 'Users', 'Sites', 'Roles'] },
    { id: 2, name: 'Manager', menus: ['Dashboard', 'Sites'] },
  ]);
  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit, reset, setValue, watch } = useForm<Role>();
  const selectedMenus = watch('menus', []);

  const handleOpen = (role?: Role) => {
    if (role) {
      setEditRole(role);
      setValue('name', role.name);
      setValue('menus', role.menus);
    } else {
      setEditRole(null);
      reset();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditRole(null);
    reset();
  };

  const onSubmit = (data: Role) => {
    if (editRole) {
      setRoles(roles.map((r) => (r.id === editRole.id ? { ...r, ...data } : r)));
    } else {
      setRoles([...roles, { ...data, id: roles.length + 1 }]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  const filteredRoles = roles.filter((role) =>
    Object.values(role).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Layout title="Roles Management">
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
          Add Role
        </Button>

        <TextField
          variant="outlined"
          placeholder="Search roles..."
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

      <Table sx={{ minWidth: 650, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Menus</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRoles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                {role.menus.map((menu) => (
                  <Chip
                    key={menu}
                    label={menu}
                    size="small"
                    sx={{
                      m: 0.5,
                      backgroundColor: getMenuColor(menu), // Dynamic background color based on menu name
                      color: 'text.primary', // Dark text for contrast
                      fontWeight: 500, // Semibold text
                    }}
                  />
                ))}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpen(role)}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => handleDelete(role.id)}>
                  <Delete color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Role Name"
              variant="outlined"
              margin="normal"
              {...register('name', { required: 'Role name is required' })}
            />
            <Select
              multiple
              fullWidth
              value={selectedMenus}
              {...register('menus')}
              onChange={(e) => setValue('menus', e.target.value as string[])}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              sx={{ mt: 2 }}
            >
              {dummyMenus.map((menu) => (
                <MenuItem key={menu} value={menu}>
                  <Checkbox checked={selectedMenus.indexOf(menu) > -1} />
                  <ListItemText primary={menu} />
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editRole ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
};

export default Roles;