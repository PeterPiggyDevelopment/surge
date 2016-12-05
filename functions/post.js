function enter(pool, req, res) {
  const name = req.body.login, pass = req.body.pass;
  const newPass = encryption(crypto, pass);
  pool.getConnection((err, connection) => {
    connection.query('SELECT ?? FROM passport WHERE ?? = ? AND ?? = ? LIMIT 1', ['id', 'pass', newPass, 'login', name], (err, results) => {
      connection.release();
      take(err, 'Ошибка запроса в БД при входе пользователя');
      let response;
      if (results.length != 0) { //данные введены верно
        response = JSON.stringify({code: 200, id: results[0].id});
      } else {
        response = JSON.stringify({code: 204});
      }
      res.send(response);
    });
  });
};

function registration(pool, req, res) {
  const name = req.body.login, pass = req.body.pass;
  const newPass = encryption(crypto, pass);
  pool.getConnection((err, connection) => {
    connection.query('SELECT ?? FROM passport WHERE ?? = ? LIMIT 1', ['id', 'login', name], (err, results) => {
      take(err, 'Ошибка при проверке уникальности ника при регистрации пользователя');
      let response;
      if (results.length != 0) { //такой пользователь уже есть
          connection.release();
          response = {code: 406};
          res.send(response);
      } else { //такого пользователя нет
        connection.query('INSERT INTO passport (??, ??) VALUES (?, ?)', ['login', 'pass', name, newPass], (err, rows, fields) => {
            connection.release();
            take(err, 'Ошибка при попытке регистрации нового пользователя');
            response = {code: 200, id: rows.insertId};
            res.send(response);
        });
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

exports.enter = enter;
exports.registration = registration;