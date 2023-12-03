const mailer = require('../config/mailer');
const crypto = require('crypto');

const Mail = {
    to: function (email) {
        this.email = email;
        return this;
    },

    generateRandomCode: function () {
        return crypto.randomBytes(3).toString('hex').toUpperCase(); 
        },

    send: async function (body,subject) {
        try {
            await mailer.sendMail({
                from: "rol95lumen@gmail.com",
                to: this.email,
                text: body,
                subject: subject
            });
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Email sending failed:', error);
        }
    },
};

module.exports = Mail;
