const express = require("express");
const mongoose = require("mongoose");

const app = express();

// роуты
const usersRoute = require("./routes/users");
const cardsRoute = require("./routes/cards");
const { login } = require("./controllers/users");
const { createUser } = require("./controllers/users");
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

app.use((req, res, next) => {
  req.user = {
    _id: "60fe9612049b911732dc6d0f",
  };

  next();
});

app.post("/signup", createUser);
app.post("/signin", login);

app.use("/", usersRoute);
app.use("/", cardsRoute);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
