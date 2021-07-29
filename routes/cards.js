const router = require("express").Router();
const { getAllCards, createCard, deleteCard, likeCard, dislikeCard } = require("../controllers/cards");
/* GET /cards — возвращает все карточки
   POST /cards — создаёт карточку
   DELETE /cards/:cardId — удаляет карточку по идентификатору
   PUT /cards/:cardId/likes — поставить лайк карточке
   DELETE /cards/:cardId/likes — убрать лайк с карточки
*/

router.get("/cards", getAllCards);

router.post("/cards", createCard);

router.delete("/cards/:cardId", deleteCard);

router.put("/cards/:cardId/likes", likeCard);

router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;
