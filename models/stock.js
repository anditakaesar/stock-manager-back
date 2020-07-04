'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    stockname: DataTypes.STRING,
    stockcode: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    qty: DataTypes.NUMBER,
    price: DataTypes.NUMBER,
    value: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.qty * 100 * this.price;
      },
      set(value) {
        throw new Error('Do not try to set the `value`!');
      }
    }
  }, {});
  Stock.associate = function(models) {
    // associations can be defined here
  };
  return Stock;
};