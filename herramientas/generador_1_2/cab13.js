/*
========================================================
PalEntropía
CAB13.js
Generador de Paleofichas 1.1

ECOLOGÍA — MEDIO DE VIDA

FASE 1 — PRUEBA j10 BRUTO

CAB13:

- Obtiene el código actual j1
- Lee master.csv directamente
- Obtiene j2
- Obtiene j10
- Muestra j10 sin decodificar
- NO utiliza PALMEDIO todavía
- NO modifica CAB12
========================================================
*/


let fichaActualCAB13 = null;


/* =====================================================
   RECIBIR FICHA ACTUAL
   ===================================================== */

document.addEventListener(
    "palentropia:contenedor-cargado",
    function(evento) {

        fichaActualCAB13 =
            evento.detail || null;


        console.log(
            "CAB13: ficha recibida:",
            fichaActualCAB13
        );

    }
);


/* =====================================================
   PARSER CSV
   ===================================================== */

function parseCSVCAB13(texto) {

    const filas = [];

    let fila = [];

    let campo = "";

    let dentroComillas = false;


    for (
        let i = 0;
        i < texto.length;
        i++
    ) {

        const caracter =
            texto[i];

        const siguiente =
            texto[i + 1];


        if (
            caracter === '"'
        ) {

            if (
                dentroComillas &&
                siguiente === '"'
            ) {

                campo += '"';

                i++;

            } else {

                dentroComillas =
                    !dentroComillas;

            }

            continue;

        }


        if (
            caracter === "," &&
            !dentroComillas
        ) {

            fila.push(
                campo
            );

            campo = "";

            continue;

        }


        if (
            (
                caracter === "\n" ||
                caracter === "\r"
            ) &&
            !dentroComillas
        ) {

            if (
                caracter === "\r" &&
                siguiente === "\n"
            ) {

                i++;

            }


            fila.push(
                campo
            );

            campo = "";


            if (
                fila.some(
                    valor =>
                        valor.trim() !== ""
                )
            ) {

                filas.push(
                    fila
                );

            }


            fila = [];

            continue;

        }


        campo += caracter;

    }


    if (
        campo !== "" ||
        fila.length > 0
    ) {

        fila.push(
            campo
        );


        if (
            fila.some(
                valor =>
                    valor.trim() !== ""
            )
        ) {

            filas.push(
                fila
            );

        }

    }


    return filas;

}


/* =====================================================
   OBTENER CÓDIGO ACTUAL
   ===================================================== */

function obtenerCodigoCAB13() {

    if (
        fichaActualCAB13 &&
        fichaActualCAB13.j1
    ) {

        return String(
            fichaActualCAB13.j1
        ).trim();

    }


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const codigoURL =
        parametros.get("codigo");


    if (codigoURL) {

        return String(
            codigoURL
        ).trim();

    }


    const ficha =
        document.getElementById(
            "ficha"
        );


    if (
        ficha &&
        ficha.dataset &&
        ficha.dataset.codigo
    ) {

        return String(
            ficha.dataset.codigo
        ).trim();

    }


    return null;

}


/* =====================================================
   OBTENER DATOS DESDE MASTER.CSV
   ===================================================== */

async function obtenerDatosCAB13(
    codigo
) {

    const respuesta =
        await fetch(
            "master.csv"
        );


    if (!respuesta.ok) {

        throw new Error(
            "CAB13: no se pudo cargar master.csv"
        );

    }


    const texto =
        await respuesta.text();


    const filas =
        parseCSVCAB13(
            texto
        );


    if (!filas.length) {

        throw new Error(
            "CAB13: master.csv está vacío"
        );

    }


    /* -----------------------------------------
       CABECERA
    ----------------------------------------- */

    const cabecera =
        filas[0].map(
            valor =>
                valor
                    .replace(
                        /^\uFEFF/,
                        ""
                    )
                    .trim()
                    .toLowerCase()
        );


    const indiceJ1 =
        cabecera.indexOf(
            "j1"
        );


    const indiceJ2 =
        cabecera.indexOf(
            "j2"
        );


    const indiceJ10 =
        cabecera.indexOf(
            "j10"
        );


    if (
        indiceJ1 === -1
    ) {

        throw new Error(
            "CAB13: no existe j1 en master.csv"
        );

    }


    if (
        indiceJ2 === -1
    ) {

        throw new Error(
            "CAB13: no existe j2 en master.csv"
        );

    }


    if (
        indiceJ10 === -1
    ) {

        throw new Error(
            "CAB13: no existe j10 en master.csv"
        );

    }


    /* -----------------------------------------
       BUSCAR PALEOFICHA
    ----------------------------------------- */

    const registro =
        filas.find(
            function(fila) {

                return (
                    fila[indiceJ1] &&
                    fila[indiceJ1]
                        .trim() ===
                    codigo
                );

            }
        );


    if (!registro) {

        throw new Error(
            "CAB13: no se encontró " +
            codigo +
            " en master.csv"
        );

    }


    /* -----------------------------------------
       DATOS
    ----------------------------------------- */

    const j2 =
        String(
            registro[indiceJ2] || ""
        ).trim();


    const j10 =
        String(
            registro[indiceJ10] || ""
        ).trim();


    return {

        j1: codigo,

        j2: j2,

        j10: j10

    };

}


/* =====================================================
   CAB13
   ===================================================== */

window.CAB13 = {


    mostrar: async function(
        contenedor
    ) {


        console.log(
            "CAB13: mostrando medio de vida."
        );


        if (!contenedor) {

            console.error(
                "CAB13: no existe contenedor."
            );

            return;

        }


        /* -----------------------------------------
           OBTENER CÓDIGO
        ----------------------------------------- */

        const codigo =
            obtenerCodigoCAB13();


        if (!codigo) {

            console.error(
                "CAB13: no se pudo determinar el código actual."
            );

            return;

        }


        try {


            /* =====================================
               OBTENER j1, j2 Y j10
            ===================================== */

            const datos =
                await obtenerDatosCAB13(
                    codigo
                );


            console.log(
                "CAB13: datos master.csv:",
                datos
            );


            /* =====================================
               MOSTRAR PRUEBA
            ===================================== */

            const bloque =
                document.createElement(
                    "div"
                );


            bloque.className =
                "medioVidaCAB13";


            /* -------------------------------------
               TÍTULO
            ------------------------------------- */

            const titulo =
                document.createElement(
                    "h3"
                );


            titulo.textContent =
                "Medio de vida";


            bloque.appendChild(
                titulo
            );


            /* -------------------------------------
               J10 BRUTO
            ------------------------------------- */

            const codigoBruto =
                document.createElement(
                    "div"
                );


            codigoBruto.className =
                "codigoBrutoCAB13";


            codigoBruto.textContent =
                datos.j10;


            bloque.appendChild(
                codigoBruto
            );


            /* -------------------------------------
               AÑADIR AL LIGHTBOX
            ------------------------------------- */

            contenedor.appendChild(
                bloque
            );


            console.log(
                "CAB13: j10 bruto mostrado:",
                datos.j10
            );


        } catch (
            error
        ) {


            console.error(
                "CAB13:",
                error
            );


        }

    }

};


/* =====================================================
   FIN CAB13
   ===================================================== */
