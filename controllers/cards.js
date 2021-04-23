const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
	Card.find({})
	.populate('owner')
	.then(cards => res.send({ data: cards }))
	.catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
	const { name, link } = req.body;
	
	Card.create({ name, link, owner: req.user._id })
	.then(card => res.send({ data: card }))
	.catch(err => {
		if(err.name === 'ValidationError'){res.status(400).send({ message: err.message });}
		else{res.status(500).send({ message: err.message });}
	});
};

module.exports.deleteCard = (req, res) => {
	Card.findByIdAndRemove( req.params.cardId )
	.then(card => {
		if(card != null){res.send({data:card});}
		else{res.status(404).send({ message: "Карта не найдена"});}
	})
	.catch(err => res.status(500).send({ message: err.message, erro:err.name })	);
};

module.exports.addLike = (req, res) => {
	Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
	.then(card => {
		if(card != null){res.send({data:card});}
		else{res.status(400).send({ message: "Не тот id"});}
	})
	.catch(err => res.status(500).send({ message: err.message }));
};

module.exports.deleteLike = (req, res) => {
	Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
	.then(card => {
		if(card != null){res.send({data:card});}
		else{res.status(400).send({ message: "Не тот id"});}
	})
	.catch(err => res.status(500).send({ message: err.message }));
};
