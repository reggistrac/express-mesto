const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', celebrate({
	body: Joi.object().keys({
		name: Joi.string().required().min(2).max(30),
		link: Joi.string().required().min(2)
	}).unknown(true)
}), createCard);
router.delete('/:cardId', celebrate({
	params: Joi.object().keys({
		cardId: Joi.string().alphanum()
	}).unknown(true)
}), deleteCard);
router.put('/:cardId/likes', celebrate({
	params: Joi.object().keys({
		cardId: Joi.string().alphanum()
	}).unknown(true)
}), addLike);
router.delete('/:cardId/likes', celebrate({
	params: Joi.object().keys({
		cardId: Joi.string().alphanum()
	}).unknown(true)
}), deleteLike);

module.exports = router;
