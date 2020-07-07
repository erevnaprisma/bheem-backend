var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')
const corsAccess = require('./middlewares/corsAccess')
const config = require('config')
const socketio = require('socket.io')

// testing
const Meeting = require('./src/collections/meeting/Model')

mongoose.connect(config.get('mongoUrl'), { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then((res) => console.log('Connected to MongoDB...'))
  .catch((err) => console.log(err.message || 'Cannot connect to MongoDB...'))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const graphqlRouter = require('./routes/graphql')

var app = express();

const port = process.env.PORT || 3000

const expressServer = app.listen(port, () => {
  console.log(`Running on localhost ${port}`)
})

const io = socketio(expressServer)

io.on('connection', (socket) => {
  console.log('Connected to Socket')
  app.use((req, res, next) => {
    req.socket = socket
    next()
  })
})

const corsOptions = {
  exposedHeaders: 'Authorization'
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions))

// app.use(corsAccess())

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/graphql', graphqlRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app
