const express = require("express");
const { submission } = require("../controller");
const router = express.Router();
const validator = require("../middleware/validation");
const { authenticate, authorize } = require("../middleware/auth");

router.post(
  "/",
  [authenticate, authorize(["assistant", "admin"])],
  ...validator.submission,
  submission.submit
);

router.get(
    "/",
    [authenticate, authorize(["assistant", "admin"])],
    ...validator.submission,
    submission.getSubmissions
  );

module.exports = router;
