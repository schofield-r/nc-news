exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};
exports.psqlErrors = (err, req, res, next) => {
  const codes = {
    '23503':{status:404,msg:'not found'},
    "23502": { msg: "bad request", status: 400 },
    "22P02": { msg: "invalid input", status: 400 },
    "42703": { msg: "column selected to sort by is invalid", status: 400 },
    "23505":{msg:"already exists",status:409}
  };
  if (codes[err.code]) {
    res.status(codes[err.code].status).send({ msg: codes[err.code].msg });
  } else next(err);
};

exports.send405 = (req, res, next) => {
  res.sendStatus(405);
};

exports.send404 = (req, res, next) => {
  res.status(404).send({msg:'not found'})
};

exports.send500 = (err, req, res, next) => {
  console.log(err,'in 500')
  res.sendStatus(500).next(err);
};
