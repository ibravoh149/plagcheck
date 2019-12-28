const mongoose = require("mongoose");
const schemaOptions = require("./schemaOptions");
const permissionLevel = require("./permissionLevel");
const ObjectId = mongoose.Schema.Types.ObjectId;

const roles = Object.keys(permissionLevel);

const permissionSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref:"user",
      required: true
    },
    role: {
      type: String,
      enum: roles,
      required: true
    },
    shadow:{
        type:Boolean,
        default:false
    }
  },
  schemaOptions
);

permissionSchema.index({ userId: 1 }, { unique: true });
// permissionSchema.index({  shadow: 1 });

/** */
function normalizeAndCheck(permission) {
  return new Promise((resolve, reject) => {
    const retPerm = permission.toLowerCase().trim();
    if (Number.isInteger(permissionLevels[retPerm])) return resolve(retPerm);
    return reject(new Error(`Invalid permissions level: ${permission}`));
  });
}

/**
 *  Weird way mongoose works. Don't need constructor
 */ 

class UserPermission {
  /**
   * @param {String} userId - user id
   * @return {Promise} promise
   */
  static findByUser(userId) {
    return this.find({ userId }).lean();
  }

  /**
   * Creates a new permission
   * @param {String} userId - user Id of user to have access
   * @param {String} permission - enum of user role to be assigned for account
   * @return {Promise} promise
   */
  static add(userId, permission) {
    return new Promise((resolve, reject) => {
      normalizeAndCheck(permission)
        .then(retPerm => {
          this({
            userId,
            role: retPerm,
          })
            .save()
            .then(resolve)
            .catch(err => {
              if (err && err.code === 11000) return resolve();
              return reject(err);
            });
        })
        .catch(reject);
    });
  }

  /**
   * remove a permission for a specific user from an account
   * @param {String} userId - user id to remove permission for
   * @return {Promise} promise
   */
  static removePermission(userId) {
    return this.findOneAndRemove({ userId });
  }

  /**
   * change a permission for a specific user from an account
   * @param {String} userId - user id to remove permission for
   * @param {String} newPermission - permission to change to
   * @return {Promise} promise
   */
  static changePermission(userId, newPermission) {
    return new Promise((resolve, reject) => {
      normalizeAndCheck(newPermission)
        .then(retPerm => {
          this.findOne({ userId })
            .then(permission => {
              if (!permission)
                return reject(
                  new Error(`Invalid user: ${userId}`)
                );
              permission.role = retPerm;
              return permission
                .save()
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }
}

permissionSchema.loadClass(UserPermission);
module.exports = mongoose.model("userPermisson", permissionSchema);
