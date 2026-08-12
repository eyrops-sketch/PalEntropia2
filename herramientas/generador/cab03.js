/*
========================================================
PalEntropía
CAB03.js
Generador de Paleofichas 1.1

BLOQUE:
- Navegación
- Primero
- Anterior
- Siguiente
- Último
- Botón aleatorio

Código procedente del generador original.
No modificar la lógica.
========================================================
*/


/* =====================================================
   NAVEGACIÓN
   ===================================================== */

async function ejecutarNavegacion(
    funcion
) {

    try {

        document.getElementById(
            "estado"
        ).textContent =
            "Cargando paleoficha...";


        await funcion();


        actualizarControlesNavegacion();

    }

    catch(error) {

        mostrarError(
            error
        );

    }

}


/* =====================================================
   PRIMERO
   ===================================================== */

botonPrimero.addEventListener(
    "click",
    function() {

        ejecutarNavegacion(
            function() {

                return window.PALNAVEGADOR.primero();

            }
        );

    }
);


/* =====================================================
   ANTERIOR
   ===================================================== */

botonAnterior.addEventListener(
    "click",
    function() {

        ejecutarNavegacion(
            function() {

                return window.PALNAVEGADOR.anterior();

            }
        );

    }
);


/* =====================================================
   SIGUIENTE
   ===================================================== */

botonSiguiente.addEventListener(
    "click",
    function() {

        ejecutarNavegacion(
            function() {

                return window.PALNAVEGADOR.siguiente();

            }
        );

    }
);


/* =====================================================
   ÚLTIMO
   ===================================================== */

botonUltimo.addEventListener(
    "click",
    function() {

        ejecutarNavegacion(
            function() {

                return window.PALNAVEGADOR.ultimo();

            }
        );

    }
);


/* =====================================================
   BOTÓN ALEATORIO
   ===================================================== */

document.getElementById(
    "botonAleatorio"
)
.addEventListener(
    "click",
    async function() {

        try {

            if(
                !window.PALNAVEGADOR
            ) {

                throw new Error(
                    "PALNAVEGADOR no está disponible."
                );

            }


            document.getElementById(
                "estado"
            ).innerHTML =
                "Cargando paleoficha aleatoria...";


            await window.PALNAVEGADOR.aleatorio();


            actualizarControlesNavegacion();

        }

        catch(error) {

            mostrarError(
                error
            );

        }

    }
);


/*
========================================================
FIN CAB03.js
========================================================
*/





