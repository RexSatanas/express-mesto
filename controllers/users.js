const bcrypt = require("bcrypt");
const User = require("../models/user");
const Error400 = require("../errors/Error400");
const Error404 = require("../errors/Error404");
const Error409 = require("../errors/Error409");
const Error500 = require("../errors/Error500");

// получение всех пользователей
const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      next(new Error500("На сервере произошла ошибка"));
    });
};

// получение определённого пользователя
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw (new Error404("Пользователь с указанным _id не найден"));
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.message === "CastError") {
        next(new Error400("Ошибка в формате ID пользователя"));
      } else if (err.statusCode === 404) {
        next(new Error404("Пользователь с указанным _id не найден"));
      } else {
        next(new Error500("На сервере произошла ошибка"));
      }
    });
};

// Получение текущего юзера
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new Error404("Пользователь с указанным _id не найден"));
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new Error400("Ошибка в формате ID пользователя"));
      } else if (err.statusCode === 404) {
        next(new Error404("Пользователь с указанным _id не найден"));
      } else {
        next(new Error500("На сервере произошла ошибка"));
      }
    });
};

// создание нового пользователя
const createUser = (req, res, next) => {
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
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new Error400("Переданы некорректные данные при создании пользователя:"));
      } else if (err.name === "MongoError" && err.code === 11000) {
        next(new Error409("Данный пользователь уже зарегистрирован"));
      } else {
        next(new Error500("На сервере произошла ошибка"));
      }
    });
};

// обновление профиля
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const userID = req.user._id;
  User.findByIdAndUpdate(userID, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      next(new Error404("Пользователь с указанным _id не найден"));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new Error400("Ошибка в формате ID пользователя"));
      } else if (err.statusCode === 404) {
        next(new Error404("Пользователь с указанным _id не найден"));
      } else {
        next(new Error500("На сервере произошла ошибка"));
      }
    });
};

// обновляет аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userID = req.user._id;
  User.findByIdAndUpdate(userID, { avatar }, {
    runValidators: true,
    new: true,
  })
    .orFail(() => {
      next(new Error404("Пользователь с указанным _id не найден"));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new Error400("Ошибка в формате ID пользователя"));
      } else if (err.statusCode === 404) {
        next(new Error404("Пользователь с указанным _id не найден"));
      } else {
        next(new Error500("На сервере произошла ошибка"));
      }
    });
};

module.exports = {
  getAllUsers, getUser, getCurrentUser, createUser, updateUserInfo, updateAvatar,
};
