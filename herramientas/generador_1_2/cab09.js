/*
========================================================
CAB09.js v1.0
LIGHTBOX DE PRUEBA
PalEntropía — Generador 1.2
========================================================

FUNCIÓN:

- Crea un pequeño botón circular dentro de #ficha
- Lo coloca en la esquina superior derecha
- Abre un Lightbox independiente
- Utiliza una imagen de prueba ficticia
- NO lee datos de master.csv
- NO lee PALSTATS
- NO modifica otros CAB
- NO modifica la Paleoficha

========================================================
*/

(function(){

"use strict";


/* =====================================================
   ESPERAR A QUE EXISTA LA PALEOFICHA
   ===================================================== */

function iniciarCAB09(){

    const ficha =
        document.getElementById("ficha");

    if(!ficha){

        console.warn(
            "CAB09: no existe #ficha."
        );

        return;

    }


    /* =================================================
       EVITAR DUPLICADOS
       ================================================= */

    if(
        document.getElementById(
            "botonLightboxCAB09"
        )
    ){

        return;

    }


    /* =================================================
       BOTÓN LIGHTBOX
       ================================================= */

    const boton =
        document.createElement("button");

    boton.id =
        "botonLightboxCAB09";

    boton.type =
        "button";

    boton.title =
        "Ampliar imagen";

    boton.setAttribute(
        "aria-label",
        "Ampliar imagen"
    );

    boton.innerHTML =
        "⛶";


    ficha.appendChild(
        boton
    );


    /* =================================================
       LIGHTBOX
       ================================================= */

    const visor =
        document.createElement("div");

    visor.id =
        "visorLightboxCAB09";

    visor.setAttribute(
        "aria-hidden",
        "true"
    );


    /* =================================================
       BOTÓN CERRAR
       ================================================= */

    const cerrar =
        document.createElement("button");

    cerrar.id =
        "cerrarLightboxCAB09";

    cerrar.type =
        "button";

    cerrar.title =
        "Cerrar";

    cerrar.setAttribute(
        "aria-label",
        "Cerrar Lightbox"
    );

    cerrar.innerHTML =
        "×";


    /* =================================================
       CONTENIDO DE PRUEBA
       ================================================= */

    const contenido =
        document.createElement("div");

    contenido.id =
        "contenidoLightboxCAB09";


    const titulo =
        document.createElement("div");

    titulo.id =
        "tituloLightboxCAB09";

    titulo.textContent =
        "LIGHTBOX DE PRUEBA";


    const texto =
        document.createElement("div");

    texto.id =
        "textoLightboxCAB09";

    texto.textContent =
        "Visor independiente — datos ficticios";


    /*
    Imagen SVG ficticia.

    No depende de ningún archivo externo.
    */

    const imagen =
        document.createElement("div");

    imagen.id =
        "imagenPruebaCAB09";

    imagen.innerHTML =
        `
        <svg
            viewBox="0 0 600 400"
            role="img"
            aria-label="Imagen ficticia de prueba">

            <rect
                x="0"
                y="0"
                width="600"
                height="400"
                rx="20"
                fill="#151719"/>

            <circle
                cx="300"
                cy="200"
                r="110"
                fill="#62d6ff"
                opacity="0.18"/>

            <circle
                cx="300"
                cy="200"
                r="70"
                fill="none"
                stroke="#62d6ff"
                stroke-width="4"/>

            <text
                x="300"
                y="210"
                text-anchor="middle"
                fill="#62d6ff"
                font-size="28"
                font-family="Arial">

                IMAGEN DE PRUEBA

            </text>

        </svg>
        `;


    contenido.appendChild(
        titulo
    );

    contenido.appendChild(
        texto
    );

    contenido.appendChild(
        imagen
    );


    visor.appendChild(
        cerrar
    );

    visor.appendChild(
        contenido
    );


    document.body.appendChild(
        visor
    );


    /* =================================================
       ABRIR
       ================================================= */

    boton.addEventListener(
        "click",
        function(){

            visor.style.display =
                "flex";

            visor.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.style.overflow =
                "hidden";

        }
    );


    /* =================================================
       CERRAR
       ================================================= */

    cerrar.addEventListener(
        "click",
        cerrarLightbox
    );


    /* =================================================
       CERRAR PULSANDO FUERA
       ================================================= */

    visor.addEventListener(
        "click",
        function(event){

            if(
                event.target === visor
            ){

                cerrarLightbox();

            }

        }
    );


    /* =================================================
       CERRAR CON ESC
       ================================================= */

    document.addEventListener(
        "keydown",
        function(event){

            if(
                event.key === "Escape" &&
                visor.style.display === "flex"
            ){

                cerrarLightbox();

            }

        }
    );


    function cerrarLightbox(){

        visor.style.display =
            "none";

        visor.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

    }


    console.log(
        "CAB09: Lightbox de prueba iniciado correctamente."
    );

}


/* =====================================================
   INICIO
   ===================================================== */

if(
    document.readyState === "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        iniciarCAB09
    );

}
else{

    iniciarCAB09();

}


})();
