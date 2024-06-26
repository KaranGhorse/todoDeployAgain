require('dotenv').config()
require('./connection')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var indexRouter = require('./route');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`app runing on ${process.env.PORT || 3000}`);
})

