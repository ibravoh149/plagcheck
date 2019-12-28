const mongoose = require("mongoose");

let uri;
if (process.env.NODE_ENV !== "production") {
  uri = process.env.MONGO_DEV_URI;
} else {
  uri = process.env.MONGO_URI;
}

module.exports = class MongoDBConnection {
  static connect() {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      reconnectTries: 9999999999,
      connectTimeoutMS: 2000,
      useUnifiedTopology:true
    });
    mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
    mongoose.connection.once("connected", () =>
      console.info(`Successfully connected to ${uri}`)
    );
    mongoose.connection.on("error", err => {
      console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
    });
  }
};
