const { check } = require("express-validator");

const validator = {
  validateAdduser: [
    check("email")
      .isEmail()
      .withMessage("invalid email address"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password should not be less than 5 characters"),
    check("username")
      .isLength({ min: 3 })
      .withMessage("Username cannot be less than 3 characters"),
    check("roleId")
      .isLength({ min: 1, max: 1 })
      .withMessage("role ID cannot be less than or more than one character")
      .isNumeric()
      .withMessage("Invalid role id")
  ],

  validateAccountVerification: [
    check("email")
      .isEmail({ min: 5 })
      .withMessage("invalid email address"),

    check("confirmationCode")
      .isNumeric()
      .withMessage("Confirmation Code can only be Number")
  ],

  resenVerificationCode: [
    check("email")
      .isEmail()
      .withMessage("Invalid email address supplied")
  ],
  login: [
    check("password")
      .isLength({ min: 5 })
      .withMessage("Passwword should not be less than 5 characters"),

    check("email")
      .isEmail()
      .withMessage("Invalid email address supplied")
  ],

  submission: [
    check("student1")
      .isMongoId()
      .withMessage("invalid student id"),
    check("student2")
      .isMongoId()
      .withMessage("invalid student id"),
    check("file1")
      .isLength({ min: 1 })
      .withMessage("please upload file for first student"),
    check("file2")
      .isLength({ min: 1 })
      .withMessage("please upload file for second student")
  ]
};

module.exports = validator;
