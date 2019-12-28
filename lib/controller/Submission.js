const SubmissionService = require("../services/submission");
const { validationResult } = require("express-validator");

module.exports = class Submisson {
  static async submit(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { student1, file1, student2, file2 } = req.body;

    try {
     const result = await SubmissionService.checkSubmissions({student1, file1, student2, file2})
      console.log(result);
    } catch (error) {
      Promise.reject(error);
      return res.status(500).json({ message: "internal server error" });
    }
  }
};
