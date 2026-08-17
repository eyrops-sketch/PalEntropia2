/*
========================================================
PalEntropía
CAB13.js
Generador de Paleofichas 1.1

ECOLOGÍA — MEDIO DE VIDA

CAB13

- Obtiene el código actual j1
- Lee master.csv directamente
- Obtiene j10
- j10 contiene cuatro slots de 3 caracteres

j10 = SM L ES C

Ejemplo:

002001002001

↓

SM002
L001
ES002
C001

- Utiliza PALMEDIO
- Decodifica cada bloque
- NO muestra los códigos internos
- NO muestra j2
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
   OBTENER j10 DESDE MASTER.CSV
   ===================================================== */

async function obtenerJ10CAB13(
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
       OBTENER j10
    ----------------------------------------- */

    const j10 =
        String(
            registro[indiceJ10] || ""
        ).trim();


    if (!j10) {

        throw new Error(
            "CAB13: j10 está vacío para " +
            codigo
        );

    }


    console.log(
        "CAB13: j10 bruto:",
        j10
    );


    return j10;

}


/* =====================================================
   DECODIFICAR j10
===================================================== */

function decodificarJ10CAB13(
    j10
) {


    /*
    -----------------------------------------
    j10 debe contener 12 caracteres

    001001002002

    001 | 001 | 002 | 002
     SM    L     ES    C
    -----------------------------------------
    */


    if (
        j10.length !== 12
    ) {

        throw new Error(
            "CAB13: j10 no tiene 12 caracteres: " +
            j10
        );

    }


    const sm =
        j10.substring(
            0,
            3
        );


    const l =
        j10.substring(
            3,
            6
        );


    const es =
        j10.substring(
            6,
            9
        );


    const c =
        j10.substring(
            9,
            12
        );


    console.log(
        "CAB13: slots:",
        {
            SM: sm,
            L: l,
            ES: es,
            C: c
        }
    );


    return {

        sm: sm,

        l: l,

        es: es,

        c: c

    };

}


/* =====================================================
   BUSCAR EN PALMEDIO
===================================================== */

function obtenerMedioCAB13(
    slots
) {


    if (!window.PALMEDIO) {

        throw new Error(
            "PALMEDIO no está cargado."
        );

    }


    const medioGeneral =
        window.PALMEDIO[
            "SM" +
            slots.sm
        ];


    const localizacion =
        window.PALMEDIO[
            "L" +
            slots.l
        ];


    const estrato =
        window.PALMEDIO[
            "ES" +
            slots.es
        ];


    const comportamiento =
        window.PALMEDIO[
            "C" +
            slots.c
        ];


    if (!medioGeneral) {

        throw new Error(
            "CAB13: no existe SM" +
            slots.sm +
            " en PALMEDIO."
        );

    }


    if (!localizacion) {

        throw new Error(
            "CAB13: no existe L" +
            slots.l +
            " en PALMEDIO."
        );

    }


    if (!estrato) {

        throw new Error(
            "CAB13: no existe ES" +
            slots.es +
            " en PALMEDIO."
        );

    }


    if (!comportamiento) {

        throw new Error(
            "CAB13: no existe C" +
            slots.c +
            " en PALMEDIO."
        );

    }


    return {

        medioGeneral:
            medioGeneral,

        localizacion:
            localizacion,

        estrato:
            estrato,

        comportamiento:
            comportamiento

    };

}


/* =====================================================
   CREAR BLOQUE ECOLÓGICO
===================================================== */

function crearBloqueCAB13(
    contenedor,
    etiqueta,
    dato
) {


    const bloque =
        document.createElement(
            "div"
        );


    bloque.className =
        "bloqueMedioVidaCAB13";


    /* -----------------------------------------
       LÍNEA ETIQUETA + VALOR
    ----------------------------------------- */

    const linea =
        document.createElement(
            "div"
        );


    linea.className =
        "lineaMedioVidaCAB13";


    const etiquetaElemento =
        document.createElement(
            "span"
        );


    etiquetaElemento.className =
        "etiquetaMedioVidaCAB13";


    etiquetaElemento.textContent =
        etiqueta;


    const valorElemento =
        document.createElement(
            "span"
        );


    valorElemento.className =
        "valorMedioVidaCAB13";


    valorElemento.textContent =
        dato.nombre;


    linea.appendChild(
        etiquetaElemento
    );


    linea.appendChild(
        valorElemento
    );


    bloque.appendChild(
        linea
    );


    /* -----------------------------------------
       DESCRIPCIÓN
    ----------------------------------------- */

    if (
        dato.descripcion
    ) {

        const descripcion =
            document.createElement(
                "p"
            );


        descripcion.className =
            "descripcionMedioVidaCAB13";


        descripcion.textContent =
            dato.descripcion;


        bloque.appendChild(
            descripcion
        );

    }


    contenedor.appendChild(
        bloque
    );

}


/* =====================================================
   CAB13
===================================================== */

window.CAB13 = {


    /* =================================================
       MOSTRAR
       ================================================= */

    mostrar: async function(
        contenedor
    ) {


        console.log(
            "CAB13: mostrando medio de vida."
        );


        /* -----------------------------------------
           COMPROBAR CONTENEDOR
        ----------------------------------------- */

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
                "CAB13: no se pudo determinar " +
                "el código actual."
            );

            contenedor.innerHTML =
                "<h3>Medio de vida</h3>" +
                "<p>No se ha podido obtener " +
                "la paleoficha.</p>";

            return;

        }


        /* -----------------------------------------
           MENSAJE TEMPORAL
        ----------------------------------------- */

        contenedor.innerHTML =
            "<h3>Medio de vida</h3>" +
            "<p>Cargando información...</p>";


        try {


            /* =====================================
               OBTENER j10
            ===================================== */

            const j10 =
                await obtenerJ10CAB13(
                    codigo
                );


            console.log(
                "CAB13: j10 recibido:",
                j10
            );


            /* =====================================
               DECODIFICAR SLOTS
            ===================================== */

            const slots =
                decodificarJ10CAB13(
                    j10
                );


            /* =====================================
               OBTENER DATOS PALMEDIO
            ===================================== */

            const medio =
                obtenerMedioCAB13(
                    slots
                );


            console.log(
                "CAB13: datos PALMEDIO:",
                medio
            );


            /* =====================================
               LIMPIAR
            ===================================== */

            contenedor.innerHTML =
                "";


            /* =====================================
               TÍTULO
            ===================================== */

            const titulo =
                document.createElement(
                    "h3"
                );


            titulo.textContent =
                "Medio de vida";


            contenedor.appendChild(
                titulo
            );


            /* =====================================
               MEDIO GENERAL
            ===================================== */

            crearBloqueCAB13(
                contenedor,
                "Medio general",
                medio.medioGeneral
            );


            /* =====================================
               LOCALIZACIÓN
            ===================================== */

            crearBloqueCAB13(
                contenedor,
                "Localización ecológica",
                medio.localizacion
            );


            /* =====================================
               ESTRATO
            ===================================== */

            crearBloqueCAB13(
                contenedor,
                "Estrato ecológico",
                medio.estrato
            );


            /* =====================================
               COMPORTAMIENTO
            ===================================== */

            crearBloqueCAB13(
                contenedor,
                "Comportamiento espacial",
                medio.comportamiento
            );


            /* =====================================
               CONFIRMACIÓN
            ===================================== */

            console.log(
                "CAB13: mostrado correctamente:",
                codigo
            );


        } catch (
            error
        ) {


            console.error(
                "CAB13:",
                error
            );


            contenedor.innerHTML =
                "<h3>Medio de vida</h3>" +
                "<p>No se ha podido obtener " +
                "la información del medio de vida.</p>";

        }

    }

};


/* =====================================================
   FIN CAB13
===================================================== */
