import app from './app';
import { sequelize } from './models';
import { AdminUser } from './models';
import bcrypt from 'bcrypt';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Database connected!');
  await sequelize.sync();
    
});

