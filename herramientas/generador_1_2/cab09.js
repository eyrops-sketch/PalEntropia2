/*
========================================================
PalEntropía
CAB09.js
Generador de Paleofichas 1.1

FASE 4A — ESTADÍSTICAS

- Botón Estadísticas
- Lightbox independiente
- Sin datos todavía
- Sin master.csv
- Ecología pertenece exclusivamente a CAB10
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

        if (
            document.getElementById("botonEstadisticas")
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
           INSERTAR
           ========================================= */

        contenedor.appendChild(
            botonEstadisticas
        );


        ficha.appendChild(
            contenedor
        );


        /* =========================================
           ABRIR LIGHTBOX
           ========================================= */

        botonEstadisticas.onclick =
            function() {


                /* Evitar duplicado */

                if (
                    document.getElementById(
                        "lightboxEstadisticas"
                    )
                ) {

                    return;

                }


                /* =================================
                   LIGHTBOX
                   ================================= */

                const lightbox =
                    document.createElement("div");


                lightbox.id =
                    "lightboxEstadisticas";


                /* =================================
                   VENTANA
                   ================================= */

                const ventana =
                    document.createElement("div");


                ventana.innerHTML =

                    "<h2>Estadísticas</h2>" +

                    "<p>" +
                    "Información estadística de la paleoficha." +
                    "</p>";


                /* =================================
                   CERRAR
                   ================================= */

                const cerrar =
                    document.createElement("button");


                cerrar.type =
                    "button";


                cerrar.textContent =
                    "×";


                cerrar.setAttribute(
                    "aria-label",
                    "Cerrar estadísticas"
                );


                cerrar.onclick =
                    function() {

                        lightbox.remove();

                    };


                ventana.appendChild(
                    cerrar
                );


                lightbox.appendChild(
                    ventana
                );


                document.body.appendChild(
                    lightbox
                );


            };


        console.log(
            "CAB09 — Estadísticas preparado."
        );

    }
);
