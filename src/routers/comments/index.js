const express = require("express");
const router = express.Router();

const deleteCommentRouter = require("./delete.comments");
const postCommentRouter = require("./post.comments");

router.use(deleteCommentRouter);
router.use(postCommentRouter);

module.exports = router;
