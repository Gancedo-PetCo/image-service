const Riak = require('basho-riak-client');

var nodes = [
  '127.0.0.1:8087'
];
var client = new Riak.Client(nodes, function (err) {
  // NB: at this point the client is fully initialized, and
  // 'client' and 'c' are the same object
  if (err) {
    console.log('error: ', err);
  }
});

module.exports = client;
