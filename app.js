'use strict'

const express = require('express')
const mysql = require('mysql')
const myConnect = require('express-myconnection')
const bodyParse = require('body-parser');
require('dotenv').config()

const db = {
    host : 'us-cdbr-east-05.cleardb.net',
    user : 'b93cb42c84e304',
    password : 'f31036ae',
    database : 'heroku_e336296c02804a2'
}

//b93cb42c84e304:f31036ae@us-cdbr-east-05.cleardb.net/heroku_e336296c02804a2?reconnect=true

const app = express()
app.use(express.json())

//middlewares
app.use(bodyParse.urlencoded({extended:false}))
app.use(bodyParse.json()) //ME CONVIERTE MIS DATOS EN JSON
//Conexion a la base de datos
app.use(myConnect(mysql,db,'single'))

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
const cors = require('cors');
var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));



// app.use(function (req, res, next) {
//     //Enabling CORS
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, ccept, x-client-key, x-client-token, x-client-secret, Authorization");
//       next();
//     });


//routes
const dashboardsRoutes = require('./routes/dashboard')
const verificateToken = require('./routes/validate_token')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const productsPublicRoutes = require('./routes/productsPublicRoutes')

app.use('/api/auth',authRoutes)
app.use('/api/dashboard/public',productsPublicRoutes)
app.use('/api/dashboard',verificateToken,dashboardsRoutes)
app.use('/api/user', verificateToken, userRoutes)

module.exports = app;