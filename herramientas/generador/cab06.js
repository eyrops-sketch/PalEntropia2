/*
========================================================
PalEntropía
CAB06.js
Generador de Paleofichas 1.1

BLOQUE:
- Iniciar generador
- Comprobación de dependencias
- Inicialización de PALNAVEGADOR
- Carga de Paleoficha aleatoria
- Actualización de controles

Código procedente del generador original.
No modificar la lógica.
========================================================
*/


/* =====================================================
   INICIAR GENERADOR
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        try {

            if(
                !window.LEEPALJSON
            ) {

                throw new Error(
                    "LEEPALJSON no está disponible."
                );

            }


            if(
                !window.CARGACONT
            ) {

                throw new Error(
                    "CARGACONT no está disponible."
                );

            }


            if(
                !window.PALBUSCADOR
            ) {

                throw new Error(
                    "PALBUSCADOR no está disponible."
                );

            }


            if(
                !window.PALNAVEGADOR
            ) {

                throw new Error(
                    "PALNAVEGADOR no está disponible."
                );

            }


            /* -----------------------------------------
               INICIALIZAR NAVEGADOR
               ----------------------------------------- */

            await window.PALNAVEGADOR.inicializar();


            /* -----------------------------------------
               CARGAR PALEOFICHA ALEATORIA
               ----------------------------------------- */

            await window.PALNAVEGADOR.aleatorio();


            /* -----------------------------------------
               ACTUALIZAR CONTROLES
               ----------------------------------------- */

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
FIN CAB06.js
========================================================
*/






