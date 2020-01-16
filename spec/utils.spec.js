const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("when given an array with one unix timecode , converts them all to correct times", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: "Wed, 22 Nov 2017 12:36:03 GMT"
      }
    ];
    expect(formatDates(input)).to.eql(output);
  });
  it("when given an array with multiple unix timecodes , converts tham all to correct times", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389
      },
      {
        body: "I hate streaming noses",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1385210163389
      },
      {
        body: "I hate streaming eyes even more",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1353674163389
      },
      {
        body: "Lobster pot",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1322138163389
      }
    ];
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: "Wed, 22 Nov 2017 12:36:03 GMT"
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: "Tue, 22 Nov 2016 12:36:03 GMT"
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: "Mon, 23 Nov 2015 12:36:03 GMT"
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: "Sun, 23 Nov 2014 12:36:03 GMT"
      },
      {
        body: "I hate streaming noses",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: "Sat, 23 Nov 2013 12:36:03 GMT"
      },
      {
        body: "I hate streaming eyes even more",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: "Fri, 23 Nov 2012 12:36:03 GMT"
      },
      {
        body: "Lobster pot",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: "Thu, 24 Nov 2011 12:36:03 GMT"
      }
    ];
    expect(formatDates(input)).to.eql(output);
  });
  it("testing for mutation of input", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const copyInput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    formatDates(input);
    expect(input).to.eql(copyInput);
  });
});

describe("makeRefObj", () => {
  it("creating a reference object with a list of objects, given one object", () => {
    expect(makeRefObj([{ article_id: 1, title: "A" }])).to.eql({ A: 1 });
  });
  it("creating a reference object with a list of objects", () => {
    let input = [
      { article_id: 1, title: "A" },
      {
        article_id: 2,
        title: "B",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      }
    ];
    let output = { A: 1, B: 2 };
    expect(makeRefObj(input)).to.eql(output);
  });
  it("test for mutation", () => {
    const input = [
      { article_id: 1, title: "A" },
      {
        article_id: 2,
        title: "B",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      }
    ];
    const copyInput = [
      { article_id: 1, title: "A" },
      {
        article_id: 2,
        title: "B",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      }
    ];
    makeRefObj(input);
    expect(input).to.eql(copyInput);
  });
});

describe("formatComments", () => {
  it("test one comment being formatted", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const refObj = makeRefObj([
      { article_id: 9, title: "They're not exactly dogs, are they?" }
    ]);
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: "butter_bridge",
        votes: 16,
        created_at: "Wed, 22 Nov 2017 12:36:03 GMT"
      }
    ];
    expect(formatComments(input, refObj)).to.eql(output);
  });
  it("testing multiple comment formats", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body: "Lobster pot",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1322138163389
      }
    ];
    const refObj = makeRefObj([
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?"
      },
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ]);
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: "butter_bridge",
        votes: 16,
        created_at: "Wed, 22 Nov 2017 12:36:03 GMT"
      },
      {
        body: "Lobster pot",
        article_id: 1,
        author: "icellusedkars",
        votes: 0,
        created_at: "Thu, 24 Nov 2011 12:36:03 GMT"
      }
    ];
    expect(formatComments(input, refObj)).to.eql(output);
  });
  it("testing for mutation", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body: "Lobster pot",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1322138163389
      }
    ];
    const copyInput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body: "Lobster pot",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1322138163389
      }
    ];
    const refObj = makeRefObj([
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?"
      },
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ]);
    formatComments(input, refObj);
    expect(input).to.eql(copyInput);
  });
});
