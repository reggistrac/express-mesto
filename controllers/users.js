const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
	User.find({})
	.then(users => res.send({ data: users }))
	.catch(err => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
	User.findById(req.params.userId)
	.then(user => {
		if(user != null){res.send({ data: user });}
		else{res.status(404).send({ message: "Нет таких"});}
	})
	.catch(err => {
		if(err.name === 'CastError'){res.status(400).send({ message: err.message });}
		else{res.status(500).send({ message: err.message });}
	});
};

module.exports.createUser = (req, res) => {
	const { name, about, avatar } = req.body;

	User.create({ name, about, avatar })
	.then(user => res.send({ data: user }))
	.catch(err => {
		if(err.name === 'ValidationError'){res.status(400).send({ message: err.message });}
		else{res.status(500).send({ message: err.message });}
	});
};

module.exports.updateUser = (req, res) => {
	const { name, about } = req.body;
	
	User.findByIdAndUpdate(req.user._id , { name:name, about:about } , {new: true, runValidators: true})
	.then(user => {
		if(user != null){res.send({ data: user });}
		else{res.status(404).send({ message: "Нет таких"});}
	})
	.catch(err => {
		if(err.name === 'ValidationError'){res.status(400).send({ message: err.message });}
		else{res.status(500).send({ message: err.message });}
	});
};

module.exports.updateAvatar = (req, res) => {
	const { avatar} = req.body;

	User.findByIdAndUpdate(req.user._id , { avatar:avatar } , {new: true, runValidators: true})
	.then(user => {
		if(user != null){res.send({ data: user });}
		else{res.status(404).send({ message: "Нет таких"});}
	})
	.catch(err => {
		if(err.name === 'ValidationError'){res.status(400).send({ message: err.message });}
		else{res.status(500).send({ message: err.message });}
	});
};