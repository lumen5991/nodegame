const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth: {
      user: "rmissimawu@gmail.com",
      pass: "dnhvuhiulnsikjju"
    }
  });

  module.exports = mailer;