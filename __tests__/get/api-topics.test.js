const request = require("supertest");
const seed = require("../../db/seeds/seed");
const testData = require("../../db/data/test-data/index");
const db = require("../../db/connection");
const app = require("../../app");

// seed test db before running test suite
beforeAll(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  describe("api calls", () => {
    it("should respond with a status code of 200", () => {
      return request(app).get("/api/topics").expect(200);
    });
    it("should respond with an object containing an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
        });
    });
    it("array should be of length 3", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
        });
    });
    it("each topic should be an object with two keys, slug & description, both of which are strings", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          body.topics.forEach((topic) => {
            expect(topic).toEqual({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
});
