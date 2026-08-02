/*
========================================================
GENERADOR PALEONTROPÍA v1.0
Prueba lectura paleofichas.json
========================================================
*/

fetch("datos/paleofichas.json")

.then(respuesta => respuesta.json())

.then(datos => {


let salida = "";

salida += "<h2>Fichas cargadas: " + datos.length + "</h2>";


datos.forEach(ficha => {

salida += `
<p>
${ficha.codigo} - ${ficha.nombre}
</p>
`;

});


document.body.innerHTML += salida;


})


.catch(error => {

document.body.innerHTML +=
"<p>Error cargando JSON: " + error + "</p>";

});






