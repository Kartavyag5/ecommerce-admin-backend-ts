// models/ProductAttribute.ts
import { Model, DataTypes, Sequelize } from "sequelize";

export class ProductAttribute extends Model {
  static initModel(sequelize: Sequelize) {
    ProductAttribute.init({
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
      attribute_name: DataTypes.STRING,
      value: DataTypes.STRING,
    }, {
      sequelize,
      modelName: "ProductAttribute",
      tableName: "product_attributes",
      timestamps: true,
    });
  }
}
export default ProductAttribute;