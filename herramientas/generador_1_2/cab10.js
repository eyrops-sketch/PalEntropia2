/*
========================================================
PalEntropía
CAB10.js
Generador de Paleofichas 1.1

FASE 4A — LIGHTBOX ECOLOGÍA
========================================================
*/

document.addEventListener(
    "palentropia:contenedor-cargado",
    function() {

        const botonEcologia =
            document.getElementById("botonEcologia");


        if (!botonEcologia) {

            console.warn(
                "CAB10: no se encontró el botón Ecología."
            );

            return;

        }


        /* =========================================
           EVITAR DUPLICAR EL EVENTO
           ========================================= */

        if (
            botonEcologia.dataset.cab10Activo === "true"
        ) {

            return;

        }


        botonEcologia.dataset.cab10Activo =
            "true";


        /* =========================================
           ABRIR LIGHTBOX ECOLOGÍA
           ========================================= */

        botonEcologia.onclick =
            function() {

                const lightbox =
                    document.createElement("div");


                lightbox.id =
                    "lightboxEcologia";


                /* =================================
                   FONDO
                   ================================= */

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
                    "<h2>Ecología</h2>" +
                    "<p>Lightbox funcionando.</p>";


                /* =================================
                   BOTÓN CERRAR
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


        console.log(
            "CAB10 — Ecología preparado."
        );

    }
);
