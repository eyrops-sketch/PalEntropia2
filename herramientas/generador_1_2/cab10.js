/*
========================================================
PalEntropía
CAB10.js
Generador de Paleofichas 1.1

ECOLOGÍA

CAB10:
- Crea botón Ecología
- Abre el lightbox
- Coordina los módulos de Ecología

CAB12 → Modo de vida
CAB13 → Medio de vida
CAB14 → Hábitats
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
       ABRIR ECOLOGÍA
       ========================================= */

    botonEcologia.onclick =
        function() {


            /*
            -------------------------------------
            EVITAR DUPLICADO
            -------------------------------------
            */

            if (
                document.getElementById(
                    "lightboxEcologia"
                )
            ) {

                return;

            }


            /*
            -------------------------------------
            LIGHTBOX
            -------------------------------------
            */

            const lightbox =
                document.createElement(
                    "div"
                );


            lightbox.id =
                "lightboxEcologia";


            /*
            -------------------------------------
            VENTANA
            -------------------------------------
            */

            const ventana =
                document.createElement(
                    "div"
                );


            /*
            -------------------------------------
            TÍTULO
            -------------------------------------
            */

            const titulo =
                document.createElement(
                    "h2"
                );


            titulo.textContent =
                "Ecología";


            ventana.appendChild(
                titulo
            );


            /*
            -------------------------------------
            CONTENEDOR CAB12
            -------------------------------------
            */

            const contenidoCAB12 =
                document.createElement(
                    "div"
                );


            contenidoCAB12.id =
                "contenidoCAB12";


            ventana.appendChild(
                contenidoCAB12
            );


            /*
            -------------------------------------
            BOTÓN CERRAR
            -------------------------------------
            */

            const cerrar =
                document.createElement(
                    "button"
                );


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


            /*
            -------------------------------------
            MOSTRAR LIGHTBOX
            -------------------------------------
            */

            lightbox.appendChild(
                ventana
            );


            document.body.appendChild(
                lightbox
            );


            /*
            -------------------------------------
            CAB12
            -------------------------------------
            */

            if (
                window.CAB12 &&
                typeof window.CAB12.mostrar ===
                    "function"
            ) {

                window.CAB12.mostrar(
                    contenidoCAB12
                );

            } else {

                console.error(
                    "CAB10: CAB12 no está disponible."
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
