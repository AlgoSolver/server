const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
var cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/checkAuth");
const cors = require("cors");

const app = express();

require("dotenv").config({ path: ".env" });

const port = process.env.PORT || 5000;

// rate limit: limiting the number of request per amount of time
// later on i will make a bunch of rate limit to ensure that
// Too many accounts created from one IP or reset too many password etc
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message:
    "Too many request created from this IP, please try again after an 15 minutes",
});

if (process.env.NODE_ENV === "production") {
  //  apply to all requests
  app.use(limiter);
  app.use(
    morgan("common", {
      stream: fs.createWriteStream("./access.log", { flags: "a" }),
    })
  );
} else {
  // debugging tool in the console : showing the requests
  app.use(morgan());
}

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["Set-Cookie", "Date", "ETag"],
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(authMiddleware);

const userRoutes = require("./routes/userRoutes");
const problemSettingRouter = require("./routes/problemSetting");
const submissionsRouter = require("./routes/submitCode");
app.use("/home", (req, res) => {
  console.log("home");
  return res.status(200).json({ message: "hello there" });
});
app.use("/api/user", userRoutes);
app.use("/api/problemSetting", problemSettingRouter);
app.use("/api/submissions", submissionsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = process.env.NODE_ENV === "development" ? err : {};
  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

// connect to DB
mongoose
  .connect(process.env.DATABASE, {
    uuseNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  })
  .catch((err) => console.error("Could't connect to MongoDB"));
