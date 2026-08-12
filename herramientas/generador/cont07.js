/*
========================================================
PalEntropía
CONT07.js

CONTENEDOR INDEPENDIENTE DE CAB07

Función:

- Recibe el registro completo procedente de CAB07.
- Guarda el registro en memoria.
- Permite consultar el registro actual.
- Permite comprobar si existe.
- Permite limpiarlo.

NO:
- Lee master.csv.
- Lee PALGEO.
- Interpreta cronología.
- Modifica datos.
- Carga Paleofichas.
- Interfiere con CARGACONT.
- Interfiere con PALNAVEGADOR.

Flujo:

MASTER.CSV
    ↓
  CAB07
    ↓
 CONT07

========================================================
*/


window.CONT07 = {


    /* =====================================================
       VERSIÓN
       ===================================================== */

    version: "1.0 LTS",


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

            console.warn(
                "CONT07: registro inválido."
            );

            return false;

        }


        /*
        -----------------------------------------------------
        GUARDAR REFERENCIA DEL REGISTRO
        -----------------------------------------------------
        
        No modificamos ningún campo.
        */

        this.registro =
            datos;


        return true;

    },


    /* =====================================================
       OBTENER
       
       Devuelve el registro almacenado.
       ===================================================== */

    obtener() {


        return this.registro;


    },


    /* =====================================================
       EXISTE
       
       Indica si CONT07 contiene un registro.
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
       LIMPIAR
       ===================================================== */

    limpiar() {


        this.registro =
            null;


        return true;

    }


};


/*
========================================================
FIN CONT07.js
========================================================
*/
