const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app");

// seed test db before running each test
beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET endpoints", () => {
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
      it("should correctly append a comment_count key, which is the sum of all comments related to the article_id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article.hasOwnProperty("comment_count")).toBe(true);
            expect(body.article.comment_count).toBe(11);
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
              comment_count: 11,
            });
          });
      });
      it("should return the correct value in comment_count for articles that have 0 comments", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(({ body }) => {
            expect(body.article.hasOwnProperty("comment_count")).toBe(true);
            expect(body.article.comment_count).toBe(0);
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
            expect(body.topics.length > 0).toBe(true);
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
  describe("GET /api/users", () => {
    describe("api calls", () => {
      it("should return a status code of 200", () => {
        return request(app).get("/api/users").expect(200);
      });
      it("should return an object with a key of users which is an array", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body).toHaveProperty("users");
            expect(Array.isArray(body.users)).toBe(true);
          });
      });
      it("should return all objects from the users table", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users.length).toBe(4);
          });
      });
      it("should return all objects fully populated with the correct keys and value types", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users.length > 0).toBe(true);
            body.users.forEach((user) => {
              expect(user).toEqual({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              });
            });
          });
      });
      it("should return all objects fully populated with the correct keys and values", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users.length).toBe(4);
            expect(body.users[0]).toEqual({
              username: "butter_bridge",
              name: "jonny",
              avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            });
          });
      });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    describe("api calls", () => {
      it("should return a 200 status code", () => {
        return request(app).get("/api/articles/1/comments").expect(200);
      });
      it("should return an object with a key of comments which is an array", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.hasOwnProperty("comments")).toBe(true);
            expect(Array.isArray(body.comments)).toBe(true);
          });
      });
      it("should return all comments with the same article_id as the one provided", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(11);
          });
      });
      it("should return all comments with the correct key:value pairs", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).not.toBe(0);
            body.comments.forEach((comment) => {
              expect(comment).toEqual({
                comment_id: expect.any(Number),
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                article_id: 1,
                created_at: expect.any(String),
              });
            });
          });
      });
      it("should return the correct author name from the users table", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0].author).toBe("jonny");
          });
      });
    });
    describe("error handling", () => {
      // ADD TEST FOR WHEN ID IS VALID BUT HAS NO COMMENTS -> 200 OR 404??
      it("should return 404 if provided a valid id that doesn't exist", () => {
        return request(app)
          .get("/api/articles/100/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("404: no article found with article_id 100");
          });
      });
      it("should return 404 if the requested article has no comments", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("404: no comments found for article_id 2");
          });
      });
      it("should return 400 if provided an id that isn't an integer", () => {
        return request(app)
          .get("/api/articles/notanint/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: article_id must be a number");
          });
      });
    });
  });
  describe("GET /api/articles", () => {
    describe("api calls", () => {
      it("should return a status code of 200", () => {
        return request(app).get("/api/articles").expect(200);
      });
      it("should return an object with a key of articles which is an array", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.hasOwnProperty("articles")).toBe(true);
            expect(Array.isArray(body.articles)).toBe(true);
          });
      });
      it("should return all articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(12);
          });
      });
      it("should return all articles with the correct key:value pairs", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).not.toBe(0);
            body.articles.forEach((article) => {
              expect(article).toEqual({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              });
            });
          });
      });
      it("should return the results in descending order based on date by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).not.toBe(0);
            expect(body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
    });
    describe("/api/articles queries", () => {
      it("works with multiple queries at once", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=ASC&topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(11);
            expect(body.articles).toBeSortedBy("votes");
            body.articles.forEach((article) => expect(article.topic).toBe("mitch"));
          });
      });
      describe("sort_by", () => {
        it("should accept a sort_by query, which correctly sorts in descending order (by default)", () => {
          return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).not.toBe(0);
              expect(body.articles).toBeSortedBy("votes", {
                descending: true,
              });
            });
        });
        it("should allow sorting by any article property", () => {
          return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).not.toBe(0);
              expect(body.articles).toBeSortedBy("title", {
                descending: true,
              });
            });
        });
        describe("error handling", () => {
          it("should return 400 if given an invalid sort_by query", () => {
            return request(app)
              .get("/api/articles?sort_by=notvalid")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("400: invalid sort_by query");
              });
          });
        });
      });
      describe("order", () => {
        it("allows changing the order (asc/desc) based on a valid query", () => {
          return request(app)
            .get("/api/articles?order=ASC")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).not.toBe(0);
              expect(body.articles).toBeSortedBy("created_at", {
                ascending: true,
              });
            });
        });
        describe("error handling", () => {
          it("returns 400 if given an invalid error query", () => {
            return request(app)
              .get("/api/articles?order=notvalid")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("400: invalid order query");
              });
          });
        });
      });
      describe("topic", () => {
        it("allows filtering based on a topic query", () => {
          return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(1);
              expect(body.articles[0].topic).toBe("cats");
            });
        });
        it("returns 200 and an empty array the topic exists but has no associated articles", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(0);
            });
        });
        describe("error handling", () => {
          it("returns 404 if the topic does not exist in the topics table", () => {
            return request(app)
              .get("/api/articles?topic=notatopic")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe("404: no topic found with slug 'notatopic'");
              });
          });
        });
      });
    });
  });
  describe("GET /api", () => {
    it("returns a 200 status code", () => {
      return request(app).get("/api").expect(200);
    });
    it("returns an object with a key of endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("endpoints");
        });
    });
    it("returns an object with 9 keys, one for each of the apps endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body.endpoints).length).toBe(9);
        });
    });
  });
  describe("GET /api/users/:username", () => {
    it("returns a status code of 200", () => {
      return request(app).get("/api/users/butter_bridge").expect(200);
    });
    it("returns an object with a key of user", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("user");
        });
    });
    it("returns a user with the correct key:value pairs", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toEqual({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
    });
    it("returns a specific user with the correct values", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toEqual({
            username: "butter_bridge",
            name: "jonny",
            avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
    describe("error handling", () => {
      it("returns 404 if the given username does not exist", () => {
        return request(app)
          .get("/api/users/notavaliduser")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toEqual("404: no user with username notavaliduser");
          });
      });
    });
  });
});
describe("PATCH endpoints", () => {
  // test body

  describe("PATCH /api/articles/article_id", () => {
    const updateData = {
      inc_votes: 5,
    };
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
      it("should correctly increment the votes value of the specified row when given a positive number", () => {
        return request(app)
          .patch("/api/articles/1")
          .send(updateData)
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).toEqual(105);
          });
      });
      it("should correctly decrement the votes value of the specified row when given a negative number", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -5 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).toEqual(95);
          });
      });
      it("should ignore irrelevant keys providing there is a key inc_votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ author: "adam", inc_votes: 1 })
          .expect(200)
          .then(() => {
            return db.query("SELECT * FROM articles WHERE article_id = 1");
          })
          .then(({ rows }) => {
            expect(rows[0].author).not.toBe("adam");
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
          .then(() => {
            return db.query("SELECT * FROM articles WHERE article_id = 1");
          })
          .then(({ rows }) => {
            expect(rows[0].votes).toBe(105);
          });
      });
    });
    describe("error handling", () => {
      it("should return 404 if provided a valid id that does not exist", () => {
        return request(app)
          .patch("/api/articles/999")
          .send(updateData)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("404: no article found with article_id 999");
          });
      });
      it("should return 400 if the given id is not an integer", () => {
        return request(app)
          .patch("/api/articles/notanint")
          .send(updateData)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: article_id must be a number");
          });
      });
      it("should return 400 if provided an empty body", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: must provide a body in the patch request - {inc_votes: [number]}");
          });
      });
      it("should return 400 if inc_votes is not a number", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "notanumber" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: inc_votes must be of type number");
          });
      });
    });
  });
  describe.only("PATCH /api/comments/comment_id", () => {
    const testData = {
      inc_votes: 10,
    };
    const firstComment = {
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 16,
      author: "butter_bridge",
      article_id: 9,
      created_at: 1586179020000,
    };
    describe("api calls", () => {
      it("should return 200", () => {
        return request(app).patch("/api/comments/1").send(testData).expect(200);
      });
      it("should return an object based on the given id", () => {
        return request(app)
          .patch("/api/comments/1")
          .send(testData)
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toEqual({
              comment_id: 1,
              body: firstComment.body,
              votes: expect.any(Number),
              author: firstComment.author,
              article_id: firstComment.article_id,
              created_at: expect.any(String),
            });
          });
      });
      it("should correctly increment the value of votes when given a positive number", () => {
        return request(app)
          .patch("/api/comments/1")
          .send(testData)
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).toBe(26);
          });
      });
      it("should correctly increment the value of votes when given a negative number", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).toBe(6);
          });
      });
    });
    describe("error handling", () => {
      it("should return 404 if the id is valid but non-existing", () => {
        return request(app)
          .patch("/api/comments/100")
          .send(testData)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("404: no comment with id 100");
          });
      });
      it("should return 400 if the id is not a number", () => {
        return request(app)
          .patch("/api/comments/NaN")
          .send(testData)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: id must be a number");
          });
      });
      it("should return 400 if the body is empty", () => {
        return request(app)
          .patch("/api/comments/NaN")
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: body must be - {inc_votes:  <number>}");
          });
      });
      it("should return 400 if the body does not include inc_votes", () => {
        return request(app)
          .patch("/api/comments/NaN")
          .send({ not_votes: 100 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: body must be - {inc_votes:  <number>}");
          });
      });
    });
  });
});
describe("POST endpoints", () => {
  describe("POST /api/articles/:article_id/comments", () => {
    const postData = { username: "butter_bridge", body: "aaa" };
    describe("api calls / post", () => {
      // test data

      it("should return a 201 status code", () => {
        return request(app).post("/api/articles/2/comments").send(postData).expect(201);
      });
      it("should return a new comment when provided a suitable body", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send(postData)
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).toEqual({
              article_id: 2,
              votes: 0,
              author: "butter_bridge",
              body: "aaa",
              created_at: expect.any(String),
              comment_id: expect.any(Number),
            });
          });
      });
      it("correctly creates a new row in the db with the new comment", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send(postData)
          .expect(201)
          .then(({ body }) => {
            return db.query("SELECT * FROM comments WHERE article_id = 2");
          })
          .then((result) => {
            expect(result.rows[0]).toEqual({
              article_id: 2,
              votes: 0,
              author: "butter_bridge",
              body: "aaa",
              created_at: expect.any(Date),
              comment_id: expect.any(Number),
            });
          });
      });
      it("correctly ignores irrelevant keys providing there's a suitable body & username", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ ...postData, randomKey: 22 })
          .expect(201)
          .then(({ body }) => {
            return db.query("SELECT * FROM comments WHERE article_id = 2");
          })
          .then((result) => {
            expect(result.rows[0]).toEqual({
              article_id: 2,
              votes: 0,
              author: "butter_bridge",
              body: "aaa",
              created_at: expect.any(Date),
              comment_id: expect.any(Number),
            });
          });
      });
    });
    describe("error handling", () => {
      it("returns a 404 if the article_id does not exist", () => {
        return request(app)
          .post("/api/articles/99/comments")
          .send(postData)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("404: no article with article_id 99");
          });
      });
      it("returns 400 if the article_id is not a number", () => {
        return request(app)
          .post("/api/articles/notanint/comments")
          .send(postData)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: article_id must be a number");
          });
      });
      it("returns 400 if the body is empty", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: request body must be {username: [string], body: [string]}");
          });
      });
      it("returns 400 if the body is not empty but does not have the right keys", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ key1: "aaa", key2: 88 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: request body must be {username: [string], body: [string]}");
          });
      });
      it("returns 400 if the body has username & body but either is of the wrong type", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ key1: "aaa", key2: 88 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: request body must be {username: [string], body: [string]}");
          });
      });
    });
  });
});
describe("DELETE endpoints", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    it("returns a status code of 204", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    it("returns an empty body", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    it("removes a comment from the db based on the provided id, if suitable", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          // make DELETE call, then make sure the comment with id 1 is no longer in the db
          return db.query("SELECT * FROM comments WHERE comment_id = 1");
        })
        .then(({ rowCount }) => {
          expect(!rowCount).toBe(true);
        });
    });
    describe("error handling", () => {
      it("returns 400 if the comment_id is of the wrong type", () => {
        return request(app)
          .delete("/api/comments/notanint")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("400: comment_id must be a number");
          });
      });
      it("returns 404 if trying to delete a comment that does not exist", () => {
        // make sure comment is there
        return request(app)
          .delete("/api/comments/999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toEqual("404: no comment found with id 999");
          });
      });
      it("returns 404 if trying to delete a comment that has already been deleted", () => {
        // make sure comment is there
        return request(app)
          .get("/api/articles/6/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(1);
            return request(app).delete("/api/comments/16").expect(204);
          })
          .then(({ body }) => {
            return request(app).delete("/api/comments/16").expect(404);
          })
          .then(({ body }) => {
            // expect 404, meaning successful deletion
            expect(body.msg).toEqual("404: no comment found with id 16");
          });
      });
    });
  });
});
