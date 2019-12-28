const fs = require("fs");
const path = require("path");
const { Submission } = require("../models");

function readfiles(file1, file2) {
  return new Promise((resolve, reject) => {
    const fileContent1 = fs.readFileSync(
      path.resolve("temp_upload/" + file2)
    ).toString('utf-8');
    return resolve({
      fileContent1
    });
  });
}

class SubmissionService {
  static async checkSubmissions(data) {
    const { student1, file1, student2, file2 } = data;
    try {
      const files = await readfiles(file1, file2);
      return files;
    } catch (error) {
        console.log(error)
    }
  }
}

module.exports = SubmissionService;
