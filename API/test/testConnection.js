const request = require("supertest");
const app = require("../server.js");

//==================== user API test ====================

/**
 * Testing get all user endpoint
 */
describe("GET /api/v1/test/all", function () {
  it("respond with json containing a list of all time data", function (done) {
    request(app)
      .get("/api/v1/test/all")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

/**
 * Testing get a user endpoint by giving an existing user
 */
describe("GET /user/:id", function () {
  it("respond with json containing a single user", function (done) {
    request(app)
      .get("/api/v1/test/all")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

/**
 * Testing get a user endpoint by giving a non-existing user
 */
// describe('GET /user/:id', function () {
//     it('respond with json user not found', function (done) {
//         request(app)
//             .get('/users/idisnonexisting')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(404) //expecting HTTP status code
//             .expect('"user not found"') // expecting content value
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });
// });

/**
 * Testing post user endpoint
 */
describe("POST  test add", function () {
  let data = {
    Test1: "hello world",
  };
  it("respond with 201 created", function (done) {
    request(app)
      .post("/api/v1/test/add")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

after(function (done) {
  app.close(() => {
    process.exit(1);
  });
});
/**
 * Testing post user endpoint
 */
// describe('POST /users', function () {
//     let data = {
//         //no id
//         "name": "dummy",
//         "contact": "dummy",
//         "address": "dummy"
//     }
//     it('respond with 400 not created', function (done) {
//         request(app)
//             .post('/users')
//             .send(data)
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect('"user not created"')
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });
// });
