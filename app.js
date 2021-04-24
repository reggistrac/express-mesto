const express = require('express');

const mongoose = require('mongoose');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

const routeses = ['/users', '/cards'];
app.use((req, res, next) => {
	let f = false;
	for (let i = 0; i < routeses.length; i++) {
		if (req.url.startsWith(routeses[i])) {
			f = true;
			break;
		}
	}
	if (f) {
		req.user = { _id: '6081a2ef55692028401f3826' };
		next();
	}
	else {
		res.status(404).send({ message: 'Страница не найдена' });
	}
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT);
