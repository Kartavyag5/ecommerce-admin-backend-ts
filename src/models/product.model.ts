import { DataTypes, Model, Sequelize } from "sequelize";

class Product extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
  public price!: number;
  public imageUrl!: string;
  public categoryId!: number;

  static initModel(sequelize: Sequelize) {
    Product.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },

        imageUrl: {
          type: DataTypes.TEXT,
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "categories",
            key: "id",
          },
        },
        stock: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "Product",
        tableName: "products",
        timestamps: true,
      }
    );
  }
}

export default Product;
