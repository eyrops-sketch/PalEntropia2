/*
========================================================
leepalmodo.js v1.0 LTS
Decodificador de Modos de Vida
PalEntropía

Función:

j9 → MV

Estructura de j9:

XXX

El código j9 contiene tres caracteres numéricos.

Ejemplo:

002

↓

MV002

↓

Acuático

PALMODO.js contiene el catálogo.
leepalmodo.js interpreta el código.

========================================================
*/

window.LEEPALMODO = {


/* ======================================================
   VALIDAR PALMODO
====================================================== */

comprobarPALMODO:function(){

    return (
        typeof window.PALMODO === "object" &&
        window.PALMODO !== null
    );

},


/* ======================================================
   VALIDAR j9
====================================================== */

validar:function(j9){

    if(j9 === null || j9 === undefined){

        return {
            valido:false,
            mensaje:"j9 no puede estar vacío."
        };

    }


    let codigo =
        String(j9).trim();


    /*
    j9 debe contener exactamente
    3 caracteres numéricos.
    */

    if(!/^\d{3}$/.test(codigo)){

        return {
            valido:false,
            mensaje:
                "j9 debe contener exactamente " +
                "3 caracteres numéricos."
        };

    }


    return {

        valido:true,

        codigo:codigo

    };

},


/* ======================================================
   CONSULTAR CATÁLOGO
====================================================== */

consultar:function(codigo){

    /*
    Construir referencia:

    002 → MV002
    */

    const referencia =
        "MV" + codigo;


    const dato =
        window.PALMODO[referencia];


    /*
    Comprobar que la referencia
    existe en PALMODO.
    */

    if(!dato){

        return {

            valido:false,

            error:true,

            mensaje:
                "No existe " +
                referencia +
                " en PALMODO.js."

        };

    }


    /*
    Resultado de la consulta.
    */

    return {

        valido:true,

        error:false,

        vacio:
            codigo === "000",

        codigo:
            dato.codigo,

        nombre:
            dato.nombre,

        descripcion:
            dato.descripcion

    };

},


/* ======================================================
   DECODIFICAR j9
====================================================== */

decodificar:function(j9){

    /*
    Comprobar que PALMODO
    está disponible.
    */

    if(!this.comprobarPALMODO()){

        return {

            valido:false,

            error:true,

            mensaje:
                "PALMODO.js no se ha " +
                "cargado correctamente."

        };

    }


    /*
    Validar j9.
    */

    const validacion =
        this.validar(j9);


    if(!validacion.valido){

        return {

            valido:false,

            error:true,

            mensaje:
                validacion.mensaje

        };

    }


    /*
    Consultar catálogo.
    */

    const modo =
        this.consultar(
            validacion.codigo
        );


    if(!modo.valido){

        return modo;

    }


    /*
    Resultado final.
    */

    return {

        valido:true,

        error:false,

        j9:
            validacion.codigo,

        MV:{

            codigo:
                modo.codigo,

            nombre:
                modo.nombre,

            descripcion:
                modo.descripcion

        }

    };

}

};
