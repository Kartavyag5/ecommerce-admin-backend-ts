import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "./index";

class Category extends Model {
  public id!: number;
  public name!: string;
  public description?: string;

  static initModel(sequelize: Sequelize) {
    Category.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
        },
      },
      {
        sequelize,
        modelName: "Category",
        tableName: "categories",
        timestamps: true,
      }
    );
  }
}

export default Category;
