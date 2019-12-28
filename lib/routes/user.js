const express = require("express");
const { user } = require("../controller");
const router = express.Router();
const validator = require("../middleware/validation");
const {authenticate, authorize}= require("../middleware/auth")

router.post("/", [...validator.validateAdduser], user.addUser);

router.put("/account/verify", [...validator.validateAccountVerification], user.verifyAccount);

router.put("/account/resend-verification", [...validator.resenVerificationCode], user.resendConfirmationCode);

router.post("/login", [...validator.login], user.login);

router.get('/students', [authenticate, authorize(['assistant'])], user.getStudents)

module.exports = router;
