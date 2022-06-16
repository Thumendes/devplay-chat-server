const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { templatesPath } = require("../data/constants");

async function createTransport() {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  return transport;
}

const MailService = {
  transport: null,

  async sendMail(to, subject, html) {
    if (!this.transport) {
      this.transport = await createTransport();
    }

    const response = await this.transport.sendMail({
      from: "thumendess@gmail.com",
      to,
      html,
      subject,
    });

    return response;
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
