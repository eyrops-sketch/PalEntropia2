/*
========================================================
PalEntropía
CAB09.js
Generador de Paleofichas 1.1

FASE 1 — PRUEBA DEL BOTÓN

OBJETIVO:
- Crear únicamente el botón CAB09.
- No estadísticas.
- No lightbox.
- No master.csv.
- No CSS externo.
========================================================
*/

document.addEventListener(
    "palentropia:contenedor-cargado",
    function() {

        /* =========================================
           COMPROBAR SI YA EXISTE
           ========================================= */

        if (
            document.getElementById("botonCAB09")
        ) {

            return;

        }


        /* =========================================
           CREAR BOTÓN
           ========================================= */

        const boton =
            document.createElement("button");


        boton.id =
            "botonCAB09";


        boton.type =
            "button";


        boton.textContent =
            "Estadísticas";


        /* =========================================
           INSERTAR EN LA FICHA
           ========================================= */

        const ficha =
            document.getElementById("ficha");


        if (!ficha) {

            console.warn(
                "CAB09: no se encontró el contenedor #ficha."
            );

            return;

        }


        ficha.appendChild(
            boton
        );


        console.log(
            "CAB09 — botón creado correctamente."
        );

    }
);
