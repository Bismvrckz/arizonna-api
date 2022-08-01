const { sendVerificationMail } = require("../../lib/email-auth");
const taiPasswordStrength = require("tai-password-strength");
const { hash, compare } = require("../../lib/bcryptjs");
const { createToken } = require("../../lib/token");
const { fieldIsEmpty } = require("../../helpers");
const validator = require("email-validator");
const { Verification } = require("../../../models");
const { user } = require("../../../models");
const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();

const userRegister = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const emptyFields = fieldIsEmpty({
      username,
      email,
      password,
    });

    if (emptyFields.length) {
      throw {
        code: 400,
        message: "Please fill all the required fields",
        detail: `Empty fields: ${emptyFields}`,
        errorType: "emptyFields",
      };
    }

    const validEmail = validator.validate(email);

    if (!validEmail) {
      throw {
        code: 400,
        message: "Wrong email format",
        detail: email,
        errorType: "email",
      };
    }

    const strengthTester = new taiPasswordStrength.PasswordStrength();
    const results = strengthTester.check(password);
    const { number, upper, symbol, passwordLength } = results.charsets;
    // console.log(password);
    // console.log(results);

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

    const resGetUser = await user.findOne({
      where: { [Op.or]: { username, email } },
    });

    // console.log(resGetUser?.dataValues);
    // console.log({ getUserResult });

    if (resGetUser) {
      if (resGetUser.dataValues.username == username) {
        throw {
          code: 400,
          message: "Username already used",
          detail: {
            databaseUsername: resGetUser,
            currentClientUsername: username,
          },
          errorType: "username",
        };
      } else if (resGetUser.dataValues.email == email) {
        throw {
          code: 400,
          message: "Email already used",
          detail: { databaseEmail: resGetUser, clientEmail: email },
          errorType: "email",
        };
      }
    }

    const date = new Date();
    const userIdMaker = date.getTime();

    const encryptedPassword = hash(password);

    const resCreateNewUser = await user.create({
      user_id: userIdMaker,
      username,
      email,
      user_password: encryptedPassword,
      bio: "",
    });

    console.log(`Success create user ${username}`);

    const verificationIdMaker = `${userIdMaker}-verification-${new Date().getTime()}`;
    const resCreateVerification = await Verification.create({
      user_id: userIdMaker,
      verification_id: verificationIdMaker,
    });

    const token = createToken({
      verification_id: verificationIdMaker,
      user_id: userIdMaker,
      username,
    });

    sendVerificationMail({ email, token, username });

    res.send({
      status: "Success",
      message: "Success resgister user",
      data: {
        result: { resCreateNewUser, resCreateVerification },
      },
    });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const resGetUser = await user.findOne({
      where: { [Op.or]: { username: usernameOrEmail, email: usernameOrEmail } },
    });

    if (!resGetUser) {
      throw {
        code: 404,
        message: "User doesn't exist",
        errorType: "usernameOrEmail",
      };
    }

    // console.log(resGetUser.dataValues);

    const currentUser = resGetUser.dataValues;

    // if (!currentUser.isVerified) {
    //   throw {
    //     code: 403,
    //     message: "User is not verified",
    //   };
    // }

    // {
    //   user_id: 1657867641261,
    //   username: '123',
    //   email: '123@123.com',
    //   user_password: '$2a$10$IT1eLjrT7e.VScVdcvnBbuC1B3uBul.PHIed.7kDcbWJwn/Qf9V.C',
    //   isVerified: false,
    //   createdAt: 2022-07-15T13:47:21.000Z,
    //   updatedAt: 2022-07-15T13:47:21.000Z
    // }

    const isPasswordMatch = compare(password, currentUser.user_password);

    if (!isPasswordMatch) {
      throw {
        code: 401,
        message: "Incorrect password",
        errorType: "password",
      };
    }

    const token = createToken({
      user_id: currentUser.user_id,
      username: currentUser.username,
    });

    res.send({
      status: "Success",
      message: "Login success",
      data: {
        result: {
          user_id: currentUser.user_id,
          username: currentUser.username,
          accessToken: token,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const userResendVerificationMail = async (req, res, next) => {
  try {
    const { username, email } = req.body.user.dataValues;
    const { user_id } = req.body;

    console.log({ user_id, email, username });

    const verificationIdMaker = `${user_id}-verification-${new Date().getTime()}`;
    const resCreateVerification = await Verification.create({
      user_id,
      verification_id: verificationIdMaker,
    });

    const token = createToken({
      verification_id: verificationIdMaker,
      user_id: parseInt(user_id),
      username,
    });

    sendVerificationMail({ email, token, username });

    res.send({
      status: "Success",
      message: "Success create new token",
      detail: {
        resCreateVerification,
      },
    });
  } catch (error) {
    console.log({ error });
  }
};

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/resendVerificationMail", userResendVerificationMail);

module.exports = router;
