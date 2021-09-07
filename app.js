import express from 'express';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import mongoose from 'mongoose';

const mongoStore = require('connect-mongodb-session')(session);

import routes from './routes';
;
const mongoDB = 'mongodb://localhost/nightshoes'

const store = new mongoStore({
    uri: mongoDB,
    collection: 'sessions'
});

mongoose.connect(mongoDB,
    async (err) => {
        if (err) throw err;
        console.log('Connected with mongoDB')
    }
)

const app = express();

app.use(
    session({
        secret: 'mysecret',
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        },
        saveUninitialized: false,
        resave: false,
        store: store
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(routes);

app.listen(5000, () => console.log('Server is running'));