// models/ProductImage.ts
import { Model, DataTypes, Sequelize } from "sequelize";

export class ProductImage extends Model {
  static initModel(sequelize: Sequelize) {
    ProductImage.init({
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
      image_url: DataTypes.STRING,
      alt_text: DataTypes.STRING,
      is_primary: DataTypes.BOOLEAN,
    }, {
      sequelize,
      modelName: "ProductImage",
      tableName: "product_images",
      timestamps: true,
    });
  }
}
 export default ProductImage;