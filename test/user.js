const chai = require("chai");
const chaiHttp = require("chai-http");
const supertest = require("supertest");
const app = require("../index");
const {
  insertUserSeed,
  validUser,
  userWithWrongEmail,
  userWithWrongPassword,
  generateToken
} = require("./helper/mockData");
const { User } = require("../lib/models");

const expect = chai.expect;
const request = supertest(app);
let token = "";
let user = "";
chai.use(chaiHttp);

describe("user Controller", () => {
  before(async () => {
    user = await insertUserSeed();
    token = generateToken(user);
  });

  after(async () => {
    await User.remove({});
  });

  describe("Create User POST: /v1/users", () => {
    it("should successfully create a new user", done => {
      request
        .post("/v1/users")
        .send(validUser)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).to.equal(
            "An OTP has been sent to your email."
          );
          done();
        });
    });
  });

  describe("Create User Validation POST: /v1/users", () => {
    it("should return 409 on duplicate email", done => {
      request
        .post("/v1/users")
        .send(validUser)
        .expect(409)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).to.equal(
            `User with email ${validUser.email} alread exist`
          );
          done();
        });
    });
  });

  describe("Signin user POST: /v1/login", () => {
    it("should successfully log in a registered user", done => {
      request
        .post("/v1/users/login")
        .send(validUser)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.email).to.equal(validUser.email);
          done();
        });
    });
    it("should return a 404 error if wrong email", done => {
      request
        .post("v1/users/login")
        .send(userWithWrongEmail)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(404);
          done();
        });
    });

    it("should return a 404 error if wrong password", done => {
      request
        .post("/v1/users/login")
        .send(userWithWrongPassword)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  describe("GET STUDENTS GET:/v1/users/students", () => {
    it("should be able to list all students", done => {
      request
        .get("/v1/users/students")
        .set({ authorization: token })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.docs.length).to.be.greaterThan(0);
          done();
        });
    });
  });
});
