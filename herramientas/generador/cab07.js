/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

BLOQUE:
- Obtener registro completo desde master.csv mediante j1
- Guardar registro en MASTER_ACTUAL
- Obtener j3
- Procesar j3 mediante LEEPALGEO
- Mostrar cronología procesada en la Paleoficha

CAB07 es la función maestra de cronología.

NO modifica:
- LEEPALJSON
- CARGACONT
- PALGEO
- PALGEOSIMPLIFICADO
========================================================
*/


window.CAB07 = {


    /* =====================================================
       PROCESAR PALEOFICHA
       ===================================================== */

    async procesar(j1) {


        /*
        -----------------------------------------------------
        1. COMPROBAR CARGADOR DE MASTER.CSV
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
        2. OBTENER REGISTRO COMPLETO
        -----------------------------------------------------
        */

        const registro =
            await window.cargarMasterPorJ1(
                j1
            );


        if (!registro) {

            console.warn(
                "CAB07: No se encontró el registro:",
                j1
            );

            return null;

        }


        /*
        -----------------------------------------------------
        3. GUARDAR REGISTRO COMPLETO EN MEMORIA
        -----------------------------------------------------
        */

        window.MASTER_ACTUAL =
            registro;


        /*
        -----------------------------------------------------
        4. OBTENER J3
        -----------------------------------------------------
        */

        const j3 =
            registro.j3;


        if (!j3) {

            console.warn(
                "CAB07: El registro no contiene j3:",
                j1
            );

            mostrarCronologia(
                "Cronología no disponible"
            );

            return registro;

        }


        /*
        -----------------------------------------------------
        5. COMPROBAR LEEPALGEO
        -----------------------------------------------------
        */

        if (
            !window.LEEPALGEO ||
            typeof window.LEEPALGEO.leer !==
            "function"
        ) {

            console.error(
                "CAB07: LEEPALGEO no está disponible."
            );

            mostrarCronologia(
                j3
            );

            return registro;

        }


        /*
        -----------------------------------------------------
        6. PROCESAR J3 MEDIANTE LEEPALGEO
        -----------------------------------------------------
        */

        const resultado =
            window.LEEPALGEO.leer({

                j1:
                    registro.j1,

                j2:
                    registro.j2,

                j3:
                    j3

            });


        /*
        -----------------------------------------------------
        7. COMPROBAR RESULTADO
        -----------------------------------------------------
        */

        if (!resultado) {

            console.warn(
                "CAB07: LEEPALGEO no pudo procesar:",
                j3
            );

            mostrarCronologia(
                j3
            );

            return registro;

        }


        /*
        -----------------------------------------------------
        8. GUARDAR RESULTADO GEOLÓGICO
        -----------------------------------------------------
        */

        window.MASTER_ACTUAL.intervalo =
            resultado.intervalo || "";

        window.MASTER_ACTUAL.periodo =
            resultado.periodo || "";

        window.MASTER_ACTUAL.subperiodo =
            resultado.subperiodo || "";


        /*
        -----------------------------------------------------
        9. MOSTRAR RESULTADO
        -----------------------------------------------------
        */

        mostrarCronologia(
            resultado
        );


        /*
        -----------------------------------------------------
        10. DEVOLVER REGISTRO COMPLETO
        -----------------------------------------------------
        */

        return window.MASTER_ACTUAL;

    }

};


/*
========================================================
MOSTRAR CRONOLOGÍA
========================================================
*/

function mostrarCronologia(
    resultado
) {


    const elemento =
        document.getElementById(
            "cronologia"
        );


    if (!elemento) {

        return;

    }


    /*
    -----------------------------------------------------
    SI LEEPALGEO DEVUELVE UN OBJETO
    -----------------------------------------------------
    */

    if (
        typeof resultado ===
        "object"
    ) {

        const intervalo =
            resultado.intervalo ||
            "—";

        const periodo =
            resultado.periodo ||
            "—";

        const subperiodo =
            resultado.subperiodo ||
            "—";


        elemento.innerHTML =

            "<div>" +
                intervalo +
            "</div>" +

            "<div>" +
                periodo +
            "</div>" +

            "<div>" +
                subperiodo +
            "</div>";


        return;

    }


    /*
    -----------------------------------------------------
    SI RECIBIMOS TEXTO
    -----------------------------------------------------
    */

    elemento.textContent =
        resultado || "—";

}


/*
========================================================
FIN CAB07.js
========================================================
*/
