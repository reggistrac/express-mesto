const Card = require('../models/card');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))

	.catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req._id._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
		if (err.name === 'ValidationError') { next({statusCode:400}); }
		else { next(err); }
    });
};

module.exports.deleteCard = (req, res, next) => {
	Card.findById(req.params.cardId)
	.then((card) => {
		if (card != null) {
			if(card.owner._id == req._id._id){	Card.findByIdAndRemove(req._id._id);}
			else{res.status(401).send({ message: 'Чужое!' });}
		}
		else { next({statusCode:404}); }
	})
	.catch((err) => {
		if (err.name === 'CastError') { next({statusCode:400}); }
		else { next(err); }
	});

};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card != null) { res.send({ data: card }); }
	  else { next({statusCode:404}); }
    })
    .catch((err) => {
      if (err.name === 'CastError') { next({statusCode:400}); }
	  else { next(err); }
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card != null) { res.send({ data: card }); }
	  else { next({statusCode:404}); }
    })
    .catch((err) => {
      if (err.name === 'CastError') { next({statusCode:400}); }
	  else { next(err); }
    });
};
