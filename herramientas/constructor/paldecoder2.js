/*
========================================================
PALDECODER2.js v1.0 LTS

Decodificador Universal Biológico
PalEntropía

Responsabilidades:

1. Interpretar modo_vida (MVxxx)
   usando PALMODO.js

2. Interpretar medio_compuesto
   usando PALMEDIO.js

No modifica:
- PALDECODER.js (cronología LTS)
- PALHAB.js
- PALSTATS.js

========================================================
*/


window.PALDECODER2 = {


/*
========================================================
 decodeModoVida()

 Entrada:

 "MV001"

 Proceso:

 MV001
   ↓
 PALMODO
   ↓
 Registro interpretado

 Salida:

 {
   codigo:"MV001",
   nombre:"Terrestre"
 }

========================================================
*/


decodeModoVida(codigo){


    if(!codigo || typeof codigo !== "string"){
        return null;
    }


    codigo = codigo
    .trim()
    .toUpperCase();



    if(!codigo.startsWith("MV")){
        return null;
    }



    if(!window.PALMODO){
        return null;
    }



    const modo = PALMODO[codigo];



    if(!modo){
        return null;
    }



    return modo;


},



/*
========================================================

Fin Parte 1

========================================================
*/


};

/*
========================================================
 decodeMedio()

 Entrada:

 "003003002003"

 Estructura:

 Slot 1 → SMxxx Medio ecológico
 Slot 2 → Lxxx  Localización
 Slot 3 → ESxxx Estrato ecológico
 Slot 4 → Cxxx  Comportamiento espacial

 Salida:

 {
   medio:{},
   localizacion:{},
   estrato:{},
   comportamiento:{}
 }

========================================================
*/


decodeMedio(codigo){


    if(!codigo || typeof codigo !== "string"){
        return null;
    }



    codigo = codigo
    .trim()
    .toUpperCase();



    if(codigo.length !== 12){
        return null;
    }



    if(!window.PALMEDIO){
        return null;
    }



    const sm = codigo.substring(0,3);
    const l  = codigo.substring(3,6);
    const es = codigo.substring(6,9);
    const c  = codigo.substring(9,12);



    return {


        medio:
            PALMEDIO["SM" + sm] || null,


        localizacion:
            PALMEDIO["L" + l] || null,


        estrato:
            PALMEDIO["ES" + es] || null,


        comportamiento:
            PALMEDIO["C" + c] || null



    };


},

/*
========================================================
 obtenerModoVida()

 Devuelve una versión limpia del modo de vida

 Entrada:

 "MV001"

 Salida:

 {
   codigo:"MV001",
   nombre:"Terrestre"
 }

========================================================
*/


obtenerModoVida(codigo){


    const modo = this.decodeModoVida(codigo);


    if(!modo){
        return null;
    }


    return {

        codigo: modo.codigo,
        nombre: modo.nombre,
        descripcion: modo.descripcion

    };


},



/*
========================================================
 obtenerMedio()

 Devuelve una lista limpia del medio compuesto

 Entrada:

 "003003002003"

 Salida:

 Array con elementos válidos

========================================================
*/


obtenerMedio(codigo){


    const medio = this.decodeMedio(codigo);


    if(!medio){
        return [];
    }


    return [

        medio.medio,
        medio.localizacion,
        medio.estrato,
        medio.comportamiento

    ].filter(item => item !== null);



},



/*
========================================================
 esValidoModoVida()

 Comprueba que existe un código MV

========================================================
*/


esValidoModoVida(codigo){


    if(!codigo || typeof codigo !== "string"){
        return false;
    }


    codigo = codigo.trim().toUpperCase();


    if(!codigo.startsWith("MV")){
        return false;
    }


    if(!window.PALMODO){
        return false;
    }


    return !!PALMODO[codigo];


},



/*
========================================================
 esValidoMedio()

 Comprueba que el código compuesto
 tiene estructura correcta

========================================================
*/


esValidoMedio(codigo){


    if(!codigo || typeof codigo !== "string"){
        return false;
    }


    codigo = codigo.trim();



    if(codigo.length !== 12){
        return false;
    }


    return true;


},

/*
========================================================
 API PÚBLICA PALDECODER2 v1.0 LTS


 decodeModoVida(codigo)

    Interpreta un código MVxxx.

    Ejemplo:

    MV001

    devuelve el registro correspondiente
    de PALMODO.js.



 decodeMedio(codigo)

    Interpreta un campo medio_compuesto.

    Ejemplo:

    003003002003

    divide los cuatro slots:

    SMxxx
    Lxxx
    ESxxx
    Cxxx

    y consulta PALMEDIO.js.



 obtenerModoVida(codigo)

    Devuelve una versión limpia del modo
    de vida para mostrar en interfaces.



 obtenerMedio(codigo)

    Devuelve una lista limpia de elementos
    del medio compuesto.



 esValidoModoVida(codigo)

    Comprueba que un código MV exista
    dentro de PALMODO.js.



 esValidoMedio(codigo)

    Comprueba la estructura básica
    del código de medio compuesto.


========================================================
*/


};





