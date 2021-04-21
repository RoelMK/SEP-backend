const http = require('http');
const port = 8080;

const server = http.createServer(function(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.write('Hello World!'); 
    res.end();
});

server.listen(port, () => {
    console.log('Server is available under http://127.0.0.1:' + port + '/');
});