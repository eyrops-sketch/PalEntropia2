/*
========================================================
PalEntropía
cont07.js v1.0 LTS

CONTENEDOR DE CAB07

Función:

- Recibe el registro completo de CAB07.
- Lo guarda en memoria.
- No carga CSV.
- No interpreta datos.
- No modifica datos.
- No consulta PALGEO.
- No ejecuta ninguna función externa.

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

        Se conserva exactamente el registro recibido.

        CONT07 NO MODIFICA LOS DATOS.
        */

        window.CONT07_ACTUAL = registro;


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

        window.CONT07_ACTUAL = null;

    }

};


/*
========================================================
FIN cont07.js
========================================================
*/





