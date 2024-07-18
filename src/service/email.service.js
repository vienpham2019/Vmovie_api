"use strict";

const { InternalServerError } = require("../core/error.response");
const { getTransport } = require("../db/init.nodemailer");

const {
  emailTicketTemplate,
} = require("../util/emailTemplate/emailTicketTemplate");
const sendEmailTicket = async ({
  ticketDetail,
  toEmail,
  subject = "Hello",
  text = "hello ...",
}) => {
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
};

module.exports = { sendEmailTicket };
