var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var nunjucks = require('nunjucks')

app.use(bodyParser.json())
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
		FROM elever
	`

	database.query(spørring, function (err, results) {
		res.render('main.html', {elever: results})
	})
})

app.post('/leggtilelev', function (req, res) {
	console.log(req.body.navn)
	console.log(req.body.tel)

	var id = Math.round(Math.random() * 10000)

	var spørring = `
		INSERT INTO elever(elev_id, navn, telefonnummer)
		VALUES(${id}, '${req.body.navn}', '${req.body.tel}')
	`

	console.log(spørring)

	database.query(spørring, function (err, results) {
		res.redirect('/'+id)
	})
})

app.get('/:elev_id', function (req, res) {
	var spørring = `
		SELECT *
		FROM elever
		WHERE elev_id='${req.params.elev_id}'
	`

	var kursspørring = `
		SELECT *
		FROM kurs
	`
	var påmeldsp = `
		SELECT *
		FROM paameldinger
		WHERE elev_id='${req.params.elev_id}'
	`

	console.log(spørring)
	database.query(spørring, function (err, results) {
		database.query(kursspørring, function (err, kursresults) {
			database.query(påmeldsp, function (err, pmresults) {

				var påmeldinger = pmresults.map(function(påmelding) {
					if(påmelding.elev_id == req.params.elev_id){
						console.log('ja')
						return kursresults.find(kurs => kurs.kurs_id == påmelding.kurs_id)
					}
				})

				console.log(påmeldinger)
				res.render('elev.html', {
					elev: results[0],
					kurs: kursresults,
					paameldinger: påmeldinger
				})
			})
		})
	})
})

app.get('/melddeg/:kurs/:elev', function (req, res) {
	console.log(req.params.navn)
	console.log(req.body.tel)

	var id = Math.round(Math.random() * 10000)

	var spørring = `
		INSERT INTO paameldinger(elev_id, kurs_id)
		VALUES(${req.params.elev}, ${req.params.kurs})
	`

	console.log(spørring)

	database.query(spørring, function (err, results) {
		res.redirect('/'+req.params.elev)
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