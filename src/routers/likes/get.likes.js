const express = require("express");
const router = express.Router();
const { post } = require("../../../models");
const { like } = require("../../../models");
const { auth } = require("../../helpers/auth");
const { comment } = require("../../../models");

const getUserLikes = async (req, res, next) => {
  try {
    const getUserLikesSequelize = await like.findAll({
      where: { user_id: req.user.dataValues.user_id },
    });

    let userLikedPostsMapped = [];

    for (let i = 0; i < getUserLikesSequelize.length; i++) {
      const { post_id } = getUserLikesSequelize[i].dataValues;

      const findPost = await post.findOne({
        where: { post_id },
        include: [
          { model: like, as: "postLikes" },
          { model: comment, as: "postComments" },
        ],
      });

      userLikedPostsMapped.push(findPost.dataValues);
    }

    res.send({
      status: "Success",
      message: "Get user liked post",
      data: { userLikedPostsMapped },
    });
  } catch (error) {
    next(error);
  }
};

router.get("/userLikes/:user_id", auth, getUserLikes);

module.exports = router;
