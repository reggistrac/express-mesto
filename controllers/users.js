const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
	.then((users) => res.send({ data: users }))

	.catch(next);
};

module.exports.getUser = (req, res, next) => {
	let userId;
	if(req.params.userId != 'me'){userId = req.params.userId;}
	else{userId = req._id._id;}
	User.findById(userId)
	.then((user) => {
		if (user != null) { res.send({ data: user }); }

		else { next({statusCode:404}); }
	})
	.catch((err) => {

		if (err.name === 'CastError') { next({statusCode:400}); }
		else { next(err); }
	});
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password} = req.body;

  bcrypt.hash(password, 10)
  .then(hash => User.create({name, about, avatar, email: email, password: hash}))
  .then((user) => res.send({ data: user }))
	.catch((err) => {
		if (err.name === 'ValidationError') { next({statusCode:400});  }
		else if(err.name === "MongoError" && err.code === 11000) {next({statusCode:409});}
		else { next(err); }
	});


};

module.exports.login = (req, res)=>{
	const { email, password} = req.body;
	let userId;
	User.findOne({ email }).select('+password')
	.then((user) => {
		userId = user._id;
		if(!user){
			return Promise.reject(new Error('1 Неправильные почта или пароль'));
		}
		return bcrypt.compare(password, user.password);
	})
	.then((matched) => {
		if (!matched) {
			return Promise.reject(new Error('2 Неправильные почта или пароль'));
		}
		const token = jwt.sign({ _id: userId }, 'some-secret-key', { expiresIn: '7d' });
		res.cookie('jwt', token, {maxAge: 3600000*24*30,httpOnly: true}).end();
	})
// Сообщение об ошибке нестандартное, отправляется здесь.
	.catch((err) => { res.status(401).send({ message: err.message });  });
}

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req._id._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user != null) { res.send({ data: user }); }
	  else { next({statusCode:404}); }
    })
    .catch((err) => {
		if (err.name === 'ValidationError') { next({statusCode:400}); }
		else { next(err); }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req._id._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user != null) { res.send({ data: user }); }
	  else { next({statusCode:404}); }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { next({statusCode:400,errMess:err.message}); }
	  else { next(err); }
    });
};
