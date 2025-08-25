'use client';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { useState } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      await api.post('/auth/login', form);
      alert('Login Successful');
      router.push('/');
    } catch {
      alert('Login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5}>
        <Typography variant="h5">Login</Typography>
        <TextField fullWidth margin="normal" label="Email" name="email" onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} />
        <Button variant="contained" fullWidth onClick={handleLogin}>Login</Button>
      </Box>
    </Container>
  );
}
