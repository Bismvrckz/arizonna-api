"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Verification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Verification.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "userVerification",
      });
    }
  }
  Verification.init(
    {
      verification_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "user",
          key: "user_id",
        },
      },
    },
    {
      sequelize,
      modelName: "Verification",
    }
  );
  return Verification;
};
