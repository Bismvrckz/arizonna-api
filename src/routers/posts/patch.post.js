const express = require("express");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const { post } = require("../../../models");

const editPostCaption = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const { postCaption } = req.body;

    const resFindPost = await post.findOne({ where: { post_id } });
    await resFindPost.update({
      caption: postCaption,
    });

    const resSaveCaption = resFindPost.save();

    res.send({
      status: "Success",
      caption: req.body.postCaption,
      resSaveCaption,
    });
  } catch (error) {
    next(error);
  }
};

router.patch("/editCaption/:post_id", editPostCaption);

module.exports = router;
