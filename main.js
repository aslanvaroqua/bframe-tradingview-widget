const express = require('express');
const Request = require('request');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient

const app = express();

app.use(bodyParser.urlencoded({
	extended: true
}))

MongoClient.connect('mongodb://aslanvaroqua:@duas-shard-00-00-7p0tb.mongodb.net:27017,duas-shard-00-01-7p0tb.mongodb.net:27017,duas-shard-00-02-7p0tb.mongodb.net:27017/admin?replicaSet=duas-shard-0&ssl=true', (error, database) => {
	if (error) return console.log(error)
	app.listen(3000, function () {
		console.log('listening on 3000')
	});

	app.get('/', (request, response) => {
		response.sendFile(__dirname + '/index.html');
	});

	app.get('/last200btcblocks', (request, response) => {
		database.collection('bitcoin_blocks').find({}).limit(200).toArray().then(data => {
			let blocks = data;
			response.json(blocks);
		})
	})

	app.get('/last100btcblocks', (request, response) => {
		database.collection('bitcoin_blocks').find({}).limit(100).toArray().then(data => {
			let blocks = data;
			response.json(blocks);
		})
	})

	app.get('/last50btcblocks', (request, response) => {
		database.collection('bitcoin_blocks').find({}).limit(50).toArray().then(data => {
			let blocks = data;
			response.json(blocks);
		})
	})

})