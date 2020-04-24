'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    stockname: DataTypes.STRING,
    stockcode: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    qty: DataTypes.NUMBER,
    value: DataTypes.NUMBER
  }, {});
  Stock.associate = function(models) {
    // associations can be defined here
  };
  return Stock;
};