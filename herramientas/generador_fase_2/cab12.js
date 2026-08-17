/*
========================================================
PalEntropía
CAB12.js
Generador de Paleofichas 1.1

ECOLOGÍA — MODO DE VIDA

CAB12

- Obtiene el código actual j1
- Lee master.csv directamente
- Obtiene j9
- j9 → PALMODO
- El código MV es interno
- Obtiene el nombre real desde la ficha actual
- Muestra nombre de la paleoficha
- Muestra modo de vida
- Muestra descripción
========================================================
*/


let fichaActualCAB12 = null;


/* =====================================================
   RECIBIR FICHA ACTUAL
   ===================================================== */

document.addEventListener(
    "palentropia:contenedor-cargado",
    function(evento) {

        fichaActualCAB12 =
            evento.detail || null;


        console.log(
            "CAB12: ficha recibida:",
            fichaActualCAB12
        );

    }
);


/* =====================================================
   PARSER CSV
   ===================================================== */

function parseCSVCAB12(texto) {

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

function obtenerCodigoCAB12() {

    if (
        fichaActualCAB12 &&
        fichaActualCAB12.j1
    ) {

        return String(
            fichaActualCAB12.j1
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
   OBTENER NOMBRE REAL DE LA FICHA
   ===================================================== */

function obtenerNombreCAB12() {

    /*
    -----------------------------------------
    PRIMERO: ficha recibida
    -----------------------------------------
    */

    if (
        fichaActualCAB12 &&
        fichaActualCAB12.j2
    ) {

        const nombre =
            String(
                fichaActualCAB12.j2
            ).trim();


        /*
        El CSV utiliza "j2" como marcador.
        No debemos mostrarlo.
        */

        if (
            nombre &&
            nombre.toLowerCase() !== "j2"
        ) {

            return nombre;

        }

    }


    /*
    -----------------------------------------
    SEGUNDO: buscar el nombre en la ficha
    -----------------------------------------
    */

    const ficha =
        document.getElementById(
            "ficha"
        );


    if (ficha) {

        /*
        Intentamos localizar elementos
        habituales que contienen el nombre.
        */

        const selectores = [

            ".nombre",

            "#nombre",

            ".nombreEspecie",

            "#nombreEspecie",

            ".tituloFicha",

            "h1"

        ];


        for (
            const selector of selectores
        ) {

            const elemento =
                ficha.querySelector(
                    selector
                );


            if (
                elemento &&
                elemento.textContent.trim()
            ) {

                return elemento.textContent.trim();

            }

        }

    }


    return "";

}


/* =====================================================
   OBTENER DATOS ECOLÓGICOS DESDE MASTER.CSV
   ===================================================== */

async function obtenerDatosCAB12(
    codigo
) {


    const respuesta =
        await fetch(
            "master.csv"
        );


    if (!respuesta.ok) {

        throw new Error(
            "CAB12: no se pudo cargar master.csv"
        );

    }


    const texto =
        await respuesta.text();


    const filas =
        parseCSVCAB12(
            texto
        );


    if (!filas.length) {

        throw new Error(
            "CAB12: master.csv está vacío"
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


    const indiceJ9 =
        cabecera.indexOf(
            "j9"
        );


    if (
        indiceJ1 === -1
    ) {

        throw new Error(
            "CAB12: no existe j1 en master.csv"
        );

    }


    if (
        indiceJ9 === -1
    ) {

        throw new Error(
            "CAB12: no existe j9 en master.csv"
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
            "CAB12: no se encontró " +
            codigo +
            " en master.csv"
        );

    }


    /* -----------------------------------------
       j9
    ----------------------------------------- */

    const j9 =
        String(
            registro[indiceJ9] || ""
        ).trim();


    return {

        j1: codigo,

        j9: j9

    };

}


/* =====================================================
   CAB12
   ===================================================== */

window.CAB12 = {


    /* =================================================
       MOSTRAR
       ================================================= */

    mostrar: async function(
        contenedor
    ) {


        console.log(
            "CAB12: mostrando modo de vida."
        );


        /* -----------------------------------------
           COMPROBAR CONTENEDOR
        ----------------------------------------- */

        if (!contenedor) {

            console.error(
                "CAB12: no existe contenedor."
            );

            return;

        }


        /* -----------------------------------------
           OBTENER CÓDIGO
        ----------------------------------------- */

        const codigo =
            obtenerCodigoCAB12();


        if (!codigo) {

            console.error(
                "CAB12: no se pudo determinar el código actual."
            );

            contenedor.innerHTML =
                "<h3>Modo de vida</h3>" +
                "<p>No se ha podido obtener la paleoficha.</p>";

            return;

        }


        /* -----------------------------------------
           OBTENER NOMBRE REAL
        ----------------------------------------- */

        const nombreFicha =
            obtenerNombreCAB12();


        /* -----------------------------------------
           MENSAJE TEMPORAL
        ----------------------------------------- */

        contenedor.innerHTML =
            "<h3>Modo de vida</h3>" +
            "<p>Cargando información...</p>";


        try {


            /* =====================================
               OBTENER j1 Y j9
            ===================================== */

            const datos =
                await obtenerDatosCAB12(
                    codigo
                );


            console.log(
                "CAB12: datos ecológicos:",
                datos
            );


            /* =====================================
               COMPROBAR PALMODO
            ===================================== */

            if (!window.PALMODO) {

                throw new Error(
                    "PALMODO no está cargado."
                );

            }


            /* =====================================
               CONSTRUIR CLAVE INTERNA
               
               j9 = 001
               ↓
               MV001
               
               NO SE MUESTRA.
            ===================================== */

            const clave =
                "MV" +
                datos.j9.padStart(
                    3,
                    "0"
                );


            console.log(
                "CAB12: clave PALMODO interna:",
                clave
            );


            /* =====================================
               BUSCAR MODO
            ===================================== */

            const modo =
                window.PALMODO[
                    clave
                ];


            if (!modo) {

                throw new Error(
                    "No existe " +
                    clave +
                    " en PALMODO."
                );

            }


            /* =====================================
               LIMPIAR
            ===================================== */

            contenedor.innerHTML =
                "";


            /* =====================================
               NOMBRE PALEOFICHA
            ===================================== */

            if (
                nombreFicha
            ) {

                const nombre =
                    document.createElement(
                        "div"
                    );


                nombre.className =
                    "nombreFichaCAB12";


                nombre.textContent =
                    nombreFicha;


                contenedor.appendChild(
                    nombre
                );

            }


            /* =====================================
               TÍTULO
            ===================================== */

            const titulo =
                document.createElement(
                    "h3"
                );


            titulo.textContent =
                "Modo de vida";


            titulo.className =
                "tituloModoVidaCAB12";


            contenedor.appendChild(
                titulo
            );


            /* =====================================
               NOMBRE MODO DE VIDA
            ===================================== */

            const nombreModo =
                document.createElement(
                    "div"
                );


            nombreModo.className =
                "nombreModoVidaCAB12";


            nombreModo.textContent =
                modo.nombre;


            contenedor.appendChild(
                nombreModo
            );


            /* =====================================
               DESCRIPCIÓN
            ===================================== */

            const descripcion =
                document.createElement(
                    "p"
                );


            descripcion.className =
                "descripcionModoVidaCAB12";


            descripcion.textContent =
                modo.descripcion;


            contenedor.appendChild(
                descripcion
            );


            /* =====================================
               CONFIRMACIÓN
            ===================================== */

            console.log(
                "CAB12: mostrado correctamente:",
                datos.j1,
                nombreFicha,
                modo.nombre
            );


        } catch (
            error
        ) {


            console.error(
                "CAB12:",
                error
            );


            contenedor.innerHTML =
                "<h3>Modo de vida</h3>" +
                "<p>Modo de vida no definido.</p>";

        }

    }

};


/* =====================================================
   FIN CAB12
   =====================================================
*/
