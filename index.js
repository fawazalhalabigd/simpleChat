const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4005;

const data = require('./db.js');

const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require('cookie-parser'); // 1. Added cookie-parser

// --- Middleware Setup ---
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 2. MUST be placed before verifyUser and checkAuthStatus

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// --- Custom Middleware & Routes ---
const { verifyUser, requireAuth, checkAuthStatus } = require("./routes/middleware/auth");

app.use(verifyUser);
app.use(checkAuthStatus);

// Static & View Engine
app.engine('txt', (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);
    return callback(null, content.toString());
  });
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/homePage.js'));
// app.use('/', require('./routes/products.js')); 
app.use((req, res, next) => {
  res.status(404).render('auth/error', { 
    message: 'Page Not Found',
    url: req.originalUrl 
  });
});
// Server Start
app.listen(PORT, async () => {
  await data.first();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});