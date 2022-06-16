const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { templatesPath } = require("../data/constants");

const mailtrapTransporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const MailService = {
  transport: gmailTransporter,

  async sendMail(to, subject, html) {
    try {
      const response = await this.transport.sendMail({
        from: process.env.MAIL_FROM,
        to,
        html,
        subject,
      });

      return response;
    } catch (error) {
      console.log(error);

      throw error;
    }
  },

  template(name, config) {
    try {
      const layout = fs.readFileSync(path.join(templatesPath, `layout.html`), "utf8");
      const file = fs.readFileSync(path.join(templatesPath, `${name}.html`), "utf8");

      const content = file.replace(/\{\{(.*?)\}\}/g, (match, key) => {
        return config[key.trim()];
      });

      const template = layout.replace(/\{\{(.*?content.*?)\}\}/i, content);

      return template;
    } catch (error) {
      throw new Error("Template não encontrado!");
    }
  },
};

module.exports = { MailService };
