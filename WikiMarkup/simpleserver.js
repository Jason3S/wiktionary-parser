// simpleserver.js

var http = require('http');

var counter = 0;

http.createServer(function (req, res) {
    ++counter;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello world - ' + counter);
}).listen(8000);
