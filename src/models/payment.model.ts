import { DataTypes, Model, Sequelize } from "sequelize"; // make sure this exists

class Payment extends Model {
  public id!: number;
  public transactionId!: string;
  public orderId!: number;
  public paymentStatus!: "succeeded" | "failed" | "pending";
  public paymentMode!: string;
  public amount!: number;
  public currency!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Payment.init(
      {
        transactionId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        paymentStatus: {
          type: DataTypes.ENUM("success", "failed", "pending"),
          allowNull: false,
        },
        paymentMode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        amount: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        currency: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "INR",
        },
      },
      {
        sequelize,
        modelName: "Payment",
        tableName: "payments",
      }
    );
  }
}

export default Payment;
