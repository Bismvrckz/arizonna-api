const { verifyToken } = require("../../lib/token");
const { user } = require("../../../models");
const { post } = require("../../../models");

async function auth(req, res, next) {
  try {
    const token = req.token;

    console.log({ authAtJWTHelper: typeof token, token });

    const verifiedToken = verifyToken(token);

    const resGetUser = await user.findOne({
      where: { user_id: verifiedToken.user_id },
    });

    const resGetUserPost = await post.findAll({
      where: { user_id: verifiedToken.user_id },
    });

    if (!resGetUser) {
      throw { message: "User not found" };
    }
    const { dataValues } = resGetUser;
    const idMaker = new Date().getTime();
    req.custom_id = idMaker;
    req.user = { dataValues };
    req.userPost = resGetUserPost;
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = { auth };
