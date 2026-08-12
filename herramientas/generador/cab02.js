/*
========================================================
PalEntropía
CAB02.js
Generador de Paleofichas 1.1

BLOQUE:
- Evento: contenedor cargado
- Actualización de vídeo
- Carga de imágenes
- Error del contenedor

Código procedente del generador original.
========================================================
*/


/* =====================================================
   EVENTO: CONTENEDOR CARGADO
   ===================================================== */

document.addEventListener(
    "palentropia:contenedor-cargado",
    async function(evento) {

        try {

            const ficha =
                evento.detail;


            if(!ficha) {

                throw new Error(
                    "CARGACONT no entregó ningún registro."
                );

            }


            fichaActual =
                ficha;


            /* =========================================
               POSICIONAR PUNTERO
               ========================================= */

            if(
                window.PALNAVEGADOR &&
                ficha.j1
            ) {

                await window.PALNAVEGADOR.posicionar(
                    ficha.j1
                );

            }


            /* =========================================
               DATOS
               ========================================= */

            document.getElementById(
                "titulo"
            ).textContent =
                ficha.j2 || "";


            document.getElementById(
                "codigoFicha"
            ).textContent =
                ficha.j1 || "";


            document.getElementById(
                "dieta"
            ).textContent =
                ficha.j7 || "";


            document.getElementById(
                "descripcion"
            ).textContent =
                ficha.j8 || "";


            /* =========================================
               VÍDEO
               ========================================= */

            actualizarVideo(
                ficha.j1
            );


            /* =========================================
               IMÁGENES
               ========================================= */

            cargarImagen(
                "imagenPrincipal",
                ficha.i0
            );


            cargarImagen(
                "img2",
                ficha.i2
            );


            cargarImagen(
                "img3",
                ficha.i3
            );


            /* =========================================
               MOSTRAR FICHA
               ========================================= */

            document.getElementById(
                "ficha"
            ).style.display =
                "block";


            document.getElementById(
                "estado"
            ).innerHTML =

                '<span class="ok">' +

                "✓ Ficha " +

                (ficha.j1 || "") +

                " cargada" +

                "</span>";


            actualizarControlesNavegacion();


            console.log(
                "PalEntropía — GENERADOR",
                ficha
            );

        }

        catch(error) {

            mostrarError(
                error
            );

        }

    }
);


/* =====================================================
   ACTUALIZAR VÍDEO
   ===================================================== */

function actualizarVideo(j1) {

    const contenedorVideo =
        document.getElementById(
            "videoFicha"
        );


    const botonVideo =
        document.getElementById(
            "botonVideo"
        );


    if(
        !contenedorVideo ||
        !botonVideo
    ) {

        return;

    }


    contenedorVideo.style.display =
        "none";


    botonVideo.href =
        "#";


    if(
        !window.PALVIDEO ||
        !j1
    ) {

        return;

    }


    const codigo =
        String(j1)
            .trim()
            .toUpperCase();


    const registro =
        window.PALVIDEO[codigo];


    if(
        !registro ||
        typeof registro !== "object"
    ) {

        return;

    }


    const enlace =
        registro.video;


    if(
        enlace === null ||
        enlace === undefined ||
        String(enlace).trim() === ""
    ) {

        return;

    }


    botonVideo.href =
        String(enlace).trim();


    contenedorVideo.style.display =
        "block";

}


/* =====================================================
   CARGAR IMAGEN
   ===================================================== */

function cargarImagen(
    idImagen,
    ruta
) {

    const imagen =
        document.getElementById(
            idImagen
        );


    if(!imagen) {

        return;

    }


    imagen.style.display =
        "none";


    if(!ruta) {

        return;

    }


    imagen.src =
        ruta;


    imagen.onload =
        function() {

            imagen.style.display =
                "block";

        };


    imagen.onerror =
        function() {

            imagen.style.display =
                "none";

        };

}


/* =====================================================
   ERROR DEL CONTENEDOR
   ===================================================== */

document.addEventListener(
    "palentropia:error-carga",
    function(evento) {

        mostrarError(
            evento.detail
        );

    }
);


function mostrarError(error) {

    console.error(
        "ERROR GENERADOR:",
        error
    );


    document.getElementById(
        "estado"
    ).innerHTML =

        '<span class="error">' +

        "✗ ERROR: " +

        (
            error &&
            error.message

                ? error.message

                : error
        ) +

        "</span>";

}
