const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const myConnection = require('express-myconnection');

const app = express();

//importing routes
const principalRota = require('./routes/principalRota');
const empresaRota = require('./routes/empresaRota');
const leilaoRota = require('./routes/leilaoRota')
const loteRota = require('./routes/loteRota');
const dataRota = require('./routes/dataRota');

// settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(myConnection(mysql,{
    host: '192.168.100.102',
    user: 'root',
    password: '',
    port: 3306,
    database: 'se7ivips_base'
}, 'single'));

app.use(bodyParser.urlencoded({extended: false}));

// routes
app.use('/empresa', empresaRota);
app.use('/leilao', leilaoRota);
app.use('/lote', loteRota);
app.use('/data', dataRota)
app.use('/', principalRota);

// static files
app.use('/', express.static(__dirname + '/public'))


app.listen(3000, () => {
    console.log("Server on")
})
