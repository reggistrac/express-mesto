const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', celebrate({
	params: Joi.object().keys({
		userId: Joi.string().required().length(24).hex()
	}).unknown(true)
}), getUser);

router.get('/me', getUser);
router.patch('/me', celebrate({
	body: Joi.object().keys({
		name: Joi.string().required().min(2).max(30),
		about: Joi.string().required().min(2).max(30)
	}).unknown(true)
}), updateUser);
router.patch('/me/avatar', celebrate({
	body: Joi.object().keys({
		avatar: Joi.string().required().min(2)
	}).unknown(true)
}), updateAvatar);

module.exports = router;
