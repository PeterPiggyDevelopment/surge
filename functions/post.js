function enter(pool, req, res) {
  const name = req.body.login, pass = req.body.pass;
  const newPass = encryption(crypto, pass);
  pool.getConnection((err, connection) => {
    take(err, 'Ошибка получения соединения из пула БД');
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
    take(err, 'Ошибка получения соединения из пула БД');
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

function time(pool, req, res) {
    pool.getConnection((err, connection) => {
        take(err, 'Ошибка получения соединения из пула БД');
        connection.query(`SELECT ?? FROM time WHERE ?? = ? AND ?? = ? LIMIT 1`, ['id', 'count', req.body.count, 'id_user', req.body.id], (err, results) => {
        if (results.length === 0) { //если пользователь ещё не добавлял этот бюджет
            connection.query(`INSERT INTO time (??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, DATE_ADD(?, INTERVAL ? DAY))`,
                            ['id_user', 'start', 'count', 'money', 'end', req.body.id, req.body.start, req.body.count, req.body.money, req.body.start, req.body.count], (err, rows, fields) => {
            connection.release();
            res.send({code: 200});
            });
        } else {
            connection.query(`UPDATE time SET ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ? LIMIT 1`, 
                            ['start', req.body.start, 'money', req.body.money, 'id_user', req.body.id, 'count', req.body.count], (error, resultsTwo) => {
            connection.release();
            res.send({code: 226});
            });
        }
        });
    });
};

function source(pool, req, res) {
    const data = req.body;
    pool.getConnection((err, connection) => {
        take(err, 'Ошибка получения соединения из пула БД');
        connection.query(`INSERT INTO source (??, ??, ??) VALUES(?, ?, ?)`, ['id_user', 'name', 'type', data.id, data.name, data.type], (err, rows, fields) => {
            connection.release();
            if (err && err.errno === 1062) {
               res.send({code: 403});
            } else {
               res.send({code: 200, id: rows.insertId});
            };
        });
    });
};

function card(pool, req, res) {
    const data = req.body;
    if (data.idSource === '') data.idSource = null;
    pool.getConnection((err, connection) => {
        take(err, 'Ошибка получения соединения из пула БД');
        connection.query(`INSERT INTO cards (??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?)`, ['id_user', 'id_source', 'type', 'number', 'balance', data.idUser, data.idSource, data.type, data.number, data.balance], (err, rows, fields) => {
            connection.release();
            if (err) {
              res.send({code: 400});
            } else {
              res.send({code: 200, id: rows.insertId});
            }
        });
    });
};

function coins(pool, req, res) {
    const data = req.body;
    pool.getConnection((err, connection) => {
       take(err, 'Ошибка получения соединения из пула БД');
       const query = `UPDATE cards SET ?? = ?? + ? WHERE ?? = ? AND ?? = ? LIMIT 1`;
       connection.query(query, ['balance', 'balance', data.balance, 'id', data.idCard, 'id_user', data.idUser], (error, results) => {
          if (error) {
              connection.release();
              res.send({code: 501});
          } else {
            const query = `INSERT INTO transaction (??, ??, ??, ??) VALUES(?, ?, ?, ?)`;
            connection.query(query, ['id_user', 'id_card', 'money', 'day', data.idUser, data.idCard, data.balance, data.day], (e, rows, fields) => {
                connection.release();
                if (e && e.errno === 1452) {
                    res.send({code: 501});
                } else {
                    res.send({code: 200, id: rows.insertId});
                }
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
exports.time = time;
exports.source = source;
exports.card = card;
exports.coins = coins;