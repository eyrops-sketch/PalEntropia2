CAB08.js — Taxonomía corregida

/*
========================================================
PalEntropía
CAB08.js
Generador de Paleofichas 1.1

BLOQUE:
- Taxonomía
- Lectura de PALTAXON
- Presentación de ta1 como árbol descendente
- Presentación de ta2

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


        if (!ficha) {

            return;

        }


        /*
        -------------------------------------------------
        EL CONTENEDOR NORMALIZADO USA j1
        -------------------------------------------------
        */

        const codigo =
            ficha.j1 ||
            ficha.codigo ||
            "";


        procesarTaxon(
            codigo
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

    if (
        !elementoTa1 ||
        !elementoTa2
    ) {

        return;

    }


    /*
    -----------------------------------------------------
    LIMPIAR CONTENIDO ANTERIOR
    -----------------------------------------------------
    */

    elementoTa1.innerHTML =
        "";

    elementoTa2.textContent =
        "";


    /*
    -----------------------------------------------------
    COMPROBAR PALTAXON
    -----------------------------------------------------
    */

    if (
        !window.PALTAXON
    ) {

        console.warn(
            "CAB08: PALTAXON no está disponible."
        );

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


    if (!codigo) {

        console.warn(
            "CAB08: no se recibió código de paleoficha."
        );

        return;

    }


    /*
    -----------------------------------------------------
    BUSCAR REGISTRO EN PALTAXON
    -----------------------------------------------------
    */

    const taxon =
        window.PALTAXON[codigo];


    if (
        !taxon
    ) {

        console.warn(
            "CAB08: no existe taxonomía para:",
            codigo
        );

        return;

    }


    /*
    -----------------------------------------------------
    TA1
    ÁRBOL TAXONÓMICO DESCENDENTE
    -----------------------------------------------------
    */

    const ta1 =
        String(
            taxon.ta1 || ""
        ).trim();


    if (ta1) {

        const niveles =
            ta1
                .split(">")
                .map(
                    function(nivel) {

                        return nivel.trim();

                    }
                )
                .filter(
                    function(nivel) {

                        return nivel !== "";

                    }
                );


        niveles.forEach(
            function(
                nivel,
                indice
            ) {

                const linea =
                    document.createElement(
                        "div"
                    );


                linea.className =
                    "nivelTaxon";


                /*
                -------------------------------------------------
                NIVEL PRINCIPAL
                -------------------------------------------------
                */

                if (
                    indice === 0
                ) {

                    linea.textContent =
                        nivel;

                }


                /*
                -------------------------------------------------
                NIVELES DESCENDIENTES
                -------------------------------------------------
                */

                else {

                    linea.textContent =
                        "└─ " + nivel;

                }


                /*
                -------------------------------------------------
                INDENTACIÓN
                -------------------------------------------------
                */

                linea.style.paddingLeft =
                    (
                        indice * 18
                    ) + "px";


                elementoTa1.appendChild(
                    linea
                );

            }
        );

    }


    /*
    -----------------------------------------------------
    TA2
    -----------------------------------------------------
    */

    const ta2 =
        String(
            taxon.ta2 || ""
        ).trim();


    elementoTa2.textContent =
        ta2;


    /*
    -----------------------------------------------------
    DIAGNÓSTICO
    -----------------------------------------------------
    */

    console.log(
        "CAB08: taxonomía cargada",
        codigo,
        taxon
    );

}


/* =====================================================
   FIN CAB08.js
========================================================
*/
