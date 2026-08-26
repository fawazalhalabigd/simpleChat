const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4005;

const data = require('./db.js');

// --- Middleware Setup ---
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);


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

// --- Mounted Routes ---
app.use('/', require('./routes/homePage.js'));
app.use('/users', require('./routes/users.js'));
app.use('/api/messages', require('./routes/messages.js'));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

// Server Start
app.listen(PORT, async () => {
  if (data.first) await data.first();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});