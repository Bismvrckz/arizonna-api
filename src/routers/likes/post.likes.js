const express = require("express");
const router = express.Router();
const { like } = require("../../../models");

const newPostLike = async (req, res, next) => {
  try {
    const { user_id, post_id } = req.body;

    const resFindPostLike = await like.findOne({
      where: { like_id: `${post_id}-${user_id}` },
    });
    // console.log(resFindPostLike.dataValues.liked);

    if (resFindPostLike) {
      resFindPostLike.destroy({
        where: { like_id: `${post_id}-like-${user_id}` },
      });

      res.send({
        status: "Success delete like",
      });
      return;
    }

    const resNewPostLike = await like.create({
      like_id: `${post_id}-${user_id}`,
      user_id,
      post_id,
      liked: true,
    });

    console.log(resNewPostLike);

    res.send({
      status: "Success create like",
    });
  } catch (error) {
    next(error);
  }
};

router.post("/alterLike", newPostLike);

module.exports = router;
