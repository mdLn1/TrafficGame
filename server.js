const express = require("express");
const mongoConnect = require("./utils/mongoConnect");
const CLIENT_ORIGIN = ["http://127.0.0.1:3000", "http://localhost:3000"];
const cors = require("cors");
const app = express();
app.use(express.json({ extended: true }));

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);
mongoConnect();

app.use("*", (req, res) => {
  res.json({ message: "hello" });
});

app.use((req, res, next) => {
  res.status(404).json({ errors: "Page not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.statusCode ? err.statusCode : 500)
    .json({ error: err.message });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Listening on port ${process.env.PORT || 5000}`)
);
