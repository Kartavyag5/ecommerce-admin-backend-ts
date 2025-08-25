'use client';
import { useEffect, useState } from 'react';
import { Container, Grid, TextField, Typography } from '@mui/material';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const fetchProducts = async (query = '') => {
    try {
      const res = await api.get(`/products${query ? `?search=${query}` : ''}`);
      setProducts(res.data.data);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    fetchProducts(query);
  };

  return (
    <Container>
      <Typography variant="h4" mt={4} mb={2}>Products</Typography>
      <TextField fullWidth placeholder="Search products..." value={search} onChange={handleSearch} />
      <Grid container spacing={2} mt={2}>
        {products.map((product: any) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
