import { DataTypes, Model, Sequelize } from "sequelize";

class Customer extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone?: string;
  public address?: string;

  static initModel(sequelize: Sequelize) {
    Customer.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        phone: {
          type: DataTypes.STRING,
        },
        address: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: "Customer",
        tableName: "customers",
        timestamps: true,
      }
    );
  }
}

export default Customer;
