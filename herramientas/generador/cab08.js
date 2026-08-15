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

    elementoTa1.innerHTML =
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
    ÁRBOL TAXONÓMICO DESCENDENTE
    -----------------------------------------------------
    */

    const ta1 =
        String(
            taxon.ta1 || ""
        ).trim();


    if(ta1) {

        const niveles =
            ta1
                .split(">")
                .map(
                    nivel =>
                        nivel.trim()
                )
                .filter(
                    nivel =>
                        nivel !== ""
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


                linea.textContent =
                    indice === 0
                        ? nivel
                        : "└─ " + nivel;


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
    SALTO DE LÍNEA ENTRE TA1 Y TA2
    -----------------------------------------------------
    */

    if(ta1) {

        const salto =
            document.createElement(
                "br"
            );


        elementoTa1.appendChild(
            salto
        );

    }


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
