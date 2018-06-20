var express = require('express');
var app = express();

var mongo = require('mongodb');
var swig = require('swig');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Variables
app.set('db', 'mongodb://sergio:a123456@ds263640.mlab.com:63640/question-db');

var gestorBD = require("./modules/gestorBD");
gestorBD.init(app, mongo);

app.get('/', function (req, res) {
    var respuesta = swig.renderFile("views/inicio.html");
    res.send(respuesta);
});

app.get('/examen', function (req, res) {
    gestorBD.todasLasPreguntas(function (result) {
        if (result == null) {
            res.send("Error")
        } else {
            var respuesta = swig.renderFile("views/examen.html", {
                list: result
            });
            res.send(respuesta);
        }
    });
});

app.get('/listado', function (req, res) {
    gestorBD.todasLasPreguntas(function (result) {
        if (result == null) {
            res.send("Error")
        } else {
            var respuesta = swig.renderFile("views/list.html", {
                list: result
            });
            res.send(respuesta);
        }
    });
});

app.post('/crearPregunta', function (req, res) {
    var pregunta = req.body.pregunta;
    var respuesta = req.body.respuesta;

    var json = { "pregunta": pregunta, "respuesta": respuesta }
    gestorBD.insertarPregunta(json, function (id) {
        if (id == null) {
            res.redirect("/crearPregunta?mensaje=Fallo al insertar");
        } else {
            res.redirect("/crearPregunta?mensaje=Insertada correctamente");
        }
    });
});

app.get("/crearPregunta", function (req, res) {
    var mensaje = req.query.mensaje;
    var respuesta = swig.renderFile("views/pregunta.html", {
        men: mensaje
    });
    res.send(respuesta);
});

app.listen(8081, function () {
    console.log('Example app listening on port 8081!');
});