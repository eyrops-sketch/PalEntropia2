/*
========================================================
PalEntropía
CAB01.js
Generador de Paleofichas 1.1

PRIMER BLOQUE FUNCIONAL
- Estado de ficha actual
- Referencias de navegación
- Actualización de controles de navegación

Código procedente del generador original.
No modificar la lógica.
========================================================
*/


let fichaActual = null;


/* =====================================================
   REFERENCIAS DE NAVEGACIÓN
   ===================================================== */

const botonPrimero =
    document.getElementById(
        "botonPrimero"
    );


const botonAnterior =
    document.getElementById(
        "botonAnterior"
    );


const botonSiguiente =
    document.getElementById(
        "botonSiguiente"
    );


const botonUltimo =
    document.getElementById(
        "botonUltimo"
    );


const posicionNavegacion =
    document.getElementById(
        "posicionNavegacion"
    );


/* =====================================================
   ACTUALIZAR CONTROLES
   ===================================================== */

function actualizarControlesNavegacion() {

    if(
        !window.PALNAVEGADOR
    ) {

        return;
    }


    const estado =
        window.PALNAVEGADOR.estado();


    const total =
        estado.total || 0;


    const posicion =
        estado.posicion || 0;


    posicionNavegacion.textContent =

        total

            ? posicion +
              " / " +
              total

            : "— / —";


    botonPrimero.disabled =
        !total ||
        posicion <= 1;


    botonAnterior.disabled =
        !total ||
        posicion <= 1;


    botonSiguiente.disabled =
        !total ||
        posicion >= total;


    botonUltimo.disabled =
        !total ||
        posicion >= total;

}


/*
========================================================
FIN CAB01.js
========================================================
*/




