// error handling
// custom errors
exports.customErrors = (err, req, res, next) => {
  // if we provide a custom error, process and respond
  if (err.status) res.status(err.status).send({ status: err.status, msg: err.msg });
  else next(err);
};

// PSQL errors
exports.psqlErrors = (err, req, res, next) => {
  // provide a different response based on the err code given by PSQL
  if (err.code) res.status(400).send({ status: 400, msg: err.msg });
  else next(err);
};

// server errors
exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ status: 500, msg: "Error 500: internal server" });
};
