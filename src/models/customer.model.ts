import { DataTypes, Model, Sequelize } from "sequelize";
import bcrypt from "bcrypt";

class Customer extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone?: string;
  public address?: string;
  public password!: string;

  // ✅ Define the static initModel method properly
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
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "temp@123",
        },
      },
      {
        sequelize,
        modelName: "Customer",
        tableName: "customers",
        timestamps: true,
        hooks: {
          beforeCreate: async (customer: Customer) => {
            if (customer.password) {
              customer.password = await bcrypt.hash(customer.password, 10);
            }
          },
          beforeUpdate: async (customer: Customer) => {
            if (customer.changed("password")) {
              customer.password = await bcrypt.hash(customer.password, 10);
            }
          },
        },
      }
    );
  }

  // Optional: instance method for password check
  public async checkPassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}

export default Customer;
