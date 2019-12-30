const chai = require("chai");
const chaiHttp = require("chai-http");
const supertest = require("supertest");
const app = require("../index");
const {
  insertUserSeed,
  generateToken,
  insertStudentSeed
} = require("./helper/mockData");
const { Submission, User } = require("../lib/models");

const expect = chai.expect;
const request = supertest(app);
let token = "";
let assistant = "";
let student1 = "";
let student2 = "";
let file1 = "1577593716529-one.txt";
let file2 = "1577593740793-two.txt";
let currentSubmission = "";
chai.use(chaiHttp);

describe("submission controller", () => {
  before(async () => {
    // seed a user into the db collection
    assistant = await insertUserSeed();

    //  generatee token for the seeded user
    token = generateToken(assistant);

    //  seed students into the db collection
    const students = await insertStudentSeed();

    student1 = students[0]._id;
    student2 = students[1]._id;
  });

  after(async () => {
    await User.remove({});
    await Submission.remove({});
  });

  describe("SUBMISSIONS: /v1/submissions", () => {
    it("should successfully submit and compare students submissions", done => {
      request
        .post("/v1/submissions")
        .set({ authorization: token })
        .send({ student1, student2, file1, file2 })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.be.equal(201);
          done();
        });
    });

    it("should successfully get a list previous comparison sessions", done => {
      request
        .get("/v1/submissions")
        .set({ authorization: token })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          currentSubmission = res.body.data.docs[0]._id;
          expect(res.body.data.docs).not.to.be.equal([]);
          done();
        });
    });
  });

  it("should successfully re-run a previous comparison", done => {
    request
      .put(`/v1/submissions/${currentSubmission}`)
      .set({ authorization: token })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(200);
        done();
      });
  });

//   it("should successfully get the details of a comparison session", done => {
//     request
//       .get(`/v1/submissions/${currentSubmission}`)
//       .set({ authorization: token })
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         console.log(res.body)
//         expect(res.body.data._id).to.be.equal(currentSubmission);
//         done();
//       });
//   });
});
