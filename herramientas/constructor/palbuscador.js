/*=========================================================
PALBUSCADOR.js
Motor de búsqueda universal
PalEntropía

Versión: 1.0 LTS
=========================================================*/

const PALBUSCADOR = {

version: "1.0 LTS",

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

.replace(/[.,;:()\-_/]/g," ")

.replace(/\s+/g," ")

.trim();

},

/*=========================================================
DIVIDIR BÚSQUEDA EN PALABRAS
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
CONSTRUIR CADENA INDEXABLE
=========================================================*/

crearIndice(codigo){

/* Se desarrollará en la Parte 2 */

return "";

},

/*=========================================================
BUSCADOR PRINCIPAL
=========================================================*/

buscar(texto){

/* Se desarrollará en la Parte 3 */

return [];

},

/*=========================================================
ORDENAR RESULTADOS
=========================================================*/

ordenar(resultados){

/* Se desarrollará en la Parte 4 */

return resultados;

}

};

/*=========================================================
FIN PALBUSCADOR
=========================================================*/


/*=========================================================
CONSTRUIR CADENA INDEXABLE
=========================================================*/

crearIndice(codigo){

let datos=[];

/*---------------------------------------
PALEOFICHAS.JSON
---------------------------------------*/

const ficha=

paleofichas.find(f=>f.codigo===codigo);

if(ficha){

Object.values(ficha).forEach(valor=>{

if(valor!==undefined && valor!==null){

datos.push(String(valor));

}

});

}

/*---------------------------------------
PALDB
---------------------------------------*/

const db=

PALDB.find(f=>f.codigo===codigo);

if(db){

Object.values(db).forEach(valor=>{

if(valor!==undefined && valor!==null){

datos.push(String(valor));

}

});

}

/*---------------------------------------
PALTAXON
(Se ampliará en Parte 3)
---------------------------------------*/

if(typeof PALTAXON!=="undefined"){

const taxon=

PALTAXON.find(t=>t.codigo===codigo);

if(taxon){

Object.values(taxon).forEach(valor=>{

if(valor!==undefined && valor!==null){

datos.push(String(valor));

}

});

}

}

/*---------------------------------------
ELIMINAR DUPLICADOS
---------------------------------------*/

datos=

this.unicos(datos);

/*---------------------------------------
NORMALIZAR
---------------------------------------*/

return this.normalizar(

datos.join(" ")

);

},


/*=========================================================
AMPLIACIÓN DEL ÍNDICE
PALDECODER / PALDECODER2
=========================================================*/

/*---------------------------------------
CRONOLOGÍA
---------------------------------------*/

if(ficha){

const geo=

PALDECODER.decodeCronologia(ficha.cronologia);

Object.values(geo).forEach(valor=>{

if(valor!==undefined && valor!==null){

datos.push(String(valor));

}

});

}

/*---------------------------------------
HÁBITATS
---------------------------------------*/

if(db && typeof PALDECODER2!=="undefined"){

const hab=

PALDECODER2.decodeHabitat(db.habitat_principal);

Object.values(hab).forEach(valor=>{

if(valor!==undefined && valor!==null){

datos.push(String(valor));

}

});

}

/*---------------------------------------
MEDIOS ECOLÓGICOS
---------------------------------------*/

if(db && typeof PALDECODER2!=="undefined"){

const medio=

PALDECODER2.decodeMedio(db.medio_principal);

Object.values(medio).forEach(valor=>{

if(valor!==undefined && valor!==null){

datos.push(String(valor));

}

});

}

/*---------------------------------------
MODO DE VIDA
---------------------------------------*/

if(db && typeof PALDECODER2!=="undefined"){

const modo=

PALDECODER2.decodeModoVida(db.modo_vida);

Object.values(modo).forEach(valor=>{

if(valor!==undefined && valor!==null){

datos.push(String(valor));

}

});

}

/*---------------------------------------
ESTADÍSTICAS
Preparado para futuras versiones
---------------------------------------*/

if(typeof PALSTATS!=="undefined"){

const stats=

PALSTATS[codigo];

if(stats){

Object.keys(stats).forEach(clave=>{

datos.push(clave);

datos.push(String(stats[clave]));

});

}

}


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

this.crearIndice(ficha.codigo);

let coincidencias=0;

/*---------------------------------------
COMPROBAR PALABRAS
---------------------------------------*/

consulta.forEach(palabra=>{

if(indice.includes(palabra)){

coincidencias++;

}

});

/*---------------------------------------
SOLO SI CUMPLE TODAS
---------------------------------------*/

if(coincidencias===consulta.length){

const relevancia=

Math.round(

(coincidencias/

consulta.length)

*100

);

resultados.push({

codigo:ficha.codigo,

nombre:ficha.nombre,

relevancia:relevancia,

coincidencias:coincidencias

});

}

});

/*---------------------------------------
ORDENAR
---------------------------------------*/

return this.ordenar(resultados);

},

/*=========================================================
ORDENAR RESULTADOS
=========================================================*/

ordenar(resultados){

return resultados.sort((a,b)=>{

if(b.relevancia!==a.relevancia){

return b.relevancia-a.relevancia;

}

return a.nombre.localeCompare(

b.nombre,

"es"

);

});

}










