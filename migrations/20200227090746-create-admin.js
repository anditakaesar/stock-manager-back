'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users',
      [
        { firstname: 'admin', 
          email: 'admin@email.com',
          createdat: Date.now(),
          updatedat: Date.now() 
        }
      ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users',
      { firstname: 'admin', email: 'admin@email.com' });
  }
};
