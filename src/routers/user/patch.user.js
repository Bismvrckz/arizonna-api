const express = require("express");
const router = express.Router();
const { user } = require("../../../models");
const { auth } = require("../../helpers/auth");
const { uploadAvatar } = require("../../lib/multer");

const updateUserProfilePicture = async (req, res, next) => {
  try {
    const { username } = req.user.dataValues;
    const updateImageUser = await user.findOne({ where: { username } });
    await updateImageUser.update({
      user_avatar: `http://localhost:2000/userAvatar/${username}-avatar.png`,
    });
    const resUpdateProfilePicture = await updateImageUser.save();

    res.send({
      status: "Success",
      message: "Success update profile picture",
      detail: { resUpdateProfilePicture },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserCredential = async (req, res, next) => {
  try {
    const { user_id } = req.user.dataValues;
    const { inputUsername, inputFullname, inputBio } = req.body;

    const findSameUsername = await user.findOne({
      where: { username: inputUsername },
    });

    console.log({ findSameUsername });

    if (findSameUsername && findSameUsername.dataValues.user_id != user_id) {
      throw {
        code: 400,
        message: "Username already exist",
      };
    }

    const editUser = await user.findOne({ where: { user_id } });
    await editUser.update({
      username: inputUsername,
      bio: inputBio,
      fullname: inputFullname,
    });
    const resUpdateProfileCredential = await editUser.save();

    res.send({
      status: "Success",
      message: "Success update profile credential",
      detail: {
        resUpdateProfileCredential,
      },
    });
  } catch (error) {
    next(error);
  }
};

router.patch(
  "/avatar",
  auth,
  uploadAvatar.single("newAvatar"),
  updateUserProfilePicture
);
router.patch("/userCredential", auth, updateUserCredential);

module.exports = router;
