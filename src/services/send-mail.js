require("dotenv").config({ path: ".env" });

var mailgun = require("mailgun-js")({
  apiKey: `${process.env.MG_API_KEY}`,
  domain: `algosolver.tech`,
});

module.exports = function (email, subject, body) {
  console.log(email, subject, body);
  const data = {
    from: "admin@algosolver.tech",
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
