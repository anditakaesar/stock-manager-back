'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: DataTypes.INTEGER,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    createdat: DataTypes.DATE,
    updatedat: DataTypes.DATE
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};