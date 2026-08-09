/*
========================================================
LEEPALJSON.js v1.0
Lector / conversor de master.csv
PalEntropía — Generador
========================================================

FUNCIÓN
-------
Lee master.csv y extrae exclusivamente:

j1 → codigo
j2 → nombre
j7 → dieta
j8 → anatomia

El módulo convierte la estructura del CSV en objetos
preparados para ser utilizados directamente por el
generador.

ENTRADA
-------
master.csv

Columnas utilizadas:
j1
j2
j7
j8

SALIDA
------
window.PALEOFICHAS

[
  {
    codigo: "...",
    nombre: "...",
    dieta: "...",
    anatomia: "..."
  }
]

========================================================
*/

window.PALEOFICHAS = [];


/* =====================================================
   PARSER CSV
   -----------------------------------------------------
   Permite campos entre comillas y comas dentro del texto.
===================================================== */

function parseCSV(texto) {

    const filas = [];

    let fila = [];
    let campo = "";
    let dentroComillas = false;

    for (let i = 0; i < texto.length; i++) {

        const caracter = texto[i];
        const siguiente = texto[i + 1];

        /* ---------------------------------------------
           COMILLAS
        --------------------------------------------- */

        if (caracter === '"') {

            /* Comilla doble escapada */
            if (dentroComillas && siguiente === '"') {

                campo += '"';
                i++;

            } else {

                dentroComillas = !dentroComillas;

            }

            continue;
        }


        /* ---------------------------------------------
           SEPARADOR
        --------------------------------------------- */

        if (caracter === ',' && !dentroComillas) {

            fila.push(campo);
            campo = "";

            continue;
        }


        /* ---------------------------------------------
           FIN DE FILA
        --------------------------------------------- */

        if (
            (caracter === '\n' || caracter === '\r') &&
            !dentroComillas
        ) {

            /* Evitar doble salto CRLF */
            if (
                caracter === '\r' &&
                siguiente === '\n'
            ) {
                i++;
            }

            fila.push(campo);
            campo = "";

            if (fila.some(valor => valor.trim() !== "")) {
                filas.push(fila);
            }

            fila = [];

            continue;
        }


        /* ---------------------------------------------
           CARACTER NORMAL
        --------------------------------------------- */

        campo += caracter;
    }


    /* ---------------------------------------------
       ÚLTIMA FILA
    --------------------------------------------- */

    if (campo !== "" || fila.length > 0) {

        fila.push(campo);

        if (fila.some(valor => valor.trim() !== "")) {
            filas.push(fila);
        }
    }


    return filas;
}


/* =====================================================
   LIMPIEZA DE VALORES
===================================================== */

function limpiarValor(valor) {

    if (valor === undefined || valor === null) {
        return "";
    }

    return String(valor)
        .replace(/^\uFEFF/, "")
        .trim();
}


/* =====================================================
   CONVERSIÓN CSV → PALEOFICHAS
===================================================== */

function convertirCSV(textoCSV) {

    const filas = parseCSV(textoCSV);

    if (!filas.length) {

        throw new Error(
            "master.csv está vacío o no contiene datos."
        );
    }


    /* ---------------------------------------------
       CABECERA
    --------------------------------------------- */

    const cabecera = filas[0].map(
        valor => limpiarValor(valor).toLowerCase()
    );


    const indiceJ1 = cabecera.indexOf("j1");
    const indiceJ2 = cabecera.indexOf("j2");
    const indiceJ7 = cabecera.indexOf("j7");
    const indiceJ8 = cabecera.indexOf("j8");


    /* ---------------------------------------------
       COMPROBACIÓN DE COLUMNAS
    --------------------------------------------- */

    const faltantes = [];

    if (indiceJ1 === -1) faltantes.push("j1");
    if (indiceJ2 === -1) faltantes.push("j2");
    if (indiceJ7 === -1) faltantes.push("j7");
    if (indiceJ8 === -1) faltantes.push("j8");


    if (faltantes.length) {

        throw new Error(
            "Faltan columnas obligatorias en master.csv: " +
            faltantes.join(", ")
        );
    }


    /* ---------------------------------------------
       CONVERSIÓN
    --------------------------------------------- */

    const resultado = [];


    for (let i = 1; i < filas.length; i++) {

        const fila = filas[i];


        const codigo = limpiarValor(
            fila[indiceJ1]
        );

        const nombre = limpiarValor(
            fila[indiceJ2]
        );

        const dieta = limpiarValor(
            fila[indiceJ7]
        );

        const anatomia = limpiarValor(
            fila[indiceJ8]
        );


        /* -----------------------------------------
           IGNORAR FILAS COMPLETAMENTE VACÍAS
        ----------------------------------------- */

        if (
            codigo === "" &&
            nombre === "" &&
            dieta === "" &&
            anatomia === ""
        ) {
            continue;
        }


        /* -----------------------------------------
           CREAR REGISTRO DEL GENERADOR
        ----------------------------------------- */

        resultado.push({

            codigo: codigo,

            nombre: nombre,

            dieta: dieta,

            anatomia: anatomia

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

        const respuesta = await fetch(ruta);


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar " +
                ruta +
                " (" +
                respuesta.status +
                ")"
            );
        }


        const textoCSV = await respuesta.text();


        const datos = convertirCSV(textoCSV);


        /* ---------------------------------------------
           ENTREGAR DATOS AL GENERADOR
        --------------------------------------------- */

        window.PALEOFICHAS = datos;


        /* ---------------------------------------------
           EVENTO DE CARGA
        --------------------------------------------- */

        document.dispatchEvent(
            new CustomEvent(
                "palentropia:datos-cargados",
                {
                    detail: datos
                }
            )
        );


        console.log(
            "========================================"
        );

        console.log(
            "PalEntropía — LEEPALJSON"
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
            "codigo, nombre, dieta, anatomia"
        );

        console.log(
            "========================================"
        );


        return datos;

    }


    catch (error) {

        console.error(
            "ERROR LEEPALJSON:",
            error
        );


        window.PALEOFICHAS = [];


        document.dispatchEvent(
            new CustomEvent(
                "palentropia:error-carga",
                {
                    detail: error
                }
            )
        );


        throw error;
    }
}


/* =====================================================
   FUNCIÓN DE ACCESO
   -----------------------------------------------------
   Permite al generador solicitar los datos ya
   preparados.
===================================================== */

function obtenerPaleofichas() {

    return window.PALEOFICHAS;
}


/* =====================================================
   EXPORTACIÓN GLOBAL
===================================================== */

window.LEEPALJSON = {

    cargar: cargarMasterCSV,

    convertir: convertirCSV,

    obtener: obtenerPaleofichas

};


/* =====================================================
   CARGA AUTOMÁTICA
   -----------------------------------------------------
   Al cargar el módulo se intenta leer master.csv.
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarMasterCSV();

    }
);




