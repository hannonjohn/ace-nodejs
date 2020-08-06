var aws = require('aws-sdk');
var envPRODUCTION = process.env.NODE_ENV == 'production';
if (!envPRODUCTION) aws.config.loadFromPath('awsConfig.json');
aws.config.update({ region: 'eu-west-1' });
var ses = new aws.SES();
var config = require('../../config');

var textToHtml = function(text) {
	if (!text || !text.length) return '';
	var html = text.replace(new RegExp('\\r', 'g'), '');
	html = html.replace(new RegExp('\n', 'g'), ' <br />');
	html = html.replace(new RegExp('(\\s*<br />\\s*){2,}'), '<br /><br />');
	return html;
};

var buildSubject = function (data) {
	return ['Message from', data.fname, data.lname].join(' ');
};

var buildMessage = function (data) {
	var rows = [];

	rows.push(['<p><b>Name:</b>', data.fname, data.lname, '</p>'].join(' '));
	rows.push(['<p><b>Company:</b>', data.company, '</p>'].join(' '));
	rows.push(['<p><b>Email:</b>', data.email, '</p>'].join(' '));
	rows.push(['<p><b>Phone:</b>', data.phone, '</p>'].join(' '));
	rows.push('<p><b>Message:</b></p>');
	rows.push(['<p>', textToHtml(data.message), '</p>'].join(''));

	return rows.join('');
};

var buildConfirmationMessage = function (data, copyOfMessage) {
	var rows = [];

	rows.push('<p>Hello ', data.fname, ',</p>');
	rows.push('<p>Thanks for the mail. We\'ll get back to you as soon as we can.</p>');
	rows.push('<p><b>Here\'s a copy of your message:</b></p>');
	rows.push('<p>******************************************</p>');
	rows.push('<p>', copyOfMessage, '</p>');
	rows.push('<p>******************************************</p>');
	rows.push('<p>Kind regards,</p>');
	rows.push('<p>Roger</p>');
	rows.push('<hr>');
	rows.push('<p><b>Roger Murphy MIEI CEng (Ireland), CPEng (Australia)</b></p>');
	rows.push('<p>Founder & Director</p>');
	rows.push('<p>Allied Consultant Engineering</p>');

	return rows.join('');
};

var sendConfirmationMessage = function (data, copyOfMessage, cb) {

	var params = {
		Destination: { ToAddresses: [data.email] },
		Message: {
			Subject: { Data: 'Re: Your message to Allied Consultant Engineering' },
			Body: { Html: { Data: buildConfirmationMessage(data, copyOfMessage) } }
		},
		Source: config.fromEmailAddress
	};

	ses.sendEmail(params, function(err) {
		if (err) {
			console.log(err, err.stack);
			cb(false);
		}
		else cb(true);
	});
};

var sendMessage = function (data, cb) {
	var msg = buildMessage(data);
	var params = {
		Destination: { ToAddresses: [config.toEmailAddress] },
		Message: {
			Subject: { Data: buildSubject(data) },
			Body: { Html: { Data: msg } }
		},
		Source: config.fromEmailAddress,
		ReplyToAddresses: [data.email]
	};

	ses.sendEmail(params, function(err) {
		if (err) {
			console.log(err, err.stack);
			cb(false);
		}
		else sendConfirmationMessage(data, msg, cb);
	});
};

module.exports = {
	sendMessage: sendMessage
};