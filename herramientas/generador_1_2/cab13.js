/*
========================================================
PalEntropía
CAB13.js
Generador de Paleofichas 1.1

ECOLOGÍA — MEDIO DE VIDA

FASE 2 — DECODIFICACIÓN j10

CAB13:

- Obtiene el código actual j1
- Lee master.csv directamente
- Obtiene j2
- Obtiene j10
- Extrae j10 mediante slots de 3 caracteres
- Consulta PALMEDIO
- Muestra:
    SM → Medio general
    L  → Localización ecológica
    ES → Estrato ecológico
    C  → Comportamiento espacial

El código interno NO se muestra.

Formato j10:

xxxxxxxxxxxx

001001002002

↓

001 | 001 | 002 | 002
SM    L    ES    C
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
        indiceJ1 === -1 ||
        indiceJ2 === -1 ||
        indiceJ10 === -1
    ) {

        throw new Error(
            "CAB13: faltan columnas j1, j2 o j10."
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
   DECODIFICAR j10
   ===================================================== */

function decodificarJ10CAB13(
    j10
) {


    const codigo =
        String(
            j10 || ""
        ).trim();


    /* -----------------------------------------
       VALIDACIÓN
    ----------------------------------------- */

    if (
        codigo.length !== 12
    ) {

        throw new Error(
            "CAB13: j10 debe contener exactamente 12 caracteres."
        );

    }


    /* -----------------------------------------
       EXTRACCIÓN POR SLOTS
    ----------------------------------------- */

    const sm =
        codigo.substring(
            0,
            3
        );


    const l =
        codigo.substring(
            3,
            6
        );


    const es =
        codigo.substring(
            6,
            9
        );


    const c =
        codigo.substring(
            9,
            12
        );


    return {

        sm:
            "SM" + sm,

        l:
            "L" + l,

        es:
            "ES" + es,

        c:
            "C" + c

    };

}


/* =====================================================
   CREAR BLOQUE ECOLÓGICO
   ===================================================== */

function crearBloqueCAB13(
    etiqueta,
    dato
) {


    const bloque =
        document.createElement(
            "div"
        );


    bloque.className =
        "bloqueMedioCAB13";


    const titulo =
        document.createElement(
            "div"
        );


    titulo.className =
        "etiquetaMedioCAB13";


    titulo.textContent =
        etiqueta;


    bloque.appendChild(
        titulo
    );


    const nombre =
        document.createElement(
            "div"
        );


    nombre.className =
        "nombreMedioCAB13";


    nombre.textContent =
        dato.nombre;


    bloque.appendChild(
        nombre
    );


    const descripcion =
        document.createElement(
            "p"
        );


    descripcion.className =
        "descripcionMedioCAB13";


    descripcion.textContent =
        dato.descripcion;


    bloque.appendChild(
        descripcion
    );


    return bloque;

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
               OBTENER DATOS
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
               COMPROBAR PALMEDIO
            ===================================== */

            if (!window.PALMEDIO) {

                throw new Error(
                    "PALMEDIO no está cargado."
                );

            }


            /* =====================================
               DECODIFICAR j10
            ===================================== */

            const codigos =
                decodificarJ10CAB13(
                    datos.j10
                );


            console.log(
                "CAB13: j10 decodificado:",
                codigos
            );


            /* =====================================
               BUSCAR EN PALMEDIO
            ===================================== */

            const medioGeneral =
                window.PALMEDIO[
                    codigos.sm
                ];


            const localizacion =
                window.PALMEDIO[
                    codigos.l
                ];


            const estrato =
                window.PALMEDIO[
                    codigos.es
                ];


            const comportamiento =
                window.PALMEDIO[
                    codigos.c
                ];


            if (
                !medioGeneral ||
                !localizacion ||
                !estrato ||
                !comportamiento
            ) {

                throw new Error(
                    "CAB13: uno o más códigos de PALMEDIO no existen."
                );

            }


            /* =====================================
               CREAR CONTENEDOR
            ===================================== */

            const bloquePrincipal =
                document.createElement(
                    "div"
                );


            bloquePrincipal.className =
                "contenedorMedioCAB13";


            /* =====================================
               TÍTULO
            ===================================== */

            const titulo =
                document.createElement(
                    "h3"
                );


            titulo.textContent =
                "Medio de vida";


            bloquePrincipal.appendChild(
                titulo
            );


            /* =====================================
               NOMBRE PALEOFICHA
            ===================================== */

            if (
                datos.j2
            ) {

                const nombreFicha =
                    document.createElement(
                        "div"
                    );


                nombreFicha.className =
                    "nombreFichaMedioCAB13";


                nombreFicha.textContent =
                    datos.j2;


                bloquePrincipal.appendChild(
                    nombreFicha
                );

            }


            /* =====================================
               MEDIO GENERAL
            ===================================== */

            bloquePrincipal.appendChild(

                crearBloqueCAB13(
                    "Medio general",
                    medioGeneral
                )

            );


            /* =====================================
               LOCALIZACIÓN
            ===================================== */

            bloquePrincipal.appendChild(

                crearBloqueCAB13(
                    "Localización ecológica",
                    localizacion
                )

            );


            /* =====================================
               ESTRATO
            ===================================== */

            bloquePrincipal.appendChild(

                crearBloqueCAB13(
                    "Estrato ecológico",
                    estrato
                )

            );


            /* =====================================
               COMPORTAMIENTO
            ===================================== */

            bloquePrincipal.appendChild(

                crearBloqueCAB13(
                    "Comportamiento espacial",
                    comportamiento
                )

            );


            /* =====================================
               AÑADIR AL LIGHTBOX
            ===================================== */

            contenedor.appendChild(
                bloquePrincipal
            );


            console.log(
                "CAB13: medio de vida decodificado correctamente."
            );


        } catch (
            error
        ) {


            console.error(
                "CAB13:",
                error
            );


            const errorBloque =
                document.createElement(
                    "p"
                );


            errorBloque.textContent =
                "No se ha podido obtener la información del medio de vida.";


            contenedor.appendChild(
                errorBloque
            );

        }

    }

};


/* =====================================================
   FIN CAB13
   ===================================================== */
