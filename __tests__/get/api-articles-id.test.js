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
    it("should return a specific object based on the provided article_id paramater", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            author: "jonny",
            title: "Living in the shadow of a great man",
            article_id: 1,
            topic: "mitch",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
          });
        });
    });
  });
  describe("error handling", () => {
    it("should return 404 if provided a valid id that does not exist", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404: no article found with article_id 999");
        });
    });
    it("should return 400 if the given id is not an integer", () => {
      return request(app)
        .get("/api/articles/notanint")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: article_id must be a number");
        });
    });
  });
});
