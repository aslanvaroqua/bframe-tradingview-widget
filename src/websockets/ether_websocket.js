const WebSocket = require('ws');
const MongoClient = require('mongodb').MongoClient

const ws = new WebSocket("wss://socket.blockcypher.com/v1/eth/main");

MongoClient.connect('mongodb://mongoadmin:S4ax3clp@cluster0-shard-00-00-1dhpr.mongodb.net:27017,cluster0-shard-00-01-1dhpr.mongodb.net:27017,cluster0-shard-00-02-1dhpr.mongodb.net:27017/blockframe?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', (error, database) => {

    ws.on('message', function incoming(data) {
        let ether = JSON.parse(data);
        ether.time = (Math.round(Date.parse(ether.time) / 1000))

        database.collection('prices').find({
            market: 'USDT-ETH',
            timestamp: {
                $lte: ether.time
            }
        }).sort({
            timestamp: -1
        }).limit(1).toArray((err, lastPriceCursor) => {
            if (err) throw err;

            const lastPrice = lastPriceCursor;

            ether.price = {
                open: lastPrice[0].rate
            }

            database.collection('ethers_blocks').find({}).sort({
                time: -1
            }).toArray((e, lastBlock) => {
                if (e) {
                    console.log(e)
                };
                if (lastBlock.length != 0) {
                    let updatedLastBlock = lastBlock[0];

                    database.collection('prices').find({
                        market: 'USDT-ETH',
                        timestamp: {
                            $lte: ether.time,
                            $gte: updatedLastBlock.time
                        }
                    }).sort({
                        rate: -1
                    }).toArray().then(pricesData => {
                        let prices = pricesData;

                        if (prices.length == 0) {
                            prices = lastPrice;
                        }
                        updatedLastBlock.price = {
                            open: lastBlock[0].price.open,
                            close: lastPrice[0].rate,
                            high: prices[0].rate,
                            low: prices[prices.length - 1].rate
                        }

                        database.collection('ethers_blocks').update({
                            _id: updatedLastBlock._id
                        }, updatedLastBlock, (eUpdate) => {
                            if (eUpdate) {
                                console.log(eUpdate);
                            }
                        });
                    });
                }

                database.collection('ether_blocks').save(
                    ether
                );
            })
        })
    })
});

// Subscribe to new ether blocks
ws.on('open', function open() {
    ws.send(JSON.stringify({
        event: "new-block"
    }));
});