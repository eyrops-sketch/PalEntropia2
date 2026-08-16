/*
========================================================
PalEntropía
CAB10.js
Generador de Paleofichas 1.1

FASE 4A — LIGHTBOX ECOLOGÍA

- Crea botón Ecología
- Se integra junto a Estadísticas
- Lightbox independiente
- Coordina CAB12, CAB13 y CAB14
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

    const contenedor =
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
        "🌿 Ecología";


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


            ventana.id =
                "ventanaEcologia";


            /* ================================
               CABECERA
               ================================ */

            const titulo =
                document.createElement("h2");


            titulo.textContent =
                "Ecología";


            ventana.appendChild(
                titulo
            );


            /* ================================
               CONTENIDO ECOLOGÍA
               ================================ */

            const contenidoEcologia =
                document.createElement("div");


            contenidoEcologia.id =
                "contenidoEcologia";


            ventana.appendChild(
                contenidoEcologia
            );


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
               MOSTRAR LIGHTBOX
               ================================ */

            lightbox.appendChild(
                ventana
            );


            document.body.appendChild(
                lightbox
            );


            /* ================================
               CAB12 — MODO DE VIDA
               ================================ */

            if (
                window.CAB12 &&
                typeof window.CAB12.mostrar ===
                    "function"
            ) {

                window.CAB12.mostrar(
                    contenidoEcologia
                );

            }


            /* ================================
               CAB13 — MEDIO DE VIDA
               ================================ */

            if (
                window.CAB13 &&
                typeof window.CAB13.mostrar ===
                    "function"
            ) {

                window.CAB13.mostrar(
                    contenidoEcologia
                );

            }


            /* ================================
               CAB14 — HÁBITATS
               ================================ */

            if (
                window.CAB14 &&
                typeof window.CAB14.mostrar ===
                    "function"
            ) {

                window.CAB14.mostrar(
                    contenidoEcologia
                );

            }

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
