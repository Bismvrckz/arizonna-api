const bearerToken = require("express-bearer-token");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

// ROUTERS
const usersRouter = require("./routers/user");
const postsRouter = require("./routers/posts");
const likesRouter = require("./routers/likes");
const commentsRouter = require("./routers/comments");

// APP.USE
app.use(express.json());
app.use(bearerToken());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Akses API aman 👍");
});

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/likes", likesRouter);
app.use("/comments", commentsRouter);

app.use((error, req, res, next) => {
  console.log({ error });

  const errorFormat = {
    status: "Error",
    message: error.message,
    detail: error.detail,
    errorType: error?.errorType,
  };

  const httpCode = typeof error.code == "number" ? error.code : 500;

  res.status(httpCode).send(errorFormat);
});

app.listen(port, (error) => {
  if (error) return console.log({ err: error.message });
  console.log(
    `API berhasil running di port ${port} 
Lancar jaya mazseh (^////^)' `
  );
});
