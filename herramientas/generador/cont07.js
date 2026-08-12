/*
========================================================
PalEntropía
cont07.js v1.0 LTS

CONTENEDOR DE CAB07

Función:

- Recibe el registro completo procedente de CAB07.
- Lo guarda en memoria.
- No carga CSV.
- No interpreta datos.
- No modifica datos.
- No consulta PALGEO.
- No ejecuta funciones externas.

Entrada:

registro completo procedente de CAB07

Salida:

window.CONT07_ACTUAL

========================================================
*/


window.CONT07_ACTUAL = null;


window.CONT07 = {


    /* =====================================================
       GUARDAR REGISTRO
       ===================================================== */

    guardar(registro) {


        /*
        -----------------------------------------------------
        COMPROBAR REGISTRO
        -----------------------------------------------------
        */

        if (
            !registro ||
            typeof registro !== "object"
        ) {

            window.CONT07_ACTUAL = null;

            return null;

        }


        /*
        -----------------------------------------------------
        GUARDAR REGISTRO
        -----------------------------------------------------

        Se conserva exactamente el registro
        recibido desde CAB07.

        CONT07 NO MODIFICA LOS DATOS.
        */

        window.CONT07_ACTUAL =
            registro;


        /*
        -----------------------------------------------------
        PRUEBA DE RECEPCIÓN
        -----------------------------------------------------

        Permite comprobar que CAB07
        ha entregado correctamente
        el registro al contenedor.
        */

        console.log(
            "CONT07: registro recibido",
            window.CONT07_ACTUAL
        );


        /*
        -----------------------------------------------------
        DEVOLVER REGISTRO
        -----------------------------------------------------
        */

        return window.CONT07_ACTUAL;

    },


    /* =====================================================
       OBTENER REGISTRO ACTUAL
       ===================================================== */

    obtener() {

        return window.CONT07_ACTUAL;

    },


    /* =====================================================
       LIMPIAR
       ===================================================== */

    limpiar() {

        window.CONT07_ACTUAL =
            null;

    }

};


/*
========================================================
FIN cont07.js
========================================================
*/
