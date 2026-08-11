/*
========================================================
leepalmedio.js v1.0 LTS
Decodificador de Medios Ecológicos
PalEntropía

Función:

j10 → SM + L + ES + C

Estructura de j10:

XXXXXXXXXXXX

Dividido en cuatro bloques:

SM L ES C

Ejemplo:

002002004002

↓

SM002
L002
ES004
C002

PALMEDIO.js contiene el catálogo.
leepalmedio.js interpreta el código.

========================================================
*/

window.LEEPALMEDIO = {


/* ======================================================
   VALIDAR PALMEDIO
====================================================== */

comprobarPALMEDIO:function(){

    return (
        typeof window.PALMEDIO === "object" &&
        window.PALMEDIO !== null
    );

},


/* ======================================================
   VALIDAR j10
====================================================== */

validar:function(j10){

    if(j10 === null || j10 === undefined){

        return {
            valido:false,
            mensaje:"j10 no puede estar vacío."
        };

    }


    let codigo =
        String(j10).trim();


    /*
    j10 debe contener exactamente
    12 caracteres numéricos.
    */

    if(!/^\d{12}$/.test(codigo)){

        return {
            valido:false,
            mensaje:
                "j10 debe contener exactamente " +
                "12 caracteres numéricos."
        };

    }


    return {

        valido:true,

        codigo:codigo

    };

},


/* ======================================================
   DESCOMPONER j10
====================================================== */

descomponer:function(j10){

    const validacion =
        this.validar(j10);


    if(!validacion.valido){

        return validacion;

    }


    const codigo =
        validacion.codigo;


    /*
    002002004002

    002 | 002 | 004 | 002
     ↓     ↓     ↓     ↓
    SM    L     ES    C
    */


    const sm =
        codigo.substring(0,3);


    const l =
        codigo.substring(3,6);


    const es =
        codigo.substring(6,9);


    const c =
        codigo.substring(9,12);


    return {

        valido:true,

        j10:codigo,

        SM:sm,

        L:l,

        ES:es,

        C:c

    };

},


/* ======================================================
   CONSULTAR CATÁLOGO
====================================================== */

consultar:function(prefijo,codigo){

    /*
    Construir referencia:

    SM + 002 → SM002
    L  + 002 → L002
    ES + 004 → ES004
    C  + 002 → C002

    También funciona con:

    SM000
    L000
    ES000
    C000

    Los códigos 000 se consultan
    directamente en PALMEDIO.js.
    */


    const referencia =
        prefijo + codigo;


    const dato =
        window.PALMEDIO[referencia];


    /*
    Comprobar que la referencia
    existe en PALMEDIO.
    */

    if(!dato){

        return {

            valido:false,

            error:true,

            mensaje:
                "No existe " +
                referencia +
                " en PALMEDIO.js."

        };

    }


    return {

        valido:true,

        error:false,

        vacio:
            codigo === "000",

        codigo:
            dato.codigo,

        nombre:
            dato.nombre,

        categoria:
            dato.categoria,

        descripcion:
            dato.descripcion

    };

},


/* ======================================================
   DECODIFICAR j10
====================================================== */

decodificar:function(j10){

    /*
    Comprobar que PALMEDIO
    está disponible.
    */

    if(!this.comprobarPALMEDIO()){

        return {

            valido:false,

            error:true,

            mensaje:
                "PALMEDIO.js no se ha " +
                "cargado correctamente."

        };

    }


    /*
    Descomponer j10.
    */

    const partes =
        this.descomponer(j10);


    if(!partes.valido){

        return {

            valido:false,

            error:true,

            mensaje:
                partes.mensaje

        };

    }


    /*
    Consultar SM.
    */

    const medioSM =
        this.consultar(
            "SM",
            partes.SM
        );


    if(!medioSM.valido){

        return medioSM;

    }


    /*
    Consultar L.
    */

    const medioL =
        this.consultar(
            "L",
            partes.L
        );


    if(!medioL.valido){

        return medioL;

    }


    /*
    Consultar ES.
    */

    const medioES =
        this.consultar(
            "ES",
            partes.ES
        );


    if(!medioES.valido){

        return medioES;

    }


    /*
    Consultar C.
    */

    const medioC =
        this.consultar(
            "C",
            partes.C
        );


    if(!medioC.valido){

        return medioC;

    }


    /*
    Resultado final.
    */

    return {

        valido:true,

        error:false,

        j10:partes.j10,


        SM:{

            codigo:
                medioSM.codigo,

            nombre:
                medioSM.nombre,

            categoria:
                medioSM.categoria,

            descripcion:
                medioSM.descripcion

        },


        L:{

            codigo:
                medioL.codigo,

            nombre:
                medioL.nombre,

            categoria:
                medioL.categoria,

            descripcion:
                medioL.descripcion

        },


        ES:{

            codigo:
                medioES.codigo,

            nombre:
                medioES.nombre,

            categoria:
                medioES.categoria,

            descripcion:
                medioES.descripcion

        },


        C:{

            codigo:
                medioC.codigo,

            nombre:
                medioC.nombre,

            categoria:
                medioC.categoria,

            descripcion:
                medioC.descripcion

        }

    };

}

};
