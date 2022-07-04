const request = require("supertest");
const seed = require("../../db/seeds/seed");
const testData = require("../../db/data/test-data/index");
const db = require("../../db/connection");
const app = require("../../app");

// seed test db before running test suite
beforeAll(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/articles/:article_id", () => {
  describe("api calls", () => {
    it("should return a status code of 200", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    it("should return an object with a key of article and a value that is an object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("article");
          expect(body.article).toEqual(expect.any(Object));
        });
    });
  });
});
