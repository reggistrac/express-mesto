const express = require('express');
const mongoose = require('mongoose');
  
const {login, createUser}= require('./controllers/users');
const auth = require('./middlewares/auth');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});



app.post('/signup', celebrate({
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().min(8)
	}).unknown(true)
}), createUser);
app.post('/signin', celebrate({
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required()
	}).unknown(true)
}), login);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use(errors());
app.use((err, req, res, next) => {
	const errors = {400:'Некорректный запрос',401:'Необходима авторизация',404:'Такого не существует',409:'Такой пользователь уже есть'};
	let message;
	if(err.errMess){message = err.errMess;}
	else{message = errors[err.statusCode];}
	if(err.statusCode){res.status(err.statusCode).send({ message });}
	else{ res.status(500).send({ message: err.message }); }
});


app.listen(PORT);
