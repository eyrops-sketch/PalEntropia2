/*
========================================================
PalEntropía
CAB10.js
Generador de Paleofichas 1.1

FASE 4A — LIGHTBOX ECOLOGÍA

- Crea botón Ecología
- Se integra junto a Estadísticas
- Lightbox independiente
- Sin datos todavía
========================================================
*/


function inicializarCAB10() {

    const ficha =
        document.getElementById("ficha");


    if (!ficha) {

        return;

    }


    /* =========================================
       EVITAR DUPLICADO
       ========================================= */

    if (
        document.getElementById("botonEcologia")
    ) {

        return;

    }


    /* =========================================
       BUSCAR CONTENEDOR DE BOTONES
       ========================================= */

    let contenedor =
        document.getElementById(
            "botonesCAB09"
        );


    if (!contenedor) {

        return;

    }


    /* =========================================
       CREAR BOTÓN ECOLOGÍA
       ========================================= */

    const botonEcologia =
        document.createElement("button");


    botonEcologia.id =
        "botonEcologia";


    botonEcologia.type =
        "button";


    botonEcologia.textContent =
        "Ecología";


    contenedor.appendChild(
        botonEcologia
    );


    /* =========================================
       LIGHTBOX ECOLOGÍA
       ========================================= */

    botonEcologia.onclick =
        function() {


            if (
                document.getElementById(
                    "lightboxEcologia"
                )
            ) {

                return;

            }


            /* ================================
               LIGHTBOX
               ================================ */

            const lightbox =
                document.createElement("div");


            lightbox.id =
                "lightboxEcologia";


            /* ================================
               VENTANA
               ================================ */

            const ventana =
                document.createElement("div");


            ventana.innerHTML =

                "<h2>Ecología</h2>" +

                "<p>" +
                "Información ecológica de la paleoficha." +
                "</p>";


            /* ================================
               CERRAR
               ================================ */

            const cerrar =
                document.createElement("button");


            cerrar.type =
                "button";


            cerrar.textContent =
                "×";


            cerrar.setAttribute(
                "aria-label",
                "Cerrar ecología"
            );


            cerrar.onclick =
                function() {

                    lightbox.remove();

                };


            ventana.appendChild(
                cerrar
            );


            /* ================================
               MOSTRAR
               ================================ */

            lightbox.appendChild(
                ventana
            );


            document.body.appendChild(
                lightbox
            );

        };


    console.log(
        "CAB10 — Botón Ecología creado."
    );

}


/* =====================================================
   EVENTO PRINCIPAL
   ===================================================== */

document.addEventListener(
    "palentropia:contenedor-cargado",
    function() {

        inicializarCAB10();

    }
);


/* =====================================================
   RESPALDO
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setTimeout(
            function() {

                inicializarCAB10();

            },
            100
        );

    }
);
