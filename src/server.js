const express = require("express");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const createError = require("http-errors");
var cookieParser = require("cookie-parser");
const cors = require('cors')
const connect = require("./services/db");
require("dotenv").config({ path: ".env" });
const checkAuth = require('./resources/_global-middlewares/check-auth')


const userRoutes = require('./resources/user/user.routes');
const codeRoutes = require('./resources/code/code.routes');
// untill khalid change it to /resource/problem
const problems = require('./routes/problems');
// untill khalid change it to /resource/submission
const submissionsRouter = require("./routes/submitCode");

// variables
const app = express();
const port = process.env.PORT || 5000;
let origin = process.env.CLIENT_DEV_URL;
// rate limit: limiting the number of request per amount of time
// later on i will make a bunch of rate limit to ensure that
// Too many accounts created from one IP or reset too many password etc
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message:
		"Too many request created from this IP, please try again after an 15 minutes",
});

// middlewares
if (process.env.NODE_ENV === "production") {
	origin = process.env.CLIENT_PROD_URL;
	app.use(limiter);
} else {
	// debugging tool in the console : showing the requests
	app.use(morgan());
}
app.use(cookieParser());
app.use(
	cors({
		origin,
		credentials: true,
		exposedHeaders: ["Set-Cookie", "Date", "ETag"],
	})
);
app.use(express.json());
app.use(express.urlencoded({ encoded: true }));
app.use(checkAuth)

// routes
app.use('/api/user',userRoutes);
app.use('/api/code',codeRoutes);
// untill khalid chnage it to /resource/problem
app.use("/api/problems", problems);
// untill khalid chnage it to /resource/submission
app.use("/api/submissions", submissionsRouter);

// handle Error
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404,"page not found"));
});
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

// connect to the db then running the server
const runServer = async () => {
	try {
		await connect(`${process.env.DATABASE}`);
		app.listen(port, () => {
			console.log(`server is running ${port}`);
		});
	} catch (err) {
		console.error(err);
	}
};
module.exports = runServer;
