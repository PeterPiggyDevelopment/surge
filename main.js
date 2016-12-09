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


app.post('/enter', (req, res) => { //вход
    post.enter(pool, req, res);
});

app.post('/reg', (req, res) => { //регистрация
    post.registration(pool, req, res);
});

app.post('/time', (req, res) => { //формирование бюджета
    post.time(pool, req, res);
});

app.post('/source', (req, res) => { //добавление источников дохода/расхода
    post.source(pool, req, res);
});

app.post('/card', (req, res) => { //привязка карты
    post.card(pool, req, res);
});

app.post('/coins', (req, res) => { //изменение баланса
    post.coins(pool, req, res);
});

app.listen(8888);