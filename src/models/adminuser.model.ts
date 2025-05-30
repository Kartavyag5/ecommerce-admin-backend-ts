import { DataTypes, Model, Sequelize } from "sequelize";

class AdminUser extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;

  static initModel(sequelize: Sequelize) {
    AdminUser.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "AdminUser",
        tableName: "admin_users",
        timestamps: true,
      }
    );
  }
}

export default AdminUser;
