/*
========================================================
PalEntropía
CAB08.js
Generador de Paleofichas 1.1

BLOQUE:
- Taxonomía
- Lectura de PALTAXON
- Presentación de ta1 y ta2

CRITERIO:
- Injerencia mínima
- No modifica CARGACONT
- No modifica PALNAVEGADOR
- No modifica PALBUSCADOR
- No modifica PALTAXON

Fuente taxonómica:
PALTAXON.js

Campos:
ta1 → clasificación taxonómica
ta2 → descripción taxonómica
========================================================
*/


/* =====================================================
   EVENTO: CONTENEDOR CARGADO
   ===================================================== */

document.addEventListener(
    "palentropia:contenedor-cargado",
    function(evento) {

        const ficha =
            evento.detail;


        if(!ficha) {

            return;

        }


        procesarTaxon(
            ficha.j1
        );

    }
);


/* =====================================================
   PROCESAR TAXÓN
   ===================================================== */

function procesarTaxon(
    j1
) {

    const elementoTa1 =
        document.getElementById(
            "taxonTa1"
        );


    const elementoTa2 =
        document.getElementById(
            "taxonTa2"
        );


    /*
    -----------------------------------------------------
    COMPROBAR ELEMENTOS HTML
    -----------------------------------------------------
    */

    if(
        !elementoTa1 ||
        !elementoTa2
    ) {

        return;

    }


    /*
    -----------------------------------------------------
    LIMPIAR ANTES DE CARGAR
    -----------------------------------------------------
    */

    elementoTa1.textContent =
        "";

    elementoTa2.textContent =
        "";


    /*
    -----------------------------------------------------
    COMPROBAR PALTAXON
    -----------------------------------------------------
    */

    if(
        !window.PALTAXON
    ) {

        return;

    }


    /*
    -----------------------------------------------------
    NORMALIZAR CÓDIGO
    -----------------------------------------------------
    */

    const codigo =
        String(
            j1 || ""
        )
        .trim()
        .toUpperCase();


    if(!codigo) {

        return;

    }


    /*
    -----------------------------------------------------
    BUSCAR REGISTRO TAXONÓMICO
    -----------------------------------------------------
    */

    const taxon =
        window.PALTAXON[codigo];


    if(
        !taxon
    ) {

        return;

    }


    /*
    -----------------------------------------------------
    TA1
    -----------------------------------------------------
    */

    elementoTa1.textContent =
        taxon.ta1 || "";


    /*
    -----------------------------------------------------
    TA2
    -----------------------------------------------------
    */

    elementoTa2.textContent =
        taxon.ta2 || "";

}


/*
========================================================
FIN CAB08.js
========================================================
*/





