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

Búsqueda por PREFIJO.

Ejemplos:

o
ord
hel
003_
003_1
perm
devo
chan

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


/*---------------------------------------
LIMPIAR
---------------------------------------*/

return this.unicos(

terminos

.filter(Boolean)

);

},

/*=========================================================
OBTENER TAXONOMÍA
=========================================================*/

obtenerTaxonomia(codigo){

if(

typeof PALTAXON==="undefined" ||

!codigo

){

return [];

}

const taxon=

PALTAXON[codigo];

if(!taxon || !taxon.ta1){

return [];

}

const terminos=

taxon.ta1

.split(">")

.map(t=>t.trim())

.filter(Boolean);

return this.unicos(

terminos

);

},




   
/*=========================================================
CREAR ÍNDICE
=========================================================*/

crearIndice(codigo){

const ficha=

paleofichas.find(

f=>f.codigo===codigo

);

if(!ficha){

return "";

}

let datos=[];


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
GEOLOGÍA
---------------------------------------*/

const geologia=

this.obtenerGeologia(

ficha

);

datos.push(

...geologia

);


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
DETERMINAR TIPO DE CONSULTA
=========================================================*/

tipoConsulta(texto){

const consulta=

this.normalizar(texto);

if(!consulta){

return "vacio";

}


/*---------------------------------------
CÓDIGO
---------------------------------------

Cualquier consulta formada únicamente
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
NOMBRE
---------------------------------------

IMPORTANTE:

Primero se intenta localizar un nombre.

Esto evita que consultas normales como:

ord
hel
pri
sac

sean interpretadas como geología.

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

return "nombre";

}

}

}



/*---------------------------------------
GEOLOGÍA
---------------------------------------

Solo se considera geología cuando:

1. Tiene mínimo 4 caracteres.
2. Coincide realmente con un término
   geológico existente.

---------------------------------------*/

if(

consulta.length>=4 &&

this.esTerminoGeologico(consulta)

){

return "geologia";

}


/*---------------------------------------
TAXONOMÍA
---------------------------------------

Solo se considera taxonomía cuando:

1. Tiene mínimo 5 caracteres.
2. Coincide realmente con un término
   taxonómico existente.

---------------------------------------*/

if(

consulta.length>=5 &&

this.esTerminoTaxonomico(consulta)

){

return "taxon";

}





   
   
/*---------------------------------------
OTRA CONSULTA DE NOMBRE
---------------------------------------

Si no hemos encontrado un nombre pero
tiene al menos 3 caracteres, seguimos
tratándolo como búsqueda de nombre.

---------------------------------------*/

if(

consulta.length>=3

){

return "nombre";

}


/*---------------------------------------
DEMASIADO CORTA
---------------------------------------*/

return "corto";

},


/*=========================================================
COMPROBAR TÉRMINO GEOLÓGICO
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

this.obtenerGeologia(

ficha

);

for(const termino of terminos){

const normalizado=

this.normalizar(

termino

);

if(

normalizado.startsWith(

consulta

)

){

return true;

}

}

}

return false;

},



/*=========================================================
COMPROBAR TÉRMINO TAXONÓMICO
=========================================================*/

esTerminoTaxonomico(texto){

const consulta=

this.normalizar(texto);

if(

consulta.length<5

){

return false;

}

for(const ficha of paleofichas){

const terminos=

this.obtenerTaxonomia(

ficha.codigo

);

for(const termino of terminos){

const normalizado=

this.normalizar(

termino

);

if(

normalizado.startsWith(

consulta

)

){

return true;

}

}

}

return false;

},



   
/*=========================================================
BUSCAR POR CÓDIGO
=========================================================*/

buscarPorCodigo(consulta){

let resultados=[];

for(const ficha of paleofichas){

const codigo=

this.normalizar(

ficha.codigo

);

if(

codigo.startsWith(

consulta

)

){

resultados.push({

codigo:ficha.codigo,

nombre:ficha.nombre,

tipo:"codigo",

relevancia:100

});

}

}

return resultados;

},


/*=========================================================
BUSCAR POR NOMBRE
=========================================================*/

buscarPorNombre(consulta){

let resultados=[];

for(const ficha of paleofichas){

const nombre=

this.normalizar(

ficha.nombre

);

if(

nombre.startsWith(

consulta

)

){

resultados.push({

codigo:ficha.codigo,

nombre:ficha.nombre,

tipo:"nombre",

relevancia:100

});

}

}

return resultados;

},


/*=========================================================
BUSCAR POR GEOLOGÍA
=========================================================*/

buscarPorGeologia(consulta){

let resultados=[];

for(const ficha of paleofichas){

const terminos=

this.obtenerGeologia(

ficha

);

let encontrado=false;

for(const termino of terminos){

const normalizado=

this.normalizar(

termino

);

if(

normalizado.startsWith(

consulta

)

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

}

return resultados;

},



/*=========================================================
BUSCAR POR TAXONOMÍA
=========================================================*/

buscarPorTaxon(consulta){

let resultados=[];

for(const ficha of paleofichas){

const terminos=

this.obtenerTaxonomia(

ficha.codigo

);

let encontrado=false;

for(const termino of terminos){

const normalizado=

this.normalizar(

termino

);

if(

normalizado.startsWith(

consulta

)

){

encontrado=true;

break;

}

}

if(encontrado){

resultados.push({

codigo:ficha.codigo,

nombre:ficha.nombre,

tipo:"taxon",

relevancia:100

});

}

}

return resultados;

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


/*---------------------------------------
DETERMINAR TIPO
---------------------------------------*/

const tipo=

this.tipoConsulta(

consulta

);


/*---------------------------------------
DEMASIADO CORTO
---------------------------------------*/

if(

tipo==="corto" ||

tipo==="vacio"

){

return [];

}


/*---------------------------------------
CÓDIGO
---------------------------------------*/

if(

tipo==="codigo"

){

return this.ordenar(

this.buscarPorCodigo(

consulta

)

);

}


/*---------------------------------------
NOMBRE
---------------------------------------*/

if(

tipo==="nombre"

){

return this.ordenar(

this.buscarPorNombre(

consulta

)

);

}


/*---------------------------------------
GEOLOGÍA
---------------------------------------*/

if(

tipo==="geologia"

){

return this.ordenar(

this.buscarPorGeologia(

consulta

)

);

}


/*---------------------------------------
TAXONOMÍA
---------------------------------------*/

if(

tipo==="taxon"

){

return this.ordenar(

this.buscarPorTaxon(

consulta

)

);

}

   
   
return [];

},


/*=========================================================
ORDENAR RESULTADOS
=========================================================*/

ordenar(resultados){

return resultados.sort(

(a,b)=>{

if(

b.relevancia!==a.relevancia

){

return (

b.relevancia-

a.relevancia

);

}

return a.nombre.localeCompare(

b.nombre,

"es",

{

sensitivity:"base"

}

);

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


/*---------------------------------------
CÓDIGO
---------------------------------------*/

if(

/^[0-9_]+$/.test(

consulta

)

){

for(const ficha of paleofichas){

const codigo=

this.normalizar(

ficha.codigo

);

if(

codigo.startsWith(

consulta

)

){

return ficha.codigo;

}

}

return "";

}


/*---------------------------------------
NOMBRE
---------------------------------------

Mínimo 3 caracteres.

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

nombre.startsWith(

consulta

)

){

return ficha.nombre;

}

}

}


/*---------------------------------------
GEOLOGÍA
---------------------------------------

Mínimo 4 caracteres.

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

this.normalizar(

termino

)

.startsWith(

consulta

)

){

return termino;

}

}

}

}



/*---------------------------------------
TAXONOMÍA
---------------------------------------

Mínimo 5 caracteres.

---------------------------------------*/

if(

consulta.length>=5

){

for(const ficha of paleofichas){

const terminos=

this.obtenerTaxonomia(

ficha.codigo

);

for(const termino of terminos){

if(

this.normalizar(

termino

)

.startsWith(

consulta

)

){

return termino;

}

}

}

}

   
   
   
return "";

}


/*=========================================================
FIN DEL OBJETO
=========================================================*/

};


/*
=========================================================
FIN PALBUSCADOR.js

Versión 2.2 LTS

✓ Código desde 1 carácter
✓ Nombre desde 3 caracteres
✓ Geología desde 4 caracteres
✓ Búsqueda por prefijo
✓ Código independiente
✓ Nombre independiente
✓ Geología independiente
✓ Ignora mayúsculas
✓ Ignora tildes
✓ Normaliza ñ
✓ Orden alfabético
✓ Autocompletado
✓ Interpretación de búsqueda

=========================================================
*/




