function Json_to_Json (new_data, old_data) {
    result = [];
    try {
    // пробегаемся по новому массиву
    for(i=0; i < new_data[0].length; i++) 
    {
      var table_new = JSON.stringify(new_data[0][i]).split(',')[1].split('"')[1].slice(0, JSON.stringify(new_data[0][i]).split(',')[1].split('"')[1].length -5 );
      // пробегаемся по старому массиву
      for(j=0; j< old_data[0].length; j++) {

        var table_old = JSON.stringify(old_data[0][j]).split(',')[1].split('"')[1].slice(0, JSON.stringify(old_data[0][j]).split(',')[1].split('"')[1].length -5 );
        // ищем одинаковые данные по имени таблицы
        if(table_new == table_old) 
        {
           var new_str = JSON.stringify(new_data[0][i]);
           var old_str = JSON.stringify(old_data[0][j]);
           // если строки не равны
           if(new_str != old_str) 
           {
              var n_str = new_str.split(',');
              var o_str = old_str.split(',');
              for(k=0; k< n_str.length; k++) 
              {
                 if(n_str[k].includes('date_time')== false) {
                  if(n_str[k] != o_str[k]) {
                     //result.push(new_str);
                     result.push(new_data);
                      k = n_str.length;
                   }
                 }
              }
           }
        }
      }
       
    }
   }
catch(e) {
     // console.log('Неизвестная ошибка');
     }
    if(result.length > 0) {//console.log(result);
    return result;}
    else {return false}
}

module.exports = {Json_to_Json}