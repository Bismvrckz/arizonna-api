const express = require("express");
const router = express.Router();
const { post } = require("../../../models");
const { comment } = require("../../../models");
const { auth } = require("../../helpers/auth");
const { uploadPosts } = require("../../lib/multer");

const addNewComments = async (req, res, next) => {
  try {
    const { post_id } = req.body.postDetail;
    const { user_id, username, user_avatar } = req.body.userData;
    const { commentInput } = req.body;

    const idMaker = new Date().getTime();

    const resAddNewComments = await comment.create({
      comment_id: `${post_id}-comment-${user_id}-${idMaker}`,
      user_id,
      post_id,
      username,
      user_avatar,
      commentPhrase: commentInput,
    });
    // {
    //     postDetail: {
    //       post_id: 'Bismvrckz-1658396749263',
    //       user_id: 1658382703336,
    //       caption: 'yes',
    //       postImage: 'http://localhost:2000/userPosts/Bismvrckz-post-2.png',
    //       createdAt: '2022-07-21T09:45:49.000Z',
    //       updatedAt: '2022-07-21T09:45:49.000Z',
    //       postLikes: [ [Object] ],
    //       postComments: []
    //     },
    //     userData: {
    //       user_id: 1658382703336,
    //       username: 'Bismvrckz',
    //       email: 'Bismvrckz@r3ich.com',
    //       bio: 'Bio baru',
    //       fullname: 'Nama lengkap',
    //       user_avatar: 'http://localhost:2000/userAvatar/Bismvrckz-avatar.png',
    //       user_password: '$2a$10$DT1l9NLOdqVX0b2wJe/OP.A13KmRrgUYbzjn01c5QmlHUXvazW0RK',
    //       isVerified: true,
    //       createdAt: '2022-07-21T05:51:43.000Z',
    //       updatedAt: '2022-07-21T06:08:40.000Z'
    //     }
    //   }

    console.log(resAddNewComments);
    res.send({
      status: "Success add new comments",
      messafe: "Add new comments",
      detail: { resAddNewComments },
    });
  } catch (error) {
    next(error);
  }
};

router.post("/", auth, addNewComments);

module.exports = router;
