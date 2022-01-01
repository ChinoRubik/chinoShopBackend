'use strict'

const express = require('express')
const mysql = require('mysql')
const myConnect = require('express-myconnection')
const bodyParse = require('body-parser');

const db = {
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '',
    database : 'expressdatabase'
}

const app = express()
app.use(express.json())


//middlewares
app.use(bodyParse.urlencoded({extended:false}))
app.use(bodyParse.json()) //ME CONVIERTE MIS DATOS EN JSON

//Conexion a la base de datos
app.use(myConnect(mysql,db,'single'))

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//routes
const routes = require('./routes/myRoutes')
app.use('/api',routes)



module.exports = app;