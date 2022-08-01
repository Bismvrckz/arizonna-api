const express = require("express");
const router = express.Router();

const patchUserRouter = require("./patch.user");
const postUserRouter = require("./post.user");
const getUserRouter = require("./get.user");

router.use(patchUserRouter);
router.use(postUserRouter);
router.use(getUserRouter);

module.exports = router;
