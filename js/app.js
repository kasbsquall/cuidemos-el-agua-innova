/* ============================================
   CUIDEMOS EL AGUA - JavaScript Principal
   Código sencillo para proyecto escolar
   ============================================ */

// ========== NAVEGACIÓN ==========

// Obtener elementos del menú
var menuToggle = document.getElementById('menu-toggle');
var navLinks = document.getElementById('nav-links');
var todosLosLinks = document.querySelectorAll('.nav-link');
var logoHome = document.getElementById('logo-home');

// Abrir/cerrar menú en móvil
menuToggle.addEventListener('click', function() {
  navLinks.classList.toggle('abierto');
});

// Cambiar de página al hacer clic en el menú
todosLosLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var pagina = this.getAttribute('data-page');
    cambiarPagina(pagina);
    // Cerrar menú móvil
    navLinks.classList.remove('abierto');
  });
});

// Logo lleva al inicio
logoHome.addEventListener('click', function(e) {
  e.preventDefault();
  cambiarPagina('inicio');
});

// Función para cambiar de página
function cambiarPagina(nombrePagina) {
  // Ocultar todas las páginas
  var paginas = document.querySelectorAll('.pagina');
  paginas.forEach(function(p) {
    p.classList.remove('activa');
  });

  // Mostrar la página seleccionada
  var paginaActiva = document.getElementById('pagina-' + nombrePagina);
  if (paginaActiva) {
    paginaActiva.classList.add('activa');
  }

  // Actualizar el link activo
  todosLosLinks.forEach(function(link) {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === nombrePagina) {
      link.classList.add('active');
    }
  });

  // Ir al inicio de la página
  window.scrollTo(0, 0);

  // Si es la página de juegos, cargar el juego activo
  if (nombrePagina === 'juegos') {
    cargarJuego('trivia');
  }

  // Animar las entradas
  setTimeout(function() {
    animarEntradas();
  }, 100);
}


// ========== ANIMACIONES DE ENTRADA ==========

function animarEntradas() {
  var elementos = document.querySelectorAll('.animar-entrada');
  
  var observador = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  elementos.forEach(function(el) {
    observador.observe(el);
  });
}

// Iniciar animaciones al cargar
animarEntradas();


// ========== GRÁFICO DE BARRAS ANIMADO ==========

function animarBarras() {
  var barras = document.querySelectorAll('.barra');
  barras.forEach(function(barra) {
    var altura = barra.getAttribute('data-altura');
    barra.style.height = altura;
  });
}

// Observar el gráfico para animar cuando sea visible
var grafico = document.getElementById('grafico-barras');
if (grafico) {
  var observadorGrafico = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        setTimeout(animarBarras, 300);
      }
    });
  }, { threshold: 0.3 });
  observadorGrafico.observe(grafico);
}


// ========== ENCUESTA ==========

// Resaltar opción seleccionada
var opciones = document.querySelectorAll('.opcion');
opciones.forEach(function(opcion) {
  opcion.addEventListener('click', function() {
    // Encontrar el radio dentro de esta opción
    var radio = this.querySelector('input[type="radio"]');
    if (radio) {
      radio.checked = true;
      // Quitar clase de otras opciones del mismo grupo
      var nombre = radio.getAttribute('name');
      var grupo = document.querySelectorAll('input[name="' + nombre + '"]');
      grupo.forEach(function(r) {
        r.closest('.opcion').classList.remove('seleccionada');
      });
      this.classList.add('seleccionada');
    }
  });
});

// Enviar encuesta
var formEncuesta = document.getElementById('form-encuesta');
if (formEncuesta) {
  formEncuesta.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Verificar que todas las preguntas estén respondidas
    var preguntas = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'];
    var todasRespondidas = true;
    
    preguntas.forEach(function(p) {
      var respuesta = document.querySelector('input[name="' + p + '"]:checked');
      if (!respuesta) {
        todasRespondidas = false;
      }
    });

    if (!todasRespondidas) {
      alert('💧 ¡Por favor responde todas las preguntas antes de enviar!');
      return;
    }

    // Mostrar modal de éxito
    document.getElementById('modal-exito').classList.add('visible');
  });
}

// Cerrar modal
var btnCerrarModal = document.getElementById('btn-cerrar-modal');
if (btnCerrarModal) {
  btnCerrarModal.addEventListener('click', function() {
    document.getElementById('modal-exito').classList.remove('visible');
    formEncuesta.reset();
    // Quitar clases seleccionada
    document.querySelectorAll('.opcion.seleccionada').forEach(function(op) {
      op.classList.remove('seleccionada');
    });
  });
}


// ========== JUEGOS ==========

// Botones de selección de juego
var botonesJuego = document.querySelectorAll('.juego-btn');
botonesJuego.forEach(function(btn) {
  btn.addEventListener('click', function() {
    var juego = this.getAttribute('data-juego');
    // Actualizar botón activo
    botonesJuego.forEach(function(b) { b.classList.remove('activo'); });
    this.classList.add('activo');
    cargarJuego(juego);
  });
});

function cargarJuego(tipo) {
  var area = document.getElementById('juego-area');
  
  if (tipo === 'trivia') {
    iniciarTrivia(area);
  } else if (tipo === 'sopa') {
    iniciarSopaDeLetras(area);
  } else if (tipo === 'ordenar') {
    iniciarOrdenar(area);
  } else if (tipo === 'memoria') {
    iniciarMemoria(area);
  }
}


// ========== JUEGO: TRIVIA ==========

var preguntasTrivia = [
  {
    pregunta: '¿Qué porcentaje del agua del planeta es salada?',
    opciones: ['50%', '97%', '75%', '30%'],
    correcta: 1
  },
  {
    pregunta: '¿Cuántos estados tiene el agua?',
    opciones: ['2 estados', '4 estados', '3 estados', '5 estados'],
    correcta: 2
  },
  {
    pregunta: '¿Qué día se celebra el Día Mundial del Agua?',
    opciones: ['1 de enero', '22 de marzo', '15 de junio', '10 de diciembre'],
    correcta: 1
  },
  {
    pregunta: '¿Qué debes hacer si ves un caño goteando en la escuela?',
    opciones: ['Ignorarlo', 'Jugar con el agua', 'Avisar a un profesor', 'Dejarlo así'],
    correcta: 2
  },
  {
    pregunta: '¿Cuál es el estado sólido del agua?',
    opciones: ['Lluvia', 'Vapor', 'Hielo', 'Nube'],
    correcta: 2
  },
  {
    pregunta: '¿Qué porcentaje del agua dulce está congelada en glaciares?',
    opciones: ['10%', '30%', '50%', '70%'],
    correcta: 3
  },
  {
    pregunta: '¿Qué debes hacer mientras te enjabonas las manos?',
    opciones: ['Dejar el caño abierto', 'Cerrar el caño', 'Usar más agua', 'Salpicar agua'],
    correcta: 1
  },
  {
    pregunta: '¿Cómo se llama el proceso cuando el agua se convierte en vapor?',
    opciones: ['Condensación', 'Precipitación', 'Evaporación', 'Recolección'],
    correcta: 2
  },
  {
    pregunta: '¿Dónde debes tirar los residuos?',
    opciones: ['Al inodoro', 'Al desagüe', 'Al piso', 'Al tacho de basura'],
    correcta: 3
  },
  {
    pregunta: '¿Menos de qué porcentaje de agua es accesible para el ser humano?',
    opciones: ['5%', '10%', '1%', '20%'],
    correcta: 2
  }
];

var triviaActual = 0;
var triviaPuntaje = 0;

function iniciarTrivia(area) {
  triviaActual = 0;
  triviaPuntaje = 0;
  mostrarPreguntaTrivia(area);
}

function mostrarPreguntaTrivia(area) {
  if (triviaActual >= preguntasTrivia.length) {
    mostrarResultadoTrivia(area);
    return;
  }

  var p = preguntasTrivia[triviaActual];
  var progreso = ((triviaActual) / preguntasTrivia.length) * 100;

  var html = '';
  html += '<h3>🧠 Trivia del Agua</h3>';
  html += '<p class="juego-instrucciones">Selecciona la respuesta correcta</p>';
  html += '<div class="trivia-score">⭐ Puntaje: ' + triviaPuntaje + '/' + preguntasTrivia.length + '</div>';
  html += '<div class="trivia-progreso"><div class="trivia-progreso-barra" style="width: ' + progreso + '%"></div></div>';
  html += '<div class="trivia-pregunta">';
  html += '<h4>Pregunta ' + (triviaActual + 1) + ' de ' + preguntasTrivia.length + ':</h4>';
  html += '<h4>' + p.pregunta + '</h4>';
  html += '<div class="trivia-opciones">';
  
  p.opciones.forEach(function(opcion, i) {
    html += '<button class="trivia-opcion" data-index="' + i + '">' + opcion + '</button>';
  });

  html += '</div></div>';
  area.innerHTML = html;

  // Añadir eventos a las opciones
  var botones = area.querySelectorAll('.trivia-opcion');
  botones.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var seleccion = parseInt(this.getAttribute('data-index'));
      verificarRespuestaTrivia(seleccion, area, botones);
    });
  });
}

function verificarRespuestaTrivia(seleccion, area, botones) {
  var p = preguntasTrivia[triviaActual];
  
  // Deshabilitar todos los botones
  botones.forEach(function(btn) {
    btn.style.pointerEvents = 'none';
    var idx = parseInt(btn.getAttribute('data-index'));
    if (idx === p.correcta) {
      btn.classList.add('correcta');
    }
  });

  if (seleccion === p.correcta) {
    triviaPuntaje++;
    botones[seleccion].classList.add('correcta');
  } else {
    botones[seleccion].classList.add('incorrecta');
  }

  // Actualizar puntaje
  var scoreEl = area.querySelector('.trivia-score');
  if (scoreEl) {
    scoreEl.textContent = '⭐ Puntaje: ' + triviaPuntaje + '/' + preguntasTrivia.length;
  }

  // Pasar a la siguiente pregunta después de 1.5 segundos
  setTimeout(function() {
    triviaActual++;
    mostrarPreguntaTrivia(area);
  }, 1500);
}

function mostrarResultadoTrivia(area) {
  var porcentaje = Math.round((triviaPuntaje / preguntasTrivia.length) * 100);
  var emoji = '';
  var mensaje = '';

  if (porcentaje >= 80) {
    emoji = '🏆';
    mensaje = '¡Increíble! ¡Eres un experto del agua!';
  } else if (porcentaje >= 60) {
    emoji = '🌟';
    mensaje = '¡Muy bien! Sabes mucho sobre el agua';
  } else if (porcentaje >= 40) {
    emoji = '💪';
    mensaje = '¡Buen intento! Sigue aprendiendo sobre el agua';
  } else {
    emoji = '📚';
    mensaje = '¡No te rindas! Lee el manual y vuelve a intentarlo';
  }

  var html = '';
  html += '<div class="resultado-juego">';
  html += '<span class="emoji-resultado">' + emoji + '</span>';
  html += '<h3>¡Juego Terminado!</h3>';
  html += '<p>' + mensaje + '</p>';
  html += '<div class="trivia-score" style="font-size: 2rem; margin: 20px 0;">⭐ ' + triviaPuntaje + '/' + preguntasTrivia.length + ' (' + porcentaje + '%)</div>';
  html += '<button class="btn-juego" id="btn-reiniciar-trivia">🔄 Jugar de nuevo</button>';
  html += '</div>';

  area.innerHTML = html;

  document.getElementById('btn-reiniciar-trivia').addEventListener('click', function() {
    iniciarTrivia(area);
  });
}


// ========== JUEGO: SOPA DE LETRAS ==========

function iniciarSopaDeLetras(area) {
  var palabras = ['AGUA', 'GOTA', 'RIO', 'LLUVIA', 'VAPOR', 'HIELO', 'CUIDAR', 'GRIFO'];
  var tamaño = 10;
  var grilla = [];
  var letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var palabrasColocadas = [];

  // Crear grilla vacía
  for (var i = 0; i < tamaño; i++) {
    grilla[i] = [];
    for (var j = 0; j < tamaño; j++) {
      grilla[i][j] = '';
    }
  }

  // Colocar palabras
  palabras.forEach(function(palabra) {
    var colocada = false;
    var intentos = 0;
    
    while (!colocada && intentos < 100) {
      intentos++;
      // Dirección: 0=horizontal, 1=vertical
      var dir = Math.floor(Math.random() * 2);
      var fila, col;
      
      if (dir === 0) { // Horizontal
        fila = Math.floor(Math.random() * tamaño);
        col = Math.floor(Math.random() * (tamaño - palabra.length + 1));
      } else { // Vertical
        fila = Math.floor(Math.random() * (tamaño - palabra.length + 1));
        col = Math.floor(Math.random() * tamaño);
      }

      // Verificar si cabe
      var puedeColocar = true;
      for (var k = 0; k < palabra.length; k++) {
        var f = dir === 0 ? fila : fila + k;
        var c = dir === 0 ? col + k : col;
        if (grilla[f][c] !== '' && grilla[f][c] !== palabra[k]) {
          puedeColocar = false;
          break;
        }
      }

      if (puedeColocar) {
        for (var k = 0; k < palabra.length; k++) {
          var f = dir === 0 ? fila : fila + k;
          var c = dir === 0 ? col + k : col;
          grilla[f][c] = palabra[k];
        }
        colocada = true;
        palabrasColocadas.push(palabra);
      }
    }
  });

  // Rellenar espacios vacíos
  for (var i = 0; i < tamaño; i++) {
    for (var j = 0; j < tamaño; j++) {
      if (grilla[i][j] === '') {
        grilla[i][j] = letras[Math.floor(Math.random() * letras.length)];
      }
    }
  }

  // Construir HTML
  var html = '';
  html += '<h3>🔤 Sopa de Letras</h3>';
  html += '<p class="juego-instrucciones">Encuentra las palabras relacionadas con el agua. ¡Haz clic en las letras!</p>';
  html += '<div class="sopa-contenedor">';
  html += '<div class="sopa-grid" style="grid-template-columns: repeat(' + tamaño + ', 1fr);">';
  
  for (var i = 0; i < tamaño; i++) {
    for (var j = 0; j < tamaño; j++) {
      html += '<div class="sopa-celda" data-fila="' + i + '" data-col="' + j + '" data-letra="' + grilla[i][j] + '">' + grilla[i][j] + '</div>';
    }
  }
  
  html += '</div>';
  html += '<div class="sopa-palabras" id="sopa-palabras">';
  
  palabrasColocadas.forEach(function(p) {
    html += '<span class="sopa-palabra" data-palabra="' + p + '">' + p + '</span>';
  });
  
  html += '</div>';
  html += '<p id="sopa-mensaje" style="text-align: center; font-family: Baloo 2; margin-top: 15px; color: #1565C0;"></p>';
  html += '<button class="btn-juego" id="btn-reiniciar-sopa" style="display: none;">🔄 Jugar de nuevo</button>';
  html += '</div>';

  area.innerHTML = html;

  // Lógica de selección de celdas
  var seleccion = [];
  var encontradas = [];
  var celdas = area.querySelectorAll('.sopa-celda');

  celdas.forEach(function(celda) {
    celda.addEventListener('click', function() {
      if (this.classList.contains('encontrada')) return;
      
      this.classList.toggle('seleccionada');
      
      var fila = parseInt(this.getAttribute('data-fila'));
      var col = parseInt(this.getAttribute('data-col'));
      var letra = this.getAttribute('data-letra');
      
      if (this.classList.contains('seleccionada')) {
        seleccion.push({ fila: fila, col: col, letra: letra, elem: this });
      } else {
        seleccion = seleccion.filter(function(s) {
          return !(s.fila === fila && s.col === col);
        });
      }

      // Verificar si la selección forma una palabra
      var textoSeleccion = seleccion.map(function(s) { return s.letra; }).join('');
      
      palabrasColocadas.forEach(function(palabra) {
        if (encontradas.indexOf(palabra) >= 0) return;
        if (textoSeleccion === palabra || textoSeleccion === palabra.split('').reverse().join('')) {
          // ¡Palabra encontrada!
          encontradas.push(palabra);
          seleccion.forEach(function(s) {
            s.elem.classList.remove('seleccionada');
            s.elem.classList.add('encontrada');
          });
          seleccion = [];
          
          // Marcar la palabra en la lista
          var palabraElem = area.querySelector('.sopa-palabra[data-palabra="' + palabra + '"]');
          if (palabraElem) {
            palabraElem.classList.add('encontrada');
          }

          // Verificar si ganó
          if (encontradas.length === palabrasColocadas.length) {
            document.getElementById('sopa-mensaje').textContent = '🎉 ¡Encontraste todas las palabras! ¡Felicidades!';
            document.getElementById('btn-reiniciar-sopa').style.display = 'block';
          }
        }
      });
    });
  });

  // Reiniciar
  setTimeout(function() {
    var btnReiniciar = document.getElementById('btn-reiniciar-sopa');
    if (btnReiniciar) {
      btnReiniciar.addEventListener('click', function() {
        iniciarSopaDeLetras(area);
      });
    }
  }, 100);
}


// ========== JUEGO: ORDENAR PASOS DEL CICLO ==========

function iniciarOrdenar(area) {
  var pasosCorrectos = [
    { id: 1, texto: '☀️ El sol calienta el agua y se evapora', emoji: '1' },
    { id: 2, texto: '☁️ El vapor sube y forma las nubes (condensación)', emoji: '2' },
    { id: 3, texto: '🌧️ Las nubes sueltan el agua como lluvia (precipitación)', emoji: '3' },
    { id: 4, texto: '🏞️ El agua se junta en ríos y lagos (recolección)', emoji: '4' },
    { id: 5, texto: '🔄 El ciclo comienza de nuevo', emoji: '5' }
  ];

  // Mezclar los pasos
  var pasosMezclados = pasosCorrectos.slice();
  for (var i = pasosMezclados.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = pasosMezclados[i];
    pasosMezclados[i] = pasosMezclados[j];
    pasosMezclados[j] = temp;
  }

  var html = '';
  html += '<h3>🔢 Ordena los Pasos del Ciclo del Agua</h3>';
  html += '<p class="juego-instrucciones">Arrastra o haz clic en las flechas para poner los pasos en orden correcto</p>';
  html += '<div class="pasos-contenedor" id="pasos-contenedor">';
  
  pasosMezclados.forEach(function(paso, index) {
    html += '<div class="paso-item" data-id="' + paso.id + '" data-index="' + index + '">';
    html += '<span class="paso-handle">☰</span>';
    html += '<span>' + paso.texto + '</span>';
    html += '<div style="margin-left: auto; display: flex; gap: 5px;">';
    html += '<button class="btn-mover" data-dir="up" style="background:none;border:1px solid #cde5f5;border-radius:8px;padding:5px 10px;cursor:pointer;font-size:1rem;">⬆️</button>';
    html += '<button class="btn-mover" data-dir="down" style="background:none;border:1px solid #cde5f5;border-radius:8px;padding:5px 10px;cursor:pointer;font-size:1rem;">⬇️</button>';
    html += '</div>';
    html += '</div>';
  });

  html += '</div>';
  html += '<button class="btn-juego" id="btn-verificar-orden">✅ Verificar Orden</button>';
  html += '<p id="orden-mensaje" style="text-align: center; font-family: Baloo 2; margin-top: 15px; font-size: 1.2rem;"></p>';

  area.innerHTML = html;

  // Mover pasos con botones
  area.querySelectorAll('.btn-mover').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var dir = this.getAttribute('data-dir');
      var pasoItem = this.closest('.paso-item');
      var contenedor = document.getElementById('pasos-contenedor');
      
      if (dir === 'up' && pasoItem.previousElementSibling) {
        contenedor.insertBefore(pasoItem, pasoItem.previousElementSibling);
      } else if (dir === 'down' && pasoItem.nextElementSibling) {
        contenedor.insertBefore(pasoItem.nextElementSibling, pasoItem);
      }
    });
  });

  // Verificar orden
  document.getElementById('btn-verificar-orden').addEventListener('click', function() {
    var items = document.querySelectorAll('#pasos-contenedor .paso-item');
    var correcto = true;
    
    items.forEach(function(item, index) {
      var id = parseInt(item.getAttribute('data-id'));
      if (id === index + 1) {
        item.classList.remove('incorrecto');
        item.classList.add('correcto');
      } else {
        item.classList.remove('correcto');
        item.classList.add('incorrecto');
        correcto = false;
      }
    });

    var mensaje = document.getElementById('orden-mensaje');
    if (correcto) {
      mensaje.textContent = '🎉 ¡Perfecto! ¡Conoces muy bien el ciclo del agua!';
      mensaje.style.color = '#558B2F';
    } else {
      mensaje.textContent = '😅 ¡Casi! Intenta de nuevo, tú puedes';
      mensaje.style.color = '#EF5350';
    }
  });
}


// ========== JUEGO: MEMORIA ==========

function iniciarMemoria(area) {
  var pares = [
    { id: 1, contenido: '💧', nombre: 'Gota' },
    { id: 2, contenido: '🌊', nombre: 'Ola' },
    { id: 3, contenido: '❄️', nombre: 'Hielo' },
    { id: 4, contenido: '☁️', nombre: 'Nube' },
    { id: 5, contenido: '🌧️', nombre: 'Lluvia' },
    { id: 6, contenido: '🚿', nombre: 'Ducha' },
    { id: 7, contenido: '🌱', nombre: 'Planta' },
    { id: 8, contenido: '🐟', nombre: 'Pez' }
  ];

  // Duplicar para hacer pares
  var tarjetas = [];
  pares.forEach(function(par) {
    tarjetas.push({ id: par.id, contenido: par.contenido, nombre: par.nombre });
    tarjetas.push({ id: par.id, contenido: par.contenido, nombre: par.nombre });
  });

  // Mezclar
  for (var i = tarjetas.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = tarjetas[i];
    tarjetas[i] = tarjetas[j];
    tarjetas[j] = temp;
  }

  var html = '';
  html += '<h3>🃏 Juego de Memoria</h3>';
  html += '<p class="juego-instrucciones">Encuentra los pares iguales. ¡Haz clic en las tarjetas!</p>';
  html += '<div class="trivia-score" id="memoria-intentos">🎯 Intentos: 0 | Pares: 0/8</div>';
  html += '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 400px; margin: 0 auto;">';
  
  tarjetas.forEach(function(tarjeta, index) {
    html += '<div class="tarjeta-memoria" data-id="' + tarjeta.id + '" data-index="' + index + '" ';
    html += 'style="aspect-ratio:1;background:linear-gradient(135deg,#4ABEDC,#1565C0);border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;cursor:pointer;transition:all 0.3s ease;box-shadow:0 4px 10px rgba(27,58,92,0.15);">';
    html += '<span class="carta-frente" style="display:none;">' + tarjeta.contenido + '</span>';
    html += '<span class="carta-atras">❓</span>';
    html += '</div>';
  });

  html += '</div>';
  html += '<button class="btn-juego" id="btn-reiniciar-memoria" style="display:none;margin-top:20px;">🔄 Jugar de nuevo</button>';

  area.innerHTML = html;

  // Lógica del juego
  var primeraSeleccion = null;
  var segundaSeleccion = null;
  var bloqueado = false;
  var paresEncontrados = 0;
  var intentos = 0;

  var tarjetasDOM = area.querySelectorAll('.tarjeta-memoria');
  
  tarjetasDOM.forEach(function(tarjeta) {
    tarjeta.addEventListener('click', function() {
      if (bloqueado) return;
      if (this === primeraSeleccion) return;
      if (this.classList.contains('memoria-encontrada')) return;

      // Voltear tarjeta
      this.querySelector('.carta-frente').style.display = 'block';
      this.querySelector('.carta-atras').style.display = 'none';
      this.style.background = '#FFFFFF';
      this.style.border = '3px solid #4ABEDC';

      if (!primeraSeleccion) {
        primeraSeleccion = this;
      } else {
        segundaSeleccion = this;
        bloqueado = true;
        intentos++;

        var id1 = primeraSeleccion.getAttribute('data-id');
        var id2 = segundaSeleccion.getAttribute('data-id');

        if (id1 === id2) {
          // ¡Par encontrado!
          paresEncontrados++;
          primeraSeleccion.classList.add('memoria-encontrada');
          segundaSeleccion.classList.add('memoria-encontrada');
          primeraSeleccion.style.background = '#C8E6C9';
          segundaSeleccion.style.background = '#C8E6C9';
          primeraSeleccion.style.borderColor = '#7CB342';
          segundaSeleccion.style.borderColor = '#7CB342';
          
          primeraSeleccion = null;
          segundaSeleccion = null;
          bloqueado = false;

          actualizarContadorMemoria();

          if (paresEncontrados === 8) {
            var msgEl = document.getElementById('memoria-intentos');
            msgEl.textContent = '🎉 ¡Ganaste! Encontraste todos los pares en ' + intentos + ' intentos';
            document.getElementById('btn-reiniciar-memoria').style.display = 'block';
          }
        } else {
          // No coinciden - voltear de nuevo
          setTimeout(function() {
            primeraSeleccion.querySelector('.carta-frente').style.display = 'none';
            primeraSeleccion.querySelector('.carta-atras').style.display = 'block';
            primeraSeleccion.style.background = 'linear-gradient(135deg,#4ABEDC,#1565C0)';
            primeraSeleccion.style.border = 'none';
            
            segundaSeleccion.querySelector('.carta-frente').style.display = 'none';
            segundaSeleccion.querySelector('.carta-atras').style.display = 'block';
            segundaSeleccion.style.background = 'linear-gradient(135deg,#4ABEDC,#1565C0)';
            segundaSeleccion.style.border = 'none';

            primeraSeleccion = null;
            segundaSeleccion = null;
            bloqueado = false;
          }, 800);
        }

        actualizarContadorMemoria();
      }
    });
  });

  function actualizarContadorMemoria() {
    var el = document.getElementById('memoria-intentos');
    if (el) {
      el.textContent = '🎯 Intentos: ' + intentos + ' | Pares: ' + paresEncontrados + '/8';
    }
  }

  // Reiniciar memoria
  setTimeout(function() {
    var btnReiniciar = document.getElementById('btn-reiniciar-memoria');
    if (btnReiniciar) {
      btnReiniciar.addEventListener('click', function() {
        iniciarMemoria(area);
      });
    }
  }, 100);
}


// ========== INICIALIZACIÓN ==========

// Cargar el primer juego si estamos en esa página
var paginaJuegos = document.getElementById('pagina-juegos');
if (paginaJuegos && paginaJuegos.classList.contains('activa')) {
  cargarJuego('trivia');
}

// Scroll suave y cierre de menú al hacer scroll
window.addEventListener('scroll', function() {
  // Cerrar menú si está abierto
  if (navLinks.classList.contains('abierto')) {
    navLinks.classList.remove('abierto');
  }
});

// Cargar juego trivia por defecto
document.addEventListener('DOMContentLoaded', function() {
  animarEntradas();
});
