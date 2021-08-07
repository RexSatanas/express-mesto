const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    message: `Ошибка: ${err.message || "Ошибка на сервере"}`,
  });

  next();
};

module.exports = errorHandler;
