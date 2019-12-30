const faker = require("faker");
var { User } = require("../../lib/models");

const users = [
  {
    email: faker.internet.email(),
    username: faker.name.firstName(),
    password: faker.internet.password(),
    isActive: true,
    role: "assistant"
  }
];

const studentSeed = [
  {
    email: faker.internet.email(),
    username: faker.name.firstName(),
    password: faker.internet.password(),
    isActive: true,
    role: "student"
  },
  {
    email: faker.internet.email(),
    username: faker.name.firstName(),
    password: faker.internet.password(),
    isActive: true,
    role: "student"
  }
];

/**
 * @description Insert seed data in user model
 *
 * @returns {object}
 */
const insertUserSeed = async () => {
  let user = await new User(users[0]).save();
  return user;
};


const insertStudentSeed = async () => {
    let students = await User.insertMany(studentSeed);
    return students;
  };

/**
 * @description Generates token from seed data
 *
 * @param {Number} id - User object
 *
 * @returns {string} token - Generated token
 */

const generateToken = user => {
  return User.generateToken(user);
};

const validUser = {
  email: "usertwo@gmail.com",
  username: "usertwo",
  password: "mypassword",
  roleId: "2"
};

const userWithExistingEmail = {
  email: "usertwo@mail.com",
  username: "usertwo",
  password: "mypassword",
  isActive: true
};

const userWithWrongEmail = {
  email: "user@mail.com"
  // phone:"890384",
};

const userWithWrongPassword = {
  email: "usertwo@gmail.com",
  password: "mypaswordwrong"
};

module.exports = {
  insertUserSeed,
  validUser,
  userWithExistingEmail,
  userWithWrongEmail,
  userWithWrongPassword,
  generateToken,
  insertStudentSeed
};
