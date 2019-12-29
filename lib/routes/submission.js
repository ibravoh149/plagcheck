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
  submission.getSubmissions
);

router.get(
  "/:id",
  [authenticate, authorize(["assistant", "admin"])],
  submission.getSubmission
);

router.put(
    "/:id",
    [authenticate, authorize(["assistant", "admin"])],
    submission.reRunSubmission
  );

module.exports = router;
