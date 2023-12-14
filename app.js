import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

app.use("/public", express.static("public")); //staticDir not working for me - Paddy
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
        not: function (value) {
          return !value;
        },
    }
}));

app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthState",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false
}))

// This is where every route goes an logs the users information and data
const neutralMiddleware = (req, res, next) => {
  const timestamp = new Date().toUTCString();
  const method = req.method;
  const route = req.originalUrl;
  const isAuthenticated = req.session.user
    ? "Authenticated User"
    : "Non-Authenticated User";

  console.log(`[${timestamp}]: ${method} ${route} (${isAuthenticated})`);

  next();
};

app.use("/", neutralMiddleware);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
