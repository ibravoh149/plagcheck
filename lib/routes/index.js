const express = require("express");
const router = express.Router();

const user = require("./user");
const upload = require("./file_upload");
const submission = require("./submission");

// user route middleware
router.use("/users", user);
router.use("/upload", upload);
router.use("/submissions", submission);

module.exports = router;
