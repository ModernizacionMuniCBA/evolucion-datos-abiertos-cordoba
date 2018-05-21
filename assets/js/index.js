

$(document).ready(function() {

  var spinner;
  function startSpinner(elementId) {
      var opts = {
          lines: 9, // The number of lines to draw
          length: 9, // The length of each line
          width: 5, // The line thickness
          radius: 14, // The radius of the inner circle
          color: '#00a650', // #rgb or #rrggbb or array of colors
          speed: 1.9, // Rounds per second
          trail: 40, // Afterglow percentage
          className: 'spinner' // The CSS class to assign to the spinner
      };
      var target = document.getElementById(elementId);
      spinner = new Spinner(opts).spin(target);
  }

  function stopSpinner(elementId) {
      spinner.stop();
      $('#'+elementId).hide();
  }

  startSpinner("chartCont");

  function compareDates(a,b) {
    var key_a;
    var key_b;
    $.each( a, function( key, dato ) {
      key_a = key;
    });
    $.each( b, function( key, dato ) {
      key_b = key;
    });

    if (key_a < key_b)
      return -1;
    if (key_a > key_b)
      return 1;
    return 0;
  }

  function sortMapByKey(map) {
    map = map.sort(compareDates);
    return map;
  }

  window.chartColors = {
  strong_red: 'rgba(255,0,0,0.5)',
	red: 'rgba(255, 99, 132,0.5)',
	orange: 'rgba(255, 159, 64,0.5)',
  strong_orange: 'rgba(255,88,26,0.5)',
	yellow: 'rgba(255, 205, 86,0.5)',
	green_blue: 'rgba(75, 192, 192,0.5)',
  green: 'rgb(86,255,121)',
	blue: 'rgba(54, 162, 235,0.5)',
	purple: 'rgba(153, 102, 255,0.5)',
  light_blue: 'rgba(86,221,255,0.5)',
  aqua: 'rgba(86,255,205,0.5)',
  red_solid: 'rgb(255, 99, 132)',
  strong_red_solid: 'rgb(255,0,0)',
	orange_solid: 'rgb(255, 159, 64)',
  strong_orange_solid: 'rgb(255,88,26)',
	yellow_solid: 'rgb(255, 205, 86)',
	green_blue_solid: 'rgb(75, 192, 192)',
  green_solid: 'rgb(10,255,60)',
	blue_solid: 'rgb(54, 162, 235)',
	purple_solid: 'rgb(153, 102, 255)',
  light_blue_solid: 'rgb(86,221,255)',
  aqua_solid: 'rgb(86,255,205)',
  red_solid_dark: 'rgb(202,0,43)',
  strong_red_solid_dark: 'rgb(179,0,0)',
	orange_solid_dark: 'rgb(243,121,0)',
  strong_orange_solid_dark: 'rgb(205,55,0)',
	yellow_solid_dark: 'rgb(240,168,0)',
	green_blue_solid_dark: 'rgb(49,141,141)',
  green_solid_dark: 'rgb(0,214,44)',
	blue_solid_dark: 'rgb(19,123,193)',
	purple_solid_dark: 'rgb(102,26,255)',
  light_blue_solid_dark: 'rgb(10,206,255)',
  aqua_solid_dark: 'rgb(0,214,150)',
  };

var colors = [[window.chartColors.red, window.chartColors.red_solid, window.chartColors.red_solid],
              [window.chartColors.orange, window.chartColors.orange_solid, window.chartColors.orange_solid_dark],
              [window.chartColors.yellow, window.chartColors.yellow_solid, window.chartColors.yellow_solid_dark],
              [window.chartColors.green, window.chartColors.green_solid, window.chartColors.green_solid_dark],
              [window.chartColors.blue, window.chartColors.blue_solid, window.chartColors.blue_solid_dark],
              [window.chartColors.purple, window.chartColors.purple_solid, window.chartColors.purple_solid_dark],
              [window.chartColors.light_blue, window.chartColors.light_blue_solid, window.chartColors.light_blue_solid_dark],
              [window.chartColors.aqua, window.chartColors.aqua_solid, window.chartColors.aqua_solid_dark],
              [window.chartColors.green_blue, window.chartColors.green_blue_solid, window.chartColors.green_blue_solid_dark],
              [window.chartColors.strong_red, window.chartColors.strong_red_solid, window.chartColors.strong_red_solid_dark],
              [window.chartColors.strong_orange, window.chartColors.strong_orange_solid, window.chartColors.strong_orange_solid_dark]
            ]
var today = new Date().toLocaleDateString();
var catDatos;

if (localStorage.graphDatosCatData == null || localStorage.graphDatosCatData == "null" || localStorage.graphDatosCatData == "undefined" || localStorage.userDate != today ) {
  $.getJSON("https://gobiernoabierto.cordoba.gob.ar/api/categorias-datos-abiertos/?page_size=100", function(dataJSON) {
    var catDatosAux = dataJSON.results;
    localStorage.graphDatosCatData = JSON.stringify(catDatosAux);
    catDatos = generateMap(catDatosAux);
    getData();
  });
} else {
    catDatosAux = JSON.parse(localStorage.graphDatosCatData);
    catDatos = generateMap(catDatosAux);
    getData();
}

function getData(){
  if (localStorage.graphDatosData == null || localStorage.graphDatosData == "null" || localStorage.graphDatosData == "undefined" || localStorage.userDate != today ) {
    $.getJSON("https://gobiernoabierto.cordoba.gob.ar/api/datos-abiertos/?page_size=600", function(dataJSON) {
      var datos = dataJSON.results;
      localStorage.graphDatosData = JSON.stringify(datos);
      graph(datos);
    });
  } else {
      var datos = JSON.parse(localStorage.graphDatosData);
      graph(datos);
  }
}

function generateMap(array){
  var aux = [];
  var final = [];
  $.each( array, function( key, item ) {
      aux[item.nombre] = item.depende_de;
  });
  $.each( array, function( key, item ) {
      var depende = item.depende_de;
      while(aux[depende]!=null){
        depende = aux[depende];
      }
      aux[item.nombre] = depende;
      var itemAux = {};
      itemAux["nombre"] = item.nombre;
      itemAux["depende"] = depende;
      final.push(itemAux);
  });
  return final;
}
localStorage.userDate = today;



function getDatoCat(array, query){
  var returnValue = null;
  $.each( array, function( key, categoria ) {
    if(categoria.nombre == query){
      returnValue = (categoria.depende != null? categoria.depende : categoria.nombre);
      return false;
    }
  });
  return returnValue;
}
function graph(datos){
  // var datosxMesxCat = {};

  var datosxCatxMes = {};
  $.each( catDatos, function( key, categoria ) {
    if(categoria.depende == null){
        datosxCatxMes[categoria.nombre] = [];
    }else{}
  });


  $.each( datos, function( key, dato ) {
    var datosxMes = {};
    if(dato.categoria.depende_de!=null){
      dato.categoria = getDatoCat(catDatos, dato.categoria.depende_de);
    }else{
      dato.categoria = dato.categoria.nombre;
    }

    var dates = [];
    $.each( dato.versiones, function( key, version ) {
      dates.push(new Date(version.fecha));
    });
    var minDatoDate = new Date(Math.min.apply(null,dates));

    if(datosxMes[moment(minDatoDate).format('YYYY-MM')]){
      datosxMes[moment(minDatoDate).format('YYYY-MM')] += 1;
    }else{
      datosxMes[moment(minDatoDate).format('YYYY-MM')] = 1;
    }

    datosxCatxMes[dato.categoria].push(datosxMes);

  });

  var dates=[];
  $.each( datosxCatxMes, function( key, cat ) {
    $.each( cat, function( key, dato ) {
      $.each( dato, function( key, value ) {
        if (dates.indexOf(key)==-1) dates.push(key);
      });
    });
  });

  dates.sort();

  var totMonthly=0;


  $.each( datosxCatxMes, function( key, datosxCat ) {
    datosxCatxMes[key] = sortMapByKey(datosxCat);
  });

  var datasetsCat = [];

  var usedColors=0;
  $.each( datosxCatxMes, function( key, cat ) {
    var totMonthly=0;
    var dataset = {};
    var data = [];

    function existsDate(date, arr){
      var exists = 0;
      $.each( arr, function( keyArr, dato ) {
        $.each( dato, function( keyDato, value ) {
          if(date == keyDato){
            exists += value;
            // return false;
          }
        });
      });
      return exists;
    }

    console.log(cat);
    $.each( dates, function( keyDate, date ) {
      var val = existsDate(date, cat);
      if(val != 0){
        totMonthly += val;
        data.push(totMonthly);
      }else{
        data.push(totMonthly);
      }
    });


    dataset["label"] = key;
    dataset["data"]=data;
    dataset["borderColor"] = colors[usedColors][2];
    dataset["backgroundColor"]=colors[usedColors][1];
    usedColors+=1;
    datasetsCat.push(dataset);
  });



console.log(datasetsCat);
console.log(dates);



  var ctx = document.getElementById("chart");
  var config = {
    type: 'line',
    data: {
      labels: dates,
      datasets: datasetsCat
    },
    options: {
      responsive: true,
      title: {
        display: false,
        text: 'Evolución de Datos Abiertos - Córdoba'
      },
      tooltips: {
        mode: 'index',
        callbacks: {
            title: function(tooltipItem, data) {
                return moment(tooltipItem[0].xLabel).format('MMM YYYY');
            }
        }
      },
      hover: {
        mode: 'index'
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
              unit: 'month',
              min:'2016/01'
           },
           distribution: 'series',
           scaleLabel: {
             display: true,
             labelString: 'Año',
             fontSize: '16'
           },
           ticks: {
             source: 'labels'
           }
        }],
        yAxes: [{
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'Cantidad',
            fontSize: '16'
          },
          ticks: {
            suggestedMax: 500,
          }
        }]
      }
    }
  };

  moment.locale('es');

  var colorNames = Object.keys(window.chartColors);
  stopSpinner('chartCont');
  // var myChart = new Chart(ctx, config);
  window.myChart = new Chart(ctx, config);
}


});

//ANALYTICS
var uuid_analytics = "UA-79840006-1";

(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', uuid_analytics, 'auto');

window.touchAnalytics = function(page, title) {
  ga('send', 'pageview', {
    'page': page,
    'title': title
  });
};
