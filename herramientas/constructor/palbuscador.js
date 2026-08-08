/*
=========================================================
PALBUSCADOR.js
Motor de Búsqueda Universal
PalEntropía

Versión: 2.2 LTS

Búsqueda por:

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

version:"2.2 LTS",


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

/*
IMPORTANTE:
NO eliminamos "_"
porque forma parte de los códigos.
*/

.replace(/[.,;:()\-\/]/g," ")

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

const geo=

PALDECODER.decodeCronologia(

ficha.cronologia

);

if(!geo){

return [];

}

let terminos=[];


/*-----------------------------------------
EÓN
-----------------------------------------*/

if(Array.isArray(geo.eon)){

terminos.push(...geo.eon);

}


/*-----------------------------------------
ERA
-----------------------------------------*/

if(Array.isArray(geo.era)){

terminos.push(...geo.era);

}


/*-----------------------------------------
PERÍODO
-----------------------------------------*/

if(Array.isArray(geo.periodo)){

terminos.push(...geo.periodo);

}


/*-----------------------------------------
EDAD
-----------------------------------------*/

if(Array.isArray(geo.edad)){

terminos.push(...geo.edad);

}


/*-----------------------------------------
TEXTOS PREPARADOS
-----------------------------------------*/

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

terminos.filter(Boolean)

);

},


/*=========================================================
TIPO DE CONSULTA
=========================================================*/

tipoConsulta(texto){

const consulta=

this.normalizar(texto);


/*-----------------------------------------
VACÍO
-----------------------------------------*/

if(!consulta){

return "vacio";

}


/*-----------------------------------------
CÓDIGO
-----------------------------------------

Ejemplos:

0
00
003
003_
003_1
003_12
-----------------------------------------*/

if(

/^[0-9_]+$/.test(consulta)

){

return "codigo";

}


/*-----------------------------------------
NOMBRE
MÍNIMO 3 CARACTERES
-----------------------------------------*/

if(

consulta.length>=3

){

return "nombre";

}


/*-----------------------------------------
DEMASIADO CORTO
-----------------------------------------*/

return "corto";

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


/*-----------------------------------------
CONSULTA DEMASIADO CORTA
-----------------------------------------*/

if(tipo==="corto"){

return [];

}


/*=========================================================
CÓDIGO
=========================================================*/

if(tipo==="codigo"){

const resultados=[];

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

return this.ordenar(resultados);

}


/*=========================================================
NOMBRE
=========================================================*/

if(tipo==="nombre"){

const resultados=[];

paleofichas.forEach(ficha=>{

const nombre=

this.normalizar(

ficha.nombre

);


/*
El nombre debe comenzar por
la consulta.

Ejemplo:

hel → Helicoprion

goni → Goniatites

dim → Dimetrodon

*/

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

return this.ordenar(resultados);

}


/*=========================================================
TIEMPO GEOLÓGICO
=========================================================

IMPORTANTE:

La búsqueda geológica necesita
4 caracteres.

Por tanto:

ord → NO

perm → SÍ

devo → SÍ

jurá → SÍ

=========================================================*/

if(

consulta.length>=4

){

const resultados=[];

paleofichas.forEach(ficha=>{

const terminos=

this.obtenerGeologia(ficha);

let encontrado=false;

for(const termino of terminos){

const geo=

this.normalizar(termino);

if(

geo.startsWith(consulta)

){

encontrado=true;

break;

}

}

if(encontrado){

resultados.push({

codigo:ficha.codigo,

nombre:ficha.nombre,

tipo:"geologia",

relevancia:100

});

}

});

return this.ordenar(resultados);

}


/*-----------------------------------------
CUALQUIER OTRA CONSULTA
-----------------------------------------*/

return [];

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


/*-----------------------------------------
CÓDIGO
-----------------------------------------*/

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


/*-----------------------------------------
NOMBRE
MÍNIMO 3
-----------------------------------------*/

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


/*-----------------------------------------
GEOLOGÍA
MÍNIMO 4
-----------------------------------------*/

if(

consulta.length>=4

){

for(const ficha of paleofichas){

const terminos=

this.obtenerGeologia(ficha);

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

Versión 2.2 LTS

Restricciones:

✓ Código desde 1 carácter
✓ Nombre desde 3 caracteres
✓ Geología desde 4 caracteres

Características:

✓ Búsqueda por prefijo
✓ Ignora mayúsculas/minúsculas
✓ Ignora tildes
✓ Mantiene "_" en códigos
✓ No mezcla código y nombre
✓ No mezcla nombre y cronología
✓ Autocompletado

Compatible con Constructor 1.9
=========================================================
*/
