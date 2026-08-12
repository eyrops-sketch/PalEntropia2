/*
========================================================
PalEntropía
CAB05.js
Generador de Paleofichas 1.1

BLOQUE:
- Buscador
- Apertura y cierre del buscador
- Búsqueda en tiempo real
- Presentación de resultados
- Selección de resultado
- Cierre al pulsar fuera
- Tecla ESC

Código procedente del generador original.
No modificar la lógica.
========================================================
*/


/* =====================================================
   BUSCADOR
   ===================================================== */

const visorBuscador =
    document.getElementById(
        "visorBuscador"
    );


function abrirBuscador() {

    visorBuscador.style.display =
        "flex";


    visorBuscador.setAttribute(
        "aria-hidden",
        "false"
    );


    const input =
        document.getElementById(
            "buscarNombre"
        );


    if(input) {

        input.value =
            "";


        setTimeout(
            function() {

                input.focus();

            },
            50
        );

    }

}


function cerrarBuscador() {

    visorBuscador.style.display =
        "none";


    visorBuscador.setAttribute(
        "aria-hidden",
        "true"
    );

}


document.getElementById(
    "botonBuscar"
)
.addEventListener(
    "click",
    abrirBuscador
);


document.getElementById(
    "cerrarBuscador"
)
.addEventListener(
    "click",
    cerrarBuscador
);


/* =====================================================
   BÚSQUEDA EN TIEMPO REAL
   ===================================================== */

const campoBusqueda =
    document.getElementById(
        "buscarNombre"
    );


const listaResultados =
    document.getElementById(
        "listaResultados"
    );


campoBusqueda.addEventListener(
    "input",
    async function() {

        const texto =
            this.value.trim();


        /* -----------------------------------------
           LIMPIAR
           ----------------------------------------- */

        if(!texto) {

            listaResultados.innerHTML =
                "";

            return;

        }


        /* -----------------------------------------
           BUSCAR
           ----------------------------------------- */

        try {

            const resultados =
                await window.PALBUSCADOR.buscar(
                    texto
                );


            listaResultados.innerHTML =
                "";


            /* -------------------------------------
               SIN RESULTADOS
               ------------------------------------- */

            if(
                !resultados.length
            ) {

                listaResultados.innerHTML =
                    '<div class="sinResultados">' +
                    'No se encontraron paleofichas' +
                    '</div>';

                return;

            }


            /* -------------------------------------
               MOSTRAR RESULTADOS
               ------------------------------------- */

            for(
                const resultado
                of resultados
            ) {

                const elemento =
                    document.createElement(
                        "button"
                    );


                elemento.type =
                    "button";


                elemento.className =
                    "resultadoBuscador";


                elemento.innerHTML =

                    '<span class="resultadoCodigo">' +

                    resultado.codigo +

                    '</span>' +

                    '<span class="resultadoNombre">' +

                    resultado.nombre +

                    '</span>';


                /* -------------------------------
                   SELECCIONAR RESULTADO
                   ------------------------------- */

                elemento.addEventListener(
                    "click",
                    async function() {

                        try {

                            listaResultados.innerHTML =

                                '<div class="sinResultados">' +

                                'Cargando paleoficha...' +

                                '</div>';


                            await window.PALBUSCADOR.cargarResultado(
                                resultado
                            );


                            cerrarBuscador();

                        }

                        catch(error) {

                            console.error(
                                "ERROR BUSCADOR:",
                                error
                            );


                            listaResultados.innerHTML =

                                '<div class="sinResultados">' +

                                'Error al cargar la paleoficha' +

                                '</div>';

                        }

                    }
                );


                listaResultados.appendChild(
                    elemento
                );

            }

        }

        catch(error) {

            console.error(
                "ERROR PALBUSCADOR:",
                error
            );


            listaResultados.innerHTML =

                '<div class="sinResultados">' +

                'Error en el buscador' +

                '</div>';

        }

    }
);


/* =====================================================
   CERRAR BUSCADOR AL PULSAR FUERA
   ===================================================== */

visorBuscador.addEventListener(
    "click",
    function(evento) {

        if(
            evento.target ===
            visorBuscador
        ) {

            cerrarBuscador();

        }

    }
);


/* =====================================================
   TECLA ESC
   ===================================================== */

document.addEventListener(
    "keydown",
    function(evento) {

        if(
            evento.key === "Escape"
        ) {

            cerrarLightbox();

            cerrarBuscador();

        }

    }
);


/*
========================================================
FIN CAB05.js
========================================================
*/






