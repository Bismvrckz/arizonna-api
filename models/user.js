"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasMany(models.post, { foreignKey: "user_id", as: "posts" });
      users.hasMany(models.like, { foreignKey: "user_id", as: "userLikes" });
      users.hasMany(models.comment, {
        foreignKey: "user_id",
        as: "userComments",
      });
      users.hasMany(models.Verification, {
        foreignKey: "user_id",
        as: "userVerification",
      });
    }
  }
  users.init(
    {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      user_avatar: {
        type: DataTypes.STRING(100),
        defaultValue: "http://localhost:2000/images/defaultAvatar.png",
      },
      user_password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return users;
};

// asdsd
