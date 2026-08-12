/*
========================================================
PalEntropía
CONT07.js
Contenedor independiente de CAB07

FUNCIÓN:

- Recibe el registro completo procedente de CAB07.
- Conserva todos sus campos.
- Permite consultar el registro actual.
- No interpreta datos.
- No modifica datos.
- No utiliza PALGEO.
- No depende de cargacont.js.

FLUJO:

master.csv
   ↓
CAB07
   ↓
CONT07
   ↓
Navegador / futuros filtros

========================================================
*/


window.CONT07 = {


    /* =====================================================
       REGISTRO ACTUAL
       ===================================================== */

    registro: null,


    /* =====================================================
       GUARDAR

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
        CONSERVAR EL REGISTRO

        CONT07 mantiene su propia copia.
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
        DEVOLVER REGISTRO GUARDADO
        -----------------------------------------------------
        */

        return this.registro;

    },


    /* =====================================================
       OBTENER

       Devuelve el registro actualmente almacenado.
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

       Comprueba si el registro almacenado
       corresponde al código solicitado.
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
       LIMPIAR

       Vacía el contenedor.
       ===================================================== */

    limpiar() {

        this.registro = null;

    }


};


/*
========================================================
FIN CONT07.js
========================================================
*/
