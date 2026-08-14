/*
========================================================
PalEntropía
CAB06.js
Generador de Paleofichas 1.1

BLOQUE:
- Comprobación de dependencias
- Inicialización de PALNAVEGADOR

IMPORTANTE:
- CAB06 NO carga ninguna Paleoficha.
- CAB06 NO llama a aleatorio().
- CAB06 NO interpreta ?codigo=.
- El arranque principal se realiza desde el HTML.

Esto evita que existan dos sistemas de arranque
simultáneos y elimina las cargas duplicadas.
========================================================
*/


/* =====================================================
   COMPROBAR E INICIALIZAR GENERADOR
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        try {


            /* -----------------------------------------
               COMPROBAR LEEPALJSON
               ----------------------------------------- */

            if(
                !window.LEEPALJSON
            ) {

                throw new Error(
                    "LEEPALJSON no está disponible."
                );

            }


            /* -----------------------------------------
               COMPROBAR CARGACONT
               ----------------------------------------- */

            if(
                !window.CARGACONT
            ) {

                throw new Error(
                    "CARGACONT no está disponible."
                );

            }


            /* -----------------------------------------
               COMPROBAR PALBUSCADOR
               ----------------------------------------- */

            if(
                !window.PALBUSCADOR
            ) {

                throw new Error(
                    "PALBUSCADOR no está disponible."
                );

            }


            /* -----------------------------------------
               COMPROBAR PALNAVEGADOR
               ----------------------------------------- */

            if(
                !window.PALNAVEGADOR
            ) {

                throw new Error(
                    "PALNAVEGADOR no está disponible."
                );

            }


            /* -----------------------------------------
               INICIALIZAR PALNAVEGADOR
               
               IMPORTANTE:
               
               Aquí SOLO se inicializa el navegador.

               NO se carga ninguna ficha.
               
               La decisión de cargar:
               
               ?codigo=XXXX
               
               o
               
               una ficha aleatoria
               
               corresponde al ARRANQUE PRINCIPAL
               situado en el HTML.
               ----------------------------------------- */

            await window.PALNAVEGADOR.inicializar();


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
FIN CAB06.js
========================================================
*/
