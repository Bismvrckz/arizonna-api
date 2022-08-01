const express = require("express");
const router = express.Router();

const postLikesRouter = require("./post.likes");
const getLikesRouter = require("./get.likes");

router.use(postLikesRouter);
router.use(getLikesRouter);

module.exports = router;
