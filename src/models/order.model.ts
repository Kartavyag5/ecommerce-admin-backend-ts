import { DataTypes, Model, Sequelize } from "sequelize";

class Order extends Model {
  public id!: number;
  public customerId!: number;
  public status!: string;
  public totalAmount!: number;

  static initModel(sequelize: Sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        customerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "pending", // optional: pending, shipped, delivered, etc.
        },
        totalAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Order",
        tableName: "orders",
        timestamps: true,
      }
    );
  }
}

export default Order;
