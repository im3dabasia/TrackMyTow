const generateRandomLinkId = () => {
	const characters = '0123456789abcdef';
	let linkId = '';
	for (let i = 0; i < 24; i++) {
		linkId += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return linkId;
};

module.exports = generateRandomLinkId;
