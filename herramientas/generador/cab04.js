/*
========================================================
PalEntropía
CAB04.js
Generador de Paleofichas 1.1

BLOQUE:
- Lightbox de imágenes

Código procedente del generador original.
No modificar la lógica.
========================================================
*/


/* =====================================================
   LIGHTBOX DE IMÁGENES
   ===================================================== */

const visorImagen =
    document.getElementById(
        "visorImagen"
    );


const imagenAmpliada =
    document.getElementById(
        "imagenAmpliada"
    );


function abrirLightbox(
    imagen
) {

    if(
        !imagen ||
        !imagen.src
    ) {

        return;

    }


    imagenAmpliada.src =
        imagen.currentSrc ||
        imagen.src;


    visorImagen.style.display =
        "flex";


    visorImagen.setAttribute(
        "aria-hidden",
        "false"
    );

}


function cerrarLightbox() {

    visorImagen.style.display =
        "none";


    visorImagen.setAttribute(
        "aria-hidden",
        "true"
    );


    imagenAmpliada.src =
        "";

}


/* =====================================================
   IMAGEN PRINCIPAL
   ===================================================== */

document.getElementById(
    "imagenPrincipal"
)
.addEventListener(
    "click",
    function() {

        abrirLightbox(
            this
        );

    }
);


/* =====================================================
   IMAGEN 2
   ===================================================== */

document.getElementById(
    "img2"
)
.addEventListener(
    "click",
    function() {

        abrirLightbox(
            this
        );

    }
);


/* =====================================================
   IMAGEN 3
   ===================================================== */

document.getElementById(
    "img3"
)
.addEventListener(
    "click",
    function() {

        abrirLightbox(
            this
        );

    }
);


/* =====================================================
   CERRAR
   ===================================================== */

document.getElementById(
    "cerrarImagen"
)
.addEventListener(
    "click",
    cerrarLightbox
);


/* =====================================================
   CERRAR AL PULSAR EL FONDO
   ===================================================== */

visorImagen.addEventListener(
    "click",
    function(evento) {

        if(
            evento.target ===
            visorImagen
        ) {

            cerrarLightbox();

        }

    }
);


/*
========================================================
FIN CAB04.js
========================================================
*/




