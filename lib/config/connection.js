const mongoose = require("mongoose");

let uri;

switch (process.env.NODE_ENV) {
  case "test":
    uri = process.env.MONGO_TEST_URI;
    break;
  case "development":
    uri = process.env.MONGO_DEV_URI;
  default:
    uri = process.env.MONGO_URI;
    break;
}

module.exports = class MongoDBConnection {
  static connect() {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      reconnectTries: 9999999999,
      connectTimeoutMS: 2000,
      useUnifiedTopology: true
    });
    mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
    mongoose.connection.once("connected", () =>
      console.info(`Successfully connected to database`)
    );
    mongoose.connection.on("error", err => {
      console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
    });
  }
};
