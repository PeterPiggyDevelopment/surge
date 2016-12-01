const http = require('http'),
      server = http.createServer((req, res) => {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('okay');

            
      }).listen(40888);

server.on('request', (req, res) => {
      console.log('Запрос '+ req.url);
});