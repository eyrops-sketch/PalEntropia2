/*
========================================================
PalEntropía
CAB09.js
Generador de Paleofichas 1.1

FASE 3 — PULSACIÓN

- Estadísticas
- Ecología

Todavía sin lightbox.
Todavía sin datos.
========================================================
*/

document.addEventListener(
    "palentropia:contenedor-cargado",
    function() {

        const ficha =
            document.getElementById("ficha");


        if (!ficha) {

            console.warn(
                "CAB09: no se encontró #ficha."
            );

            return;

        }


        if (
            document.getElementById("botonesCAB09")
        ) {

            return;

        }


        /* =========================================
           CONTENEDOR
           ========================================= */

        const contenedor =
            document.createElement("div");


        contenedor.id =
            "botonesCAB09";


        /* =========================================
           ESTADÍSTICAS
           ========================================= */

        const botonEstadisticas =
            document.createElement("button");


        botonEstadisticas.id =
            "botonEstadisticas";


        botonEstadisticas.type =
            "button";


        botonEstadisticas.textContent =
            "Estadísticas";


        botonEstadisticas.addEventListener(
            "click",
            function() {

                console.log(
                    "CAB09 — Estadísticas pulsado."
                );

            }
        );


        /* =========================================
           ECOLOGÍA
           ========================================= */

        const botonEcologia =
            document.createElement("button");


        botonEcologia.id =
            "botonEcologia";


        botonEcologia.type =
            "button";


        botonEcologia.textContent =
            "Ecología";


        botonEcologia.addEventListener(
            "click",
            function() {

                console.log(
                    "CAB09 — Ecología pulsado."
                );

            }
        );


        /* =========================================
           AÑADIR BOTONES
           ========================================= */

        contenedor.appendChild(
            botonEstadisticas
        );


        contenedor.appendChild(
            botonEcologia
        );


        /* =========================================
           COLOCAR AL FINAL
           ========================================= */

        ficha.appendChild(
            contenedor
        );


        console.log(
            "CAB09 — botones creados y eventos preparados."
        );

    }
);
