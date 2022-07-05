// error handling
// custom errors
exports.customErrors = (err, req, res, next) => {
  // if we provide a custom error, process and respond
  switch (err.status) {
    case 404:
      res.status(404).send({ status: 404, msg: err.msg });
  }
  // otherwise, continue
  next(err);
};

// PSQL errors
exports.psqlErrors = (err, req, res, next) => {
  // provide a different response based on the err code given by PSQL
  if (err.code) res.status(400).send({ status: 400, msg: err.msg });
  next();
};

// server errors
exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ status: 500, msg: "Error 500: internal server" });
};
