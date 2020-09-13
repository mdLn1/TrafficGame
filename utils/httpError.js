module.exports = class HttpError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    if (statusCode) this.statusCode = statusCode;
  }
};
