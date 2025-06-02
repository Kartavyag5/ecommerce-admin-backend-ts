import express from 'express';
import { upload } from '../middlewares/upload';
import path from 'path';

const router = express.Router();

router.post('/image', upload.single('imageUrl'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const imageUrl = `/uploads/${file.filename}`; // relative URL
    res.json({ url: imageUrl });
});

export default router;
