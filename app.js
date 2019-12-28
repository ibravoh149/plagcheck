require("dotenv").config({ silent: true });
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const http = require("http");
const morgan = require("morgan");
const fileUpload = require('express-fileupload');

const routes = require("./lib/routes");
const DBConnection = require("./lib/config/connection");

DBConnection.connect();
const port = process.env.PORT || 3000;

class Server {
  constructor() {
    this.app = express();
    this.server = this.createServer(this.app);
    this.mountMiddlewares(this.app);
    this.handleErrors();
  }

  start() {
    this.server.listen(port, err => {
      if (err) console.log(err);
      console.log(`server running on port: ${port}`);
    });
  }

  createServer(app) {
    app.set("port", port);
    const server = http.createServer(app);
    return server;
  }

  mountMiddlewares(app) {
    app.disable("x-powered-by");
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    app.use(morgan('dev'))
    app.use(helmet());
    app.use(fileUpload());

    this.setupRoutes(app);
  }

  setupRoutes(app) {
    app.use("/v1", routes);

    app.use("/", (req, res, next) => {
      res.statusCode = 200;
      res.json({ status: "success", message: "refer to API", data: {} });
    });
  }

  handleErrors() {
    //catch 404 and handle with error handler
    this.app.use((req, res, next) => {
      let err = new Error("Not Found");
      err.status = 404;
      next(err);
    });

    //error handler
    this.app.use((err, req, res, next) => {
      res.locals.message = err.message;
      res.locals.Error = req.app.get("env") === "development" ? err : {};

      //display the error
      res.status(err.status || 500);
      res.send("error");
    });
  }
}

module.exports = new Server();
