/*
========================================================
PalEntropía
CAB09.js
Generador de Paleofichas 1.1

FASE 1 — BOTONES

- Estadísticas
- Ecología

Sin lightbox.
Sin estadísticas.
Sin datos.
Sin master.csv.
========================================================
*/

document.addEventListener(
    "palentropia:contenedor-cargado",
    function() {

        /* =========================================
           COMPROBAR FICHA
           ========================================= */

        const ficha =
            document.getElementById("ficha");


        if (!ficha) {

            console.warn(
                "CAB09: no se encontró #ficha."
            );

            return;

        }


        /* =========================================
           EVITAR DUPLICADOS
           ========================================= */

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
           BOTÓN ESTADÍSTICAS
           ========================================= */

        const botonEstadisticas =
            document.createElement("button");


        botonEstadisticas.id =
            "botonEstadisticas";


        botonEstadisticas.type =
            "button";


        botonEstadisticas.textContent =
            "Estadísticas";


        /* =========================================
           BOTÓN ECOLOGÍA
           ========================================= */

        const botonEcologia =
            document.createElement("button");


        botonEcologia.id =
            "botonEcologia";


        botonEcologia.type =
            "button";


        botonEcologia.textContent =
            "Ecología";


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
           COLOCAR AL FINAL DE LA PALEOFICHA
           ========================================= */

        ficha.appendChild(
            contenedor
        );


        console.log(
            "CAB09 — botones Estadísticas y Ecología creados."
        );

    }
);
