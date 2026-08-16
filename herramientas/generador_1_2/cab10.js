/*
========================================================
PalEntropía
CAB10.js
Generador de Paleofichas 1.1

FASE 4A — LIGHTBOX ECOLOGÍA

- Botón Ecología
- Lightbox independiente

SIN:
- datos ecológicos
- master.csv
- CSS externo
- lógica de CAB09
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
           COMPROBAR SI EL BOTÓN YA EXISTE
           ========================================= */

        if (
            document.getElementById("botonEcologia")
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


        /* =========================================
           INSERTAR BOTÓN
           ========================================= */

        let contenedor =
            document.getElementById("botonesCAB09");


        if (!contenedor) {

            contenedor =
                document.createElement("div");

            contenedor.id =
                "botonesCAB09";

            ficha.appendChild(
                contenedor
            );

        }


        contenedor.appendChild(
            botonEcologia
        );


        /* =========================================
           ABRIR LIGHTBOX
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

    }
);
