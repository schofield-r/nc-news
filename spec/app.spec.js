process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;

chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("GET /topics", () => {
    it("responds with an array of topic objects, each topic having the correct keys in table", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an("array");
          expect(res.body.topics[0]).to.contain.keys("slug", "description");
        });
    });
    it("responds with a 404 if invalid endpoint is typed", () => {
      return request(app)
        .get("/api/not-the correct-endpoint")
        .expect(404);
    });
    it("responds with 405 bad method, when patch,put and delete request sent", () => {
      const invalidMethods = ["put", "patch", "delete"];
      const methodPromise = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405);
      });
      return Promise.all(methodPromise);
    });
  });
  describe("POST /topics", () => {
    it("responds with 201 'topic created' and posted topic when sent new topic", () => {
      return request(app)
        .post("/api/topics")
        .send({ slug: "newTopic", description: "this is a new topic" })
        .expect(201)
        .then(res => {
          expect(res.body.topic.slug).to.equal("newTopic");
        });
    });
    it("responds with 409 topic already exists, when sent a topic that already exists", () => {
      return request(app)
        .post("/api/topics")
        .send({
          description: "Not dogs",
          slug: "cats"
        })
        .expect(409);
    });
    it("responds with 400 when sent a badly formed topic object", () => {
      return request(app)
        .post("/api/topics")
        .send({ slurp: "newTopic", descript: "this is a new topic" })
        .expect(400);
    });
  });
  describe("GET /users/:username", () => {
    it("responds with user data when passed username in a get request", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(res => {
          expect(res.body.user).to.be.an("object");
          expect(res.body.user).to.contain.keys(
            "username",
            "avatar_url",
            "name"
          );
        });
    });
    it("responds with 404 if request is not a user", () => {
      return request(app)
        .get("/api/users/not-a-user")
        .expect(404);
    });
    it("responds with 404 when badly formed username sent", () => {
      return request(app)
        .get("/api/users/1234")
        .expect(404);
    });
    it("responds with 405 bad method, when patch,post,put and delete request sent", () => {
      const invalidMethods = ["post", "put", "patch", "delete"];
      const methodPromise = invalidMethods.map(method => {
        return request(app)
          [method]("/api/users/lurker")
          .expect(405);
      });
      return Promise.all(methodPromise);
    });
  });
  describe("GET /users", () => {
    it("responds with 200 and array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(res => {
          expect(res.body.users).to.be.an("array");
          expect(res.body.users[0]).to.eql({
            username: "butter_bridge",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            name: "jonny"
          });
        });
    });
    it("responds with 404 when invalid route given", () => {
      return request(app)
        .get("/api/not-users")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("not found");
        });
    });
    it("responds with 405 method not allowed when patch,put,and delete request sent", () => {
      const invalidMethods = ["put", "patch", "delete"];
      const methodPromise = invalidMethods.map(method => {
        return request(app)
          [method]("/api/users")
          .expect(405);
      });
      return Promise.all(methodPromise);
    });
  });
  describe("POST /users", () => {
    it("responds with 201 and new user object when sent new user request", () => {
      return request(app)
        .post("/api/users")
        .send({
          username: "newUser",
          name: "newName",
          avatar_url: "https://www.avatar.png"
        })
        .expect(201)
        .then(res => {
          expect(res.body.user).to.eql({
            username: "newUser",
            name: "newName",
            avatar_url: "https://www.avatar.png"
          });
        });
    });
    it("responds with 409 when sent a username that already exists", () => {
      return request(app)
        .post("/api/users")
        .send({
          username: "butter_bridge",
          name: "newName",
          avatar_url: "https://www.avatar.png"
        })
        .expect(409)
        .then(res => {
          expect(res.body.msg).to.equal("already exists");
        });
    });
    it("responds with 400 when invalid body given", () => {
      return request(app)
        .post("/api/users")
        .send({
          user: "newUser",
          name: "newName",
          avata: "https://www.avatar.png"
        })
        .expect(400);
    });
  });
  describe("GET /articles/:article_id", () => {
    it("responds with an array of article objects, each having the correct keys in table", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)

        .then(res => {
          //console.log(res.body);
          expect(res.body.article).to.be.an("object");
          expect(res.body.article).to.contain.keys(
            "article_id",
            "title",
            "votes",
            "topic",
            "author",
            "body",
            "created_at",
            "comment_count"
          );
        });
    });
    it("responds with 404 if article does not exist", () => {
      return request(app)
        .get("/api/article/99999")
        .expect(404);
    });
    it("responds with 404 if request is not a valid article id", () => {
      return request(app)
        .get("/api/article/not-an-article")
        .expect(404);
    });
    it("responds with 405 when sent a PUT or POST request", () => {
      const invalidMethods = ["put", "post"];
      const methodPromise = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/1")
          .expect(405);
      });
      return Promise.all(methodPromise);
    });
  });
  describe("DELETE /articles/:article_id", () => {
    it("responds with 204 when sent article_id to delete article", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(204);
    });
    it("responds with 400 when invalid route given", () => {
      return request(app)
        .delete("/api/articles/not-an-article-id")
        .expect(400);
    });
    it("responds with 404 when article id is not in database", () => {
      return request(app)
        .delete("/api/articles/999999")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("article id does not exist");
        });
    });
  });
  describe("PATCH /articles/:article_id", () => {
    it("responds with an updated article and 201", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(102);
          expect(res.body.article).to.contain.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          );
        });
    });
    it("responds with 200 and the unedited article when no inc_votes on request body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send()
        .expect(200);
    });
    it("responds with 400 when invalid inc_votes given", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "cats" })
        .expect(400);
    });
    it("responds with 400 when invalid route given", () => {
      return request(app)
        .patch("/api/articles/not-a-route")
        .send({ inc_votes: 1 })
        .expect(400);
    });
    it("responds with 404 when article id is not in database", () => {
      return request(app)
        .patch("/api/articles/999999")
        .send({ inc_votes: 1 })
        .expect(404);
    });
  });
  describe("POST /articles/:article_id/comments", () => {
    it("POST comment by article id returns the posted comment", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({ username: "lurker", body: "this is a comment" })
        .then(res => {
          expect(res.body.comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(res.body.comment.body).to.equal("this is a comment");
          expect(res.body.comment.author).to.equal("lurker");
        });
    });
    it("POST comment by article id returns the correct error handles by psql errorcodes for 'no body'", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({ username: "lurker" })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("bad request");
        });
    });
    it("returns 404 for an article id that does not exist", () => {
      return request(app)
        .post("/api/articles/9999/comments")
        .send({ username: "lurker", body: "this is a comment" })
        .expect(404);
    });
    it("returns 400 for an invalid article id", () => {
      return request(app)
        .post("/api/articles/not-an-id/comments")
        .send({ username: "lurker", body: "this is a comment" })
        .expect(400);
    });
    it("returns 404 for a username that does not exist", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "not-a-username", body: "this is a comment" })
        .expect(404);
    });
  });
  describe("GET /articles/:article_id/comments", () => {
    it("GET request on comments of an article by article id returns all comments on that article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(res => {
          // console.log(res.body)
          expect(res.body.comments).to.be.an("array");
          expect(res.body.comments).to.have.lengthOf(13);
          expect(res.body.comments[0]).to.contain.keys(
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          );
        });
    });
    it("get a 404 if article id does not exist", () => {
      return request(app)
        .get("/api/articles/888/comments")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("article_id not found");
        });
    });
    it("get a 400 if article id is not correct format, eg a string", () => {
      return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("invalid input");
        });
    });
    it("get a 200 if article id exists but has no comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.eql([]);
        });
    });
    it("handle query of sort by", () => {
      return request(app)
        .get("/api/articles/9/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(res => {
          expect(res.body.comments[0]).to.contain.keys(
            "comment_id",
            "author",
            "votes",
            "created_at",
            "body",
            "article_id"
          );
        });
    });
    it("returns 405 for invalid method PUT,PATCH,DELETE", () => {
      const invalidMethods = ["put", "patch", "delete"];
      const methodPromise = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/1/comments")
          .expect(405);
      });
      return Promise.all(methodPromise);
    });
  });
  describe("GET /articles", () => {
    it("responds with 200 and articles when sending a query to articles", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=asc&author=butter_bridge")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.have.lengthOf(3);
          expect(res.body.articles).to.eql([
            {
              article_id: 12,
              title: "Moustache",
              body: "Have you seen the size of that thing?",
              votes: 0,
              comment_count: "0",
              topic: "mitch",
              author: "butter_bridge",
              created_at: "1974-11-26T12:21:54.171Z"
            },
            {
              article_id: 9,
              title: "They're not exactly dogs, are they?",
              body: "Well? Think about it.",
              votes: 0,
              comment_count: "2",
              topic: "mitch",
              author: "butter_bridge",
              created_at: "1986-11-23T12:21:54.171Z"
            },
            {
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              comment_count: "13",
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z"
            }
          ]);
        });
    });
    it("responds with 200 and articles when passed another query with different parameters ", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc&topic=cats")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.have.lengthOf(1);
          expect(res.body.articles).to.eql([
            {
              article_id: 5,
              title: "UNCOVERED: catspiracy to bring down democracy",
              body: "Bastet walks amongst us, and the cats are taking arms!",
              comment_count: "2",
              votes: 0,
              topic: "cats",
              author: "rogersop",
              created_at: "2002-11-19T12:21:54.171Z"
            }
          ]);
        });
    });
    it("responds with 400 when sent an incorrect query statement", () => {
      return request(app)
        .get("/api/articles?sort_by=voes&order=asc&topic=cats")
        .expect(400);
    });
    it("responds with 400 when optional query is added and not spelt properly or isnt author or topic, ", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc&top=cats")
        .expect(200);
    });
    it("responds with 404 when passed an author/topic that is not in database", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc&topic=not-a-topic")
        .expect(404);
    });
    it("responds with 200 when order is not asc or desc and defaults to desc", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("returns 200 and empty array when optional query is added and has no articles associated with it", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc&top=cats")
        .expect(200);
    });
    it("responds with 405 when sent a PATCH,PUT or DELETE request", () => {
      const invalidMethods = ["put", "patch", "delete"];
      const methodPromise = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles")
          .expect(405);
      });
      return Promise.all(methodPromise);
    });
  });
  describe("POST /articles", () => {
    it("responds with 201 and the article posted to database", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "newArticle",
          topic: "mitch",
          author: "butter_bridge",
          body:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        })
        .expect(201)
        .then(res => {
          expect(res.body.article).to.be.an("object");
          expect(res.body.article).to.contain.keys(
            "title",
            "author",
            "article_id",
            "created_at",
            "votes",
            "body"
          );
        });
    });
    it("responds with 400 when article object is badly formed", () => {
      return request(app)
        .post("/api/articles")
        .send({
          t: "newArticle",
          top: "mitch",
          author: "butter_bridge",
          body: "Lorem ipsum "
        })
        .expect(400);
    });
    it("responds with 404 when sent an article with topic that is not in the topics table", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "newArticle",
          topic: "mike",
          author: "butter_bridge",
          body:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("not found");
        });
    });
    it("responds with 404 when sent an article with username(author) that is not in users table", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "newArticle",
          topic: "mitch",
          author: "buttery",
          body:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        })
        .expect(404)
        .then(res => {
          // expect(res.body.msg).to.equal("username does not exist, please create user or log in")
        });
    });
  });
  describe("PATCH /comments/:comment_id", () => {
    it("responds with an updated comment and 200", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 4 })
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(20);
          expect(res.body.comment).to.contain.keys(
            "article_id",
            "body",
            "votes",
            "comment_id",
            "author",
            "created_at"
          );
        });
    });
    it("responds with 200 and unedited comment if no inc_votes is included on body", () => {
      return request(app)
        .patch("/api/comments/1")
        .send()
        .expect(200);
    });
    it("responds with 400 when invalid inc_votes given", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "cats" })
        .expect(400);
    });
    it("responds with 400 when invalid route given", () => {
      return request(app)
        .patch("/api/comments/not-a-route")
        .send({ inc_votes: 1 })
        .expect(400);
    });
    it("responds with 404 when comment id is not in database", () => {
      return request(app)
        .patch("/api/comments/999999")
        .send({ inc_votes: 1 })
        .expect(404);
    });
    it("responds with 405 when sent a PUT , GET or POST request", () => {
      const invalidMethods = ["put", "get", "post"];
      const methodPromise = invalidMethods.map(method => {
        return request(app)
          [method]("/api/comments/1")
          .expect(405);
      });
      return Promise.all(methodPromise);
    });
  });
  describe("DELETE /comments/:comment_id", () => {
    it("responds with 204 when deleting the given comment by comment id", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204);
    });
    it("responds with 400 when invalid route given", () => {
      return request(app)
        .delete("/api/comments/not-a-comment-id")
        .expect(400);
    });
    it("responds with 404 when comment id is not in database", () => {
      return request(app)
        .delete("/api/comments/999999")
        .expect(404);
    });
  });
  describe("GET /api", () => {
    it("responds with a JSON describing all endpoints on api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body).to.eql({
            "GET /api": {
              description:
                "serves up a json representation of all the available endpoints of the api"
            },
            "GET /api/topics": {
              description: "serves an array of all topics",
              queries: [],
              exampleResponse: {
                topics: [{ slug: "football", description: "Footie!" }]
              }
            },
            "POST /api/topics": {
              description:
                "request body accepts an object in the form { slug : 'newTopic', description : 'this is a new topic' }",
              queries: [],
              exampleResponse: {
                status: 201,
                msg: "new topic created"
              }
            },
            "GET /api/users": {
              description: "serves an array of all users",
              queries: [],
              exampleResponse: {
                users: [
                  {
                    username: "butter_bridge",
                    name: "jonny",
                    avatar_url:
                      " https: //www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
                  },
                  {
                    username: "lurker",
                    name: "do_nothing",
                    avatar_url:
                      "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
                  }
                ]
              }
            },
            "POST /api/users": {
              description:
                "request body accepts new user object in the form {username:newUsername,name:newName,avatar_url:https://www.example-avatar-url.png}",
              queries: [],
              exampleResponse: {
                Status: 201,
                msg: "new user created"
              }
            },
            "GET /api/users/:username": {
              description:
                "serves an object containing the user specified by username",
              queries: [],
              exampleResponse: {
                user: {
                  username: "butter_bridge",
                  name: "jonny",
                  avatar_url:
                    " https: //www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
                }
              }
            },
            "GET /api/articles/:article_id": {
              description:
                "serves up an object containing the article specified by article_id",
              queries: [],
              exampleResponse: {
                article: {
                  title: "Living in the shadow of a great man",
                  topic: "mitch",
                  author: "butter_bridge",
                  body: "I find this existence challenging",
                  created_at: 1542284514171,
                  votes: 100
                }
              }
            },
            "PATCH /api/articles/:article_id": {
              description:
                "Request body accepts an object in the form {inc_votes: newVote} , newVote will indicate how much the votes property in the database should be updated by",
              queries: [],
              exampleResponse: {
                article: {
                  title: "Living in the shadow of a great man",
                  topic: "mitch",
                  author: "butter_bridge",
                  body: "I find this existence challenging",
                  created_at: 1542284514171,
                  votes: 101
                }
              }
            },
            "DELETE /api/articles/:article_id": {
              description: "deletes given article by article_id",
              queries: [],
              exampleResponse: {
                status: 204
              }
            },
            "POST /api/articles/:article_id/comments": {
              description:
                "Request body accepts an object with the properties 'username' and 'body' ",
              queries: [],
              exampleResponse: {
                comment: {
                  comment_id: 2,
                  author: "butter_bridge",
                  article_id: 1,
                  votes: 0,
                  created_at: 1511354163389,
                  body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                }
              }
            },
            "GET /api/articles/:article_id/comments": {
              description:
                "serves an array of all comments associated with article_id specified",
              queries: ["sort_by", "order"],
              exampleResponse: {
                comments: [
                  {
                    comment_id: 3,
                    body:
                      "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
                    author: "icellusedkars",
                    " votes": 16,
                    " created_at": 1101386163389
                  },
                  {
                    comment_id: 4,
                    body: "I am 100% sure that we're not completely sure.",
                    author: "butter_bridge",
                    votes: 1,
                    created_at: 1069850163389
                  }
                ]
              }
            },
            "GET /api/articles": {
              description: "serves an array of all articles",
              queries: ["author", "topic", "sort_by", "order"],
              exampleResponse: {
                articles: [
                  {
                    title: "Seafood substitutions are increasing",
                    topic: "cooking",
                    author: "weegembump",
                    body: "Text from the article..",
                    created_at: 1527695953341
                  }
                ]
              }
            },
            "POST /api/articles": {
              description:
                "Request body accepts object with the keys 'title', 'topic', 'author',' body' and returns the new article",
              queries: [],
              exampleResponse: {
                article: {
                  title: "Living in the shadow of a great man",
                  author: "butter_bridge",
                  article_id: 1,
                  created_at: 1069850163389,
                  votes: 0,
                  body: "Text from the article.."
                }
              }
            },
            "PATCH /api/comments/:comment_id": {
              description:
                "Request body accepts an object in the form { inc_votes: newVote}, newVote will indicate how much the votes property in the database should be updated by (this must be a number and can contain negative numbers)",
              queries: [],
              exampleResponse: {
                comment: {
                  comment_id: 2,
                  author: "butter_bridge",
                  article_id: 1,
                  votes: 1,
                  created_at: 1511354163389,
                  body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                }
              }
            },
            "DELETE /api/comments/:comment_id": {
              description: "deletes given comment by comment_id",
              queries: [],
              exampleResponse: {
                status: 204
              }
            }
          });
        });
    });
    it("returns 405 when invalid methods put,delete,patch,post sent", () => {
      const invalidMethods = ["post", "put", "patch", "delete"];
      const methodPromise = invalidMethods.map(method => {
        return request(app)
          [method]("/api")
          .expect(405);
      });
      return Promise.all(methodPromise);
    });
  });
});
