const mongoose = require("mongoose");
const schemaOptions = require("./schemaOptions");
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-paginate-v2");

const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null,
      lowercase: true,
      unique: true
    },
    password: {
      type: String,
      default: null,
      set: function(value) {
        if (!value) {
          return null;
        }
        return bcrypt.hashSync(value, bcrypt.genSaltSync());
      }
    },

    otp: {
      type: Number,
      require: true
    },

    otpExpiresIn: {
      type: Date,
      default: null
    },

    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpiresIn: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: "student",
      enum: ["assistant", "admin", "student"]
    }
  },
  schemaOptions
);

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
   * @param {*} password
   * @param {*} encrypted
   * @returns
   * @memberof User
   */
  static comparePassword(password, encrypted) {
    try {
      const isMatch = bcrypt.compareSync(password, encrypted);
      return Promise.resolve(isMatch);
    } catch (error) {
      console.log(error);
      throw Promise.reject(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} email
   * @returns
   * @memberof User
   */
  static findUserByEmail(email) {
    return this.findOne({ email }).lean();
  }

  /**
   *
   *
   * @static
   * @param {Object} user
   * @returns {String}
   * @memberof User
   */
  static generateToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXP }
    );
  }
  /**
   *
   *
   * @static
   * @param {*} userId
   * @returns
   * @memberof User
   */
  static findUserById(userId) {
    return this.findOne({ _id: userId }).lean();
  }
  /**
   *
   *
   * @static
   * @param {*} email
   * @param {*} userId
   * @returns
   * @memberof User
   */
  static findUserByPhoneAndId(email, userId) {
    return this.findOne({ email, _id: userId }).lean();
  }
}

userSchema.plugin(mongoosePaginate);
userSchema.loadClass(User);
module.exports = mongoose.model("user", userSchema);
