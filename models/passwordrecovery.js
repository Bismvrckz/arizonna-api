"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class passwordrecovery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      passwordrecovery.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "userVerifications",
      });
    }
  }
  passwordrecovery.init(
    {
      recovery_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
    },
    {
      sequelize,
      modelName: "passwordrecovery",
    }
  );
  return passwordrecovery;
};
