/*
========================================================
PalEntropía
CAB02.js
Generador de Paleofichas 1.1

BLOQUE:
- Evento: contenedor cargado
- Actualización de vídeo
- Carga de imágenes
- Estadísticas CAB09
- Error del contenedor

IMPORTANTE:
- CAB02 NO decide qué ficha cargar.
- CAB02 NO llama a aleatorio().
- CAB02 NO interpreta ?codigo=.
- CAB02 solo procesa la ficha que recibe.

CAB09:
- CAB02 obtiene e1-e11 desde master.csv
- CAB02 entrega esos datos a CAB09
- CAB09 crea el botón de información estadística
- CAB09 controla su propio lightbox

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


            /* =========================================
               GUARDAR FICHA ACTUAL
               ========================================= */

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


            /* =========================================
               ESTADÍSTICAS — CAB09
               
               IMPORTANTE:
               CAB02 NO calcula nada.
               Solo obtiene el registro maestro
               correspondiente al código actual.
               ========================================= */

            if(
                window.CAB09 &&
                typeof window.cargarMasterPorJ1 === "function" &&
                ficha.j1
            ) {

                try {

                    const master =
                        await window.cargarMasterPorJ1(
                            ficha.j1
                        );


                    if(master) {

                        window.CAB09.ejecutar(
                            master
                        );

                    }
                    else {

                        console.warn(
                            "CAB02: no se encontró registro master para " +
                            ficha.j1
                        );

                    }

                }
                catch(error) {

                    console.warn(
                        "CAB02: error cargando estadísticas CAB09.",
                        error
                    );

                }

            }
            else {

                console.warn(
                    "CAB02: CAB09 o cargarMasterPorJ1 no disponible."
                );

            }


            /* =========================================
               ESTADO
               ========================================= */

            document.getElementById(
                "estado"
            ).innerHTML =

                '<span class="ok">' +

                "✓ Ficha " +

                (ficha.j1 || "") +

                " cargada" +

                "</span>";


            /* =========================================
               CONTROLES DE NAVEGACIÓN
               ========================================= */

            actualizarControlesNavegacion();


            /* =========================================
               CONSOLA
               ========================================= */

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


/*
========================================================
FIN CAB02.js
========================================================
*/
