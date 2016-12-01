const http = require('http'),
      express = require('express'),
      app = express(),
      mysql = require('mysql'),
      crypto = require('crypto'),
      server = http.createServer().listen(40888);

app.use(express.static(__dirname + '/front-end'));

const pool = mysql.createPool({
    host: 'http://surge.app-labs.ru',
    user: 'mak',
    password: 'makardbcon',
    database: 'surge'
});


app.post('/enter', (req, res) => { //обработка пост-запроса
    enter(pool, req, res);
});

app.listen(40888);



function enter(pool, req, res) {
  const name = req.body.text0, pass = req.body.text1;
  const newPass = encryption(crypto, pass);
  pool.getConnection((err, connection) => {
    connection.query('SELECT ?? FROM passport WHERE ?? = ? AND ?? = ? LIMIT 1', ['id', 'pass', newPass, 'name', name], (err, results) => {
      connection.release();
      take(err, 'Ошибка запроса в БД при входе пользователя');
      if (results.length != 0) { //данные введены верно
        res.sendStatus(200);
      } else {
        res.sendStatus(300);
      }
    });
  });
};

function encryption(crypto, pass) { //шифрование пароля
  return crypto.createHmac('sha256', 'secret').update(pass).digest('hex');
};

function take(err, message) { //обработка ошибок
  if (err) {
    console.log(message);
    console.log(err);
    throw err;
  }
};