const { User } = require("../models");
const PermissionLevel = require("../models/permissionLevel");
const Helper = require("../util/helper");
const OTP = require("otplib");

const helper = new Helper();
class UserService {
  /**
   *
   *
   * @static
   * @param {String} email
   * @returns
   * @memberof UserService
   */
  static async createUser(email, password, username, roleId) {
    try {
      const existingUser = await User.findOne({ email }).lean();
      if (!existingUser) {
        // generate opt
        const secret = OTP.authenticator.generateSecret(10);
        const otp = OTP.authenticator.generate(secret);

        // otp expiration time
        const otpExpiresIn = Date.now() + 3600000;
        // send otp to user via email

        const role = helper.getKeyByValue(PermissionLevel, Number(roleId));

        const { _id } = await new User({
          username,
          email,
          password,
          otpExpiresIn,
          otp,
          role
        }).save();

        return Promise.resolve({
          success: true,
          newUser: { _id, email, otp }
        });
      }
      return {
        success: false,
        code: 409,
        message: `User with email ${email} alread exist`
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {String} email
   * @param {Number} code
   * @returns
   * @memberof UserService
   */
  static async verifyAccount(email, code) {
    try {
      const existingUser = await User.findOne({
        email,
        otp: code,
        otpExpiresIn: { $gt: Date.now() }
      });

      if (!existingUser) {
        return {
          success: false,
          code: 404,
          message: "Invalid or expired confirmation code"
        };
      }

      existingUser.otp = null;
      existingUser.otpExpiresIn = null;
      existingUser.isActive = true;
      existingUser.save();

      const token = await User.generateToken(existingUser);
      const userInfo = {
        userId: existingUser._id,
        isActive: existingUser.isActive,
        token
      };

      return Promise.resolve({ success: true, userInfo });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /**
   *
   *
   * @static
   * @param {String} email
   * @returns
   * @memberof UserService
   */
  static async resendConfirmationCode(email) {
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      return {
        success: false,
        code: 404,
        message: "We could not find an account with the email address"
      };
    }

    const secret = OTP.authenticator.generateSecret(10);

    existingUser.otp = OTP.authenticator.generate(secret);
    existingUser.otpExpiresIn = Date.now() + 3600000;

    await existingUser.save();
    return Promise.resolve({
      success: true
    });
  }

  /**
   *
   *
   * @static
   * @param {*} email
   * @param {*} password
   * @returns
   * @memberof UserService
   */
  static async login(email, password) {
    try {
      const user = await User.findUserByEmail(email);
      password = password.trim();
      if (
        user &&
        password &&
        (await User.comparePassword(password, user.password))
      ) {
        const { username, email, role, isActive } = user;

        const userInfo = {
          username,
          email,
          role,
          userId: user._id,
          isActive
        };

        const token = await User.generateToken(user);

        return {
          success: true,
          token,
          ...userInfo
        };
      } else {
        return {
          code: 404,
          message: "Email or password Incorrect",
          success: false
        };
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /**
   *
   *
   * @static
   * @returns
   * @memberof UserService
   */
  static async getStudents(page, limit) {
    try {
      // return await User.find({ role: "student" }).select("email username").lean();
      return await User.paginate(
        { role: "student" },
        { select: "email username", page, limit, lean: true }
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = UserService;
