###Общее
    Тип запроса: POST
    Тип отправляемых данных: JSON
    Тип ответа: JSON
    Неоходимые заголовки:
    {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
####Вход    
    Параметры запроса:
    {
        'login': логин пользователя,
        'pass': пароль пользователя
    }
    Ответ: JSON с полями code и id (если удалось войти). Если пользователь найден в БД, то значение поля равно 200, в противном случае - 204 
####Регистрация
    Параметры запроса:
    {
        'login': логин пользователя,
        'pass': пароль пользователя
    }
    Ответ: JSON с полями code и id (если удалось зарегистрировать). Если пользователь добавлен в БД, то значение поля равно 200, в противном случае - 406 
####Формирование бюджета
    Параметры запроса:
    {
        'id': id пользователя,
        'start': дата момента отправки запроса на клиенте в формате ГГГГ-ММ-ДД (строка),
        'count': на какое кол-во дней планиурется бюджета (число),
        'money': сумма (число)
    }
    Ответ: JSON с полем code. Если пользователь не добавлял такой бюджет, то его значение - 200, в противном случае - 226
####Добавление источников дохода
    Параметры запроса:
    {
        'id': id пользователя,
        'name': название источника дохода (пока только на английском),
        'type': тип источника дохода (семейный, бизнес и пр. пока только на английском)
    }
    Ответ: JSON с полем code и id (если источник добавлен в БД). Если ошибки нет, то значение поля code - 200, id - id источника дохода в таблице. Если у пользователя уже есть источник дохода с таким именем, то code - 403
####Добавление кредитных карт
    Параметры запроса:
    {
        'idUser': id пользователя,
        'idSource': id источника дохода (необязательный параметр),
        'type': тип карты(счёт, банковская карта, электронный кошелёк),
        'number': номер карты/счёта (число),
        'balance': баланс (число)
    }    
    Ответ: JSON с полем code и id (если карта добавлена в БД). Если ошибки нет, то значение поля code - 200, id - id источника дохода в таблице. Если ошибка записи, то code - 400
####Изменение баланса карты/счёта
    Параметры запроса:
    {
        'idUser': id пользователя,
        'idCard': id карты/счёта,
        'balance': сколько денег пришло на карту (в случае списания денег со счёта значение поля должно быть отрицательным),
        'day': дата транзакции в формате ГГГГ-ММ-ДД
    }
    Ответ: JSON с полем code и id (если транзакция добавлена в БД). Если ошибки нет, то значение поля code - 200, id - id транзакции в таблице. Если ошибка записи, то code - 501