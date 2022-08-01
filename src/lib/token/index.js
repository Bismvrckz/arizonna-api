const jsonwebtoken = require("jsonwebtoken");
const salt = "Kk6#/~q/Us{VU$gJ#Y{|";

const createToken = (payload) => jsonwebtoken.sign(payload, salt);
const verifyToken = (token) => jsonwebtoken.verify(token, salt);

module.exports = { createToken, verifyToken };
