'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const password = bcrypt.hashSync('admin', 10)

    return queryInterface.bulkInsert('Users', [{
      firstname: 'admin',
      username: 'admin',
      email: 'admin@email.com',
      password: password,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {
      username: 'admin'
    });
  }
};
