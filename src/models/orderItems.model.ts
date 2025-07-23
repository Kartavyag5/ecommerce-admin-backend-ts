import { DataTypes, Model, Sequelize } from "sequelize";

class OrderItems extends Model {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public price!: number;

  static initModel(sequelize: Sequelize) {
    OrderItems.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "orders",
            key: "id",
          },
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "products",
            key: "id",
          },
        },
        quantity: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            defaultValue: 1,
         },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "OrderItems",
        tableName: "orderItem",
        timestamps: true,
      }
    );
  }
}

export default OrderItems;
