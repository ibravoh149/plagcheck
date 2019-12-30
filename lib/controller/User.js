const { UserService } = require("../services");
const { validationResult } = require("express-validator");
/**
 *
 *
 * @class User
 */
class User {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns
   * @memberof User
   */
  static async addUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username, roleId } = req.body;

    try {
      const result = await UserService.createUser(
        email,
        password,
        username,
        roleId
      );
      if (!result.success) {
        return res.status(result.code).json({ message: result.message });
      }
      const { newUser } = result;
      return res.status(201).json({
        message: "An OTP has been sent to your email.",
        otp: newUser.otp
      });
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    }
  }
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof User
   */
  static async verifyAccount(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, confirmationCode } = req.body;

    try {
      const verifiedAccount = await UserService.verifyAccount(
        email,
        confirmationCode
      );

      if (!verifiedAccount.success) {
        return res
          .status(verifiedAccount.code)
          .json({ message: verifiedAccount.message });
      }

      return res.status(200).json({ data: verifiedAccount.userInfo });
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns
   * @memberof User
   */
  static async resendConfirmationCode(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const result = await UserService.resendConfirmationCode(email);
      if (!result.success) {
        return res.status(result.code).json({ message: result.message });
      }
      return res.status(200).json({
        message: "A new confirmation Code has been sent to your email address"
      });
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns
   * @memberof User
   */
  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      body: { email, password }
    } = req;

    try {
      const result = await UserService.login(email, password);
      if (!result.success) {
        return res.status(result.code).json({ message: result.message });
      }
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    }
  }
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns
   * @memberof User
   */
  static async getStudents(req, res) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 20;
    try {
      const students = await UserService.getStudents(page, limit);
      return res.status(200).json({ data: students });
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    }
  }
}

module.exports = User;
