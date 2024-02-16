const redis = require('redis')

function searchClient() {
    const client = redis.createClient();
    client.connect();
    return client;
}

module.exports = {
    searchClient,
}