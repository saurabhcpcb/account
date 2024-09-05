const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./App/routes/auth.routes');
const sequelize = require('./App/models/user.model').sequelize;
const session = require('express-session');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

app.use(session({
    secret: 'session_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // should be true in production with https
}));


// Use routes
app.use('/api/auth', authRoutes);

// Test the connection and sync models
sequelize.authenticate()
    .then(() => {
        console.log("Connection established successfully.");
        return sequelize.sync();
    })
    .then(() => {
        console.log("Models synchronized.");
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});