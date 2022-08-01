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
      where: { user_id },
    });

    if (
      findSameUsername &&
      findSameUsername.dataValues.username != inputUsername
    ) {
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

    // console.log({ resUpdateProfileCredential });
    // console.log(findSameUserrsname);

    res.send({
      status: "Success",
      message: "Success update profile credential",
      detail: {
        resUpdateProfileCredential,
      },
    });
  } catch (error) {
    // console.log(error.errors[0].message);
    // console.log(error.message);
    next(error);
  }
};

// Error
//     at Query.run (C:\Users\Wicked Wench\Documents\GitHub\GeneralRepo\Project\Arizonna\Api\node_modules\sequelize\lib\dialects\mysql\query.js:52:25)
//     at C:\Users\Wicked Wench\Documents\GitHub\GeneralRepo\Project\Arizonna\Api\node_modules\sequelize\lib\sequelize.js:311:28
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
//     at async MySQLQueryInterface.update (C:\Users\Wicked Wench\Documents\GitHub\GeneralRepo\Project\Arizonna\Api\node_modules\sequelize\lib\dialects\abstract\query-interface.js:355:12)
//     at async users.save (C:\Users\Wicked Wench\Documents\GitHub\GeneralRepo\Project\Arizonna\Api\node_modules\sequelize\lib\model.js:2432:35)
//     at async users.update (C:\Users\Wicked Wench\Documents\GitHub\GeneralRepo\Project\Arizonna\Api\node_modules\sequelize\lib\model.js:2534:12)
//     at async updateUserCredential (C:\Users\Wicked Wench\Documents\GitHub\GeneralRepo\Project\Arizonna\Api\src\routers\user\patch.user.js:34:5) {
//   name: 'SequelizeUniqueConstraintError',
//   errors: [
//     ValidationErrorItem {
//       message: 'username must be unique',
//       type: 'unique violation',
//       path: 'username',
//       value: 'abcdef',
//       origin: 'DB',
//       instance: [user],
//       validatorKey: 'not_unique',
//       validatorName: null,
//       validatorArgs: []
//     }
//   ]

router.patch(
  "/avatar",
  auth,
  uploadAvatar.single("newAvatar"),
  updateUserProfilePicture
);
router.patch("/userCredential", auth, updateUserCredential);

module.exports = router;
