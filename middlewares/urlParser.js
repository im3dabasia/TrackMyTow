const colors = require('colors');

const urlParser = () => (req, res, next) => {
	if (req) {
		if (req.method === 'GET') {
			console.log(`[${req.method}] URL: ${req.originalUrl}`.green);
		} else if (req.method === 'POST') {
			console.log(`[${req.method}] URL: ${req.originalUrl}`.cyan);
		} else if (req.method === 'PUT') {
			console.log(`[${req.method}] URL: ${req.originalUrl}`.yellow);
		} else if (req.method === 'DELETE') {
			console.log(`[${req.method}] URL: ${req.originalUrl}`.red);
		}
	}
	return next();
};

module.exports = urlParser;
