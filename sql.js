const db = require('./connect');
var query = '';

db.connect(err => {
    if (err) 
    {
      //console.error('connection error', err.stack)
      console.log(`Ошибка при коннекте с базой данных  в ${new Date()}`);
    } 
    else 
    {
      console.log(`связь с базой данных установлена в ${new Date()}`);
    }
  })

  const getAllTables = (request, response) => {
    if(request.params.tableName == 'events') 
    {
        query = `SELECT datetime, msg_prjmark, msg_text, msg_type FROM ${request.params.tableName} ORDER BY datetime DESC limit 10`;
    }
    else 
    {
       query = `SELECT * FROM "${request.params.tableName}" ORDER BY date_time DESC limit 1`
    }
      db.query(query, (error, results) => {
        if (error) {
          console.log(`Ошибка при отправке запроса к ${request.params.tableName} в ${new Date()}`)
          response.send('');
        }
        else 
        {
          console.log(`Получен ответ от ${request.params.tableName} в ${new Date()}`);
          response.send(results['rows']);
        }
      })
  }
 
  const getSocketAllTables = (arr_mass) => { 

    var rc = 0;
    return new Promise((resolve) => {   
      var query = '';
      mass_query = [];
      arr_res = [];
      rc = 0;
      for(i=0; i < arr_mass.length; i++) 
      {
        var table = arr_mass[i]; 
        if(table == 'events') 
        {
          query = `SELECT datetime, msg_prjmark, msg_text, msg_type FROM ${table} ORDER BY datetime DESC limit 10`
          mass_query.push(query);
        }
        else 
        {
          table = 'TRENDS_' + table;
          query = `SELECT * FROM "${table}" ORDER BY date_time DESC limit 1`
          mass_query.push(query);
        }

      }
       
      rc = mass_query.length;
      for(j=0;j< mass_query.length; j++) {
        var table = mass_query[j].split('"')[1];
       // console.log(table);
        db.query(mass_query[j], (error, results) => {
          if (error) {
            arr_res.push([{"error_xxxx": "no data"}, {"error_xxxx": "no data"}]);
          }
          else 
          {
            arr_res.push(results.rows);
          }
          if(rc > 0 && rc == arr_res.length) 
          {
            resolve(arr_res); 
          }  
        })
      }
    });   
}

  module.exports = {
     getAllTables, 
     getSocketAllTables
  };
