const http = require('http'),
      express = require('express'),
      app = express(),
      mysql = require('mysql'),
      post = require('./functions/post'),
      bodyParser = require('body-parser');
      crypto = require('crypto');

app.use(express.static(__dirname + '/front-end'));
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'mak',
    password: 'makardbcon',
    database: 'surge'
});


app.post('/enter', (req, res) => { //обработка пост-запроса
    post.enter(pool, req, res);
});

app.post('/reg', (req, res) => {
    post.registration(pool, req, res);
});

app.listen(40888);