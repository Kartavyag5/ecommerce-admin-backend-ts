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
          references: {
            model: "customers",
            key: "id",
          },
        },
        status: {
          type: DataTypes.ENUM(
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
          ),
          allowNull: false,
          defaultValue: "Pending", // optional: pending, shipped, delivered, etc.
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
