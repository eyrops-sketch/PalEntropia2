/*
========================================================
GENERADOR PALENTROPÍA v1.1
Generador PALDB prueba
========================================================
*/


fetch("datos/paleofichas.json")

.then(respuesta => respuesta.json())

.then(datos => {


let salida = "";

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


salida += "];";


salida += "</pre>";


document.body.innerHTML += salida;


})

.catch(error => {

document.body.innerHTML +=
"Error: " + error;

});






