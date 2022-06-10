const express = require('express');
const jsons = require('./comparison');
const cors = require('cors');
const { resolve } = require('dns');
const sql = require('./sql');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const wsServer   = require('socket.io')(http);

const HOST = 'localhost';
const PORT = 3000;
app.use(cors());

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'BLR2_ARMS')));

app.get('/', (req,res) => {
 res.send('Server ASRK start');
});

app.get('/asrk', (req, res) => {
  res.sendFile(__dirname + '/ws.html');
});

app.get('/style', (req, res) => {
  res.sendFile(__dirname + '/style.css');
});

app.get('/script', (req, res) => {
  res.sendFile(__dirname + '/script.js');
});

app.get('/:tableName',sql.getAllTables);


  //пользователь подключился
  wsServer.on('connection', function (wsClient) {
    
    var TimerIDUpdate = 0;
    console.log('Пользователь ' + wsClient.id + ' подключился в ' + new Date());

    //получили массив таблиц от клиента
    wsClient.on('message', function(mass_table) {
     clearTimeout( TimerIDUpdate );
     old_data = []; 
     new_data = [];
      //отправляем данные клиенту
      sql.getSocketAllTables(mass_table)
      .then(result => 
        {
          //отправляем клиенту данные для визуализации
           wsClient.send(JSON.stringify(result))
           console.log(`Пользователю отправлены данные в ${new Date()}`);
           old_data.push(result);
           console.log('Отслеживание новых данных ...')
           // отслеживаем изменения в базе
           TimerIDUpdate = setInterval(() => {
             // выполняем новый запрос
             sql.getSocketAllTables(mass_table)
             .then(res => {
               new_data.push(res);
               var two_json = jsons.Json_to_Json(new_data, old_data)
               if(two_json != false) 
               { 
                 wsClient.send(JSON.stringify(res));
                 console.log('Клиенту отправлены новые данные');
                 console.log('Отслеживание новых данных ...');
               }
               old_data = new_data;
               new_data = [];
            }) 
           },1000)
        })
       //.catch(console.log); })
      })
    // пользователь закрыл страницу
    wsClient.on('disconnect', () => {
      console.log('Пользователь отключился в ' + new Date());
      
      clearTimeout( TimerIDUpdate );
    })
  })

  

http.listen(PORT, HOST,() => {
  console.log('Сервер запущен');
});
