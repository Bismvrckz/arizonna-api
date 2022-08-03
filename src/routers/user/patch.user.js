const express = require("express");
const router = express.Router();
const { user } = require("../../../models");
const { auth } = require("../../helpers/auth");
const { uploadAvatar } = require("../../lib/multer");
const taiPasswordStrength = require("tai-password-strength");
const { hash } = require("../../lib/bcryptjs");

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

const updateUserPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    const { user_id } = req.params;

    const strengthTester = new taiPasswordStrength.PasswordStrength();
    const results = strengthTester.check(password);
    const { number, upper, symbol } = results.charsets;
    const { passwordLength } = results;
    console.log({ passwordLength });

    if (!number || !upper || !symbol || passwordLength < 8) {
      throw {
        code: 400,
        message:
          "Passwords should contain at least 8 characters including an uppercase letter, a symbol, and a number.",
        detail: { password },
        errorType: "password",
      };
    }

    if (password != confirmPassword) {
      throw {
        code: 400,
        message: "Password does not match",
        detail: `Password: ${password}, Confirm Password: ${confirmPassword}`,
        errorType: "confirmPassword",
      };
    }

    const resFindUser = await user.findOne({ where: { user_id } });

    const passwordEncrypt = hash(password);

    await resFindUser.update({
      user_password: passwordEncrypt,
    });
    const resUpdatePassword = await resFindUser.save();

    res.send({
      status: "Success",
      message: "Success update password",
      detail: { resUpdatePassword },
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
router.patch("/updatePassword/:user_id", updateUserPassword);

module.exports = router;
