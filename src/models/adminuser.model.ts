import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

class AdminUser extends Model {}

AdminUser.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'admin',
  }
}, {
  sequelize,
  modelName: 'AdminUser',
  tableName: 'admin_users',
  timestamps: true
});

export default AdminUser;
