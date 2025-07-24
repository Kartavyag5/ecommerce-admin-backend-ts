import "reflect-metadata";
import app from "./app";
import { sequelize } from "./models";
// import { AdminUser } from "./models";
import bcrypt from "bcrypt";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connected.");
    })
    .catch((err) => {
      console.error("DB connection error:", err);
    });
  // await sequelize.sync({ alter: true });
  await sequelize.sync();
});
