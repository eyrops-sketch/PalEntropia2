/*
========================================================
PalEntropía
CONT07.js
Contenedor independiente de CAB07

FUNCIÓN:

- Recibe el registro completo procedente de CAB07.
- Conserva todos sus campos.
- Reserva un bloque independiente para PALGEO.
- Permite guardar datos geológicos.
- Permite consultar el registro y la geología.
- No interpreta datos.
- No modifica j3.
- No consulta PALGEO directamente.

FLUJO:

master.csv
   ↓
CAB07
   ↓
CONT07
   ├── registro
   └── geologia
          ↓
       PALGEO

========================================================
*/


window.CONT07 = {


    /* =====================================================
       REGISTRO MAESTRO
       ===================================================== */

    registro: null,


    /* =====================================================
       DATOS GEOLOGICOS

       Se mantienen separados del registro maestro.
       ===================================================== */

    geologia: null,


    /* =====================================================
       GUARDAR REGISTRO

       Recibe el registro completo de CAB07.
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

            this.registro = null;

            return null;

        }


        /*
        -----------------------------------------------------
        GUARDAR COPIA DEL REGISTRO
        -----------------------------------------------------
        */

        this.registro = {

            j1:
                datos.j1 ?? "",

            j2:
                datos.j2 ?? "",

            j3:
                datos.j3 ?? "",

            j4:
                datos.j4 ?? "",

            j5:
                datos.j5 ?? "",

            j6:
                datos.j6 ?? "",

            j7:
                datos.j7 ?? "",

            j8:
                datos.j8 ?? "",

            j9:
                datos.j9 ?? "",

            j10:
                datos.j10 ?? "",


            e1:
                datos.e1 ?? "",

            e2:
                datos.e2 ?? "",

            e3:
                datos.e3 ?? "",

            e4:
                datos.e4 ?? "",

            e5:
                datos.e5 ?? "",

            e6:
                datos.e6 ?? "",

            e7:
                datos.e7 ?? "",

            e8:
                datos.e8 ?? "",

            e9:
                datos.e9 ?? "",

            e10:
                datos.e10 ?? "",

            e11:
                datos.e11 ?? ""

        };


        /*
        -----------------------------------------------------
        NUEVO REGISTRO = NUEVA GEOLOGÍA

        Evita conservar datos de PALGEO
        de la ficha anterior.
        -----------------------------------------------------
        */

        this.geologia = null;


        /*
        -----------------------------------------------------
        DEVOLVER REGISTRO
        -----------------------------------------------------
        */

        return this.registro;

    },


    /* =====================================================
       GUARDAR GEOLOGÍA

       Recibe los datos obtenidos desde PALGEO.

       No interpreta ni modifica el contenido.
       ===================================================== */

    guardarGeologia(datos) {


        /*
        -----------------------------------------------------
        COMPROBAR DATOS
        -----------------------------------------------------
        */

        if (
            !datos ||
            typeof datos !== "object"
        ) {

            this.geologia = null;

            return null;

        }


        /*
        -----------------------------------------------------
        GUARDAR COPIA
        -----------------------------------------------------
        */

        this.geologia = {


            codes:
                Array.isArray(
                    datos.codes
                )
                    ? [...datos.codes]
                    : [],


            periodo:
                Array.isArray(
                    datos.periodo
                )
                    ? [...datos.periodo]
                    : [],


            edad:
                Array.isArray(
                    datos.edad
                )
                    ? [...datos.edad]
                    : []

        };


        /*
        -----------------------------------------------------
        DEVOLVER GEOLOGÍA
        -----------------------------------------------------
        */

        return this.geologia;

    },


    /* =====================================================
       OBTENER REGISTRO
       ===================================================== */

    obtener() {


        if (
            !this.registro
        ) {

            return null;

        }


        return this.registro;

    },


    /* =====================================================
       OBTENER POR J1
       ===================================================== */

    obtenerPorJ1(j1) {


        if (
            !this.registro ||
            j1 === undefined ||
            j1 === null
        ) {

            return null;

        }


        if (
            String(
                this.registro.j1
            ).trim()
            !==
            String(j1).trim()
        ) {

            return null;

        }


        return this.registro;

    },


    /* =====================================================
       OBTENER GEOLOGÍA
       ===================================================== */

    obtenerGeologia() {


        if (
            !this.geologia
        ) {

            return null;

        }


        return this.geologia;

    },


    /* =====================================================
       OBTENER TODO

       Devuelve:

       {
           registro: {...},
           geologia: {...}
       }
       ===================================================== */

    obtenerTodo() {


        return {

            registro:
                this.registro,

            geologia:
                this.geologia

        };

    },


    /* =====================================================
       LIMPIAR

       Vacía completamente CONT07.
       ===================================================== */

    limpiar() {

        this.registro = null;

        this.geologia = null;

    }


};


/*
========================================================
FIN CONT07.js
========================================================
*/
