/*
========================================================
PalEntropía
CAB09.js
Generador de Paleofichas 1.1

FASE 3 — PRUEBA VISIBLE DE PULSACIÓN
========================================================
*/

document.addEventListener(
    "palentropia:contenedor-cargado",
    function() {

        const ficha =
            document.getElementById("ficha");


        if (!ficha) {
            return;
        }


        /* =========================================
           EVITAR DUPLICADOS
           ========================================= */

        let contenedor =
            document.getElementById("botonesCAB09");


        if (contenedor) {
            return;
        }


        /* =========================================
           CONTENEDOR
           ========================================= */

        contenedor =
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


        botonEstadisticas.onclick =
            function() {

                botonEstadisticas.textContent =
                    "✓ Estadísticas";

                setTimeout(
                    function() {

                        botonEstadisticas.textContent =
                            "Estadísticas";

                    },
                    1000
                );

            };


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


        botonEcologia.onclick =
            function() {

                botonEcologia.textContent =
                    "✓ Ecología";

                setTimeout(
                    function() {

                        botonEcologia.textContent =
                            "Ecología";

                    },
                    1000
                );

            };


        /* =========================================
           AÑADIR
           ========================================= */

        contenedor.appendChild(
            botonEstadisticas
        );

        contenedor.appendChild(
            botonEcologia
        );


        /* =========================================
           INSERTAR AL FINAL DE LA FICHA
           ========================================= */

        ficha.appendChild(
            contenedor
        );

    }
);
