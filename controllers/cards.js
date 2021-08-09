const Card = require("../models/card");
const Error400 = require("../errors/Error400");
const Error404 = require("../errors/Error404");
const Error403 = require("../errors/Error403");
const Error500 = require("../errors/Error500");

console.log("CARD =", Card);

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      next(new Error500("На сервере произошла ошибка :("));
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new Error400("Переданы некорректные данные при создании карточки"));
      } else {
        next(new Error500("На сервере произошла ошибка :("));
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error404("Карточка с указанным _id не найдена");
    })
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        next(new Error403("Нельзя удалить чужую карточку"));
      } else {
        card.remove();
        res.status(200).send({ message: `Карточка с id ${card.id} успешно удалена!` });
      }
    })
    .catch((err) => {
      if (err.message === "CastError") {
        next(new Error400("Ошибка в запросе"));
      } else if (err.message === "NotFound") {
        next(new Error404("Карточка с указанным _id не найдена"));
      } else {
        next(new Error500("На сервере произошла ошибка :("));
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new Error400("Ошибка в запросе"));
      } else if (err.message === "NotFound") {
        next(new Error404("Карточка с указанным _id не найдена"));
      } else {
        next(new Error500("На сервере произошла ошибка :("));
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new Error400("Ошибка в запросе"));
      } else if (err.message === "NotFound") {
        next(new Error404("Карточка с указанным _id не найдена"));
      } else {
        next(new Error500("На сервере произошла ошибка :("));
      }
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
