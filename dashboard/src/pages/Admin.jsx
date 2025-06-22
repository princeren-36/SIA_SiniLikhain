import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Drawer, List, ListItem, ListItemText, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('overview');
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({ username: '', role: '' });

  useEffect(() => {
    axios.get("http://localhost:5000/users/all").then(res => setUsers(res.data));
    axios.get("http://localhost:5000/products?admin=true").then(res => setProducts(res.data));
  }, []);

  const handleApprove = async (id) => {
    await axios.patch(`http://localhost:5000/products/${id}/approve`);
    setProducts(products => products.map(p => p._id === id ? { ...p, approved: true } : p));
  };

  const handleReject = async (id) => {
    await axios.patch(`http://localhost:5000/products/${id}/reject`);
    setProducts(products => products.map(p => p._id === id ? { ...p, approved: false } : p));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Loginn");
  };

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditUserData({ username: user.username, role: user.role });
  };

  const handleEditChange = (e) => {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    const res = await axios.put(`http://localhost:5000/users/${id}`, editUserData);
    setUsers(users.map(u => u._id === id ? res.data : u));
    setEditUserId(null);
  };

  const handleDeleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };

  const navItems = [
    { label: "Overview", value: "overview" },
    { label: "Buyers", value: "buyer" },
    { label: "Artisans", value: "artisan" },
    { label: "CRUD Products", value: "crud" }
  ];

  const buyers = users.filter(u => u.role === "buyer");
  const artisans = users.filter(u => u.role === "artisan");

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 220,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box', background: '#1b2a41', color: '#ccc9dc' },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Admin Panel</Typography>
          <List>
            {navItems.map(item => (
              <ListItem button key={item.value} selected={view === item.value} onClick={() => setView(item.value)}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 4 }}>
        {view === "overview" && (
          <>
            <Typography variant="h4" gutterBottom>Overview</Typography>
            <Typography>Total Users: {users.length}</Typography>
            <Typography>Total Products: {products.length}</Typography>
            <Typography>Approved Products: {products.filter(p => p.approved).length}</Typography>
          </>
        )}

        {view === "buyer" && (
          <>
            <Typography variant="h4" gutterBottom>Buyers</Typography>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {buyers.map(u => (
                    <TableRow key={u._id}>
                      <TableCell>
                        {editUserId === u._id ? (
                          <TextField name="username" value={editUserData.username} onChange={handleEditChange} size="small" />
                        ) : (
                          u.username
                        )}
                      </TableCell>
                      <TableCell>
                        {editUserId === u._id ? (
                          <TextField name="role" value={editUserData.role} onChange={handleEditChange} size="small" />
                        ) : (
                          u.role
                        )}
                      </TableCell>
                      <TableCell>
                        {editUserId === u._id ? (
                          <>
                            <Button onClick={() => handleEditSave(u._id)} color="success">Save</Button>
                            <Button onClick={() => setEditUserId(null)} color="inherit">Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={() => handleEditClick(u)} color="primary">Edit</Button>
                            <Button onClick={() => handleDeleteUser(u._id)} color="error">Delete</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}

        {view === "artisan" && (
          <>
            <Typography variant="h4" gutterBottom>Artisans</Typography>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {artisans.map(u => (
                    <TableRow key={u._id}>
                      <TableCell>
                        {editUserId === u._id ? (
                          <TextField name="username" value={editUserData.username} onChange={handleEditChange} size="small" />
                        ) : (
                          u.username
                        )}
                      </TableCell>
                      <TableCell>
                        {editUserId === u._id ? (
                          <TextField name="role" value={editUserData.role} onChange={handleEditChange} size="small" />
                        ) : (
                          u.role
                        )}
                      </TableCell>
                      <TableCell>
                        {editUserId === u._id ? (
                          <>
                            <Button onClick={() => handleEditSave(u._id)} color="success">Save</Button>
                            <Button onClick={() => setEditUserId(null)} color="inherit">Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={() => handleEditClick(u)} color="primary">Edit</Button>
                            <Button onClick={() => handleDeleteUser(u._id)} color="error">Delete</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}

        {view === "crud" && (
          <>
            <Typography variant="h4" gutterBottom>CRUD Products</Typography>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Artisan</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Approved</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map(p => (
                    <TableRow key={p._id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.artisan}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>{p.approved ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {!p.approved && (
                          <Button color="success" onClick={() => handleApprove(p._id)}>Approve</Button>
                        )}
                        {p.approved && (
                          <Button color="warning" onClick={() => handleReject(p._id)}>Reject</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Admin;
