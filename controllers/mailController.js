const Mail = require('../facades/mail');

async function main(req, res) {
    try {
        await Mail.to("rmissimawu@gmail.com").send('Merci pour votre inscription');
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error in sending email:', error);
        res.status(500).json({ message: 'Email sending failed' });
    }
}

module.exports = { main };
