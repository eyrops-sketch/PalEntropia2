/*
========================================================
PalEntropía
CAB10.js
Generador de Paleofichas 1.1

FASE 4A — LIGHTBOX ECOLOGÍA

- Crea botón Ecología
- Se integra con CAB09
- Lightbox independiente
- Sin datos todavía
- Sin master.csv
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
           BUSCAR CONTENEDOR DE BOTONES
           ========================================= */

        let contenedor =
            document.getElementById(
                "botonesCAB09"
            );


        /*
           CAB09 crea primero el contenedor.
           Si por cualquier motivo todavía no existe,
           CAB10 crea uno propio.
        */

        if (!contenedor) {

            contenedor =
                document.createElement("div");

            contenedor.id =
                "botonesCAB09";

            ficha.appendChild(
                contenedor
            );

        }


        /* =========================================
           EVITAR DUPLICADO
           ========================================= */

        if (
            document.getElementById(
                "botonEcologia"
            )
        ) {

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
           MARCADOR
           ========================================= */

        botonEcologia.dataset.cab10Activo =
            "true";


        /* =========================================
           ABRIR LIGHTBOX ECOLOGÍA
           ========================================= */

        botonEcologia.onclick =
            function() {


                /* ================================
                   EVITAR DUPLICADO
                   ================================ */

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
                   BOTÓN CERRAR
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
                   CONSTRUIR LIGHTBOX
                   ================================ */

                lightbox.appendChild(
                    ventana
                );


                document.body.appendChild(
                    lightbox
                );


            };


        console.log(
            "CAB10 — Ecología preparado."
        );

    }
);
