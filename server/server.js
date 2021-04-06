import express from 'express';
import mongoose from 'mongoose';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ExpressGrpahQL = require('express-graphql').graphqlHTTP;
import bodyparser from 'body-parser';
import sanitizer from 'express-sanitizer'
import socket from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import LoginRoute from './Routes/login.js';
import CheckAuthRoute from './Routes/check-jwt.js';
import SignupRoute from './Routes/register.js';
import MainGQLSchema from './Schema/MainSchema.js';
import TickerAdminRoute from './Routes/ticker-admin.js';
import AdminResetRoute from './Routes/admin-reset.js';
import TestRoute from './Routes/test.js';
dotenv.config();

const app = express();
const PORT = 8000;
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
    });

    socket.on('join-room', id => {
        socket.join(id);
        setInterval(() => socket.emit('client-trade', id), 60000);
    });

    socket.on('new-trade', (room_id, value) => {
        socket.broadcast.to(room_id).emit('client-trade',value);
    });
});

// graphQL endpoints;
app.use('/graphql', ExpressGrpahQL({
    schema: MainGQLSchema,
    graphiql: true
}));

// REST api exndpoints;
app.use('/login', LoginRoute);
app.use('/check-auth', CheckAuthRoute);
app.use('/signup', SignupRoute);
app.use('/ticker', TickerAdminRoute);
app.use('/reset', AdminResetRoute);
app.use('/test', TestRoute)

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