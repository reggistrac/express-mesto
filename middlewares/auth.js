const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authorization = req.headers.cookie;
	if (!authorization || !authorization.startsWith('jwt')) {
		return next({statusCode:401});;
	}
	const token = authorization.replace('jwt=', '');
	let payload;
	try{payload = jwt.verify(token, 'some-secret-key');}
	catch (err) {return next({statusCode:401});}
	req._id = payload;
	next();
}
