/*
========================================================
PalEntropía
CAB09.js
Generador de Paleofichas 1.1

FASE 4C — ESTADÍSTICAS

- Botón Estadísticas
- Lightbox independiente
- Lectura directa de master.csv
- e1 → e11
- Cálculos de indicadores generales
- Nombre desde ficha.j2
- Filas visuales de estadísticas
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
                cabecera.indexOf("j1");


            const indicesEstadisticas = {

                adaptabilidad:
                    cabecera.indexOf("e1"),

                sociabilidad:
                    cabecera.indexOf("e2"),

                resistencia:
                    cabecera.indexOf("e3"),

                reproduccion:
                    cabecera.indexOf("e4"),

                ofensiva:
                    cabecera.indexOf("e5"),

                defensa:
                    cabecera.indexOf("e6"),

                movilidad:
                    cabecera.indexOf("e7"),

                plasticidad_ecologica:
                    cabecera.indexOf("e8"),

                tamano:
                    cabecera.indexOf("e9"),

                velocidad:
                    cabecera.indexOf("e10"),

                inteligencia:
                    cabecera.indexOf("e11")

            };


            if (
                indiceJ1 === -1
            ) {

                throw new Error(
                    "No se encontró la columna j1 en master.csv"
                );

            }


            for (
                const campo in indicesEstadisticas
            ) {

                if (
                    indicesEstadisticas[campo] === -1
                ) {

                    throw new Error(
                        "No se encontró la columna estadística correspondiente en master.csv"
                    );

                }

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
               CONSTRUIR ESTADÍSTICAS
            ------------------------------------- */

            const stats = {};


            for (
                const campo in indicesEstadisticas
            ) {

                stats[campo] =
                    Number(
                        fila[
                            indicesEstadisticas[campo]
                        ]
                    );

            }


            return stats;

        }


        /* =================================================
           CÁLCULOS — INDICADORES GENERALES
           ================================================= */

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


        /* =================================================
           CREAR FILA DE ESTADÍSTICA
           ================================================= */

        function crearFilaEstadistica(
            nombre,
            valor,
            clase
        ) {

            const fila =
                document.createElement("div");


            fila.className =
                "filaEstadisticaCAB09";


            const etiqueta =
                document.createElement("span");


            etiqueta.className =
                "etiquetaEstadisticaCAB09";


            etiqueta.textContent =
                nombre;


            const barra =
                document.createElement("div");


            barra.className =
                "barraEstadisticaCAB09";


            const progreso =
                document.createElement("div");


            progreso.className =
                "progresoEstadisticaCAB09";


            progreso.style.width =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(valor) || 0
                    )
                ) + "%";


            const numero =
                document.createElement("span");


            numero.className =
                "valorEstadisticaCAB09";


            numero.textContent =
                Number(valor);


            barra.appendChild(
                progreso
            );


            fila.appendChild(
                etiqueta
            );


            fila.appendChild(
                barra
            );


            fila.appendChild(
                numero
            );


            if (clase) {

                fila.classList.add(
                    clase
                );

            }


            return fila;

        }

             /* =================================================
           ABRIR LIGHTBOX
           ================================================= */

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
                        "CAB09: No se pudo determinar el código actual."
                    );

                    return;

                }


                try {

                    /* =====================================
                       OBTENER DATOS
                    ===================================== */

                    const stats =
                        await obtenerEstadisticasCSV(
                            codigo
                        );


                    /* =====================================
                       CALCULAR INDICADORES
                    ===================================== */

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


                    /* =====================================
                       LIGHTBOX
                    ===================================== */

                    const lightbox =
                        document.createElement(
                            "div"
                        );


                    lightbox.id =
                        "lightboxEstadisticas";


                    /* =====================================
                       VENTANA
                    ===================================== */

                    const ventana =
                        document.createElement(
                            "div"
                        );


                    /* =====================================
                       CABECERA
                    ===================================== */

                    const titulo =
                        document.createElement(
                            "h2"
                        );


                    titulo.textContent =
                        "Estadísticas";


                    ventana.appendChild(
                        titulo
                    );


                    /* =====================================
                       CÓDIGO
                    ===================================== */

                    const codigoElemento =
                        document.createElement(
                            "div"
                        );


                    codigoElemento.className =
                        "codigoEstadisticasCAB09";


                    codigoElemento.textContent =
                        codigo;


                    ventana.appendChild(
                        codigoElemento
                    );


                    /* =====================================
                       NOMBRE
                    ===================================== */

                    const nombreElemento =
                        document.createElement(
                            "div"
                        );


                    nombreElemento.className =
                        "nombreEstadisticasCAB09";


                    nombreElemento.textContent =
                        nombre;


                    ventana.appendChild(
                        nombreElemento
                    );


                    /* =====================================
                       ESTADÍSTICAS BASE
                    ===================================== */

                    const tituloBase =
                        document.createElement(
                            "h3"
                        );


                    tituloBase.textContent =
                        "Estadísticas base";


                    tituloBase.className =
                        "tituloSeccionCAB09";


                    ventana.appendChild(
                        tituloBase
                    );


                    const contenedorBase =
                        document.createElement(
                            "div"
                        );


                    contenedorBase.className =
                        "contenedorEstadisticasCAB09";


                    const estadisticasBase = [

                        [
                            "Adaptabilidad",
                            stats.adaptabilidad
                        ],

                        [
                            "Sociabilidad",
                            stats.sociabilidad
                        ],

                        [
                            "Resistencia",
                            stats.resistencia
                        ],

                        [
                            "Reproducción",
                            stats.reproduccion
                        ],

                        [
                            "Ofensiva",
                            stats.ofensiva
                        ],

                        [
                            "Defensa",
                            stats.defensa
                        ],

                        [
                            "Movilidad",
                            stats.movilidad
                        ],

                        [
                            "Plasticidad ecológica",
                            stats.plasticidad_ecologica
                        ],

                        [
                            "Tamaño",
                            stats.tamano
                        ],

                        [
                            "Velocidad",
                            stats.velocidad
                        ],

                        [
                            "Inteligencia",
                            stats.inteligencia
                        ]

                    ];


                    estadisticasBase.forEach(
                        function(item) {

                            contenedorBase.appendChild(

                                crearFilaEstadistica(
                                    item[0],
                                    item[1]
                                )

                            );

                        }
                    );


                    ventana.appendChild(
                        contenedorBase
                    );


                    /* =====================================
                       INDICADORES GENERALES
                    ===================================== */

                    const tituloIndicadores =
                        document.createElement(
                            "h3"
                        );


                    tituloIndicadores.textContent =
                        "Indicadores generales";


                    tituloIndicadores.className =
                        "tituloSeccionCAB09";


                    ventana.appendChild(
                        tituloIndicadores
                    );


                    const contenedorIndicadores =
                        document.createElement(
                            "div"
                        );


                    contenedorIndicadores.className =
                        "contenedorIndicadoresCAB09";


                    const indicadoresGenerales = [

                        [
                            "Índice global",
                            indicadores.indice_global
                        ],

                        [
                            "Supervivencia",
                            indicadores.supervivencia
                        ],

                        [
                            "Competencia",
                            indicadores.competencia
                        ],

                        [
                            "Indicador movilidad",
                            indicadores.movilidad
                        ],

                        [
                            "Indicador reproductor",
                            indicadores.reproduccion
                        ]

                    ];


                    indicadoresGenerales.forEach(
                        function(item) {

                            contenedorIndicadores.appendChild(

                                crearFilaEstadistica(
                                    item[0],
                                    item[1],
                                    "indicadorGeneralCAB09"
                                )

                            );

                        }
                    );


                    ventana.appendChild(
                        contenedorIndicadores
                    );


                    /* =====================================
                       BOTÓN CERRAR
                    ===================================== */

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


                    /* =====================================
                       INSERTAR LIGHTBOX
                    ===================================== */

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


        /* =================================================
           FIN CAB09
           ================================================= */

        console.log(
            "CAB09 — Estadísticas preparado."
        );

    }
);


