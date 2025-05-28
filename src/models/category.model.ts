import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

class Category extends Model {}

Category.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  modelName: 'Category',
  tableName: 'categories',
  timestamps: true
});

export default Category;
