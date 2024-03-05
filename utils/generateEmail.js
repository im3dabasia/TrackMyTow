const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailToUsers = async (users, linkId) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL || 'eshaandabasiya@gmail.com',
			pass: process.env.EMAIL_PASSWORD || '',
		},
	});

	const mailOptions = {
		from: process.env.EMAIL || 'eshaandabasiya@gmail.com',
		to: users.map((user) => user.email).join(','),
		subject: 'Your car is being towed',
		text: `Dear user, your car is being towed. Please contact us for further information. Please use the link below to track your car. Here is link: ${linkId}`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error sending email:', error);
		} else {
			console.log('Email sent:', info.response);
		}
	});
};

const notifyUsersForTow = async (emailIds, linkId) => {
	try {
		if (emailIds.length <= 0 || !linkId) {
			console.log('Empty email Array || linkId missing');
			return;
		}
		await sendEmailToUsers(users, linkId);
		console.log('Emails sent successfully to users.');
	} catch (error) {
		console.error('Error notifying users for tow:', error);
	}
};

module.exports = notifyUsersForTow;
