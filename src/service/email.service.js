"use strict";

const { InternalServerError } = require("../core/error.response");
const { getTransport } = require("../db/init.nodemailer");
const {
  emailForgotPassword,
} = require("../util/emailTemplate/emailForgotPassword");

const {
  emailTicketTemplate,
} = require("../util/emailTemplate/emailTicketTemplate");

class EmailService {
  static async sendEmailTicket({
    ticketDetail,
    toEmail,
    subject = "Order Confirmation",
    text = "hello ...",
  }) {
    try {
      const mailOptions = {
        from: "SVG Theater <svgtheater@gmail.com>", // sender address
        to: toEmail, // list of receivers
        subject, // Subject line
        text, // plain text body
        html: emailTicketTemplate(ticketDetail), // html body
      };
      const transport = await getTransport();
      transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          return console.log(err);
        }
        console.log(info.messageId);
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  static async sendEmailResetPassword({
    link,
    toEmail,
    subject = "Reset your password",
    text = "hello ...",
  }) {
    try {
      const mailOptions = {
        from: "SVG Theater <svgtheater@gmail.com>", // sender address
        to: toEmail, // list of receivers
        subject, // Subject line
        text, // plain text body
        html: emailForgotPassword(link), // html body
      };
      const transport = await getTransport();
      transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          return console.log(err);
        }
        console.log(info.messageId);
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = EmailService;
