const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const ErrorCodes = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  DEFAULT: 500,
  UNAUTHORIZED: 401,
};
console.log("USER =", User);

// получение всех пользователей
const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ErrorCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при создании пользователя: ${err}` });
      }
      return res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере" });
    });
};

// получение определённого пользователя
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ErrorCodes.BAD_REQUEST).send({ message: "Ошибка в запросе" });
      }
      if (err.message === "NotFound") {
        return res.status(ErrorCodes.NOT_FOUND).send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере" });
    });
};

// создание нового пользователя
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при создании пользователя: ${err}` });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "На сервере произошла ошибка" });
    });
};

// обновление профиля
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userID = req.user._id;
  User.findByIdAndUpdate(userID, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
        return;
      }
      if (err.message === "NotFound") {
        res.status(ErrorCodes.NOT_FOUND).send({ message: "Пользователь с указанным _id не найден" });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "На сервере произошла ошибка" });
    });
};

// обновляет аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userID = req.user._id;
  User.findByIdAndUpdate(userID, { avatar }, {
    runValidators: true,
    new: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
        return;
      }
      if (err.message === "NotFound") {
        res.status(ErrorCodes.NOT_FOUND).send({ message: "Пользователь с указанным _id не найден" });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "На сервере произошла ошибка" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        "some-secret-key",
        { expiresIn: "7d" },
      );
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "NotFound") {
        res.status(ErrorCodes.UNAUTHORIZED).send({ message: "Неверно указаны данные для входа" });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "На сервере произошла ошибка" });
    });
};

module.exports = {
  getAllUsers, getUser, createUser, updateUserInfo, updateAvatar, login,
};
