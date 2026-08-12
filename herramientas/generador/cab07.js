/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

PRIMERA FUNCIÓN

- Recibe j1
- Obtiene el registro completo desde master.csv
- Guarda el resultado en MASTER_ACTUAL
- Muestra j3
- No utiliza PALGEO todavía
========================================================
*/


window.CAB07 = {


    /* =====================================================
       PROCESAR
       ===================================================== */

    async procesar(j1) {


        /*
        -----------------------------------------------------
        COMPROBAR FUNCIÓN MAESTRA
        -----------------------------------------------------
        */

        if (
            typeof window.cargarMasterPorJ1 !==
            "function"
        ) {

            console.error(
                "CAB07: cargarMasterPorJ1 no está disponible."
            );

            return null;

        }


        /*
        -----------------------------------------------------
        OBTENER REGISTRO COMPLETO
        -----------------------------------------------------
        */

        const datos =
            await window.cargarMasterPorJ1(
                j1
            );


        /*
        -----------------------------------------------------
        COMPROBAR RESULTADO
        -----------------------------------------------------
        */

        if (!datos) {

            console.warn(
                "CAB07: No se encontró el registro:",
                j1
            );

            return null;

        }


        /*
        -----------------------------------------------------
        MOSTRAR J3
        -----------------------------------------------------
        */

        const cronologia =
            document.getElementById(
                "cronologia"
            );


        if (cronologia) {

            cronologia.textContent =
                datos.j3 || "—";

        }


        /*
        -----------------------------------------------------
        DEVOLVER REGISTRO COMPLETO
        -----------------------------------------------------
        */

        return datos;

    }

};


/*
========================================================
FIN CAB07.js
========================================================
*/
