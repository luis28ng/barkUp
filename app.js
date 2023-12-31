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

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use(rewriteUnsupportedBrowserMethods);

app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthState",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false
}));

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

// Begin middleware

// If user is not logged in, they cannot add a review
app.get('/review/addReview/:id', (req, res, next) => {
  if (!req.session.user) {
      return res.redirect('/login');
  } else {
      next();
  }
});

// If the id does not belong to the user or the user is not an admin, they cannot edit a review
app.get('/review/:id', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  } else {
    next()
  }

});

// If user is not an admin, they will not have access to admin panel
app.get('/admin', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      next();
  } else {
      return res.redirect('/');
  }
});

// If user is not an admin, they will not have access to admin panel
app.get('/admin/park/:id', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      next();
  } else {
      return res.redirect('/');
  }
});

// If user is not an admin, they will not have access to admin panel
app.get('/admin/store/:id', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      next();
  } else {
      return res.redirect('/');
  }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/editPark/:id', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      next();
  } else {
      return res.redirect('/');
  }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/editStore/:id', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      next();
  } else {
      return res.redirect('/');
  }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/addPark', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      next();
  } else {
      return res.redirect('/');
  }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/addStore', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      next();
  } else {
      return res.redirect('/');
  }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/deleteReview/:id', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      next();
  } else {
      return res.redirect('/');
  }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/deleteStore/:id', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      next();
  } else {
      return res.redirect('/');
  }
});

// If user is not an admin, they will not have access to admin routes
app.get('/admin/deletePark/:id', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      next();
  } else {
      return res.redirect('/');
  }
});

// If user is not logged in, they should not have access to a profile
app.get('/profile', (req, res, next) => {
  console.log(req.session.user);
  if (!req.session.user) {
      return res.redirect('/login');
  } else {
      next();
  }
});

// If a user is logged in, they will not have access to the login page
app.get('/login', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      return res.redirect('/admin');
  } else if (req.session.user && req.session.user.role === 'user') {
      return res.redirect('/')
  } else {
      next();
  }
});

// If a user is logged in, they will not have access to the register page
app.get('/register', (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
      return res.redirect('/admin');
  } else if (req.session.user && req.session.user.role === 'user') {
      return res.redirect('/')
  } else {
      next();
  }
});

// End middleware

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
