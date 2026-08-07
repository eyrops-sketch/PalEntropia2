/*
=========================================================
PALBUSCADOR.js
Motor de búsqueda universal
PalEntropía

Versión: 1.1 LTS
Compatible con Constructor 1.8
=========================================================
*/

const PALBUSCADOR = {

/*=========================================================
VERSIÓN
=========================================================*/

version:"1.1 LTS",

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
OBTENER PALABRAS
=========================================================*/

obtenerPalabras(texto){

return this.normalizar(texto)

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
CREAR ÍNDICE DE UNA FICHA
=========================================================*/

crearIndice(codigo){

let datos=[];

/*---------------------------------------
PALEOFICHAS.JSON
---------------------------------------*/

const ficha=

paleofichas.find(f=>f.codigo===codigo);

if(ficha){

Object.values(ficha).forEach(v=>{

if(v!==undefined && v!==null){

datos.push(String(v));

}

});

}

/*---------------------------------------
PALDB
---------------------------------------*/

const db=

PALDB.find(f=>f.codigo===codigo);

if(db){

Object.values(db).forEach(v=>{

if(v!==undefined && v!==null){

datos.push(String(v));

}

});

}


/*---------------------------------------
PALTAXON
---------------------------------------*/

if(typeof PALTAXON!=="undefined"){

const taxon=

PALTAXON[codigo];

if(taxon){

Object.values(taxon).forEach(v=>{

if(v!==undefined && v!==null){

datos.push(String(v));

}

});

}

}

/*---------------------------------------
CRONOLOGÍA
---------------------------------------*/

if(ficha && typeof PALDECODER!=="undefined"){

const geo=

PALDECODER.decodeCronologia(

ficha.cronologia

);

Object.values(geo).forEach(v=>{

if(v!==undefined && v!==null){

datos.push(String(v));

}

});

}

/*---------------------------------------
HÁBITATS
---------------------------------------*/

if(ficha && typeof PALDECODER!=="undefined"){

const hab=

PALDECODER.decodeHabitats(

ficha.HP,

ficha.HS

);

hab.principales.forEach(h=>{

datos.push(h.nombre);

});

hab.secundarios.forEach(h=>{

datos.push(h.nombre);

});

}

/*---------------------------------------
MODO DE VIDA
---------------------------------------*/

if(ficha &&

ficha.modo_vida &&

typeof PALDECODER2!=="undefined"){

const modo=

PALDECODER2.decodeModoVida(

ficha.modo_vida

);

if(modo){

datos.push(modo.nombre);

}

}

/*---------------------------------------
MEDIO ECOLÓGICO
---------------------------------------*/

if(ficha &&

ficha.medio_compuesto &&

typeof PALDECODER2!=="undefined"){

const medio=

PALDECODER2.decodeMedio(

ficha.medio_compuesto

);

if(medio.medio){

datos.push(medio.medio.nombre);

}

if(medio.localizacion){

datos.push(medio.localizacion.nombre);

}

if(medio.estrato){

datos.push(medio.estrato.nombre);

}

if(medio.comportamiento){

datos.push(medio.comportamiento.nombre);

}

}


/*---------------------------------------
PALSTATS
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

/*---------------------------------------
ELIMINAR DUPLICADOS
---------------------------------------*/

datos=this.unicos(datos);

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

this.crearIndice(ficha.codigo);

let coincidencias=0;

consulta.forEach(palabra=>{

if(indice.includes(palabra)){

coincidencias++;

}

});

if(coincidencias===consulta.length){

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

};

/*=========================================================
FIN PALBUSCADOR
Versión 1.1 LTS
=========================================================*/






