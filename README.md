# Northcoders News API

## Contents

- [General Info](#General-Info)
- [Setup](#setup)
  - [Prerequisites](#Prerequisites)
  - [Running tests](#running-the-tests)
  - [Deployment](#deployment)
- [Technologies](#built-with)
- [Project status](#project-status)
- [API request examples](#REST-API)
  - [GET requests](#get-requests)
  - [POST requests](#post-requests)
  - [PATCH requests](#patch-requests)
  - [DELETE requests](#delete-requests)

## General Info

This is a social news aggregation, web content rating, and discussion website. Articles are divided into topics, articles can have comments and both articles and comments have votes which can be changed. Users can be created and are used to make comments, write articles and create new topics.

## Setup

This setup will explain how to get a copy of this project running on your machine for testing and development. To begin, fork this repository, clone it and open it up in your code editor.

### Prerequisites

You will need node.js and npm
Open a terminal and type:

`sudo apt install nodejs`

_(To install node.js)_

`sudo apt install npm`

_(To install npm)_

After installing node.js and npm, in the terminal type

`npm init -y`

Followed by

`npm install`

This will install all packages needed for running tests and database requests.

- [chai v4.2.0](https://www.chaijs.com/)
- [ express v4.17.1](https://expressjs.com/)
- [ knex v0.20.2](http://knexjs.org/)
- [mocha v6.2.2](https://mochajs.org/)
- [pg v7.12.1](https://www.npmjs.com/package/pg)
- [supertest v4.0.2](https://www.npmjs.com/package/supertest)

### Running the tests

Once the project is forked and all dependencies installed, you can test the endpoints by typing "npm test". This will reseed the database and run full tests on all endpoints using test data from database.

### Deployment

For deployment on a live system you will need to host the API files on a hosting service, I recommend Heroku for its ease of use and free service for light usage.

## Built With

- [JavaScript](https://www.javascript.com/)
- [Knex](https://knexjs.org)-Used to request data from database.
- [PSQL](https://www.postgresql.org/)- For creating database.
- [heroku](https://www.heroku.com/home)- Deployment

## Project status

This project is completed for now but may in the future be used as a testing ground for new ideas and testing skills.

---

## REST API

These instructions will outline the API functionality and available endpoints. See [Setup](#setup) for notes on how to get a copy of the project up and running on your local machine for development and testing purposes and to deploy the project on a live system.

For a full list of endpoints and how to format data to send please see [full endpoint documentation](https://nc-news-rs.herokuapp.com/api)

### GET requests

> All get requests for multiple results will return an array of objects from the specified field. If the array is empty then it means there is no data associated with this endpoint but the endpoint does exist.

_For example_

**GET /api/articles/1/comments**

May respond with an empty array, this will mean that the article does exist but it has no coments.

> For endpoints where only one specific item should be the response , the API will return the object with the key of its contents.

_For example_

**GET /api/articles/1**

Responds with

```json
{
  "article": {
    "title": "Living in the shadow of a great man",
    "topic": "mitch",
    "author": "butter_bridge",
    "body": "I find this existence challenging",
    "created_at": 1542284514171,
    "votes": 100
  }
}
```

> Some endpoints can be modified with queries

_For example_

**GET /api/articles/1/comments?sort_by=created_at&order=asc**

Takes the queries 'sort_by' and 'order' , which will sort the comments of the given article by any valid column and can be specified with 'order' to be in ascending or decending(defaults to descending when order not specified).

```json
{
  "comments": [
    {
      "comment_id": 3,
      "body": "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
      "author": "icellusedkars",
      " votes": 16,
      " created_at": 1101386163389
    },
    {
      "comment_id": 4,
      "body": "I am 100% sure that we're not completely sure.",
      "author": "butter_bridge",
      "votes": 1,
      "created_at": 1069850163389
    }
  ]
}
```

For the endpoint `GET /api/articles` you can add optional filters to return only articles by a specific author or from one topic.

_For example_

`/api/articles?topic=cats`

### Response

```json
{
  "articles": [
    {
      "article_id": 5,
      "title": "UNCOVERED: catspiracy to bring down democracy",
      "body": "Bastet walks amongst us, and the cats are taking arms!",
      "votes": 0,
      "topic": "cats",
      "author": "rogersop",
      "created_at": "2002-11-19T12:21:54.171Z"
    }
  ]
}
```

---

### POST requests

>Post requests will not take any queries but requre a body in the correct format.

_For example_

A `POST /api/articles/:article_id/comments` request will need to be sent an object in the form

```js
{ username: 'existing-username', body : 'this is a new comment' }
```
The new comment object will be sent back to confirm its creation along with a 201 status code. 'Votes', 'created_at' and 'id' will be generated by the database when it is added.

```json
 {
      "comment": {
        "comment_id": 2,
        "author": "existing-username",
        "article_id": 1,
        "votes": 0,
        "created_at": 1511354163389,
        "body": "this is a new comment"
      }
 }
```
---

### PATCH requests

Patch requests on this API are used to change the votes on comments and articles. The request body must be in the form 
```js
{inc_votes: 1}
```
Where the number to increase votes by can be any whole number and can be negative to decrease votes. The response will be either the comment or article that has been patched with the updated votes property.

---

### DELETE requests

Delete requests can only be done to articles and comments. It has no request body and responds with status code 204

---

## Acknowledgments

- Thanks to Northcoders for the project task and assistance making this API
- Inspired by [Reddit](https://www.reddit.com/)
