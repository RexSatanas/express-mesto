const jwt = require("jsonwebtoken");
const Error401 = require("../errors/Error401");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new Error401("Необходима авторизация"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === "production" ? JWT_SECRET : "strongest-key-ever"}`,
    );
  } catch (err) {
    next(new Error401("Необходима авторизация"));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
