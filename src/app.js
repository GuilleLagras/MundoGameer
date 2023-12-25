import express  from "express";
import __dirname from './config/utils.js';

import exphbs from 'express-handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';

import flash from "express-flash";
import { Server } from "socket.io";

import productsRouter from "./Routes/products.routes.js";
import cartsRouter from "./Routes/cart.routes.js";
import viewsRouter from "./Routes/views.routes.js";
import messageRouter from "./Routes/message.routes.js";
import sessionRouter from "./Routes/session.routes.js";

import cookieParser from "cookie-parser";
import session from 'express-session';
import MongoStore from "connect-mongo";
import './passport.js';
import passport from "passport";
// coneccion a db
import "./dao/Mongo/configDB.js"
//socket
import { socketManager } from "./dao/socket.manager.js";
import config from './config/config.js'

const app = express();
const PORT = config.port

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname+'/public'));
app.use(cookieParser('SecretCookie'));
//flash
app.use(flash());


//mongo 
const URI = config.mongo_uri
app.use(
  session({
    store: new MongoStore({
      mongoUrl: URI,
    }),
    secret: config.secret_session,
    cookie: { maxAge: 60000 },
  })
);

//passport 
app.use(passport.initialize());
//Sacar si uso JWT
//app.use(passport.session())

//handlebars
const hbs = exphbs.create({
  extname: 'handlebars',
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  //creacion de helper para igualar 
  helpers: {
    ifEqual: function(arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
  }
});

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//routes de products , carts , mensaje

app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', sessionRouter)
app.use('/chat', messageRouter);
app.use('/products', productsRouter);

// Iniciar el servidor
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});

app.on('error', (error) => {
    console.log(`Error: ${error}`);
});

const socketServer = new Server(httpServer);
socketServer.on('connection', (socket) => {
  const manager = socketManager(socketServer);
  manager.handleConnection(socket);
});