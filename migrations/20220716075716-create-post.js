"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("posts", {
      post_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      caption: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: "",
      },
      postImage: {
        type: Sequelize.STRING(100),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("posts");
  },
};
