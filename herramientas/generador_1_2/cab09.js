/*
========================================================
PalEntropía
CAB09.js
Generador de Paleofichas 1.1

FASE 4A — LIGHTBOX ESTADÍSTICAS

- Botón Estadísticas
- Botón Ecología
- Lightbox independiente de Estadísticas

SIN:
- datos estadísticos
- master.csv
- CSS externo
- lógica de Ecología
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
           CONTENEDOR DE BOTONES
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


        ficha.appendChild(
            contenedor
        );


        /* =========================================
           CREAR LIGHTBOX ESTADÍSTICAS
           ========================================= */

        const lightbox =
            document.createElement("div");


        lightbox.id =
            "lightboxEstadisticas";


        lightbox.style.position =
            "fixed";


        lightbox.style.inset =
            "0";


        lightbox.style.background =
            "rgba(0,0,0,0.75)";


        lightbox.style.display =
            "none";


        lightbox.style.alignItems =
            "center";


        lightbox.style.justifyContent =
            "center";


        lightbox.style.zIndex =
            "9999";


        /* =========================================
           VENTANA
           ========================================= */

        const ventana =
            document.createElement("div");


        ventana.style.background =
            "#ffffff";


        ventana.style.padding =
            "25px";


        ventana.style.borderRadius =
            "16px";


        ventana.style.minWidth =
            "260px";


        ventana.style.textAlign =
            "center";


        ventana.innerHTML =
            "<h2>Estadísticas</h2>" +
            "<p>Lightbox preparado.</p>";


        /* =========================================
           BOTÓN CERRAR
           ========================================= */

        const cerrar =
            document.createElement("button");


        cerrar.type =
            "button";


        cerrar.textContent =
            "Cerrar";


        cerrar.style.marginTop =
            "15px";


        ventana.appendChild(
            cerrar
        );


        lightbox.appendChild(
            ventana
        );


        document.body.appendChild(
            lightbox
        );


        /* =========================================
           ABRIR ESTADÍSTICAS
           ========================================= */

        botonEstadisticas.onclick =
            function() {

                lightbox.style.display =
                    "flex";

            };


        /* =========================================
           CERRAR
           ========================================= */

        cerrar.onclick =
            function() {

                lightbox.style.display =
                    "none";

            };


        /* =========================================
           CERRAR PULSANDO FUERA
           ========================================= */

        lightbox.onclick =
            function(evento) {

                if (
                    evento.target ===
                    lightbox
                ) {

                    lightbox.style.display =
                        "none";

                }

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
