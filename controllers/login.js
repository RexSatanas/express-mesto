const bcrypt = require("bcrypt"); // импортируем bcrypt
const jwt = require("jsonwebtoken"); // импортируем модуль jsonwebtoken
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;

const Error401 = require("../errors/Error401");
const Error500 = require("../errors/Error500");

const checkLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select("+password")
    .orFail(() => {
      const error = new Error401(`Пользователь с email: ${email} не существует`);
      throw error;
    })
    .then((user) => {
      // Надо проверить пароль
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const error = new Error401("Введён неправильный пароль");
            throw error;
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === "production" ? JWT_SECRET : "strongest-key-ever", { expiresIn: "7d" });
          res.send({ token });
        })
        .catch((err) => {
          if (err.statusCode === 401) {
            next(new Error401("Неавторизирован"));
          } else {
            next(new Error500("На сервере произошла ошибка"));
          }
        });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(new Error401("Неавторизирован"));
      } else {
        next(new Error500("На сервере произошла ошибка"));
      }
    });
};

module.exports = checkLogin;
