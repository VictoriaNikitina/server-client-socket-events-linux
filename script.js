
    //цвета
   var gray = '#cecece';
   var dark_gray = '#888888';
   var green = '#00FF00';
   var yellow = '#FFFF00';
   var magenta = '#ff00ff';
   var red = '#FF0000';
   var black = '#000000';
   var purple = '#4169E1';
   var blue = '#00FFFF';
   var white = '#FFFFFF';
   var orange = '#F4A460';
   var color_static_layer = '#f9f9f9';
   var mint = '#d3fff7';
   var dark_mint = '#c5f0ec';
   //ошибки
   var message ='';
   //сокет
   var socket = io('ws://localhost:3000', {'reconnection': true,'reconnectionDelay': 2000,'maxReconnectionAttempts':Infinity});
   //путь к svg изображениям
   var URL_path = 'http://localhost:3000/' ;
   var all_tb = '';
   var status_text = document.getElementsByClassName('status_text');
   window.onload=()=> 
   {
     //делаем масштабируемую svg, подгоняем под экран
      var svg = document.getElementById('svg2');
      svg_widht = svg.getAttribute('width');
      svg_height = svg.getAttribute('height');
      svg.setAttribute('width', '97%');
      svg.setAttribute('height', '95%');
      svg.setAttribute('viewBox', '0 0 '+ svg_widht + ' ' + svg_height);

       all_tb = GetAllTables();
       all_tb.push('events');
       console.log(all_tb.length);
       socket.send(all_tb);
       
   }

  
   //поиск сигналов
   function search_signals(el, data)
   {
      var signal_name = []; 
      var nsstringconst_name = [];

      var signals = el.getElementsByTagName('signal');
      
      //если есть сигнал
      if(signals.length > 0 ) 
       {
         //пробегаемся по всем сигналам
         for(s=0;s<signals.length; s++)
         {
           //получаем сигнал и его класс
            var s_name = signals[s].getAttribute("name");
            var s_templatename = signals[s].getAttribute('templatename');
            //если есть такой атрибут
            if(s_name) 
            {
              //если аттрибут не пустой, записываем имя сигнала
              if(s_name != '')
              {
                 var signal = [s_templatename, s_name];
                 signal_name.push(signal);
              }
            }  
          }
        }
        //поиск логических выражений
        var nsstringconsts = el.getElementsByTagName('nsstringconst');
        if(nsstringconsts.length != 0) 
        {
          for(n=0;n<nsstringconsts.length;n++)
          {
              var n_templatename = nsstringconsts[n].getAttribute('templatename');
              var n_name = nsstringconsts[n].getAttribute("name");
              //если имя не пустое
              if(n_name!="")
              {
                //если это логическое выражение
                //n_name = replace_string(n_name,'@','');
                var nsstringconst = [n_templatename, n_name];
                 nsstringconst_name.push(nsstringconst);
              }
          }
        }
      //alert(el.getAttribute('widget') + '/'+ signal_name);
      //вызываем функцию поиска мнемознака
       search_function(el, signal_name,nsstringconst_name, data); 
    }

    
//-----------------------------------------------------------------------------------------------------
   //поиск мнемознака
   function search_function(el, signal, nsstringconst, data)
   {
       var names = el.getAttribute('widget');
       switch(names) 
       {
               //значение сигнала
         case "libU_VALUE_01_VT" :  libU_VALUE_01_VT(el, signal,nsstringconst, data); break;
               //мнемознак перехода на другой видеокадр
          case  "libF_LINK-CUSTOM_01_CFTA":  libF_LINK_CUSTOM_01_CFTA(el, signal); break;
               //Состояние измерительного канала радиационного контроля с сигналом устойчивого роста
          case "libM_RM-MEASURING-CHANNEL_02_CVFTA" :  libM_RM_MEASURING_CHANNEL_02_CVFTA(el, signal,nsstringconst, data); break;
               //Индикатор для обобщенной сигнализации в вызываемом видеоакдре
           case "libF_COMMONSIGNAL_01_CA"  :  libF_COMMONSIGNAL_01_CA(el, nsstringconst, data); break;
              //Пользовательский мнемознак многосигнальный
           case "libU_CUSTOM-WIDGET_03_CFTA" : libU_CUSTOM_WIDGET_03_CFTA(el, signal,nsstringconst, data); break;
              //Вентиль с электроприводом
           case "libS_MOTORVALVE_01_CA" : libS_MOTORVALVE_01_CA(el,nsstringconst,data); break;
              //Значение целочисленного сигнала 0-65535
           case 'libU_INTVALUE-SQUARE_02_V' : libU_INTVALUE_SQUARE_02_V(el,signal, data); break;
              //Значение сигнала с атрибутами управления
           case 'libU_VALUE-COLOR_01_CVT' : libU_VALUE_COLOR_01_CVT(el,signal, nsstringconst, data); break;
              // Значение измерительного канала периодического контроля  
           case 'libM_RM-HAND-CHANNEL_01_VT' : libM_RM_HAND_CHANNEL_01_VT(el,nsstringconst, data); break;
              // Датчик уровня с 4 порогами и неисправностью
           case 'libS_LEVEL-4THRESHOLD-FAIL_01_CF' : libS_ALL_4THRESHOLD_FAIL_01_CF(el,signal, data); break;
               // Датчик расхода с 4 порогами и неисправностью
           case 'libS_FLOW-4THRESHOLD-FAIL_01_CF' : libS_ALL_4THRESHOLD_FAIL_01_CF(el,signal, data); break;
               // Датчик давления/разрежения с 4 порогами и неисправностью
           case 'libS_PRESSURE-4THRESHOLD-FAIL_01_CF' : libS_ALL_4THRESHOLD_FAIL_01_CF(el,signal, data); break;
               // Датчик температуры с 4 порогами и неисправностью
           case 'libS_TEMPERATURE-4THRESHOLD-FAIL_01_CF' : libS_ALL_4THRESHOLD_FAIL_01_CF(el,signal, data); break;
         

       }
      
   }

//1 логика перехода на другой видеокадр
function  libF_LINK_CUSTOM_01_CFTA(el, signal) 
   {
   var path = el.getElementsByTagName('path')[0];
   var svg_file = signal[0][1].substr(4,signal[0][1].length);
    el.addEventListener( "click", function() {
    var xhr= new XMLHttpRequest();
    xhr.open('GET', URL_path + svg_file, true);
    xhr.send();
    xhr.onreadystatechange= function() 
    { 
      if (xhr.readyState!==4) return;
      if (this.status != 200) 
      {
      // обработать ошибку
      alert( 'Видеокадр ' + svg_file + ' не найден');
      return;
      }
      try {
        if(this.responseText != '') {
          var div = document.getElementsByClassName('mnemo');
          div[0].innerHTML = this.responseText;
          window.onload();  
        }
        else 
        {
          alert( 'Видеокадр ' + svg_file + ' не найден' );
        }    
      }
      catch(e) {
        alert( "Некорректный ответ " + e.message );
      }
    }
  });
  
  //событие при наведении курсора на элемент
  el.addEventListener( "mouseover", function() {
    path.setAttribute('style','fill: '+ dark_mint + '; ' + 'stroke:' + black);
  });
  //событие при перемещении курсора за предел элемента
  el.addEventListener( "mouseout", function() {
    path.setAttribute('style','fill: '+ mint + '; ' + 'stroke:' + black);
            }
          );
}
//2 логика для значения сигнала
function libU_VALUE_01_VT(el, signal,nsstringconst, data) {
   var str = '';
   //получаем разметку
   var tspan_element = el.getElementsByTagName('tspan')[0];
  // tspan_element.setAttribute('style', 'fill-opacity: 1; fill: #0000FF'); 
   //получаем имя таблицы
   var table = get_table(signal[0][1]);
   //получаем данные
   var data = Research_Data(data,table);
   if(data.length > 0) 
   {
     var SIGNAME = '';
     var UNUSED = '';
     var ISAPPLICABLE = '';
     var rect = el.getElementsByTagName('rect')[2];
     //пробегаемся по списку сигналов
     for (i =0; i < signal.length; i++) 
     {
       //получаем значение сигнала
       if(signal[i][0] == 'SIGNAME') 
       {
          SIGNAME = data[0][0][signal[i][1]];
          if(SIGNAME == undefined) 
          {
             SIGNAME = 0;
          }
       }
       // получаем сигнал вывода из эксплуатации
       if(signal[i][0] == 'UNUSED') 
       {
          UNUSED = data[0][0][signal[i][1]];
       }
     }
     if(nsstringconst.length!= 0) {
       //разбираем логические выражения
       var res_split = calculate_expression(nsstringconst[0], data[0][0])
       ISAPPLICABLE = res_split[1]; 
     }
      //если выведен из эксплуатации
       if(UNUSED == true) 
       {
         rect.setAttribute('style', 'fill:' + dark_gray);
       }
       //если есть сигнал наличия данных
       if(ISAPPLICABLE == true) 
       {
         tspan_element.innerHTML = SIGNAME;
       }
       //если нет сигнала наличия данных
       else 
       {
         tspan_element.innerHTML = 'n/a';
       }
   }
   //если нет таблицы в базе данных
   else 
   {
    var tt = el.getElementsByTagName('text')[0];
    tt.innerHTML = '---';
    tt.setAttribute('style', 'fill:'+ red);
   }
}

//3 логика для состояния измерительного канала радиационного контроля с сигналом устойчивого роста
 function libM_RM_MEASURING_CHANNEL_02_CVFTA(el, signal,nsstringconst, data) 
 {
   var str = '';
  //получаем разметку
  //горизонтальные и вертикальные полосы
  var vertic_bar = el.getElementsByTagName('path')[4];
  var horiz_bar = el.getElementsByTagName('path')[5];
  //части круга
  var circle_2_4 = el.getElementsByTagName('path')[2];
  var circle_3_4 = el.getElementsByTagName('path')[3];
  var circle_1_4 = el.getElementsByTagName('path')[6];
  //прямоугольник
  var rectangle = el.getElementsByTagName('rect')[0];
  //2 треугольника по умолчанию не видны
  var triangle_1 = el.getElementsByTagName('path')[7];
  var triangle_2 = el.getElementsByTagName('path')[8];
  triangle_1.setAttribute('style', 'fill-opacity:0');
  triangle_2.setAttribute('style', 'fill-opacity:0');
  //получаем имя таблицы
  var table = get_table(signal[0][1]);
  //получаем данные
  var data = Research_Data(data, table);
  if(data.length > 0) 
  {
      //проходимся по всем сигналам
      for (i = 0; i < signal.length; i++) 
       {  
          // получаем значение сигнала
          if(signal[i][0] == 'XA0000') 
          {
           var SIG_VALUE = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала П
          if(signal[i][0] == 'XD0000') 
          {
           var SIG_P = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала А
          if(signal[i][0] == 'XD0001') 
          {
           var SIG_A = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала H
          if(signal[i][0] == 'XD0002') 
          {
           var SIG_H = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала HD
          if(signal[i][0] == 'XD0003') 
          {
           var SIG_HD = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала ресурса
          if(signal[i][0] == 'XD0004') 
          {
           var SIG_RESOURCE = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала обрыва
          if(signal[i][0] == 'XD0005') 
          {
           var SIG_BREAK = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала ВОК
          if(signal[i][0] == 'XD0006') 
          {
           var SIG_BOK = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала ВКК
          if(signal[i][0] == 'XD0007') 
          {
           var SIG_BKK = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала состояние 1
          if(signal[i][0] == 'XD0008') 
          {
           var SIG_COND1 = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала состояние 2
          if(signal[i][0] == 'XD0009') 
          {
           var SIG_COND2 = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала состояние 3
          if(signal[i][0] == 'XD0010') 
          {
           var SIG_COND3 = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала состояние 4
          if(signal[i][0] == 'XD0011') 
          {
           var SIG_COND4 = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала управление 1
          if(signal[i][0] == 'XD0012') 
          {
           var SIG_CONTR1 = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала управление 2
          if(signal[i][0] == 'XD0013') 
          {
           var SIG_CONTR2 = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала управление 3
          if(signal[i][0] == 'XD0014') 
          {
           var SIG_CONTR3 = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала управление 4
          if(signal[i][0] == 'XD0015') 
          {
           var SIG_CONTR4 = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала выше диапазона
          if(signal[i][0] == 'XD0016') 
          {
           var SIG_RANGEOUT = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала внутренний тест
          if(signal[i][0] == 'XD0017') 
          {
           var SIG_INTEST = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала внешний тест
          if(signal[i][0] == 'XD0018') 
          {
           var SIG_OUTTEST = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала ниже диапазона
          if(signal[i][0] == 'XD0019') 
          {
           var SIG_RANDELOWER = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала размерность
          if(signal[i][0] == 'XI0001') 
          {
           var SIG_SIZE = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала тест сигнализация
          if(signal[i][0] == 'XD0020') 
          {
           var SIG_TESTALARM = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала блокировка
          if(signal[i][0] == 'XD0021') 
          {
           var SIG_BLOCK = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала диапазон
          if(signal[i][0] == 'XD0022') 
          {
           var SIG_RANGE = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала наличия данных
         if(signal[i][0] == 'XD0023') 
          {
           var SIG_DATAPRESENT = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала выхода из эксплуатации
         if(signal[i][0] == 'XD0024') 
          {
           var SIG_UNUSED = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала рабочий порог
         if(signal[i][0] == 'XD0025') 
          {
           var SIG_WORK = data[0][0][signal[i][1]];
          }
          // получаем значение сигнала устройчивый рост
         if(signal[i][0] == 'XD0026') 
          {
            var SIG_UPTREND = data[0][0][signal[i][1]];
          }
       } 
       //проходимся по всем логическим выражениям
       if(nsstringconst.length!= 0) 
      {
        for(i=0; i < nsstringconst.length; i++) 
        {
        //вид контролируемого параметра
       if(nsstringconst[i][0]== 'Z04SYM1') 
       {
         var contr_params = nsstringconst[i][1];
         if(contr_params != '') {
           create_element_params(el,contr_params)
         }
       }
       //вид излучения
       if(nsstringconst[i][0]== 'Z05SYM2') 
       {
         var rad_params = nsstringconst[i][1];
         if(rad_params != '') {
           create_element_rad(el,rad_params);
        }
       }
       }
      }
     //если выведен из эксплуатации приоритет 1
    if(SIG_UNUSED == true) 
    { 
      //темно-серый
      circle_3_4.setAttribute('style', 'fill:' + dark_gray +  '; '+ 'stroke:' + black);
      circle_1_4.setAttribute('style', 'fill:' + dark_gray);
      vertic_bar.setAttribute('style', 'fill:' + dark_gray);
      horiz_bar.setAttribute('style', 'fill:' + dark_gray);
      rectangle.setAttribute('style', 'fill:' + dark_gray);
    }
    else 
    {
      // если нет сигнала наличия данных приоритет 2
       if(SIG_DATAPRESENT == false) 
       {
         //светло-серый
        circle_3_4.setAttribute('style', 'fill:' + gray + '; ' + 'stroke:' + black);
        circle_1_4.setAttribute('style', 'fill:' + gray);
        vertic_bar.setAttribute('style', 'fill:' + gray);
        horiz_bar.setAttribute('style', 'fill:' + gray);
        rectangle.setAttribute('style', 'fill:' + gray);
       }
       else 
       {
         // если есть сигнал А приоритет 3
         if(SIG_A == true) 
         {
           //красный полукруг
          circle_2_4.setAttribute('style', 'fill:' + red);
          circle_3_4.setAttribute('style', 'fill-opacity: 0; stroke:' + black);
         }
         else 
         {
           // если есть сигнал П
           if(SIG_P == true) 
           {
             //желтый полукруг
            circle_2_4.setAttribute('style', 'fill:' + yellow);
            circle_3_4.setAttribute('style', 'fill-opacity: 0; stroke:' + black);
           }
         }
         // если есть сигнал H
         if(SIG_H == true) 
         {
           //маджента 1/4
          //создаем левую нижнюю четверть круга 
          create_element_path(el);
          
         }
         //если есть хотябы 1 такой сигнал
         if (
             SIG_BKK == true || SIG_BOK == true || SIG_INTEST == true || 
             SIG_OUTTEST == true || SIG_HD == true || SIG_RESOURCE == true ||
             SIG_BREAK == true || SIG_RANDELOWER == true || SIG_RANGEOUT == true
            ) 
         {
           //светло-фиолетовая правая нижняя четвертинка круга
          circle_1_4.setAttribute('style','fill:' + purple);

         }
         else 
         {
           //зеленый круг
          circle_3_4.setAttribute('style', 'fill:' + green + '; ' + 'stroke:' + black);
          circle_1_4.setAttribute('style', 'fill:' + green);
          horiz_bar.setAttribute('style', 'fill:' + green);
          vertic_bar.setAttribute('style', 'fill:' + green);
          rectangle.setAttribute('style', 'fill:' + gray);
         }
         if(SIG_UPTREND == true) 
         {
          triangle_1.setAttribute('style', 'fill-opacity:1');
          triangle_2.setAttribute('style', 'fill-opacity:1');
         }
         circle_3_4.setAttribute('style', 'fill:' + green + '; '  + 'stroke:' + black);
         horiz_bar.setAttribute('style', 'fill:' + green);
         vertic_bar.setAttribute('style', 'fill:' + green);
         rectangle.setAttribute('style', 'fill:' + gray);
       }


    }
  
  
   if(contr_params != undefined) 
   {
      //добавляем контролируемый параметр
    create_element_params(el,contr_params);
   }
   if(rad_params != undefined) 
   {
     //добавляем вид ионизирующего излучения
    create_element_rad(el, rad_params);
   }
   
  }
  else 
  {
        //серый
        circle_3_4.setAttribute('style', 'fill:' + gray + '; ' +  'stroke:' + black);
        circle_1_4.setAttribute('style', 'fill:' + gray);
        vertic_bar.setAttribute('style', 'fill:' + gray);
        horiz_bar.setAttribute('style', 'fill:' + gray);
        rectangle.setAttribute('style', 'fill:' + gray);
        create_element_params(el, contr_params);
        if(rad_params != undefined) 
        {
           create_element_rad(el, rad_params);
        }
    }
}

//4 Индикатор для обобщенной сигнализации в вызываемом видеоакдре
function libF_COMMONSIGNAL_01_CA(el,nsstringconst, data) 
{
   let str = '';
   //получаем Н А П Р 
   var h = el.getElementsByTagName('path')[1];
   var a = el.getElementsByTagName('path')[2];
   var p = el.getElementsByTagName('path')[3];
   var r = el.getElementsByTagName('path')[4];
   //по умолчанию серым
   h.setAttribute('style', 'fill:'+ gray + '; '+ 'stroke:' + black);
   a.setAttribute('style', 'fill:'+ gray + '; '+ 'stroke:' + black);
   p.setAttribute('style', 'fill:'+ gray + '; '+ 'stroke:' + black);
   r.setAttribute('style', 'fill:'+ gray + '; '+ 'stroke:' + black);
   if(nsstringconst.length != 0) {
   //получаем имя таблицы
   var table = get_table(nsstringconst[0][1]);
   //получаем данные
   var data = Research_Data(data, table);
   if(data.length > 0 ) 
   {
     //пробегаемся по списку логических выражений
     for (i =0; i < nsstringconst.length; i++) 
     {
       //разбираем логические выражения
       var res_split = replace_logic(nsstringconst[i][1]);
       res_split.forEach(function(t)
       {
         if(t[0]== '@') 
         {
             let signal = t.slice(1,t.length);
             var zn = data[0][0][signal];
             if(zn == undefined)
             {
               str = str + false;
             }
             else 
             {
               str = str + zn;
             }
         }
         else
         {
           str = str + t;
         }
       });
      var result = '';
       try 
       {
        result = eval(str);
       }
      catch (e) 
      {    
         result = false ; 
      } 
      //Обобщенная неисправность или отсутствие данных в 
      if(nsstringconst[i][0] == 'Z01FAIL') 
      {
         if(result == true)
         {
           //маджента
           h.setAttribute('style', 'fill:' + magenta + ';' + 'stroke:' + black);
         }
         else 
         {
           //серый
           h.setAttribute('style', 'fill:'+ gray + '; '+ 'stroke:' + black);
         }
      }
      //Обобщенное нарушение аварийных уставок в видеокадре
      if(nsstringconst[i][0] == 'Z02EMERG') 
      {
         if(result == true)
         {
           //красный
           a.setAttribute('style', 'fill:'+ red + '; '+ 'stroke:' + black);
         }
         else 
         {
           //серый
           a.setAttribute('style', 'fill:'+ gray + '; '+ 'stroke:' + black);
         }
      }
      //Обобщенное нарушение контрольных уровней в видеокадре
      if(nsstringconst[i][0] == 'Z03WARN') 
      {
         if(result == true)
         {
           //желтый
           p.setAttribute('style', 'fill:'+ yellow + '; '+ 'stroke:' + black);
         }
         else 
         {
           //серый
           p.setAttribute('style', 'fill:'+ gray + '; '+ 'stroke:' + black);
         }
      }
      //Обобщенный признак устойчивого роста значения параметра в видеокадре
      if(nsstringconst[i][0] == 'Z04TRENDUP') 
      {
         if(result == true)
         {
           //голубой
           r.setAttribute('style', 'fill:'+ blue + '; '+ 'stroke:' + black);
         }
         else 
         {
           //серый
           p.setAttribute('style', 'fill:'+ gray + '; '+ 'stroke:' + black);
         }
      }
     }
    }
   }
}
//5 вентиль с электроприводом
function libS_MOTORVALVE_01_CA(el,nsstringconst, data)
{
   var str = '';
   var resul = '';
   //получаем части мнемознака
   var left_triangle  = el.getElementsByTagName('path')[0];
   var right_triangle  = el.getElementsByTagName('path')[1];
   var circle  = el.getElementsByTagName('path')[3];
   var d = el.getElementsByTagName('path')[5];
   var losk_1_2 = el.getElementsByTagName('path')[6];
   var losk_2_2 = el.getElementsByTagName('path')[7];
   var point = el.getElementsByTagName('path')[8];
   var text = el.getElementsByTagName('text')[0];
   var arr = [];
   // по умолчанию скрыты
   d.style.display = 'none';
   text.style.display = 'none';
   losk_2_2.style.display = 'none';
   losk_1_2.style.display = 'none';
   point.style.display = 'none';
 
   var table = get_table(nsstringconst[0][1]);
   var data = Research_Data(data,table);
   //получаем данные
   if(data.length > 0)
   {
     for(i=0; i< nsstringconst.length; i++ ) 
     {
         //разбираем логические выражения
         var res_split = calculate_expression(nsstringconst[i], data[0][0]);
         //вывод из эксплуатации
         if(nsstringconst[i][0] == 'UNUSED')
         {
           var  UNUSED  = res_split[1];
         }
         //наличие данных
         if(nsstringconst[i][0] == 'DATAPRESENT')
         {
           var  DATAPRESENT = res_split[1];
         }
         //Целочисленное выражение режима управления
         if(nsstringconst[i][0] == 'CONTROLMODE')
         {
           var  CONTROLMODE = res_split[1];
         }
         //Логическое выражение блокировки вентиля
         if(nsstringconst[i][0] == 'BLOCKED')
         {
           var  BLOCKED = res_split[1];
         }
         //Логическое выражение неисправности вентиля
         if(nsstringconst[i][0] == 'FAILED')
         {
           var  FAILED = res_split[1];
         }
         //Целочисленное выражение состояния вентиля. Значения: 0 - закрыт, 1 - открыт, 2 - промежуточное состояние
         if(nsstringconst[i][0] == 'STATE')
         {
           var  STATE = res_split[1];
         }
      }
         //выведен из эксплуатации закрашиваем темно-серым
         if(UNUSED ==  true ) 
         {    
         left_triangle.setAttribute('style', 'fill:' + dark_gray + '; ' + 'stroke:' + black);
         right_triangle.setAttribute('style', 'fill:' + dark_gray + '; ' + 'stroke:' + black);
         circle.setAttribute('style', 'fill:' + dark_gray + '; ' + 'stroke:' + black);
         }
         else
         {
           //нет данных закрашивем светло-серым
          if(DATAPRESENT == false || DATAPRESENT == undefined) 
          {
            left_triangle.setAttribute('style', 'fill:' + gray + '; ' + 'stroke:' + black);
            right_triangle.setAttribute('style', 'fill:' + gray + '; ' + 'stroke:' + black);
            circle.setAttribute('style', 'fill:' + gray + '; ' + 'stroke:' + black);
          }
          else 
          {
              //есть данные
            // режим управления false - ручное управление
             if(CONTROLMODE == false) 
             {
                //внешней блокировка есть
                if(BLOCKED == true) 
                {
                  //появляется синий замок
                  losk_2_2.style.display = 'block';
                  losk_1_2.style.display = 'block';
                  point.style.display = 'block';
                }
                
             }
             // режим управления true - дистанционное управление
             else 
             {
                // появляется Д
               d.style.display = 'block';
               text.style.display = 'block';
               
               // внешняя блокировка есть
               if(BLOCKED == true) 
               {
                 //появляется синий замок
                 losk_2_2.style.display = 'block';
                 losk_1_2.style.display = 'block';
                 point.style.display = 'block';
               }
             }
             // закрыт
             if (STATE == 0)    
             {
               // белый
               left_triangle.setAttribute('style', 'fill:' + white + '; ' + 'stroke:' + black);
               right_triangle.setAttribute('style', 'fill:' + white + '; ' + 'stroke:' + black);
             } 
             if (STATE == 1) 
             {
               // зеленый
               left_triangle.setAttribute('style', 'fill:' + green + '; ' + 'stroke:' + black);
               right_triangle.setAttribute('style', 'fill:' + green + '; ' + 'stroke:' + black);
             } 
             if (STATE == 2) 
             {
               // оранжевый
               left_triangle.setAttribute('style', 'fill:' + orange + '; ' + 'stroke:' + black);
               right_triangle.setAttribute('style', 'fill:' + orange + '; ' + 'stroke:' + black);
             }
             if(FAILED == false) 
             {
               // зеленый
               circle.setAttribute('style', 'fill:' + green + '; ' + 'stroke:' + black);
             }
             else 
             {
               // маджента
               circle.setAttribute('style', 'fill:' + magenta + '; ' + 'stroke:' + black);
             }
           }
         }
     }
   //нет таблицы что делаем?
   else 
     {
       //закрашиваем серым
       left_triangle.setAttribute('style', 'fill:' + gray + '; ' + 'stroke:' + black);
       right_triangle.setAttribute('style', 'fill:' + gray + '; ' + 'stroke:' + black);
       circle.setAttribute('style', 'fill:' + gray + '; ' + 'stroke:' + black);
     }
}

//6 Пользовательский сигнал многоканальный
function libU_CUSTOM_WIDGET_03_CFTA(el, signal, nsstringconst, data) 
{
  arr = [];
  let s_OPTIONS = '';
  let s_FLASH = '';
  let s_INVERSE = '';
  let s_EXPR = '';
  //получаем разметку
  var path = el.getElementsByTagName('path')[0];
  var text = el.getElementsByTagName('text')[0];
  var tspan = el.getElementsByTagName('tspan')[0];
  if(nsstringconst.length != 0)
  {
    var table = get_table(nsstringconst[0][1]);
  }
  else 
  {
     if(signal.length != 0) 
     {
      var table = get_table(signal[0][1]);
     }
     else 
     {
      //нет никаких условий 
       path.setAttribute(style, 'fill:' + gray);
     }
  }
  var data = Research_Data(data,table);
  if(data.length > 0) 
  {
      if(nsstringconst.length != 0) 
      {
        for(i=0;i< nsstringconst.length;i++)
        {
          let str = '';
          //условие видимости
          if(nsstringconst[i][0] == 'EXPR') 
          {
            var res_split = calculate_expression(nsstringconst[i], data[0][0]);
            s_EXPR = res_split[1];
            
          }
          // инверсия
          if(nsstringconst[i][0] == 'INVERSE')
          {
            s_INVERSE  = nsstringconst[i][1];
          }
          // мигание
          if(nsstringconst[i][0] == 'FLASH') 
          {
            s_FLASH = nsstringconst[i][0];
          }
        }
      }
      //ОПЦИЯ
      if(signal.length != 0) 
      {
       s_OPTIONS = signal[0][1];
      }

      //если условие видимости 0
      if(s_EXPR == false) 
      {
         el.style.display = 'none';
      }
      //мнемознак видим
      else 
      {
         if(s_OPTIONS != 0 & s_OPTIONS != '')   
         {
           //выводится подсказка
            title_element(el);
         }
      }
    }
    else 
    {
      //нет таблицы в БД
      path.setAttribute('style', 'fill:' + gray + '; stroke:' + black);
    }
 
}

//7 Значение целочисленного сигнала 0-65535
function libU_INTVALUE_SQUARE_02_V(el,signal, data) 
{
  var tspan = el.getElementsByTagName('tspan')[0];
  var rect = el.getElementsByTagName('rect')[0];
    //получаем имя таблицы
   // let table = signal_substr(signal);
    var table = get_table(signal[0][1]);
    
    rect.setAttribute('style','fill:' + color_static_layer);
    tspan.setAttribute('style', 'fill:'+ black + '; ' + 'fill-opacity: 1');
    //получаем данные
    var data = Research_Data(data, table);
    if(data.length > 0) 
    {
      var sig = signal[0][1];
      if(sig == undefined)
      {
        tspan.innerHTML = '0';
      }
      else 
      {
        tspan.innerHTML = data[0][0][sig];
      }
      
    }
    else 
    {
       tspan.innerHTML = '0';
    }
}

//! НЕ ВЕЗДЕ РАБОТАЕТ КОРРЕКТНО, ТАК КАК НЕТ УСЛОВИЯ ВИДИМОСТИ
//8 Значение сигнала с атрибутами управления
function libU_VALUE_COLOR_01_CVT(el,signal, nsstringconst, data) 
{
  //переменные для всех сигналов
  let CONDITION_1 = '';
  let CONDITION_2 = '';
  let CONDITION_3 = '';
  let CONDITION_4 = '';
  let CONDITION_5 = '';
  let TEXT_1 = '';
  let TEXT_2 = '';
  let TEXT_3 = '';
  let TEXT_4 = '';
  let TEXT_5 = '';
  let BACKGROUND_1 = '';
  let BACKGROUND_2 = '';
  let BACKGROUND_3 = '';
  let BACKGROUND_4 = '';
  let BACKGROUND_5 = '';
  let ZNOTAPPLICABLE = [];
  let ZVIEW = '';
  let ALIGMENT = '';
  let SIGNAME = '/';
  let UNUSED = '';
  let COLOR_TEXT = '';
  let FONT ='';
  let SIZE = '';
  var text = '';
  var style = '';
  var expr_cond = '';
 

  //получаем разметку
  var tspan = el.getElementsByTagName('tspan')[0];
  var txt = el.getElementsByTagName('text')[0];
  var rect = el.getElementsByTagName('rect')[0];
 //скрываем ненужные элементы при визуализации
  var del_rect = el.getElementsByTagName('rect');
  for(i=2;i<7;i++) 
  {
    del_rect[i].style.display = 'none';
  }

  var del_text = el.getElementsByTagName('text')[1];
  del_text.style.display = 'none';

  var del_path = el.getElementsByTagName('path');
  for(i=0;i<del_path.length;i++) 
  {
    del_path[i].style.display = 'none';
  }
  var del_tspan = el.getElementsByTagName('tspan')[1];
  del_tspan.style.display = 'none';

  var table='';
    //есть  сигналы
    if(signal.length != 0) 
    {
       table = get_table(signal[0][1]);
    }
    else 
    {
       //нет сигналов смотрим на логические выражения
       if(nsstringconst.length != 0 ) 
       {
        table = get_table(nsstringconst[0][1]);
       }
       else 
       {
         //если в разметке не указан ни один сигнал
          tspan.innerHTML = '---';
          tspan.setAttribute('style', 'fill:'+ red);
       }

    }
    var data = Research_Data(data,table);
    if(data.length > 0)
    {
        //проходимся по всем сигналам
        if(signal.length != 0) 
        {
          for(i=0;i< signal.length; i++) 
          {
            // значение
            if(signal[i][0]== 'SIGNAME') 
            {
              SIGNAME = data[0][0][signal[i][1]];
              if(SIGNAME == undefined){ SIGNAME = '--';}
            }
            // вывод из эксплуатации
            if(signal[i][0]== 'UNUSED') 
            {
              UNUSED = data[0][0][signal[i][1]];
              //if(UNUSED == undefined){ UNUSED = false;}
            }
          }
        }
        //проходимся по всем логическим выражениям
        if(nsstringconst.length != 0)
        {
           for(i=0;i< nsstringconst.length; i++) 
          {
            let ns = nsstringconst[i][0];
            //если это нужно считать
            if(ns == 'Z11COLOREXPR' || ns == 'Z21COLOREXPR' || ns == 'Z31COLOREXPR' ||
               ns == 'Z41COLOREXPR' || ns == 'Z51COLOREXPR' || ns== 'ZVIEW' || ns == 'ZNOTAPPLICABLE' ) 
            {
              let str = '';
              var res_split = calculate_expression(nsstringconst[i], data[0][0]);
              //условие видимости
              if(ns == 'ZVIEW')
              {
                ZVIEW = res_split[1];
              }
              //условие 1
              if(ns == 'Z11COLOREXPR')
              {
                CONDITION_1 = res_split[1];
              }

              //условие 2
              if(ns == 'Z21COLOREXPR')
              {
                CONDITION_2 = res_split[1];
              }

              //условие 3
              if(ns == 'Z31COLOREXPR')
              {
                CONDITION_3 = res_split[1];
              }

              //условие 4
              if(ns == 'Z41COLOREXPR')
              {
                CONDITION_4 = res_split[1];
              }

              //условие 5
              if(ns == 'Z51COLOREXPR')
              {
                CONDITION_5 = res_split[1];
              }
              if(ns == 'ZNOTAPPLICABLE')
              {
                  ISAPPLICABLE = res_split[1];
              }
            }
            //если это текст, цвета, шрифты
            else 
            {
               // текст 1
              if(nsstringconst[i][0] == 'Z12TEXT')
              {
                TEXT_1 = nsstringconst[i][1];
              }
              // текст 2
              if(nsstringconst[i][0] == 'Z22TEXT')
              {
                TEXT_2 = nsstringconst[i][1];
              }
              // текст 3
              if(nsstringconst[i][0] == 'Z32TEXT')
              {
                TEXT_3 = nsstringconst[i][1];
              }
              // текст 4
              if(nsstringconst[i][0] == 'Z42TEXT')
              {
                TEXT_4 = nsstringconst[i][1];
              }
              // текст 5
              if(nsstringconst[i][0] == 'Z51COLOREXPR')
              {
                TEXT_5 = nsstringconst[i][1];
              }
              // выравнивание
              if(nsstringconst[i][0]== 'ZZ3ALIGN') 
              {
                ALIGMENT = nsstringconst[i][1];
              }
            }
            
          }
        }
          //получаем цвета 
          var nscolor = search_nscolor(el);
          if(nscolor.length != 0) 
          {
            for(i=0; i< nscolor.length; i++) 
            {
              //цвет фона 1
              if(nscolor[i][0] == 'Z13COLOR') 
              {
                BACKGROUND_1 = nscolor[i][1];
              }
                //цвет фона 2
              if(nscolor[i][0] == 'Z23COLOR') 
              {
                BACKGROUND_2 = nscolor[i][1];
              }
                //цвет фона 3
              if(nscolor[i][0] == 'Z33COLOR') 
              {
                BACKGROUND_3 = nscolor[i][1];
              }
                //цвет фона 4
              if(nscolor[i][0] == 'Z43COLOR') 
              {
                BACKGROUND_4 = nscolor[i][1];
              }
                //цвет фона 5
              if(nscolor[i][0] == 'Z53COLOR') 
              {
                BACKGROUND_5 = nscolor[i][1];
              }
              //цвет текста
              if(nscolor[i][0] == 'ZZ2COLORTEXT') 
              {
                COLOR_TEXT = nscolor[i][1];
              }
            }
          }
            //получаем шрифт
            var nsfont = search_nsfont(el);

            if(nsfont.length != 0) 
            {
              for(i=0; i< nsfont.length; i++) 
              {
              //шрифт
                if(nsfont[i][0] == 'ZZ1FONTDESC') 
                {
                  FONT = nsfont[i][1];
                  SIZE = nsfont[i][2];
                }
              }
            }
            //проверка сигналов
            //выведен из эксплуатации
            if(UNUSED == true) 
            {
              rect.setAttribute('style', 'fill:' + dark_gray);
            }
            else 
            {
                // не выведен из эксплуатации
                // проверка условия видимости
                if(ZVIEW != '' & ZVIEW == false) 
                {
                  el.style.display = 'none';
                  //tspan.style.display = 'none';
                }
                else 
                {
                  if(ISAPPLICABLE == false) 
                  {
                     tspan.innerHTML = 'n/a';
                  }
                  else
                  {
                  // видим
                  //есть значение сигнала
                   if (SIGNAME != '/') 
                   {
                      tspan.innerHTML = SIGNAME;
                   }
                   else 
                   {
                     //значение не задано проверяем условия 1-5
                     //условие 1
                      if(CONDITION_1 == true) 
                      {
                        //устанавливаем текст и закрашиваем
                         tspan.innerHTML = TEXT_1;
                         rect.setAttribute('style','fill: rgba(' + BACKGROUND_1 + ')');
                      }
                      else 
                      {
                        //условие 2
                        if(CONDITION_2 == true) 
                        {
                          //устанавливаем текст и закрашиваем
                           tspan.innerHTML = TEXT_2;
                           rect.setAttribute('style','fill: rgba(' + BACKGROUND_2 + ')');
                        }
                        else 
                        {
                            //условие 3
                          if(CONDITION_3 == true) 
                          {
                            //устанавливаем текст и закрашиваем
                            tspan.innerHTML = TEXT_3;
                            rect.setAttribute('style','fill: rgba(' + BACKGROUND_3 + ')');
                          }
                          else 
                          {
                             //условие 4
                            if(CONDITION_4 == true) 
                            {
                              //устанавливаем текст и закрашиваем
                              tspan.innerHTML = TEXT_4;
                              rect.setAttribute('style','fill: rgba(' + BACKGROUND_4 + ')');
                            }
                            else 
                            {
                              //условие 5
                              if(CONDITION_5 == true) 
                              {
                                //устанавливаем текст и закрашиваем
                                tspan.innerHTML = TEXT_5;
                                rect.setAttribute('style','fill: rgba(' + BACKGROUND_5 + ')');
                              }
                            }
                          }
                        }
                      }
                    }
                   }
                   //цвет текста
                   var style = 'fill: rgba('+ COLOR_TEXT + ')' +'; ';
                   // шрифт и размер
                   style = style + 'font-size:'+ SIZE + '; ' + 'font-family:' + FONT + '; ';
                   //выравнивание
                  if(ALIGMENT == 1) {
                    style = style + 'align: right ';
                  }
                  if(ALIGMENT == 2) {
                     style = style + 'align: center ';
                  }
                  txt.setAttribute('style', style);
                  tspan.setAttribute('style', '');
                  tspan.setAttribute('y', '17');

                }
            }
      }
      else 
      {
        //нет таблицы в базе данных
        tspan.innerHTML = 'n/a';
        tspan.setAttribute('style', 'fill:'+ red);
      }
} 

//9 Значение измерительного канала периодического контроля
function libM_RM_HAND_CHANNEL_01_VT(el,nsstringconst, data) 
{
  //скрываем ненужные элементы
  var  del_path = el.getElementsByTagName('path');
  var  tspan = el.getElementsByTagName('tspan')[0];
  tspan.setAttribute('style', 'fill-opacity : 1; fill: #0000FF');
  for(i=0;i< del_path.length; i++)
  {
   del_path[i].style.display = 'none';
  }
  var table = get_table(nsstringconst[0][1]);
  //получаем данные
  var data = Research_Data(data,table);
  if(data.length > 0 ) 
  {
    //значение
    var text = data[0][0][nsstringconst[0][1]];
    //если нет данных о сигнале
    if(text == undefined) 
    {
       tspan.innerHTML = 'Нет измерений';
    }
    else
    {
       tspan.innerHTML = text;
    }
  }
  //если нет таблицы в базе данных
  else 
  {
    tspan.innerHTML = 'n/a';
  }
}

//10 Общая логика для датчиков  с 4 порогами и неисправностью
function libS_ALL_4THRESHOLD_FAIL_01_CF (el,signal) 
{
  let SIGNAL_H = '';
  let SIGNAL_PS = '';
  let SIGNAL_PP = '';
  let SIGNAL_AS = '';
  let SIGNAL_AP = '';
  //разметка мнемознака
  var path_up = el.getElementsByTagName('path')[1];
  var path_down = el.getElementsByTagName('path')[2];
  if(signal.length != 0) 
  {
    var table = get_table(signal[0][1]);
    var data = Research_Data(data,table);
    //получаем данные
    if(data.length > 0) 
    {
         for(i=0; i< signal.length; i++) 
           {
             // Сигнал АП
              if(signal[i][0]== 'DI1004') 
              {
                 SIGNAL_AP = data[0][0][signal[i][1]];
              }

              // Сигнал ПП
              if(signal[i][0]== 'DI1002') 
              {
                 SIGNAL_PP = data[0][0][signal[i][1]];
              }

              // Сигнал ПС
              if(signal[i][0]== 'DI1001') 
              {
                 SIGNAL_PS = data[0][0][signal[i][1]];
              }

              // Сигнал АС
              if(signal[i][0]== 'DI1003') 
              {
                 SIGNAL_AS = data[0][0][signal[i][1]];
              }

              // Сигнал Н
              if(signal[i][0]== 'DI0002') 
              {
                 SIGNAL_H = data[0][0][signal[i][1]];
              }
              path_down.setAttribute('style','fill:'+ green);
              path_up.setAttribute('style','fill:'+ green);
              //неисправность датчика
              if(SIGNAL_H == true) 
              {
                //зеленый и маджента
                create_element_path_circle(el);
                
              }
              // предупредительный порог снижения
              if(SIGNAL_PS == true ) 
              {
                path_down.setAttribute('style','fill:'+ yellow);
              }
              // Предупредительный порог превышения
              if(SIGNAL_PP == true) 
              {
                path_up.setAttribute('style','fill:'+ yellow);
              }
              // Аварийный порог  снижения
              if(SIGNAL_AS == true) 
              {
                path_down.setAttribute('style','fill:'+ red);
              }
              // Аварийный порог превышения
              if(SIGNAL_AP == true) 
              {
                path_up.setAttribute('style','fill:'+ red);
              }
            }
      }
      else
      {
         //данных нет - вывод буквы датчика
          path_down.style.display = 'none';
          path_up.style.display = 'none';
      }
  }
 else 
 {
    //если ни один сигнал не задан, то просто вывод буквы датчика
    path_down.style.display = 'none';
    path_up.style.display = 'none';
 }
}


  // функция для получения имени таблицы по имени сигнала или логического выражения
   function get_table(signal) 
   { 
      var res =''; 
      var table =''; 
      var dog = ''; 
    
      for(i=0; i<signal.length ;i++) 
      {
        if(signal[i] == '@')
        {
           dog = i;
        }
         if(signal[i] == '_') 
         {
           if(dog.length != 0 ) 
           {
            table = signal.slice(dog+1,i);
           }
           else 
           {
            table = signal.slice(0,i);
           }
            
         }
      }
      return table;
   }

//функция для формирования массива таблиц
function GetAllTables() 
{
   all_tables = [];
   // находим все мнемознаки
   var all_tags_g = document.getElementsByTagName('g');
   for (var i=0; i < all_tags_g.length; i++) 
   {
    var g_element = all_tags_g[i];
    var g_widget = g_element.getAttribute('widget');
    //если есть виджет 
    if(g_widget)
      {
            var table =  get_signals_or_nsstringconsts(g_element);
            if(table != '') 
            {
               if(all_tables.length != 0) 
               {
                  //проверяем, чтобы названия таблиц были уникальными, без повторов
                  for(t=0; t < all_tables.length; t++) 
                  {
                     if(all_tables[t] != table) 
                     {
                        if(t == all_tables.length -1) 
                        {
                           all_tables.push(table);
                        }
                     }
                  }
               } 
               else 
               {
               all_tables.push(table);
               }
            }
         }
   }
   return all_tables;
  
}


  //функция для нахождения сигнала или логического выражения для которого задан аттрибут имя
function get_signals_or_nsstringconsts(el) 
{ 
   var table = '';
   //получаем сигналы
   var all_signal = el.getElementsByTagName('signal');
   if(all_signal.length > 0) 
   {
      for(s=0; s < all_signal.length; s++)
      {
         var name = all_signal[s].getAttribute('name');
         if(name != '') 
         {
            table = get_table(all_signal[s].getAttribute('name'));
            break;
         }
      }
   }
   else 
   {
      var all_nsstringconst = el.getElementsByTagName

('nsstringconst');
      if(all_nsstringconst.length > 0) 
      {
         for(n=0; n < all_nsstringconst.length; n++)
         {
            var name = all_nsstringconst[n].getAttribute('name');
            if(name != '') 
            {
               table = get_table(all_nsstringconst

[n].getAttribute('name'));
               break;
            }
            
         }
      }
   }
   return table;
}

//глобальная функция для отрисовки мнемознаков
   function Visualization_MnemoSymbol(data) 
   {
      //все элементы g
      var tags_g = document.getElementsByTagName('g');
      for (var i=0; i < tags_g.length; i++) 
      {
          var g_element = tags_g[i];
          var g_widget = g_element.getAttribute('widget');
          //если есть виджет 
          if(g_widget)
           {
                  search_signals(g_element, data);
           }
       }
   }

     //функция замены символов в строке
  function replace_string (str,search, replacement)
  {
    var res = str.split(search).join(replacement);
    return res;
  }
  //общение по сокету 
  var max_socket_reconnects = 6;
   socket.on('connect', () => 
   {
    socket.send(all_tb);
    status_text[0].innerHTML = 'связь с сервером АСРК установлена' ;
    status_text[0].setAttribute('style', 'background-color: #DCDCDC; margin-left: 5%');

       socket.on('message', (arr_res) => 
      {
         var data = JSON.parse(arr_res);
         console.log(data);
         if (all_tb.length == data.length ) {
           
         Visualization_MnemoSymbol(data);
         filling_table(data);
         }
       else {socket.send(all_tb); }

      })
    socket.on('disconnect', () => {
    status_text[0].setAttribute('style', 'background-color: #ff0000');
    status_text[0].innerHTML = 'связь с сервером АСРК потеряна!';
    // alert('Сервер АСРК недоступен!');
     });

    
    socket.on("reconnecting", function(delay, attempt) {
    if (attempt === max_socket_reconnects) {
      setTimeout(function(){ socket.socket.reconnect(); }, 5000);
      return console.log("Failed to reconnect. Lets try that again in 5 seconds.");
    }
  });
   });
 

   

   // при восстановлении разорванного соединения создает новый ??

   socket.on('reconnecting', () => {
    //window.onload(); 
     // socket.send(all_tb);
     alert('g');
      });

  //находим данные для каждого мнемознака из всего массива данных
   function Research_Data (data, table) 
   {
    var data_table;
    response = [];
   if(data.length > 0) {
   for(i=0; i< data.length; i++) 
   {
    if(data[i].length > 0){
      //это события
      if(data[i].length == 10){ 
        if(table == 'events'){
          response.push(data[i]);
        }
      }
      else {
      //console.log()
    data_table = JSON.stringify(data[i]).split(',')[1].split('"')[1].slice(0, JSON.stringify(data[i]).split(',')[1].split('"')[1].length -5 );
    
     if(table == data_table) 
     {
        response.push(data[i]);
     }
    }
   }
 }
}
   if(response.length >0) 
    {
       return response;
    }
    else 
    {
       return '';
    }
   }

   //функция замены подстроки 
  function replace_logic(str)
  {
    let result_string = replace_string(str, ' ', '');
        result_string = replace_string(result_string, '  ', '');
        result_string = replace_string(result_string, '&&', ' & ');
        result_string = replace_string(result_string, '==', ' == ');
        result_string = replace_string(result_string, '(', ' ( ');
        result_string = replace_string(result_string, ')', ' ) ');
        result_string = replace_string(result_string, '!', ' ! ');
        result_string = replace_string(result_string, '*', ' * ');
        result_string = replace_string(result_string, '+', ' + ');
        //result_string = replace_string(result_string, '-', ' - ');
        result_string = replace_string(result_string, '/', ' / ');
        result_string = replace_string(result_string, '||', ' || ');
        result_string = replace_string(result_string, '  ', ' ');
        result_string = replace_string(result_string, '"', '');
        //если первый  и последний символ пробел удаляем
        if(result_string[0] == ' ') 
        {
            result_string = result_string.slice(1,result_string.length);
        }
        if(result_string[result_string.length -1 ] == ' ') 
        {
          result_string = result_string.slice(0,result_string.length-1);
        }
        let res_split = result_string.split(' ');
       
    
        return res_split;
  }
 

//функция для подсчета выражения
function calculate_expression (nsstringconst, data) 
{
   var res = replace_logic(nsstringconst[1]);
   let str = '';
   var arr = [];
   var res_split = '';
   res.forEach(function(r) {
      if(r == ' ') 
      {
          res_split = res.split(' ');
         
      }
      else 
      {
          res_split = res;
      }
   })
   
   //для каждого элемента строки
   res_split.forEach(function(t) 
   {
    if(t[0]== '@') {
        var signal = t.slice(1, t.length);
        var resp = data[signal];
        if(resp != undefined) 
        {
          str = str + resp;
        }
        else 
        {
         str = str + false;
        }
      }
      else
      {
         str = str + t;
      }
   });
   try 
   {
      res_eval = eval(str);
      arr = [nsstringconst[0],eval(str)];
   }
   catch (e) 
   {    
      if (e instanceof SyntaxError) {        
      //alert(el.id + ':' + e.message);  
      arr = [nsstringconst[0],0];  
      }
   }

return arr;
}

//левая нижняя четверть круга для libM_RM_MEASURING_CHANNEL_02_CVFTA
function create_element_path(el) {
   var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
   path.setAttribute('inkscape:connector-curvature', "0");
   path.setAttribute('style', "fill:#ff00ff;fill-opacity:0.90944877999999996;stroke:#9a9a9a;stroke-width:0.06313454000000000;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none");
   path.setAttribute('d', "m 18.000401,25.5 0,-7.500001 -7.499999,0 -7.4999995,0 0.08727,1.123722 c 0.40393,5.20142 3.91934,10.133038 8.8287355,12.385454 1.373408,0.630116 3.281914,1.174125 4.484854,1.278387 0.526954,0.04567 1.102333,0.112155 1.278621,0.14774 l 0.320518,0.0647 0,-7.500001 z");
   path.id = "12345";
   el.appendChild(path);
 }

 //добавлние контролируемого параметра в мнемознак для libM_RM_MEASURING_CHANNEL_02_CVFTA
function create_element_params (el, content) {
   var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
   var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
   text.setAttribute('style', 'font-size:38px;font-style:normal;font-weight:normal;line-height:125%;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none');
   text.setAttribute('x', "11");
   text.setAttribute('y','28');
   text.setAttribute('sodipodi:linespacing',"125%");
   text.id = 'contr_param';
   tspan.setAttribute('sodipodi:role', 'line');
   tspan.setAttribute('x', "11");
   if(content== '∑')
   {
     tspan.setAttribute('y','23');
     tspan.setAttribute('style','font-size:21px');
   }
   else
   {
     if(content.length >1) 
     {
       tspan.setAttribute('x', "8");
       tspan.setAttribute('style','font-size:22px');
     }
     tspan.setAttribute('y','25.5');
     tspan.setAttribute('style','font-size:22px');
   }
   
   tspan.innerHTML = content;
   text.appendChild(tspan);
   el.appendChild(text);
 }

 //добавлние вида ионизирующего излучения в мнемознак для libM_RM_MEASURING_CHANNEL_02_CVFTA
function create_element_rad (el, content) {
   var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
   var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
   text.setAttribute('style', 'font-size:12px;font-style:normal;font-weight:normal;line-height:125%;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none');
   text.setAttribute('x', "25.5");
   text.setAttribute('y','32');
   text.setAttribute('sodipodi:linespacing',"125%");
   text.id = 'rad_param';
   tspan.setAttribute('sodipodi:role', 'line');
   tspan.setAttribute('x', "25.5");
   tspan.setAttribute('y','32');
   tspan.setAttribute('style','font-size:12px');
   tspan.innerHTML = content;
   text.appendChild(tspan);
   el.appendChild(text);
 
 }

 //перевод из шеснадцетиричной в десятичную
 function DecToHex (x,base)
 {
   mass_hex = [];
   //делим строку на R G B A
   x = x.split(' ');
   //для каждого элементы
   x.forEach(function(t) {
      const parsed = parseInt(t, base);
      if(isNaN(parsed)) {mass_hex.push('0');}
      //для получения ответа от 0 до 1
      const result = (parsed/256)/256;
      mass_hex.push(result);
      
   });
   return mass_hex;
   
 }

 //поиск шрифтов для мнемознака libU_VALUE_COLOR_01_CVT
 function search_nsfont (el) 
 {
   var nsfont_name = []; 
   let font ='';
   let size = '';

   var nsfont = el.getElementsByTagName('nsfont');
   if(nsfont.length > 0 ) 
      {
        //пробегаемся по всем шрифтам
        for(s=0;s<nsfont.length; s++)
        {
          //получаем атрибут и имя
           var s_name = nsfont[s].getAttribute("name");
           var s_templatename = nsfont[s].getAttribute('templatename');
           //если есть такой атрибут
           if(s_name) 
           {
             //если аттрибут не пустой, записываем имя шрифта
             if(s_name != '')
             {
                //var font = [s_templatename, s_name];
                //nsfont_name.push(font);
                //разделим имя шрифта и его размер
                for(i=0; i< s_name.length; i++) 
                {
                  //если это шрифт
                  if(s_name[i] == '1' || s_name[i] == '2' || s_name[i] == '3' || s_name[i] == '4'||
                     s_name[i] == '5' || s_name[i] == '6' || s_name[i] == '7' || s_name[i] == '8'||
                     s_name[i] == '9' || s_name == '0') 
                  {
                    font = s_name.slice(0,i-1);
                    size = s_name.slice(i-1, s_name.length);
                    
                  }
                }
               var rr = [s_templatename, font, size];
               nsfont_name.push(rr);
             }
           }  
         }
       }
       return nsfont_name;
 }

  //поиск цветов для мнемознака libU_VALUE_COLOR_01_CVT
  function search_nscolor (el) 
  {
    var nscolor_name = []; 
   //получаем все элементы
    var nscolor = el.getElementsByTagName('nscolor');
    if(nscolor.length > 0 ) 
       {
         //пробегаемся по всем цветам
         for(s=0;s<nscolor.length; s++)
         {
           //получаем атрибут и имя
            var s_name = nscolor[s].getAttribute("name");
            var s_templatename = nscolor[s].getAttribute('templatename');
            //если есть такой атрибут
            if(s_name) 
            {
              //если аттрибут не пустой, записываем кодировку цвета
              if(s_name != '')
              {
                 var rgba = DecToHex(s_name,16);
                 var color = [s_templatename, rgba];
                 nscolor_name.push(color);
              }
            }  
          }
        }

        return nscolor_name;
  }

  function filling_table(data) 
  {
    
    var data = Research_Data(data, 'events');
    var table_evens = document.getElementsByClassName('events');
    var table_error = document.getElementsByClassName('errors');
    table_evens[0].innerHTML =' ';
    table_error[0].innerHTML = ' ';
    for (i = 0; i < data[0].length; i++) 
    {
        var tr = document.createElement('tr');
        var tr2 = document.createElement('tr');
        tr.id = 'events_row';
        for (key in data[0][i]) 
        {
          if(key != 'msg_type') 
            {
                var td = document.createElement('td');
                if(key == 'datetime') {
                  var datetime = replace_string(data[0][i][key], 'T', ' ');
                  td.innerHTML = datetime.slice(0,datetime.length-5);}
                else {td.innerHTML = data[0][i][key];}
                td.id = key;
                tr.appendChild(td);
            }
        }
        var type_message = data[0][i]['msg_type'];
        //цвета в зависимости от типа события
        switch(type_message){
            case 0: tr.setAttribute('style', 'background-color: #ffffff'); break;
            case 1: tr.setAttribute('style', 'background-color: #ffff00'); break;
            case 2: tr.setAttribute('style', 'background-color: #ff0000'); break;
            case 3: tr.setAttribute('style', 'background-color: #ff00ff'); break;
            case 4: tr.setAttribute('style', 'background-color: #96A1C8'); break;
            case 5: tr.setAttribute('style', 'background-color: #999999'); break;
            default: tr.setAttribute('style', 'background-color: #ffffff'); break;
        }
        if(type_message > 100) tr.setAttribute('style', 'background-color: #00ff00');

         tr2.innerHTML = tr.innerHTML;
         var style_t1 = tr.getAttribute('style');
         tr2.setAttribute('style', style_t1);
         table_evens[0].appendChild(tr);
        
        if(type_message > 0 && type_message < 4) 
        {
           table_error[0].appendChild(tr2);
        }
      }
  }
  function websocket_state() {
    console.log(socket.connected);
  }
