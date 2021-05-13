const getPagination = (page, size) => {
  const limit = size ? +size : 20;
  const offset = page ? +page * limit : 0;

  return { limit, offset };
};

module.exports = getPagination;
