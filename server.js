const express = require("express");
const mongoConnect = require("./utils/mongoConnect");
// const CLIENT_ORIGIN = ["http://127.0.0.1:3000", "http://localhost:3000"];
// const cors = require("cors");
const app = express();
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");

// app.use(
//   cors({
//     origin: CLIENT_ORIGIN,
//   })
// );
app.use(compression());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json({ extended: true, limit: "10kb" }));

mongoConnect();

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https: 'unsafe-eval' 'unsafe-inline'; script-src 'self' https://kit.fontawesome.com/6fc748a3b0.js 'unsafe-eval' 'unsafe-inline'; img-src 'self' 'unsafe-inline' 'unsafe-eval';"
  );
  return next();
});

app.use(express.static(path.join(__dirname, "/client/build")));

app.use("/api/scores", require("./routes/scoresRoute"));
app.use("/api/users", require("./routes/usersRoute"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

app.use((req, res, next) => {
  res.status(404).json({ errors: "Page not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode ? err.statusCode : 500).json({
    errors: Array.isArray(err.message) ? err.message : [err.message],
    errorCode: err.errorCode ? err.errorCode : 0,
  });
});

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}`)
);
