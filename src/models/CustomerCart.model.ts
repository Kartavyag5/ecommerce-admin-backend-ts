import { DataTypes, Model, Sequelize } from 'sequelize';

class CustomerCart extends Model {
  public id!: number;
  public customerId!: number;
  public productId!: number;
  public quantity!: number;

  static initModel(sequelize: Sequelize) {
    CustomerCart.init(
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
            model: 'customers',
            key: 'id',
          },
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id',
          },
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        modelName: 'CustomerCart',
        tableName: 'customer_cart',
        timestamps: true,
      }
    );
  }
}

export default CustomerCart;
