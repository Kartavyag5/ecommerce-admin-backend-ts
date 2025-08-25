// models/ProductVariant.ts
import { Model, DataTypes, Sequelize } from "sequelize";

export class ProductVariant extends Model {
  static initModel(sequelize: Sequelize) {
    ProductVariant.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "products",
            key: "id",
          },
        },
      variant_name: DataTypes.STRING,
      value: DataTypes.STRING,
      price_override: DataTypes.DECIMAL(10, 2),
      stock_quantity: DataTypes.INTEGER,
    }, {
      sequelize,
      modelName: "ProductVariant",
      tableName: "product_variants",
      timestamps: true,
    });
  }
}
export default ProductVariant;