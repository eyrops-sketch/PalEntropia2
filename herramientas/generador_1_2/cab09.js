/*
========================================================
PalEntropía
CAB09.js
Generador de Paleofichas 1.1

FASE 4A — PRUEBA LIGHTBOX ESTADÍSTICAS

- Dos botones
- Estadísticas abre lightbox
- Ecología todavía independiente
- Sin datos
- Sin CSS externo
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
           INSERTAR BOTONES
           ========================================= */

        contenedor.appendChild(
            botonEstadisticas
        );

        contenedor.appendChild(
            botonEcologia
        );

        ficha.appendChild(
            contenedor
        );


        /* =========================================
           ESTADÍSTICAS — ABRIR LIGHTBOX
           ========================================= */

        botonEstadisticas.onclick =
            function() {

                /* Crear lightbox */

                const lightbox =
                    document.createElement("div");

                lightbox.id =
                    "lightboxEstadisticas";


                /* Fondo */

                lightbox.style.position =
                    "fixed";

                lightbox.style.inset =
                    "0";

                lightbox.style.background =
                    "rgba(0,0,0,0.75)";

                lightbox.style.zIndex =
                    "99999";

                lightbox.style.display =
                    "flex";

                lightbox.style.alignItems =
                    "center";

                lightbox.style.justifyContent =
                    "center";


                /* =================================
                   VENTANA
                   ================================= */

                const ventana =
                    document.createElement("div");

                ventana.style.background =
                    "white";

                ventana.style.padding =
                    "25px";

                ventana.style.borderRadius =
                    "16px";

                ventana.style.textAlign =
                    "center";


                ventana.innerHTML =
                    "<h2>Estadísticas</h2>" +
                    "<p>Lightbox funcionando.</p>";


                /* =================================
                   CERRAR
                   ================================= */

                const cerrar =
                    document.createElement("button");

                cerrar.type =
                    "button";

                cerrar.textContent =
                    "Cerrar";


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


        /* =========================================
           ECOLOGÍA — TODAVÍA SIN LIGHTBOX
           ========================================= */

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

    }
);
