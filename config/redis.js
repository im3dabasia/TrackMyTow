require('dotenv').config();
const redis = require('redis');
let redisClient;

(async () => {
	redisClient = redis.createClient({
		legacyMode: false,
		password: process.env.REDIS_PASSWORD,
		socket: {
			host: process.env.REDIS_URI,
			port: 19773,
		},
	});
	redisClient.on('ready', () => console.log('Redis store connected'));

	redisClient.on('error', (error) => console.log('redis error' + error));
	await redisClient.connect();
})();

const getFromRedisCache = async (key) => {
	console.log(key);
	const cachedData = await redisClient.get(key);
	return cachedData;
};

const setToRedisCache = async (key, value) => {
	console.log(key, value);
	const cachedData = await redisClient.set(key, value);
	return cachedData;
};

module.exports = { setToRedisCache, getFromRedisCache };
