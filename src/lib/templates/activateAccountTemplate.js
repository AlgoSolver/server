module.exports = (clientUrl, token) => {
  return `<h1>Please use the following link to activate your account</h1>
          <p>${clientUrl}/accounts/activate-account/${token}</p>
          <hr />
          <p>this email may conatan sensitive information</p>
   	      <p>${clientUrl}</p>`;
};
