const express = require("express");
const mongoose = require("mongoose");
const { celebrate, Joi } = require("celebrate");

const app = express();

// роуты
const usersRoute = require("./routes/users");
const cardsRoute = require("./routes/cards");
const { createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/errorHandler");
const login = require("./controllers/login");
const auth = require("./middlewares/auth");
//  задаём порт
const { PORT = 3000 } = process.env;

// подключаение к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(35),
  }),
}), createUser);
// защита роутов авторизацией
app.use(auth);
app.use("/", auth, usersRoute);
app.use("/", auth, cardsRoute);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
