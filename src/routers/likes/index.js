const express = require("express");
const router = express.Router();

const postLikesRouter = require("./post.likes");

router.use(postLikesRouter);

module.exports = router;
