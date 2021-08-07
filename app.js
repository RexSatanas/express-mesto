const express = require("express");
const mongoose = require("mongoose");
const auth = require("./middlewares/auth");
const { login } = require("./controllers/users");
const { createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// роуты
const usersRoute = require("./routes/users");
const cardsRoute = require("./routes/cards");
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

app.post("/signup", createUser);
app.post("/signin", login);

app.use(auth);
app.use("/", auth, usersRoute);
app.use("/", auth, cardsRoute);
app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
