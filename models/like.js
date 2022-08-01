"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      like.belongsTo(models.post, { foreignKey: "post_id", as: "postLikes" });
      like.belongsTo(models.user, { foreignKey: "user_id", as: "userLikes" });
    }
  }
  like.init(
    {
      like_id: {
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
        allowNull: false,
        references: {
          model: "post",
          key: "post_id",
        },
      },
      liked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "like",
    }
  );
  return like;
};
