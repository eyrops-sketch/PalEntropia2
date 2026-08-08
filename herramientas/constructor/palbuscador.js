/*
=========================================================
PALBUSCADOR.js
Motor de Búsqueda Universal
PalEntropía

Versión: 2.1 LTS

Búsqueda restringida por:

- Código
- Nombre
- Eón
- Era
- Período
- Edad geológica

Restricciones:

- Código: desde 1 carácter
- Nombre: desde 3 caracteres
- Tiempo geológico: desde 4 caracteres

Compatible con:
- Constructor 1.9
- PALDB
- PALGEO
- PALDECODER
=========================================================
*/

const PALBUSCADOR = {

/*=========================================================
VERSIÓN
=========================================================*/

version:"2.1 LTS",


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
OBTENER CRONOLOGÍA
=========================================================*/

obtenerGeologia(ficha){

if(

typeof PALDECODER==="undefined" ||

!ficha ||

!ficha.cronologia

){

return [];

}

const geo =

PALDECODER.decodeCronologia(

ficha.cronologia

);

if(!geo){

return [];

}

let terminos=[];


/*---------------------------------------
EÓN
---------------------------------------*/

if(Array.isArray(geo.eon)){

terminos.push(...geo.eon);

}


/*---------------------------------------
ERA
---------------------------------------*/

if(Array.isArray(geo.era)){

terminos.push(...geo.era);

}


/*---------------------------------------
PERÍODO
---------------------------------------*/

if(Array.isArray(geo.periodo)){

terminos.push(...geo.periodo);

}


/*---------------------------------------
EDAD
---------------------------------------*/

if(Array.isArray(geo.edad)){

terminos.push(...geo.edad);

}


/*---------------------------------------
TEXTOS PREPARADOS
---------------------------------------*/

if(geo.periodo_texto){

terminos.push(

geo.periodo_texto

);

}

if(geo.subperiodo_texto){

terminos.push(

geo.subperiodo_texto

);

}


return this.unicos(

terminos

.filter(Boolean)

);

},


/*=========================================================
CREAR ÍNDICE
=========================================================*/

crearIndice(codigo){

let datos=[];


/*---------------------------------------
BUSCAR FICHA
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

datos.push(

ficha.codigo

);


/*---------------------------------------
NOMBRE
---------------------------------------*/

datos.push(

ficha.nombre

);


/*---------------------------------------
CRONOLOGÍA
---------------------------------------*/

const geologia=

this.obtenerGeologia(

ficha

);

datos.push(

...geologia

);


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
DETERMINAR TIPO DE CONSULTA
=========================================================*/

tipoConsulta(texto){

const consulta=

this.normalizar(texto);


/*---------------------------------------
VACÍO
---------------------------------------*/

if(!consulta){

return "vacio";

}


/*---------------------------------------
CÓDIGO
---------------------------------------

Un código está compuesto únicamente
por números y guion bajo.

Ejemplos:

0
00
003
003_
003_1
003_12
---------------------------------------*/

if(

/^[0-9_]+$/.test(consulta)

){

return "codigo";

}


/*---------------------------------------
TIEMPO GEOLÓGICO

Mínimo 4 caracteres.

Ejemplo:

perm
devon
triass
jurass

---------------------------------------*/

if(

consulta.length>=4 &&

this.esTerminoGeologico(

consulta)

){

return "geologia";

}


/*---------------------------------------
NOMBRE

Mínimo 3 caracteres.

---------------------------------------*/

if(

consulta.length>=3

){

return "nombre";

}


/*---------------------------------------
DEMASIADO CORTO
---------------------------------------*/

return "corto";

},


/*=========================================================
COMPROBAR SI EXISTE TÉRMINO GEOLÓGICO
=========================================================*/

esTerminoGeologico(texto){

const consulta=

this.normalizar(texto);

if(

consulta.length<4

){

return false;

}

for(const ficha of paleofichas){

const terminos=

this.obtenerGeologia(ficha);

for(const termino of terminos){

const normalizado=

this.normalizar(termino);

if(

normalizado.startsWith(consulta)

){

return true;

}

}

}

return false;

},


/*=========================================================
BUSCADOR PRINCIPAL
=========================================================*/

buscar(texto){

const consulta=

this.normalizar(texto);

if(!consulta){

return [];

}

const tipo=

this.tipoConsulta(consulta);


/*---------------------------------------
CONSULTA DEMASIADO CORTA
---------------------------------------*/

if(tipo==="corto"){

return [];

}


/*---------------------------------------
RESULTADOS
---------------------------------------*/

let resultados=[];


/*=========================================================
BÚSQUEDA POR CÓDIGO
=========================================================*/

if(tipo==="codigo"){

paleofichas.forEach(ficha=>{

const codigo=

this.normalizar(

ficha.codigo

);

if(

codigo.startsWith(consulta)

){

resultados.push({

codigo:ficha.codigo,

nombre:ficha.nombre,

tipo:"codigo",

relevancia:100

});

}

});

}


/*=========================================================
BÚSQUEDA POR NOMBRE
=========================================================*/

else if(tipo==="nombre"){

paleofichas.forEach(ficha=>{

const nombre=

this.normalizar(

ficha.nombre

);

if(

nombre.startsWith(consulta)

){

resultados.push({

codigo:ficha.codigo,

nombre:ficha.nombre,

tipo:"nombre",

relevancia:100

});

}

});

}


/*=========================================================
BÚSQUEDA POR TIEMPO GEOLÓGICO
=========================================================*/

else if(tipo==="geologia"){

paleofichas.forEach(ficha=>{

const terminos=

this.obtenerGeologia(

ficha

);

let encontrado=false;


/*---------------------------------------
COMPROBAR TÉRMINOS
---------------------------------------*/

for(const termino of terminos){

const normalizado=

this.normalizar(termino);

if(

normalizado.startsWith(consulta)

){

encontrado=true;

break;

}

}


/*---------------------------------------
AÑADIR RESULTADO
---------------------------------------*/

if(encontrado){

resultados.push({

codigo:ficha.codigo,

nombre:ficha.nombre,

tipo:"geologia",

relevancia:100

});

}

});

}


/*---------------------------------------
ORDENAR
---------------------------------------*/

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
INTERPRETAR BÚSQUEDA
=========================================================*/

interpretar(texto){

const consulta=

this.normalizar(texto);

if(!consulta){

return "";

}


/*---------------------------------------
CÓDIGO
---------------------------------------*/

if(

/^[0-9_]+$/.test(consulta)

){

for(const ficha of paleofichas){

const codigo=

this.normalizar(

ficha.codigo

);

if(

codigo.startsWith(consulta)

){

return ficha.codigo;

}

}

return "";

}


/*---------------------------------------
NOMBRE
Mínimo 3 caracteres
---------------------------------------*/

if(

consulta.length>=3

){

for(const ficha of paleofichas){

const nombre=

this.normalizar(

ficha.nombre

);

if(

nombre.startsWith(consulta)

){

return ficha.nombre;

}

}

}


/*---------------------------------------
GEOLOGÍA
Mínimo 4 caracteres
---------------------------------------*/

if(

consulta.length>=4

){

for(const ficha of paleofichas){

const terminos=

this.obtenerGeologia(

ficha

);

for(const termino of terminos){

if(

this.normalizar(termino)

.startsWith(consulta)

){

return termino;

}

}

}

}

return "";

}


/*=========================================================
FIN DEL MÓDULO
=========================================================*/

};


/*
=========================================================
FIN PALBUSCADOR

Versión 2.1 LTS

Restricciones:

✓ Código desde 1 carácter
✓ Nombre desde 3 caracteres
✓ Geología desde 4 caracteres

Búsqueda separada:

✓ Código
✓ Nombre
✓ Eón
✓ Era
✓ Período
✓ Edad geológica

Características:

✓ Autocompletado
✓ Búsqueda por prefijo
✓ Ignora mayúsculas/minúsculas
✓ Ignora tildes
✓ Trata la ñ como equivalente a n
✓ Elimina duplicados
✓ Evita coincidencias indiscriminadas
✓ No mezcla nombre y cronología

Compatible con Constructor 1.9
=========================================================
*/
