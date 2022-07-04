const request = require("supertest");
const seed = require("../../db/seeds/seed");
const testData = require("../../db/data/test-data/index");
const db = require("../../db/connection");
const app = require("../../app");

// seed test db before running each test
beforeEach(() => seed(testData));
afterAll(() => db.end());

// test body
const updateData = {
  inc_votes: 5,
};

describe("PATCH /api/articles/article_id", () => {
  describe("api calls", () => {
    it("should return 200", () => {
      return request(app).patch("/api/articles/1").send(updateData).expect(200);
    });
    it("should return an object based on the provided id", () => {
      return request(app)
        .patch("/api/articles/1")
        .send(updateData)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.article_id).toEqual(1);
        });
    });
    it("should correctly increment the votes value of the specified row", () => {
      return request(app)
        .patch("/api/articles/1")
        .send(updateData)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).toEqual(105);
        });
    });
    it("should return a fully populated object with the updated value", () => {
      return request(app)
        .patch("/api/articles/1")
        .send(updateData)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            topic: "mitch",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 105,
          });
        });
    });
    it("should correctly update the value in the database", () => {
      return request(app)
        .patch("/api/articles/1")
        .send(updateData)
        .expect(200)
        .then(({ body }) => {
          return db.query("SELECT * FROM articles WHERE article_id = 1");
        })
        .then(({ rows }) => {
          expect(rows[0].votes).toBe(105);
        });
    });
  });
});
