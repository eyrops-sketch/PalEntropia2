/*
========================================================
LEEPALJSON.js v1.2 LTS
Lector / conversor de master.csv
PalEntropía — Generador
========================================================

FUNCIÓN
-------
Lee master.csv y extrae:

j1 → codigo
j2 → nombre
j3 → cronologia
j7 → dieta
j8 → anatomia

COMPATIBILIDAD
--------------
El registro entrega:

codigo
nombre
j3
cronologia
dieta
anatomia

De esta forma se mantiene compatibilidad con
los módulos que utilizan j3 y con los que utilizan
cronologia.

========================================================
*/

window.PALEOFICHAS = [];


/* =====================================================
   PARSER CSV
===================================================== */

function parseCSV(texto) {

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


        /* ---------------------------------------------
           COMILLAS
        --------------------------------------------- */

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


        /* ---------------------------------------------
           SEPARADOR
        --------------------------------------------- */

        if (
            caracter === ',' &&
            !dentroComillas
        ) {

            fila.push(
                campo
            );

            campo = "";

            continue;
        }


        /* ---------------------------------------------
           FIN DE FILA
        --------------------------------------------- */

        if (
            (
                caracter === '\n' ||
                caracter === '\r'
            ) &&
            !dentroComillas
        ) {

            if (
                caracter === '\r' &&
                siguiente === '\n'
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


        /* ---------------------------------------------
           CARÁCTER NORMAL
        --------------------------------------------- */

        campo += caracter;

    }


    /* ---------------------------------------------
       ÚLTIMA FILA
    --------------------------------------------- */

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
   LIMPIEZA DE VALORES
===================================================== */

function limpiarValor(valor) {

    if (
        valor === undefined ||
        valor === null
    ) {

        return "";

    }


    return String(valor)
        .replace(/^\uFEFF/, "")
        .trim();

}


/* =====================================================
   CONVERSIÓN CSV → PALEOFICHAS
===================================================== */

function convertirCSV(
    textoCSV
) {

    const filas =
        parseCSV(
            textoCSV
        );


    if (
        !filas.length
    ) {

        throw new Error(
            "master.csv está vacío o no contiene datos."
        );

    }


    /* ---------------------------------------------
       CABECERA
    --------------------------------------------- */

    const cabecera =
        filas[0].map(
            valor =>
                limpiarValor(
                    valor
                ).toLowerCase()
        );


    const indiceJ1 =
        cabecera.indexOf(
            "j1"
        );


    const indiceJ2 =
        cabecera.indexOf(
            "j2"
        );


    const indiceJ3 =
        cabecera.indexOf(
            "j3"
        );


    const indiceJ7 =
        cabecera.indexOf(
            "j7"
        );


    const indiceJ8 =
        cabecera.indexOf(
            "j8"
        );


    /* ---------------------------------------------
       COMPROBAR COLUMNAS
    --------------------------------------------- */

    const faltantes = [];


    if (
        indiceJ1 === -1
    ) {

        faltantes.push(
            "j1"
        );

    }


    if (
        indiceJ2 === -1
    ) {

        faltantes.push(
            "j2"
        );

    }


    if (
        indiceJ3 === -1
    ) {

        faltantes.push(
            "j3"
        );

    }


    if (
        indiceJ7 === -1
    ) {

        faltantes.push(
            "j7"
        );

    }


    if (
        indiceJ8 === -1
    ) {

        faltantes.push(
            "j8"
        );

    }


    if (
        faltantes.length
    ) {

        throw new Error(
            "Faltan columnas obligatorias en master.csv: " +
            faltantes.join(", ")
        );

    }


    /* ---------------------------------------------
       CONVERSIÓN
    --------------------------------------------- */

    const resultado = [];


    for (
        let i = 1;
        i < filas.length;
        i++
    ) {

        const fila =
            filas[i];


        const codigo =
            limpiarValor(
                fila[indiceJ1]
            );


        const nombre =
            limpiarValor(
                fila[indiceJ2]
            );


        const cronologia =
            limpiarValor(
                fila[indiceJ3]
            );


        const dieta =
            limpiarValor(
                fila[indiceJ7]
            );


        const anatomia =
            limpiarValor(
                fila[indiceJ8]
            );


        /* -----------------------------------------
           IGNORAR FILAS COMPLETAMENTE VACÍAS
        ----------------------------------------- */

        if (
            codigo === "" &&
            nombre === "" &&
            cronologia === "" &&
            dieta === "" &&
            anatomia === ""
        ) {

            continue;

        }


        /* -----------------------------------------
           CREAR REGISTRO
           
           j3 y cronologia contienen exactamente
           el mismo valor.
        ----------------------------------------- */

        resultado.push({

            codigo:
                codigo,

            nombre:
                nombre,

            j3:
                cronologia,

            cronologia:
                cronologia,

            dieta:
                dieta,

            anatomia:
                anatomia

        });

    }


    return resultado;

}


/* =====================================================
   CARGAR MASTER.CSV
===================================================== */

async function cargarMasterCSV(
    ruta = "master.csv"
) {

    try {

        const respuesta =
            await fetch(
                ruta
            );


        if (
            !respuesta.ok
        ) {

            throw new Error(
                "No se pudo cargar " +
                ruta +
                " (" +
                respuesta.status +
                ")"
            );

        }


        const textoCSV =
            await respuesta.text();


        const datos =
            convertirCSV(
                textoCSV
            );


        window.PALEOFICHAS =
            datos;


        /* ---------------------------------------------
           EVENTO DE CARGA
        --------------------------------------------- */

        document.dispatchEvent(

            new CustomEvent(
                "palentropia:datos-cargados",
                {
                    detail:
                        datos
                }
            )

        );


        /* ---------------------------------------------
           CONSOLA
        --------------------------------------------- */

        console.log(
            "========================================"
        );

        console.log(
            "PalEntropía — LEEPALJSON v1.2 LTS"
        );

        console.log(
            "master.csv cargado correctamente"
        );

        console.log(
            "Paleofichas:",
            datos.length
        );

        console.log(
            "Campos preparados:"
        );

        console.log(
            "codigo, nombre, j3, cronologia, dieta, anatomia"
        );

        console.log(
            "========================================"
        );


        return datos;

    }


    catch (
        error
    ) {

        console.error(
            "ERROR LEEPALJSON:",
            error
        );


        window.PALEOFICHAS =
            [];


        document.dispatchEvent(

            new CustomEvent(
                "palentropia:error-carga",
                {
                    detail:
                        error
                }
            )

        );


        throw error;

    }

}


/* =====================================================
   FUNCIÓN DE ACCESO
===================================================== */

function obtenerPaleofichas() {

    return window.PALEOFICHAS;

}


/* =====================================================
   EXPORTACIÓN GLOBAL
===================================================== */

window.LEEPALJSON = {

    cargar:
        cargarMasterCSV,

    convertir:
        convertirCSV,

    obtener:
        obtenerPaleofichas

};


/* =====================================================
   CARGA AUTOMÁTICA
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarMasterCSV();

    }
);


/*
========================================================
FIN LEEPALJSON.js v1.2 LTS
========================================================
*/
