const Card = require("../models/card");

const ErrorCodes = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  DEFAULT: 500,
};

console.log("CARD =", Card);

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при создании карточки: ${err}` });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "На сервере произошла ошибка" });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при создании карточки: ${err}` });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "На сервере произошла ошибка" });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: "Ошибка в запросе" });
        return;
      }
      if (err.message === "NotFound") {
        res.status(ErrorCodes.NOT_FOUND).send({ message: "Карточка с указанным _id не найдена" });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "На сервере произошла ошибка" });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: "Переданы некорректные данные для постановки лайка" });
        return;
      }
      if (err.message === "NotFound") {
        res.status(ErrorCodes.NOT_FOUND).send({ message: "Карточка с указанным _id не найдена" });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "На сервере произошла ошибка" });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: "Переданы некорректные данные для постановки лайка" });
        return;
      }
      if (err.message === "NotFound") {
        res.status(ErrorCodes.NOT_FOUND).send({ message: "Карточка с указанным _id не найдена" });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "На сервере произошла ошибка" });
    });
};

module.exports = { getAllCards, createCard, deleteCard, likeCard, dislikeCard };
