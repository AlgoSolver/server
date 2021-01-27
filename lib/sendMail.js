require("dotenv").config({ path: ".env" });

var mailgun = require("mailgun-js")({
  apiKey: `${process.env.MG_API_KEY}`,
  domain: `${process.env.MG_DOMAIN_NAME}`,
});

module.exports = function (email, subject, body) {
  const data = {
    from: "algosolver@gmail.com",
    to: email,
    subject: subject,
    html: body,
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) {
      console.log(error);
      return false;
    }

    console.log(body);
    return true;
  });
};
