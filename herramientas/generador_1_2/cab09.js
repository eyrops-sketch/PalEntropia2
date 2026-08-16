/*
========================================================
PalEntropía
CAB09.js
Generador de Paleofichas 1.1

FASE 4B — ESTADÍSTICAS

- Botón Estadísticas
- Lightbox independiente
- Lectura directa de master.csv
- e1 → e11
- Cálculos de indicadores generales
- Nombre desde ficha.j2
- Sin modificar CAB10
========================================================
*/


/* =====================================================
   FICHA ACTUAL
===================================================== */

let fichaActualCAB09 = null;


/* =====================================================
   EVENTO: CONTENEDOR CARGADO
===================================================== */

document.addEventListener(
    "palentropia:contenedor-cargado",
    function(evento) {

        fichaActualCAB09 =
            evento.detail || null;


        const ficha =
            document.getElementById("ficha");


        if (!ficha) {
            return;
        }


        /* =========================================
           EVITAR DUPLICADOS
        ========================================= */

        if (
            document.getElementById(
                "botonEstadisticas"
            )
        ) {

            return;

        }


        /* =========================================
           CONTENEDOR
        ========================================= */

        const contenedor =
            document.createElement("div");

        contenedor.id =
            "botonesCAB09";


        /* =========================================
           BOTÓN ESTADÍSTICAS
        ========================================= */

        const botonEstadisticas =
            document.createElement("button");


        botonEstadisticas.id =
            "botonEstadisticas";


        botonEstadisticas.type =
            "button";


        botonEstadisticas.textContent =
            "Estadísticas";


        contenedor.appendChild(
            botonEstadisticas
        );


        ficha.appendChild(
            contenedor
        );


        /* =========================================
           OBTENER CÓDIGO ACTUAL
        ========================================= */

        function obtenerCodigoActual() {

            if (
                fichaActualCAB09 &&
                fichaActualCAB09.j1
            ) {

                return String(
                    fichaActualCAB09.j1
                ).trim();

            }


            const parametros =
                new URLSearchParams(
                    window.location.search
                );


            const codigoURL =
                parametros.get("codigo");


            if (codigoURL) {
                return codigoURL;
            }


            if (
                ficha.dataset &&
                ficha.dataset.codigo
            ) {

                return ficha.dataset.codigo;

            }


            const texto =
                ficha.innerText || "";


            const encontrado =
                texto.match(
                    /\b\d{3}_\d{2}\b/
                );


            if (encontrado) {
                return encontrado[0];
            }


            return null;

        }


        /* =========================================
           OBTENER NOMBRE ACTUAL
        ========================================= */

        function obtenerNombreActual() {

            if (
                fichaActualCAB09 &&
                fichaActualCAB09.j2
            ) {

                return String(
                    fichaActualCAB09.j2
                ).trim();

            }


            return "";

        }


        /* =========================================
           PARSER CSV
        ========================================= */

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


        /* =========================================
           OBTENER ESTADÍSTICAS DESDE MASTER.CSV
        ========================================= */

        async function obtenerEstadisticasCSV(
            codigo
        ) {

            const respuesta =
                await fetch(
                    "master.csv"
                );


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudo cargar master.csv"
                );

            }


            const texto =
                await respuesta.text();


            const filas =
                parseCSV(
                    texto
                );


            if (!filas.length) {

                throw new Error(
                    "master.csv está vacío"
                );

            }


            /* -------------------------------------
               CABECERA
            ------------------------------------- */

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


            const indiceE1 =
                cabecera.indexOf(
                    "e1"
                );


            const indiceE2 =
                cabecera.indexOf(
                    "e2"
                );


            const indiceE3 =
                cabecera.indexOf(
                    "e3"
                );


            const indiceE4 =
                cabecera.indexOf(
                    "e4"
                );


            const indiceE5 =
                cabecera.indexOf(
                    "e5"
                );


            const indiceE6 =
                cabecera.indexOf(
                    "e6"
                );


            const indiceE7 =
                cabecera.indexOf(
                    "e7"
                );


            const indiceE8 =
                cabecera.indexOf(
                    "e8"
                );


            const indiceE9 =
                cabecera.indexOf(
                    "e9"
                );


            const indiceE10 =
                cabecera.indexOf(
                    "e10"
                );


            const indiceE11 =
                cabecera.indexOf(
                    "e11"
                );


            if (
                indiceJ1 === -1 ||
                indiceE1 === -1 ||
                indiceE2 === -1 ||
                indiceE3 === -1 ||
                indiceE4 === -1 ||
                indiceE5 === -1 ||
                indiceE6 === -1 ||
                indiceE7 === -1 ||
                indiceE8 === -1 ||
                indiceE9 === -1 ||
                indiceE10 === -1 ||
                indiceE11 === -1
            ) {

                throw new Error(
                    "No se encontraron las columnas " +
                    "j1/e1-e11 en master.csv"
                );

            }


            /* -------------------------------------
               BUSCAR REGISTRO
            ------------------------------------- */

            const fila =
                filas.find(
                    function(registro) {

                        return (
                            registro[indiceJ1] &&
                            registro[indiceJ1]
                                .trim() ===
                            codigo
                        );

                    }
                );


            if (!fila) {

                throw new Error(
                    "No se encontró " +
                    codigo +
                    " en master.csv"
                );

            }


            /* -------------------------------------
               ESTADÍSTICAS
            ------------------------------------- */

            return {

                adaptabilidad:
                    Number(
                        fila[indiceE1]
                    ),

                sociabilidad:
                    Number(
                        fila[indiceE2]
                    ),

                resistencia:
                    Number(
                        fila[indiceE3]
                    ),

                reproduccion:
                    Number(
                        fila[indiceE4]
                    ),

                ofensiva:
                    Number(
                        fila[indiceE5]
                    ),

                defensa:
                    Number(
                        fila[indiceE6]
                    ),

                movilidad:
                    Number(
                        fila[indiceE7]
                    ),

                plasticidad_ecologica:
                    Number(
                        fila[indiceE8]
                    ),

                tamano:
                    Number(
                        fila[indiceE9]
                    ),

                velocidad:
                    Number(
                        fila[indiceE10]
                    ),

                inteligencia:
                    Number(
                        fila[indiceE11]
                    )

            };

        }


         /* =========================================
           CÁLCULOS — INDICADORES GENERALES
        ========================================= */

        function calcularIndicadores(
            stats
        ) {

            return {

                indice_global:
                    Math.round(
                        (
                            stats.adaptabilidad +
                            stats.resistencia +
                            stats.sociabilidad +
                            stats.reproduccion +
                            stats.ofensiva +
                            stats.defensa +
                            stats.movilidad +
                            stats.plasticidad_ecologica +
                            stats.tamano +
                            stats.velocidad +
                            stats.inteligencia
                        ) / 11
                    ),


                supervivencia:
                    Math.round(
                        (
                            stats.adaptabilidad +
                            stats.resistencia +
                            stats.defensa +
                            stats.plasticidad_ecologica
                        ) / 4
                    ),


                competencia:
                    Math.round(
                        (
                            stats.ofensiva +
                            stats.tamano +
                            stats.velocidad +
                            stats.inteligencia
                        ) / 4
                    ),


                movilidad:
                    Math.round(
                        (
                            stats.movilidad +
                            stats.velocidad
                        ) / 2
                    ),


                reproduccion:
                    Math.round(
                        (
                            stats.reproduccion +
                            stats.sociabilidad
                        ) / 2
                    )

            };

        }


        /* =========================================
           ABRIR LIGHTBOX
        ========================================= */

        botonEstadisticas.onclick =
            async function() {

                if (
                    document.getElementById(
                        "lightboxEstadisticas"
                    )
                ) {

                    return;

                }


                const codigo =
                    obtenerCodigoActual();


                const nombre =
                    obtenerNombreActual();


                if (!codigo) {

                    console.error(
                        "CAB09: No se pudo determinar " +
                        "el código actual."
                    );

                    return;

                }


                try {

                    /* =============================
                       DATOS MASTER
                    ============================= */

                    const stats =
                        await obtenerEstadisticasCSV(
                            codigo
                        );


                    /* =============================
                       INDICADORES
                    ============================= */

                    const indicadores =
                        calcularIndicadores(
                            stats
                        );


                    console.log(
                        "CAB09 — Estadísticas:",
                        codigo,
                        stats
                    );


                    console.log(
                        "CAB09 — Indicadores generales:",
                        indicadores
                    );


                    /* =============================
                       LIGHTBOX
                    ============================= */

                    const lightbox =
                        document.createElement(
                            "div"
                        );


                    lightbox.id =
                        "lightboxEstadisticas";


                    /* =============================
                       VENTANA
                    ============================= */

                    const ventana =
                        document.createElement(
                            "div"
                        );


                    ventana.innerHTML =

                        "<h2>Estadísticas</h2>" +

                        "<p><strong>" +
                        codigo +
                        "</strong></p>" +

                        "<p><strong>" +
                        nombre +
                        "</strong></p>" +

                        "<h3>Estadísticas base</h3>" +

                        "<p>Adaptabilidad: " +
                        stats.adaptabilidad +
                        "</p>" +

                        "<p>Sociabilidad: " +
                        stats.sociabilidad +
                        "</p>" +

                        "<p>Resistencia: " +
                        stats.resistencia +
                        "</p>" +

                        "<p>Reproducción: " +
                        stats.reproduccion +
                        "</p>" +

                        "<p>Ofensiva: " +
                        stats.ofensiva +
                        "</p>" +

                        "<p>Defensa: " +
                        stats.defensa +
                        "</p>" +

                        "<p>Movilidad: " +
                        stats.movilidad +
                        "</p>" +

                        "<p>Plasticidad ecológica: " +
                        stats.plasticidad_ecologica +
                        "</p>" +

                        "<p>Tamaño: " +
                        stats.tamano +
                        "</p>" +

                        "<p>Velocidad: " +
                        stats.velocidad +
                        "</p>" +

                        "<p>Inteligencia: " +
                        stats.inteligencia +
                        "</p>" +

                        "<h3>Indicadores generales</h3>" +

                        "<p>Índice global: " +
                        indicadores.indice_global +
                        "</p>" +

                        "<p>Supervivencia: " +
                        indicadores.supervivencia +
                        "</p>" +

                        "<p>Competencia: " +
                        indicadores.competencia +
                        "</p>" +

                        "<p>Movilidad: " +
                        indicadores.movilidad +
                        "</p>" +

                        "<p>Reproducción: " +
                        indicadores.reproduccion +
                        "</p>";


                    /* =============================
                       CERRAR
                    ============================= */

                    const cerrar =
                        document.createElement(
                            "button"
                        );


                    cerrar.type =
                        "button";


                    cerrar.textContent =
                        "×";


                    cerrar.setAttribute(
                        "aria-label",
                        "Cerrar estadísticas"
                    );


                    cerrar.onclick =
                        function() {

                            lightbox.remove();

                        };


                    ventana.appendChild(
                        cerrar
                    );


                    lightbox.appendChild(
                        ventana
                    );


                    document.body.appendChild(
                        lightbox
                    );

                }


                catch(error) {

                    console.error(
                        "CAB09 — Error estadísticas:",
                        error
                    );

                }

            };


        console.log(
            "CAB09 — Estadísticas preparado."
        );

    }
);       
