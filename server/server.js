import express from 'express';
import mongoose from 'mongoose';
const ExpressGrpahQL = require('express-graphql').graphqlHTTP;
import bodyparser from 'body-parser';
import sanitizer from 'express-sanitizer'
import socket from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socket(server);

// middleware;
app.use(bodyparser.json({limit: '50mb'}));

// XSS PREVENTION;
app.use(sanitizer());

// socket connection;
io.on('connection', socket => {
    socket.on('disconnect', () => {
        console.log('user Disconnected');
    })
});

// graphQL endpoints;
app.use('/graphql', ExpressGrpahQL({
    schema: '',
    graphiql: true
}));

// REST api exndpoints;

// mongoDB main connecion;
mongoose.connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
    console.log('Connected to mongoDB');
}).catch(() => {
    console.log('Didnot connect to mongoDB');
});

// main server listener;
server.listen(PORT, () => {
    console.log(`Listening to PORT:${PORT}`);
})