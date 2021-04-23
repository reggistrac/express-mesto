const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('express').Router();

// Слушаем 3000 порт
const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});
app.use((req, res, next) => {
	req.user = { _id: '6081a2ef55692028401f3826' };
	next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));





app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
	console.log(`App listening on port ${PORT}`);
	console.log('Ссылка на сервер');
	console.log(BASE_PATH);
});
