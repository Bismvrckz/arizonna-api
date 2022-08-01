const express = require("express");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const { post } = require("../../../models");
const { like } = require("../../../models");
const { comment } = require("../../../models");
// const { where } = require("sequelize/types");

const getUserPosts = async (req, res, next) => {
  try {
    const { user_id } = req.user.dataValues;

    const resGetUserPosts = await post.findAll({
      where: { user_id },
      include: [
        { model: like, as: "postLikes" },
        { model: comment, as: "postComments" },
      ],
    });

    res.send({
      status: "Success",
      message: "Success get user posts",
      data: resGetUserPosts,
    });
  } catch (error) {
    next(error);
  }
};

const getPostDetail = async (req, res, next) => {
  try {
    const { post_id } = req.params;

    const resGetUserPosts = await post.findAll({
      where: { post_id },
      include: [
        { model: like, as: "postLikes" },
        { model: comment, as: "postComments" },
      ],
    });

    console.log({ resGetUserPosts });

    res.send({
      status: "Success",
      message: "Get post detail",
      detail: resGetUserPosts,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPost = async (req, res, next) => {
  try {
    // const resGetAllPost = await post.findAll({
    //   include: { model: like, as: "postLikes" },
    // });

    console.log(req);

    res.send({
      status: "Success",
      message: "Success get all post",
      data: req.body,
    });
  } catch (error) {
    next(error);
  }
};

router.get("/", getAllPost);
router.get("/user/:user_id", auth, getUserPosts);
router.get("/:post_id", getPostDetail);

module.exports = router;
