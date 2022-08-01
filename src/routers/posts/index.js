const express = require("express");
const router = express.Router();

const getPostsRouter = require("./get.posts");
const postPostsRouter = require("./post.posts");
const deletePostRouter = require("./delete.posts");
const patchPostRouter = require("./patch.post");

router.use(getPostsRouter);
router.use(postPostsRouter);
router.use(deletePostRouter);
router.use(patchPostRouter);

module.exports = router;
