// migrations/xxxxxx-add-deleted-at-to-products.ts

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("products", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("products", "deletedAt");
  },
};
