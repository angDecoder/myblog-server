const cookieSession = require('cookie-session');
const cors = require('cors');
const express = require('express');
const passport = require('passport');

const app = express();

app.use(cookieSession({
    name: 'session',
    keys: ['iamanghu'],
    maxAge: 24 * 60 * 60 * 100
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: 'http://localhost:5173/',
        methods: '*',
        credentials: true
    })
);

app.listen(5000, () => {
    console.log('server is listening');
})

clientid = '';
clientSecret = '';