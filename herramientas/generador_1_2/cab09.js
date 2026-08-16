/*
========================================================
PalEntropía
CAB09.js
Generador de Paleofichas 1.1

FASE 4B — ESTADÍSTICAS

- Botón Estadísticas
- Lightbox independiente
- Lectura de e1-e11 desde master.csv
- Cálculo de indicadores Nivel 1
- Sin modificar CAB10
========================================================
*/


document.addEventListener(
    "palentropia:contenedor-cargado",
    function() {

        const ficha =
            document.getElementById("ficha");


        if (!ficha) {
            return;
        }


        /* =========================================
           EVITAR DUPLICADOS
           ========================================= */

        if (
            document.getElementById("botonEstadisticas")
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

            /* -------------------------------------
               1. URL
               ------------------------------------- */

            const parametros =
                new URLSearchParams(
                    window.location.search
                );

            const codigoURL =
                parametros.get("codigo");

            if (codigoURL) {
                return codigoURL;
            }


            /* -------------------------------------
               2. DATASET DE LA FICHA
               ------------------------------------- */

            if (
                ficha.dataset &&
                ficha.dataset.codigo
            ) {

                return ficha.dataset.codigo;

            }


            /* -------------------------------------
               3. BUSCAR CÓDIGO EN LA FICHA
               ------------------------------------- */

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
           OBTENER REGISTRO MASTER
           ========================================= */

        function obtenerRegistro(codigo) {

            if (
                !window.LEEPALJSON ||
                typeof window.LEEPALJSON.obtener !==
                "function"
            ) {

                console.error(
                    "CAB09: LEEPALJSON no disponible."
                );

                return null;

            }


            const datos =
                window.LEEPALJSON.obtener();


            if (!datos) {
                return null;
            }


            /* -------------------------------------
               Si devuelve un array
               ------------------------------------- */

            if (Array.isArray(datos)) {

                return datos.find(
                    function(registro) {

                        return (
                            registro &&
                            (
                                registro.j1 === codigo ||
                                registro.codigo === codigo
                            )
                        );

                    }
                ) || null;

            }


            /* -------------------------------------
               Si devuelve un objeto indexado
               ------------------------------------- */

            if (
                typeof datos === "object"
            ) {

                if (datos[codigo]) {
                    return datos[codigo];
                }


                if (
                    datos.j1 === codigo ||
                    datos.codigo === codigo
                ) {

                    return datos;

                }

            }


            return null;

        }


        /* =========================================
           CONVERTIR VALORES ESTADÍSTICOS
           ========================================= */

        function obtenerStats(registro) {

            if (!registro) {
                return null;
            }


            return {

                adaptabilidad:
                    Number(registro.e1),

                sociabilidad:
                    Number(registro.e2),

                resistencia:
                    Number(registro.e3),

                reproduccion:
                    Number(registro.e4),

                ofensiva:
                    Number(registro.e5),

                defensa:
                    Number(registro.e6),

                movilidad:
                    Number(registro.e7),

                plasticidad_ecologica:
                    Number(registro.e8),

                tamano:
                    Number(registro.e9),

                velocidad:
                    Number(registro.e10),

                inteligencia:
                    Number(registro.e11)

            };

        }


        /* =========================================
           CÁLCULOS NIVEL 1
           ========================================= */

        function calcularNivel1(stats) {

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
            function() {


                /* Evitar duplicado */

                if (
                    document.getElementById(
                        "lightboxEstadisticas"
                    )
                ) {
                    return;
                }


                /* =================================
                   CÓDIGO ACTUAL
                   ================================= */

                const codigo =
                    obtenerCodigoActual();


                if (!codigo) {

                    console.error(
                        "CAB09: No se pudo determinar " +
                        "el código de la paleoficha."
                    );

                    return;

                }


                /* =================================
                   REGISTRO MASTER
                   ================================= */

                const registro =
                    obtenerRegistro(codigo);


                if (!registro) {

                    console.error(
                        "CAB09: No se encontró el " +
                        "registro " + codigo +
                        " en los datos."
                    );

                    return;

                }


                /* =================================
                   ESTADÍSTICAS
                   ================================= */

                const stats =
                    obtenerStats(registro);


                if (!stats) {

                    console.error(
                        "CAB09: No se pudieron obtener " +
                        "las estadísticas."
                    );

                    return;

                }


                /* =================================
                   COMPROBAR DATOS
                   ================================= */

                console.log(
                    "CAB09 — Estadísticas:",
                    codigo,
                    stats
                );


                /* =================================
                   CÁLCULOS
                   ================================= */

                const nivel1 =
                    calcularNivel1(stats);


                console.log(
                    "CAB09 — Nivel 1:",
                    nivel1
                );


                /* =================================
                   LIGHTBOX
                   ================================= */

                const lightbox =
                    document.createElement("div");

                lightbox.id =
                    "lightboxEstadisticas";


                /* =================================
                   VENTANA
                   ================================= */

                const ventana =
                    document.createElement("div");


                ventana.innerHTML =

                    "<h2>Estadísticas</h2>" +

                    "<p><strong>" +
                    codigo +
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

                    "<h3>Nivel 1</h3>" +

                    "<p>Índice global: " +
                    nivel1.indice_global +
                    "</p>" +

                    "<p>Supervivencia: " +
                    nivel1.supervivencia +
                    "</p>" +

                    "<p>Competencia: " +
                    nivel1.competencia +
                    "</p>" +

                    "<p>Movilidad: " +
                    nivel1.movilidad +
                    "</p>" +

                    "<p>Reproducción: " +
                    nivel1.reproduccion +
                    "</p>";


                /* =================================
                   CERRAR
                   ================================= */

                const cerrar =
                    document.createElement("button");


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

            };


        console.log(
            "CAB09 — Estadísticas preparado."
        );

    }
);
