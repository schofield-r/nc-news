const formatDates = list => {
  let timestamps = [];
  list.forEach(x => timestamps.push({ ...x }));
  for (let i = 0; i < timestamps.length; i++)
    timestamps[i].created_at = new Date(timestamps[i].created_at);
  return timestamps;
};

const makeRefObj = list => {
  let refObj = {};
  for (let obj in list) {
    refObj[list[obj].title] = list[obj].article_id;
  }
  return refObj;
};

const formatComments = (comments, articleRef) => {
  const formatCommentsArr = [];
  for (let i = 0; i < comments.length; i++) {
    const formatComment = {};
    formatComment.author = comments[i].created_by;
    formatComment.article_id = articleRef[comments[i].belongs_to];
    formatComment.votes = comments[i].votes;
    formatComment.created_at = comments[i].created_at;
    formatComment.body = comments[i].body;
    formatCommentsArr.push(formatComment);
  }
  return formatDates(formatCommentsArr);
};

module.exports = { formatDates, formatComments, makeRefObj };
