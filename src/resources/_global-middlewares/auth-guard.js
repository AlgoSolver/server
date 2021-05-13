module.exports = (req, res, next) => {
  if (req.auth.notAuth === true || !req.auth) {
    return res.status(401).json({ message: "Unauthrized" });
  }
  return next();
};
