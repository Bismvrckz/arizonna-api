"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      comment.belongsTo(models.post, {
        foreignKey: "post_id",
        as: "postComments",
      });
      comment.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "userComments",
      });
    }
  }
  comment.init(
    {
      comment_id: {
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
      post_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "post",
          key: "post_id",
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_avatar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      commentPhrase: {
        type: DataTypes.STRING(300),
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      sequelize,
      modelName: "comment",
    }
  );
  return comment;
};
