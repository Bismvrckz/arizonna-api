const express = require("express");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const { post } = require("../../../models");
const { like } = require("../../../models");
const { comment } = require("../../../models");
const { uploadPosts } = require("../../lib/multer");

const newUserPosts = async (req, res, next) => {
  try {
    const postCount = req.userPost.length;
    const { user_id } = req.params;
    const currentDate = new Date();
    const postId_maker = currentDate.getTime();
    const { username } = req.user.dataValues;

    const resCreateUserPost = await post.create({
      user_id,
      post_id: `${username}-${postId_maker}`,
      postImage: `http://localhost:2000/userPosts/${username}-post-${req.custom_id}.png`,
      caption: req.body.caption,
    });

    res.send({
      status: "Success",
      message: "New user post",
      detail: {
        resCreateUserPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPostDetail = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const { commentLimit, commentOffset } = req.body;

    const resGetUserPosts = await post.findAll({
      where: { post_id },
      include: [
        { model: like, as: "postLikes" },
        {
          model: comment,
          as: "postComments",
          limit: commentLimit,
          offset: commentOffset,
          order: [["updatedAt", "DESC"]],
        },
      ],
    });

    const fullCommentsLength = await comment.findAll({ where: { post_id } });

    res.send({
      status: "Success",
      message: "Get post detail",
      detail: resGetUserPosts,
      fullCommentsLength,
    });
  } catch (error) {
    next(error);
  }
};

const getPostLimited = async (req, res, next) => {
  try {
    const { limit } = req.body;

    let { offset } = req.body;

    if (!offset) {
      offset = 0;
    }

    const resGetAllPostLimited = await post.findAll({
      include: { model: like, as: "postLikes" },
      order: [["post_id", "desc"]],
      limit,
      offset,
    });

    const getAllPostLength = await post.findAll();

    res.send({
      status: "Success",
      message: "Success get limited post",
      detail: resGetAllPostLimited,
      allpostlength: getAllPostLength.length,
    });
  } catch (error) {
    next(error);
  }
};

router.post(
  "/newPosts/:user_id",
  auth,
  uploadPosts.single("newPosts"),
  newUserPosts
);
router.post("/getPostLimited", getPostLimited);
router.post("/:post_id", getPostDetail);

module.exports = router;
