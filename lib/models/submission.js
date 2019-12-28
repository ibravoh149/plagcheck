const mongoose = require("mongoose");
const schemaOptions = require("./schemaOptions");
const ObjectId = mongoose.Schema.Types.ObjectId;

const submissionSchema = new mongoose.Schema(
  {
    assistant: {
      type: ObjectId,
      ref: "user",
      required: true
    },
    percentMatch: {
      type: Number,
      default: 0
    },
    matches: {
      type: Array,
      default: []
    },
    parties: [
      {
        studentId: {
          type: ObjectId,
          ref: "user",
          required: true
        },
        file: {
          type: String,
          required: true
        }
      }
    ]
  },
  schemaOptions
);

class Submission {
  static findSubmissionById(_id) {
    return this.findOne({ _id }).lean();
  }
}

submissionSchema.loadClass(Submission);
module.exports = mongoose.model("submission", submissionSchema);
