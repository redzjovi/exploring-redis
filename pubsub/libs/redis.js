const redis = require('redis')

function publishClient() {
    const client = redis.createClient();
    client.connect();
    return client;
}

function subscribeClient() {
    const client = redis.createClient();
    client.connect();
    return client;
}

module.exports = {
    publishClient,
    subscribeClient,
}