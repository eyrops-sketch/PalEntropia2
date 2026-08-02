/*
========================================================
GENERADOR PALEONTROPÍA v1.0
Prueba lectura paleofichas.json
========================================================
*/


fetch("datos/paleofichas.json")

.then(respuesta => respuesta.json())

.then(datos => {


console.log("Fichas cargadas:", datos.length);


datos.forEach(ficha => {

console.log(
ficha.codigo,
"-",
ficha.nombre
);


});


})

.catch(error => {

console.log(
"Error cargando JSON:",
error
);

});






