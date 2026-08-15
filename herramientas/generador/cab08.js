CAB08.js — Taxonomía

/*
========================================================
PalEntropía
CAB08.js
Generador de Paleofichas

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
   ÚLTIMO CÓDIGO RECIBIDO
   ===================================================== */

window.CAB08_CODIGO_ACTUAL = "";


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


        const codigo =
            ficha.j1 ||
            ficha.codigo ||
            "";


        if (!codigo) {

            return;

        }


        window.CAB08_CODIGO_ACTUAL =
            String(codigo)
                .trim()
                .toUpperCase();


        procesarTaxon(
            window.CAB08_CODIGO_ACTUAL
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

        return;

    }


    /*
    -----------------------------------------------------
    COMPROBAR PALTAXON
    -----------------------------------------------------
    */

    if (
        !window.PALTAXON
    ) {

        /*
        PALTAXON todavía no está disponible.
        Reintentamos una vez transcurrido un
        pequeño intervalo.
        */

        setTimeout(
            function() {

                procesarTaxon(
                    codigo
                );

            },
            100
        );

        return;

    }


    /*
    -----------------------------------------------------
    BUSCAR REGISTRO
    -----------------------------------------------------
    */

    const taxon =
        window.PALTAXON[codigo];


    if (
        !taxon
    ) {

        return;

    }


    /*
    =====================================================
    TA1
    ÁRBOL TAXONÓMICO DESCENDENTE
    =====================================================
    */

    const ta1 =
        String(
            taxon.ta1 || ""
        )
        .trim();


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
                TEXTO DEL NIVEL
                -------------------------------------------------
                */

                if (
                    indice === 0
                ) {

                    linea.textContent =
                        nivel;

                }

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
    =====================================================
    TA2
    =====================================================
    */

    const ta2 =
        String(
            taxon.ta2 || ""
        )
        .trim();


    if (ta2) {

        elementoTa2.textContent =
            ta2;

    }


    /*
    =====================================================
    DIAGNÓSTICO
    =====================================================
    */

    console.log(
        "CAB08: taxonomía cargada:",
        codigo,
        taxon
    );

}


/* =====================================================
   SEGUNDA OPORTUNIDAD AL CARGAR DOM
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            window.CAB08_CODIGO_ACTUAL
        ) {

            procesarTaxon(
                window.CAB08_CODIGO_ACTUAL
            );

        }

    }
);


/*
========================================================
FIN CAB08.js
========================================================
*/
