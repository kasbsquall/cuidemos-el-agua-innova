/* ============================================
   RESULTADOS DE LA ENCUESTA
   Guarda las respuestas (compartidas con JSONBin o, si no está
   configurado, en el navegador) y dibuja las gráficas y la tabla.
   ============================================ */

// Definición de las 9 preguntas con respuestas (las que generan gráfica)
var PREGUNTAS_ENCUESTA = [
  { name: 'p1', texto: '¿Cierras el caño después de lavarte las manos?', opciones: ['Siempre', 'A veces', 'Nunca'] },
  { name: 'p2', texto: '¿Has visto algún caño goteando o con fugas?', opciones: ['Sí', 'No'] },
  { name: 'p3', texto: '¿Dejas correr el agua mientras te enjabonas?', opciones: ['Siempre', 'A veces', 'Nunca'] },
  { name: 'p4', texto: '¿El agua es importante para mantener limpia la escuela?', opciones: ['Sí', 'No'] },
  { name: 'p5', texto: '¿Conoces alguna forma de ahorrar agua en la escuela?', opciones: ['Sí', 'No'] },
  { name: 'p6', texto: 'Si alguien desperdicia agua, ¿qué haces?', opciones: ['Le recuerdo que debe cuidarla', 'Aviso a un profesor', 'No hago nada'] },
  { name: 'p7', texto: '¿Participarías en actividades para cuidar el agua?', opciones: ['Sí', 'Tal vez', 'No'] },
  { name: 'p8', texto: '¿Se usa el agua de manera responsable en la escuela?', opciones: ['Sí', 'A veces', 'No'] },
  { name: 'p9', texto: '¿Te gustaría aprender más con videos y actividades?', opciones: ['Sí', 'No'] }
];

var LS_KEY = 'encuesta_agua_resultados';
var JSONBIN_URL = 'https://api.jsonbin.io/v3/b/';

// Estructura base vacía
function estructuraVacia() {
  var base = { total: 0, respuestas: {} };
  PREGUNTAS_ENCUESTA.forEach(function (p) {
    base.respuestas[p.name] = {};
    p.opciones.forEach(function (op) { base.respuestas[p.name][op] = 0; });
  });
  return base;
}

function usaJsonbin() {
  return typeof CONFIG_ENCUESTA !== 'undefined' &&
    CONFIG_ENCUESTA.ACTIVO === true &&
    CONFIG_ENCUESTA.BIN_ID && CONFIG_ENCUESTA.BIN_ID.indexOf('PEGA_AQUI') === -1;
}

// ---------- LECTURA ----------
function cargarResultados() {
  if (usaJsonbin()) {
    return fetch(JSONBIN_URL + CONFIG_ENCUESTA.BIN_ID + '/latest', {
      headers: { 'X-Master-Key': CONFIG_ENCUESTA.MASTER_KEY }
    })
      .then(function (r) {
        if (!r.ok) throw new Error('No se pudo leer');
        return r.json();
      })
      .then(function (data) { return normalizar(data.record); });
  }
  // Fallback: navegador
  return new Promise(function (resolve) {
    try {
      var guardado = JSON.parse(localStorage.getItem(LS_KEY));
      resolve(normalizar(guardado));
    } catch (e) {
      resolve(estructuraVacia());
    }
  });
}

// Asegura que el objeto tenga todas las preguntas y opciones
function normalizar(data) {
  var base = estructuraVacia();
  if (!data || typeof data !== 'object') return base;
  base.total = data.total || 0;
  if (data.respuestas) {
    PREGUNTAS_ENCUESTA.forEach(function (p) {
      var guardada = data.respuestas[p.name] || {};
      p.opciones.forEach(function (op) {
        base.respuestas[p.name][op] = guardada[op] || 0;
      });
    });
  }
  return base;
}

// ---------- GUARDADO ----------
function guardarRespuesta(respuestas) {
  return cargarResultados().then(function (data) {
    data.total = (data.total || 0) + 1;
    PREGUNTAS_ENCUESTA.forEach(function (p) {
      var elegida = respuestas[p.name];
      if (elegida && data.respuestas[p.name][elegida] !== undefined) {
        data.respuestas[p.name][elegida]++;
      }
    });

    if (usaJsonbin()) {
      return fetch(JSONBIN_URL + CONFIG_ENCUESTA.BIN_ID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': CONFIG_ENCUESTA.MASTER_KEY
        },
        body: JSON.stringify(data)
      }).then(function () { return data; });
    }

    localStorage.setItem(LS_KEY, JSON.stringify(data));
    return data;
  });
}

// ---------- DIBUJAR GRÁFICAS (final de la encuesta) ----------
function dibujarGraficas(data, contenedor) {
  var html = '';
  PREGUNTAS_ENCUESTA.forEach(function (p) {
    var conteo = data.respuestas[p.name];
    var totalPreg = 0;
    p.opciones.forEach(function (op) { totalPreg += conteo[op]; });

    html += '<div class="resultado-pregunta">';
    html += '<h4>' + p.texto + '</h4>';
    p.opciones.forEach(function (op) {
      var n = conteo[op];
      var pct = totalPreg > 0 ? Math.round((n / totalPreg) * 100) : 0;
      html += '<div class="barra-resultado-fila">';
      html += '<span class="barra-resultado-label">' + op + '</span>';
      html += '<div class="barra-resultado-pista">';
      html += '<div class="barra-resultado-relleno" style="width:' + pct + '%">' + (pct >= 12 ? pct + '%' : '') + '</div>';
      html += '</div>';
      html += '<span class="barra-resultado-num">' + (pct < 12 ? pct + '%' : '') + '</span>';
      html += '</div>';
    });
    html += '</div>';
  });
  contenedor.innerHTML = html;
}

// ---------- DIBUJAR TABLA (home) ----------
function dibujarTablaHome(data, contenedor) {
  if (!data.total) {
    contenedor.innerHTML = '<p class="resultados-vacio">Todavía no hay respuestas. ' +
      '¡Sé el primero en completar la <strong>Encuesta</strong>! 💧</p>';
    return;
  }

  var html = '';
  html += '<p class="resultados-total-home">Total de respuestas: <strong>' + data.total + '</strong></p>';
  html += '<div class="tabla-resultados-scroll"><table class="tabla-resultados">';
  html += '<thead><tr><th>Pregunta</th><th>Respuesta más elegida</th><th>%</th></tr></thead><tbody>';

  PREGUNTAS_ENCUESTA.forEach(function (p) {
    var conteo = data.respuestas[p.name];
    var totalPreg = 0, mejorOp = '-', mejorN = -1;
    p.opciones.forEach(function (op) {
      totalPreg += conteo[op];
      if (conteo[op] > mejorN) { mejorN = conteo[op]; mejorOp = op; }
    });
    var pct = totalPreg > 0 ? Math.round((mejorN / totalPreg) * 100) : 0;
    html += '<tr><td>' + p.texto + '</td><td><strong>' + mejorOp + '</strong></td><td>' + pct + '%</td></tr>';
  });

  html += '</tbody></table></div>';
  contenedor.innerHTML = html;
}

// Cargar la tabla del home al iniciar
function inicializarTablaHome() {
  var contenedor = document.getElementById('resultados-home');
  if (!contenedor) return;
  cargarResultados()
    .then(function (data) { dibujarTablaHome(data, contenedor); })
    .catch(function () {
      contenedor.innerHTML = '<p class="resultados-vacio">No se pudieron cargar los resultados ahora. 💧</p>';
    });
}

document.addEventListener('DOMContentLoaded', inicializarTablaHome);
