'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Stocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stockname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      stockcode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      qty: {
        allowNull: false,
        type: Sequelize.NUMBER
      },
      price: {
        allowNull: false,
        type: Sequelize.NUMBER
      },
      userid: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Stocks');
  }
};