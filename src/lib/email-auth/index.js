require("dotenv").config();
const nodemailer = require("nodemailer");

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

const mailCourier = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "ahmadfayruzsyamil33@gmail.com",
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
  },
});

const sendVerificationMail = async ({ email, username, token }) => {
  const mail = {
    from: "Arizonna Team <ahmadfayruzsyamil33@gmail.com>",
    to: email,
    subject: "Arizonna email verify",
    html: `<!DOCTYPE html>
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
      <script
        src="https://kit.fontawesome.com/880ed11170.js"
        crossorigin="anonymous"
      ></script>
    </head>
    <body
      class="relative font-[Montserrat] flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 to-green-800 text-white h-[100vh] w-[100vw]"
    >
      <div class="flex w-[80%] h-[90%] flex-col pt-[3vh]">
        <div class="flex items-center w-[100%] mt-[10vh]">
          <i class="fa-brands fa-atlassian text-cyan-400 text-[6vh]"></i>
          <p class="text-[6vh]">Arizonna</p>
        </div>
        <p>
          <p class="font-[600] text-[2rem]">Hi, ${username}</p> <br />
              Welcome to arizonna,<br />
              please verify your email
        </p>
  
        <a href="http://localhost:2000/users/verify/${token}" target="_blank"
        class="bg-blue-500 h-[3rem] my-[1vh] w-[15vw] text-[1.2rem] rounded-[1vh]"
      > Verify Account</a>
        
      </div>
      <p class="text-[2rem]">Thank you for joining arizonna</p>
      <div
        class="bg-black opacity-[.4] -z-[1] h-[90%] w-[90%] absolute rounded-[1vh]"
      >
        <p class="opacity-0"></p>
      </div>
    </body>`,
  };

  try {
    await mailCourier.sendMail(mail);
    console.log(`Verification mail sent for: ${email}`);
  } catch (error) {
    throw error;
  }
};

const sendPasswordRecoveryMail = async ({ email, token, username }) => {
  const mail = {
    from: "Arizonna Team <ahmadfayruzsyamil33@gmail.com>",
    to: email,
    subject: "Arizonna password recovery",
    html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <p>Hi ${username}</p>
        <p>Plase click this <a href="http://localhost:3000/resetPassword/${token}">link</a> to recover your password</p>
      </body>
    </html>`,
  };

  try {
    await mailCourier.sendMail(mail);
    console.log(`Password recovery  mail sent for ${email}`);
  } catch (error) {
    throw error;
  }
};

module.exports = { sendVerificationMail, sendPasswordRecoveryMail };
