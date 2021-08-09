class error500 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = error500;
