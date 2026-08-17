/*
========================================================
PalEntropía
CAB14.js v1.1
Generador de Paleofichas 1.1

ECOLOGÍA — HÁBITATS

CAB14

- Obtiene el código actual j1
- Lee master.csv directamente
- Obtiene j5 y j6
- Utiliza PALHABDECODER
- Utiliza PALHAB
- Aplica la regla de predominancia
- Elimina duplicados entre j5 y j6
- No modifica master.csv
- No modifica CARGACONT
- No modifica CAB10
- No crea ningún lightbox

Arquitectura:

    CAB10
       ↓
    CAB14.mostrar(contenedor)
       ↓
    j1
       ↓
    master.csv
       ↓
    j5 + j6
       ↓
    PALHABDECODER
       ↓
    PALHAB
       ↓
    cab14Ecologia

========================================================
*/


let fichaActualCAB14 = null;


/* =====================================================
   RECIBIR FICHA ACTUAL
   ===================================================== */

document.addEventListener(
    "palentropia:contenedor-cargado",
    function(evento) {

        fichaActualCAB14 =
            evento.detail || null;


        console.log(
            "CAB14: ficha recibida:",
            fichaActualCAB14
        );

    }
);


/* =====================================================
   PARSER CSV
   ===================================================== */

function parseCSVCAB14(texto) {

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

function obtenerCodigoCAB14() {


    /* -----------------------------------------
       1 — Ficha recibida
    ----------------------------------------- */

    if (
        fichaActualCAB14 &&
        fichaActualCAB14.j1
    ) {

        return String(
            fichaActualCAB14.j1
        ).trim();

    }


    /* -----------------------------------------
       2 — URL
    ----------------------------------------- */

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


    /* -----------------------------------------
       3 — Dataset de la ficha
    ----------------------------------------- */

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
   OBTENER j5 Y j6 DESDE MASTER.CSV
   ===================================================== */

async function obtenerJ5J6CAB14(
    codigo
) {


    const respuesta =
        await fetch(
            "master.csv"
        );


    if (!respuesta.ok) {

        throw new Error(
            "CAB14: no se pudo cargar master.csv"
        );

    }


    const texto =
        await respuesta.text();


    const filas =
        parseCSVCAB14(
            texto
        );


    if (!filas.length) {

        throw new Error(
            "CAB14: master.csv está vacío"
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


    const indiceJ5 =
        cabecera.indexOf(
            "j5"
        );


    const indiceJ6 =
        cabecera.indexOf(
            "j6"
        );


    if (
        indiceJ1 === -1
    ) {

        throw new Error(
            "CAB14: no existe j1 en master.csv"
        );

    }


    if (
        indiceJ5 === -1
    ) {

        throw new Error(
            "CAB14: no existe j5 en master.csv"
        );

    }


    if (
        indiceJ6 === -1
    ) {

        throw new Error(
            "CAB14: no existe j6 en master.csv"
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
            "CAB14: no se encontró " +
            codigo +
            " en master.csv"
        );

    }


    /* -----------------------------------------
       OBTENER j5
    ----------------------------------------- */

    const j5 =
        String(
            registro[indiceJ5] || ""
        ).trim();


    /* -----------------------------------------
       OBTENER j6
    ----------------------------------------- */

    const j6 =
        String(
            registro[indiceJ6] || ""
        ).trim();


    console.log(
        "CAB14: j5 bruto:",
        j5
    );


    console.log(
        "CAB14: j6 bruto:",
        j6
    );


    return {

        j5: j5,

        j6: j6

    };

}


/* =====================================================
   OBTENER DATOS PALHAB
   ===================================================== */

function obtenerHabitatCAB14(
    codigo
) {


    if (!window.PALHAB) {

        throw new Error(
            "CAB14: PALHAB.js no está cargado."
        );

    }


    const habitat =
        window.PALHAB[
            codigo
        ];


    if (!habitat) {

        console.warn(
            "CAB14: no existe " +
            codigo +
            " en PALHAB."
        );

        return null;

    }


    return habitat;

}


/* =====================================================
   CREAR BLOQUE DE HÁBITAT
   ===================================================== */

function crearBloqueCAB14(
    contenedor,
    etiqueta,
    codigo
) {


    const habitat =
        obtenerHabitatCAB14(
            codigo
        );


    if (!habitat) {

        return;

    }


    const bloque =
        document.createElement(
            "div"
        );


    bloque.className =
        "bloqueHabitatCAB14";


    bloque.setAttribute(
        "data-codigo",
        codigo
    );


    /* -----------------------------------------
       LÍNEA
    ----------------------------------------- */

    const linea =
        document.createElement(
            "div"
        );


    linea.className =
        "lineaHabitatCAB14";


    const etiquetaElemento =
        document.createElement(
            "span"
        );


    etiquetaElemento.className =
        "etiquetaHabitatCAB14";


    etiquetaElemento.textContent =
        etiqueta;


    const nombre =
        document.createElement(
            "span"
        );


    nombre.className =
        "nombreHabitatCAB14";


    nombre.textContent =
        habitat.nombre;


    linea.appendChild(
        etiquetaElemento
    );


    linea.appendChild(
        nombre
    );


    bloque.appendChild(
        linea
    );


    /* -----------------------------------------
       DESCRIPCIÓN
    ----------------------------------------- */

    if (
        habitat.descripcion
    ) {

        const descripcion =
            document.createElement(
                "p"
            );


        descripcion.className =
            "descripcionHabitatCAB14";


        descripcion.textContent =
            habitat.descripcion;


        bloque.appendChild(
            descripcion
        );

    }


    contenedor.appendChild(
        bloque
    );

}


/* =====================================================
   CREAR SECCIÓN
   ===================================================== */

function crearSeccionCAB14(
    contenedor,
    titulo,
    lista,
    etiqueta
) {


    if (
        !lista ||
        lista.length === 0
    ) {

        return;

    }


    const seccion =
        document.createElement(
            "div"
        );


    seccion.className =
        "seccionHabitatCAB14";


    const tituloElemento =
        document.createElement(
            "h4"
        );


    tituloElemento.className =
        "tituloHabitatCAB14";


    tituloElemento.textContent =
        titulo;


    seccion.appendChild(
        tituloElemento
    );


    for (
        let i = 0;
        i < lista.length;
        i++
    ) {

        const habitat =
            obtenerHabitatCAB14(
                lista[i]
            );


        if (!habitat) {

            continue;

        }


        const bloque =
            document.createElement(
                "div"
            );


        bloque.className =
            "bloqueHabitatCAB14";


        bloque.setAttribute(
            "data-codigo",
            lista[i]
        );


        const linea =
            document.createElement(
                "div"
            );


        linea.className =
            "lineaHabitatCAB14";


        const etiquetaElemento =
            document.createElement(
                "span"
            );


        etiquetaElemento.className =
            "etiquetaHabitatCAB14";


        etiquetaElemento.textContent =
            etiqueta;


        const nombre =
            document.createElement(
                "span"
            );


        nombre.className =
            "nombreHabitatCAB14";


        nombre.textContent =
            habitat.nombre;


        linea.appendChild(
            etiquetaElemento
        );


        linea.appendChild(
            nombre
        );


        bloque.appendChild(
            linea
        );


        if (
            habitat.descripcion
        ) {

            const descripcion =
                document.createElement(
                    "p"
                );


            descripcion.className =
                "descripcionHabitatCAB14";


            descripcion.textContent =
                habitat.descripcion;


            bloque.appendChild(
                descripcion
            );

        }


        seccion.appendChild(
            bloque
        );

    }


    if (
        seccion.children.length > 1
    ) {

        contenedor.appendChild(
            seccion
        );

    }

}


/* =====================================================
   MOSTRAR CAB14
   ===================================================== */

window.CAB14 = {


    mostrar: async function(
        contenedor
    ) {


        console.log(
            "CAB14: mostrando hábitats."
        );


        /* -----------------------------------------
           COMPROBAR CONTENEDOR
        ----------------------------------------- */

        if (!contenedor) {

            console.error(
                "CAB14: no existe contenedor."
            );

            return;

        }


        /* -----------------------------------------
           OBTENER CÓDIGO
        ----------------------------------------- */

        const codigo =
            obtenerCodigoCAB14();


        if (!codigo) {

            contenedor.innerHTML =
                "<h3>Hábitats</h3>" +
                "<p>No se ha podido obtener " +
                "la paleoficha.</p>";

            return;

        }


        /* -----------------------------------------
           MENSAJE TEMPORAL
        ----------------------------------------- */

        contenedor.innerHTML =
            "<h3>Hábitats</h3>" +
            "<p>Cargando información...</p>";


        try {


            /* =====================================
               COMPROBAR DECODIFICADOR
            ===================================== */

            if (
                !window.PALHABDECODER
            ) {

                throw new Error(
                    "CAB14: PALHABDECODER.js " +
                    "no está cargado."
                );

            }


            /* =====================================
               OBTENER j5 + j6
            ===================================== */

            const datosCSV =
                await obtenerJ5J6CAB14(
                    codigo
                );


            /* =====================================
               DECODIFICAR
            ===================================== */

            const datos =
                PALHABDECODER.decodificar(
                    datosCSV.j5,
                    datosCSV.j6
                );


            console.log(
                "CAB14: datos decodificados:",
                datos
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
                "Hábitats";


            contenedor.appendChild(
                titulo
            );


            /* =====================================
               PREDOMINANTE
            ===================================== */

            if (
                datos.predominante
            ) {

                crearBloqueCAB14(
                    contenedor,
                    "Hábitat predominante",
                    datos.predominante
                );

            }


            /* =====================================
               PRINCIPALES
            ===================================== */

            crearSeccionCAB14(
                contenedor,
                "Hábitats principales",
                datos.principales,
                "Hábitat principal"
            );


            /* =====================================
               SECUNDARIOS
            ===================================== */

            crearSeccionCAB14(
                contenedor,
                "Hábitats secundarios",
                datos.secundarios,
                "Hábitat secundario"
            );


            /* =====================================
               SIN HÁBITATS
            ===================================== */

            if (
                !datos.predominante &&
                datos.principales.length === 0 &&
                datos.secundarios.length === 0
            ) {

                const vacio =
                    document.createElement(
                        "p"
                    );


                vacio.className =
                    "sinHabitatCAB14";


                vacio.textContent =
                    "Hábitat no definido.";


                contenedor.appendChild(
                    vacio
                );

            }


            /* =====================================
               CONFIRMACIÓN
            ===================================== */

            console.log(
                "CAB14: mostrado correctamente:",
                codigo
            );

        } catch (
            error
        ) {


            console.error(
                "CAB14:",
                error
            );


            contenedor.innerHTML =
                "<h3>Hábitats</h3>" +
                "<p>No se ha podido obtener " +
                "la información de los hábitats.</p>";

        }

    },


    /* =================================================
       LIMPIAR
       ================================================= */

    limpiar: function(
        contenedor
    ) {

        if (contenedor) {

            contenedor.innerHTML =
                "";

        }

    }

};


/* =====================================================
   FIN CAB14.js v1.1
===================================================== */
