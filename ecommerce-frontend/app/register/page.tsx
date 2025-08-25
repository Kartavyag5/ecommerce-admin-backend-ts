'use client';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { useState } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', form); // Make sure this endpoint exists
      alert('Registration successful!');
      router.push('/login');
    } catch {
      alert('Registration failed.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h5">Register</Typography>
        <TextField fullWidth margin="normal" label="Name" name="name" onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Email" name="email" onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Phone" name="phone" onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Address" name="address" onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} />
        <Button variant="contained" fullWidth onClick={handleRegister}>Register</Button>
      </Box>
    </Container>
  );
}
