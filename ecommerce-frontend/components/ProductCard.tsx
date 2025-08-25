import { Card, CardContent, CardMedia, Typography } from '@mui/material';

export default function ProductCard({ product }: { product: any }) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={product.imageUrl?.includes('uploads') ? `http://localhost:3000${product.imageUrl}` : product.imageUrl}
        alt={product.name}
      />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          ₹{product.price}
        </Typography>
      </CardContent>
    </Card>
  );
}
