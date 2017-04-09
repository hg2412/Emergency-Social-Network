module.exports = {
  db: {
    production: process.env.MONGODB_URI,
    development: "mongodb://localhost:27017/ESN-dev",
    test: "mongodb://localhost:27017/ESN-test"
  }
};