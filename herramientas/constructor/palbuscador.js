/*
=========================================================
PALBUSCADOR.js
Motor de Búsqueda Universal
PalEntropía

Versión: 2.0 LTS

Búsqueda por:

- Código
- Nombre
- Eón
- Era
- Período
- Edad geológica

Compatible con:
- Constructor 1.8
- PALDB
- PALGEO
- PALDECODER
=========================================================
*/

const PALBUSCADOR = {

/*=========================================================
VERSIÓN
=========================================================*/

version:"2.0 LTS",

/*=========================================================
NORMALIZAR TEXTO
=========================================================*/

normalizar(texto){

if(texto===undefined || texto===null){

return "";

}

return texto

.toString()

.toLowerCase()

.normalize("NFD")

.replace(/[\u0300-\u036f]/g,"")

.replace(/ñ/g,"n")

.replace(/[.,;:()\-_/]/g," ")

.replace(/\s+/g," ")

.trim();

},

/*=========================================================
OBTENER PALABRAS
=========================================================*/

obtenerPalabras(texto){

return this

.normalizar(texto)

.split(" ")

.filter(p=>p.length>0);

},

/*=========================================================
ELIMINAR DUPLICADOS
=========================================================*/

unicos(lista){

return [...new Set(lista)];

},

/*=========================================================
CREAR ÍNDICE
=========================================================*/

crearIndice(codigo){

let datos=[];

/*---------------------------------------
PALEOFICHAS
---------------------------------------*/

const ficha=

paleofichas.find(

f=>f.codigo===codigo

);

if(!ficha){

return "";

}

/*---------------------------------------
CÓDIGO
---------------------------------------*/

datos.push(ficha.codigo);

/*---------------------------------------
NOMBRE
---------------------------------------*/

datos.push(ficha.nombre);



/*---------------------------------------
CRONOLOGÍA
---------------------------------------*/

if(typeof PALDECODER!=="undefined"){

const geo=

PALDECODER.decodeCronologia(

ficha.cronologia

);

if(geo){

/* Rango temporal */

if(geo.rango){

datos.push(geo.rango);

}

/* Eón */

if(Array.isArray(geo.eon)){

geo.eon.forEach(v=>{

datos.push(v);

});

}

/* Era */

if(Array.isArray(geo.era)){

geo.era.forEach(v=>{

datos.push(v);

});

}

/* Período */

if(Array.isArray(geo.periodo)){

geo.periodo.forEach(v=>{

datos.push(v);

});

}

/* Edad / Subperíodo */

if(Array.isArray(geo.edad)){

geo.edad.forEach(v=>{

datos.push(v);

});

}

/* Textos preparados */

if(geo.periodo_texto){

datos.push(geo.periodo_texto);

}

if(geo.subperiodo_texto){

datos.push(geo.subperiodo_texto);

}

}

}

/*---------------------------------------
LIMPIAR REPETIDOS
---------------------------------------*/

datos=

this.unicos(datos);

/*---------------------------------------
DEVOLVER ÍNDICE NORMALIZADO
---------------------------------------*/

return this.normalizar(

datos.join(" ")

);

},


/*=========================================================
BUSCADOR PRINCIPAL
=========================================================*/

buscar(texto){

const consulta=

this.obtenerPalabras(texto);

if(consulta.length===0){

return [];

}

let resultados=[];

paleofichas.forEach(ficha=>{

const indice=

this.crearIndice(

ficha.codigo

);

let coincidencias=0;

consulta.forEach(palabra=>{

if(

indice.includes(palabra)

){

coincidencias++;

}

});

if(

coincidencias===consulta.length

){

resultados.push({

codigo:ficha.codigo,

nombre:ficha.nombre,

relevancia:Math.round(

(coincidencias/

consulta.length)

*100

)

});

}

});

return this.ordenar(

resultados

);

},

/*=========================================================
ORDENAR RESULTADOS
=========================================================*/

ordenar(resultados){

return resultados.sort((a,b)=>{

if(

b.relevancia!==a.relevancia

){

return b.relevancia-a.relevancia;

}

return a.nombre.localeCompare(

b.nombre,

"es",

{

sensitivity:"base"

}

);

});

},


/*=========================================================
FIN DEL MÓDULO
=========================================================*/

};

/*=========================================================
FIN PALBUSCADOR
Motor de búsqueda universal

Versión: 2.0 LTS

Indexa:

✓ Código
✓ Nombre
✓ Eón
✓ Era
✓ Período
✓ Edad geológica

Características:

✓ Autocompletado
✓ Búsqueda por varias palabras
✓ Ignora mayúsculas/minúsculas
✓ Ignora tildes
✓ Trata la ñ como equivalente a n
✓ Elimina duplicados del índice

Compatible con Constructor 1.8
=========================================================*/
  






