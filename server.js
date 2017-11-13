var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var nunjucks = require('nunjucks')

app.use(bodyParser.urlencoded({ extended: true }))
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

var database = require('./connect.js')

//////////////////////////////////////////


app.get('/', function (req, res) {
	var spørring = `
		SELECT *
		FROM damer
	`

	database.query(spørring, function (err, results) {
		res.send(resultatTilTabell(results))
	})
})

app.get('/:navn', function (req, res) {
	var spørring = `
		SELECT *
		FROM damer
		WHERE navn='${req.params.navn}'
	`

	database.query(spørring, function (err, results) {
		res.render('main.html', {results})
	})
})



// hjelpefunksjon

function resultatTilTabell(resultat) {
	var tekst = ''
	resultat.forEach(function(rad) {
		tekst += `${rad.id} | ${rad.navn} <br >`
	})
	return tekst
}

// start serveren

app.listen(1234, function () {
  console.log(`listening at 1234`)
})