exports.get404 = (req, res, next) => {
    res.status(404).json({ error: 'PAGE NOT FOUND' });
  };

/*exports.createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode || 500;
  return error;
}*/