/*
========================================================
GENERADOR PALENTROPÍA v1.2
Generador PALDB + PALSTATS prueba
========================================================
*/


fetch("datos/paleofichas.json")

.then(respuesta => respuesta.json())

.then(datos => {


let salida = "";


/* =========================
   GENERAR PALDB
========================= */


salida += "<h2>PALDB GENERADO</h2>";

salida += "<pre>";

salida += "const PALDB = [\n\n";


datos.forEach(ficha => {


salida += 
`{
codigo:"${ficha.codigo}",
nombre:"${ficha.nombre}",

volumen:"${ficha.volumen}",
carpeta:"${ficha.carpeta}",

imagen:"${ficha.imagen}"

},\n\n`;


});


salida += "];\n\n";

salida += "</pre>";



/* =========================
   GENERAR PALSTATS
========================= */


salida += "<h2>PALSTATS GENERADO</h2>";

salida += "<pre>";

salida += "const PALSTATS = {\n\n";


datos.forEach(ficha => {


salida += 
`"${ficha.codigo}": {
nombre:"${ficha.nombre}",

adaptabilidad:${ficha.stats.adaptabilidad},
sociabilidad:${ficha.stats.sociabilidad},
resistencia:${ficha.stats.resistencia},
reproduccion:${ficha.stats.reproduccion},
ofensiva:${ficha.stats.ofensiva},
defensa:${ficha.stats.defensa},
movilidad:${ficha.stats.movilidad},
plasticidad_ecologica:${ficha.stats.plasticidad_ecologica}

},\n\n`;



});


salida += "};";


salida += "</pre>";



document.body.innerHTML += salida;



})


.catch(error => {

document.body.innerHTML +=
"Error: " + error;

});






