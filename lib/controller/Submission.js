const SubmissionService = require("../services/submission");
const { validationResult } = require("express-validator");

module.exports = class Submisson {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async submit(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { student1, file1, student2, file2 } = req.body;

    try {
      const result = await SubmissionService.checkSubmissions({
        assistant: req.user.userId,
        student1,
        file1,
        student2,
        file2
      });
      return res.status(result.code).json({ message: result.message });
    } catch (error) {
      Promise.reject(error);
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
   */
  static async getSubmissions(req, res) {
    try {
      const submissions = await SubmissionService.getSubmissions();
      return res.status(200).json({ data: submissions });
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    }
  }

  static async getSubmission(req, res) {
    const { id } = req.params;
    try {
      const result = await SubmissionService.getSubmission(id);
      console.log(result)
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    }
  }
};
