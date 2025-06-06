import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure 'uploads/' folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
        cb(null, uploadDir);
    },
    filename: (req:any, file:any, cb:any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

export const upload = multer({ storage });
