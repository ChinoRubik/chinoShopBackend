'use strict'

const app = require('./app');   
const port = process.env.PORT || 4000

app.listen(port ,() => {
    console.log('Servidor esta corriendo en mi http://localhost:'+port);
})
