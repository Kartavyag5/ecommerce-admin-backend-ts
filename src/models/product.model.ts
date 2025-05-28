import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../models/index';

class Product extends Model {}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true
});

export default Product;