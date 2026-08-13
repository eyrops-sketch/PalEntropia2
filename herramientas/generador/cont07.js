/*
========================================================
PalEntropía
CONT07.js

CONTENEDOR INDEPENDIENTE DE CAB07

Función:

- Recibe el registro completo procedente de CAB07.
- Guarda el registro en memoria.
- Reserva un espacio independiente para geología.
- Permite consultar el registro actual.
- Permite consultar la geología.
- Permite comprobar si existe.
- Permite limpiar el contenedor.

NO:
- Lee master.csv.
- Lee PALGEO directamente.
- Interpreta cronología.
- Modifica datos.
- Carga Paleofichas.
- Interfiere con CARGACONT.
- Interfiere con PALNAVEGADOR.

Flujo actual:

MASTER.CSV
    ↓
  CAB07
    ↓
 CONT07
    │
    └── geologia: null

========================================================
*/


window.CONT07 = {


    /* =====================================================
       VERSIÓN
       ===================================================== */

    version: "1.1 LTS",


    /* =====================================================
       REGISTRO ACTUAL
       ===================================================== */

    registro: null,


    /* =====================================================
       GEOLOGÍA ACTUAL
       
       Reservada para PALGEO.
       Todavía no se procesa aquí.
       ===================================================== */

    geologia: null,


    /* =====================================================
       GUARDAR REGISTRO
       
       Recibe el registro completo procedente de CAB07.
       ===================================================== */

    guardar(datos) {


        /*
        -----------------------------------------------------
        COMPROBAR DATOS
        -----------------------------------------------------
        */

        if (
            !datos ||
            typeof datos !== "object"
        ) {

            console.warn(
                "CONT07: registro inválido."
            );

            return false;

        }


        /*
        -----------------------------------------------------
        GUARDAR REGISTRO
        -----------------------------------------------------
        
        No modificamos ningún campo.
        */

        this.registro =
            datos;


        /*
        -----------------------------------------------------
        REINICIAR GEOLOGÍA
        -----------------------------------------------------
        
        Cada nuevo registro comienza sin datos
        geológicos hasta que PALGEO los entregue.
        */

    this.geologia = {

    rango:
        datos.rango || null,

    codes:
        Array.isArray(datos.codes)
            ? datos.codes
            : [],

    periodo:
        Array.isArray(datos.periodo)
            ? datos.periodo
            : [],

    edad:
        Array.isArray(datos.edad)
            ? datos.edad
            : []

};


        return true;

    },


    /* =====================================================
       OBTENER REGISTRO
       ===================================================== */

    obtener() {


        return this.registro;


    },


    /* =====================================================
       EXISTE
       ===================================================== */

    existe() {


        return (
            this.registro !== null
        );


    },


    /* =====================================================
       OBTENER J1
       ===================================================== */

    obtenerJ1() {


        if (
            !this.registro
        ) {

            return null;

        }


        return (
            this.registro.j1 ||
            null
        );

    },


    /* =====================================================
       OBTENER J3
       ===================================================== */

    obtenerJ3() {


        if (
            !this.registro
        ) {

            return null;

        }


        return (
            this.registro.j3 ||
            null
        );

    },


    /* =====================================================
       GUARDAR GEOLOGÍA
       
       Preparado para recibir posteriormente
       el resultado del sistema PALGEO.
       ===================================================== */

    guardarGeologia(datos) {


        if (
            datos === undefined ||
            datos === null
        ) {

            this.geologia =
                null;

            return false;

        }


        if (
            typeof datos !== "object"
        ) {

            console.warn(
                "CONT07: datos geológicos inválidos."
            );

            return false;

        }


        this.geologia =
            datos;


        return true;

    },


    /* =====================================================
       OBTENER GEOLOGÍA
       ===================================================== */

    obtenerGeologia() {


        return this.geologia;


    },


    /* =====================================================
       EXISTE GEOLOGÍA
       ===================================================== */

    existeGeologia() {


        return (
            this.geologia !== null
        );


    },


    /* =====================================================
       LIMPIAR
       ===================================================== */

    limpiar() {


        this.registro =
            null;


        this.geologia =
            null;


        return true;

    }


};


/*
========================================================
FIN CONT07.js
========================================================
*/
