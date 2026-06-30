/* ============================================
   CONFIGURACIÓN DE LA ENCUESTA
   ============================================

   Aquí se guardan los resultados de la encuesta para que TODOS
   los estudiantes que la respondan se sumen en una sola gráfica.

   Usamos JSONBin.io, un servicio GRATIS que NO necesita base de datos
   ni servidor propio (funciona perfecto en GitHub Pages).

   ---------------------------------------------
   CÓMO ACTIVARLO (una sola vez, ~5 minutos):
   ---------------------------------------------
   1. Entra a https://jsonbin.io y crea una cuenta gratis.
   2. En el menú, entra a "API KEYS" y copia tu "X-MASTER-KEY".
   3. Entra a "BINS" y haz clic en "CREATE A BIN".
   4. Borra el contenido y pega exactamente esto:
        { "total": 0, "respuestas": {} }
      Ponle un nombre (ej: "encuesta-agua") y guárdalo ("CREATE").
   5. Copia el BIN ID que aparece en la URL del bin
      (la parte después de /b/ ... son letras y números).
   6. Pega abajo tu BIN ID y tu MASTER KEY entre las comillas.
   7. Cambia ACTIVO a true.

   Mientras ACTIVO sea false, la encuesta funciona igual pero los
   resultados se guardan SOLO en el navegador de cada persona (para pruebas).
   ============================================ */

var CONFIG_ENCUESTA = {
  ACTIVO: true,
  BIN_ID: "6a444b27f5f4af5e294a2efa",
  MASTER_KEY: "$2a$10$dQwETlO8/yttdVMWtwnwcenve3SpGKCqWYaIytvZ.APFrwvhVuS9e"
};
