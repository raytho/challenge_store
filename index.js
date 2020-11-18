const express = require("express");
const path = require("path");
const productsRouter = require("./router/views/products");
const productsApiRouter = require("./router/api/products");
const authApiRouter = require("./router/api/auth");

const {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler,
} = require("./utils/middlewares/errorsHandlers");

// app
const app = express();

// middleware
app.use(express.json());

//static files
app.use("/static", express.static(path.join(__dirname, "public")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// routes
app.use("/products", productsRouter);
app.use("/api/products", productsApiRouter);
app.use("/api/auth", authApiRouter);

// redirect
app.get("/", (req, res) => {
  res.redirect("/products");
});

app.use((req, res, next) => {
  res.status(404).render("404");
});

// error handler
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// init server
const server = app.listen(8000, function () {
  console.log(`Listening http://localhost:${server.address().port}`);
});
