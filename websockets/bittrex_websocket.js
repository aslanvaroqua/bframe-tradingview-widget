const bittrex = require('node-bittrex-api');
const MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://mongoadmin:S4ax3clp@cluster0-shard-00-00-1dhpr.mongodb.net:27017,cluster0-shard-00-01-1dhpr.mongodb.net:27017,cluster0-shard-00-02-1dhpr.mongodb.net:27017/blockframe?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
 (error, database) => {
    if (error) throw error;
    bittrex.websockets.subscribe(['USDT-BTC', 'USDT-ETH', 'USDT-LTC'], function (data, client) {
        if (data.M === 'updateExchangeState') {
            data.A.forEach(function (data_for) {
                data_for.Fills.forEach(element => {
                    let price = {
                        market: data_for.MarketName,
                        rate: element.Rate,
                        timestamp: (Math.round(Date.parse(element.TimeStamp) / 1000) - 7200)
                    }

                    database.collection('prices').save(price, (err, item) => {
                        if(error != null ) console.log("Error: "+ error);
                    });
                })
            });
        }
    });

});