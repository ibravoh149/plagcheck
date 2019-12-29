const fs = require("fs");
const path = require("path");
const { Submission } = require("../models");

function readfile(file) {
  const pathToFile = path.resolve("temp_upload/" + file);
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(pathToFile)) {
      return reject({ code: 400, message: `No such file ${file}` });
    }
    fs.readFile(pathToFile, "utf-8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

function compare(a, b) {
  a = a.replace(/\s+/g, "");
  b = b.replace(/\s+/g, "");

  if (!a.length && !b.length) return 1 * 100; // if both are empty strings
  if (!a.length || !b.length) return 0; // if only one is empty string
  if (a === b) return 1 * 100; // identical
  if (a.length === 1 && b.length === 1) return 0; // both are 1-letter strings
  if (a.length < 2 || b.length < 2) return 0; // if either is a 1-letter string

  let aBigrams = new Map();
  for (let i = 0; i < a.length - 1; i++) {
    const bigram = a.substring(i, i + 2);
    const count = aBigrams.has(bigram) ? aBigrams.get(bigram) + 1 : 1;

    aBigrams.set(bigram, count);
  }

  let intersectionSize = 0;
  for (let i = 0; i < b.length - 1; i++) {
    const bigram = b.substring(i, i + 2);
    const count = aBigrams.has(bigram) ? aBigrams.get(bigram) : 0;

    if (count > 0) {
      aBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return ((2.0 * intersectionSize) / (a.length + b.length - 2)) * 100;
}

class SubmissionService {
  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof SubmissionService
   */
  static async checkSubmissions(data) {
    const { assistant, student1, file1, student2, file2 } = data;
    try {
      const files = await Promise.all([readfile(file1), readfile(file2)]);
      let percentMatch = compare(files[0], files[1]);
      percentMatch = percentMatch.toFixed(2);
      const parties = [
        { studentId: student1, file: file1 },
        { studentId: student2, file: file2 }
      ];
      //   save submission
      let newSubmission = await new Submission({
        assistant,
        percentMatch,
        parties
      }).save();
      if (newSubmission) {
        return {
          message: `Similarity between files is ${percentMatch}%`,
          code: 201
        };
      }
      return {
        message: `Unable to compare submissions, try again`,
        code: 400
      };
    } catch (error) {
      if (error.code && error.code === 400) {
        return {
          message: error.message,
          code: error.code
        };
      }
      return Promise.reject(error);
    }
  }
  /**
   *
   *
   * @static
   * @returns
   * @memberof SubmissionService
   */
  static async getSubmissions(page, limit) {
    try {
      return await Submission
        .paginate(
          {},
          {
            page,
            limit,
            select: "percentMatch parties createdAt",
            populate: { path: "parties.studentId", select: "username" },
            sort: { createdAt: -1 },
            lean: true
          }
        );
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /**
   *
   *
   * @static
   * @param {*} _id
   * @returns
   * @memberof SubmissionService
   */
  static async getSubmission(_id) {
    try {
      const submission = await Submission.findById({ _id })
        .populate({
          path: "parties.studentId",
          select: "username email"
        })
        .lean();
      if (submission === null) {
        return {
          success: false,
          code: 404,
          message: "Submission not found"
        };
      }
      return {
        success: true,
        submission
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /**
   *
   *
   * @static
   * @param {*} _id
   * @returns
   * @memberof SubmissionService
   */
  static async reRunSubmission(_id) {
    try {
      const submission = await Submission.findById({ _id });
      const { parties } = submission;
      const file1 = parties[0].file;
      const file2 = parties[1].file;
      const files = await Promise.all([readfile(file1), readfile(file2)]);
      let percentMatch = compare(files[0], files[1]);
      percentMatch = percentMatch.toFixed(2);
      submission.percentMatch = percentMatch;
      await submission.save();
      return {
        message: `Similarity between files is ${percentMatch}%`,
        code: 200
      };
    } catch (error) {
      if (error.code && error.code === 400) {
        return {
          message: error.message,
          code: error.code
        };
      }
      return Promise.reject(error);
    }
  }
}

module.exports = SubmissionService;
