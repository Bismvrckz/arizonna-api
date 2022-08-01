const express = require("express");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const { comment } = require("../../../models");

const deleteComments = async (req, res, next) => {
  try {
    const { post_id } = req.params;

    const resDeleteComments = await comment.destroy({ where: { post_id } });

    res.send({
      status: "Success",
      message: "Success delete comments",
      detail: {
        post_id,
        resDeleteComments,
      },
    });
  } catch (error) {
    next(error);
  }
};

router.delete("/:post_id", deleteComments);

module.exports = router;
