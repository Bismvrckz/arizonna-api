"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      post.belongsTo(models.user, { foreignKey: "user_id", as: "posts" });
      post.hasMany(models.like, { foreignKey: "post_id", as: "postLikes" });
      post.hasMany(models.comment, {
        foreignKey: "post_id",
        as: "postComments",
      });
    }
  }
  post.init(
    {
      post_id: {
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
      caption: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
      },
      postImage: {
        type: DataTypes.STRING(100),
      },
    },
    {
      sequelize,
      modelName: "post",
    }
  );
  return post;
};
