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
- Cálculos Nivel 1
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

                    fila.push(campo);
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


                    fila.push(campo);
                    campo = "";


                    if (
                        fila.some(
                            valor =>
                                valor.trim() !== ""
                        )
                    ) {

                        filas.push(fila);

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

                fila.push(campo);


                if (
                    fila.some(
                        valor =>
                            valor.trim() !== ""
                    )
                ) {

                    filas.push(fila);

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
                await fetch("master.csv");


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudo cargar master.csv"
                );

            }


            const texto =
                await respuesta.text();


            const filas =
                parseCSV(texto);


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
                            .replace(/^\uFEFF/, "")
                            .trim()
                            .toLowerCase()
                );


            const indiceJ1 =
                cabecera.indexOf("j1");


            const indiceE1 =
                cabecera.indexOf("e1");


            const indiceE2 =
                cabecera.indexOf("e2");


            const indiceE3 =
                cabecera.indexOf("e3");


            const indiceE4 =
                cabecera.indexOf("e4");


            const indiceE5 =
                cabecera.indexOf("e5");


            const indiceE6 =
                cabecera.indexOf("e6");


            const indiceE7 =
                cabecera.indexOf("e7");


            const indiceE8 =
                cabecera.indexOf("e8");


            const indiceE9 =
                cabecera.indexOf("e9");


            const indiceE10 =
                cabecera.indexOf("e10");


            const indiceE11 =
                cabecera.indexOf("e11");


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
                            registro[indiceJ1].trim() ===
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

            return {

                adaptabilidad:
                    Number(fila[indiceE1]),

                sociabilidad:
                    Number(fila[indiceE2]),

                resistencia:
                    Number(fila[indiceE3]),

                reproduccion:
                    Number(fila[indiceE4]),

                ofensiva:
                    Number(fila[indiceE5]),

                defensa:
                    Number(fila[indiceE6]),

                movilidad:
                    Number(fila[indiceE7]),

                plasticidad_ecologica:
                    Number(fila[indiceE8]),

                tamano:
                    Number(fila[indiceE9]),

                velocidad:
                    Number(fila[indiceE10]),

                inteligencia:
                    Number(fila[indiceE11])

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


                if (!codigo) {

                    console.error(
                        "CAB09: No se pudo determinar " +
                        "el código actual."
                    );

                    return;

                }


                try {

                    const stats =
                        await obtenerEstadisticasCSV(
                            codigo
                        );


                    const nivel1 =
                        calcularNivel1(
                            stats
                        );


                    console.log(
                        "CAB09 — Estadísticas:",
                        codigo,
                        stats
                    );


                    console.log(
                        "CAB09 — Nivel 1:",
                        nivel1
                    );


                    /* =============================
                       LIGHTBOX
                       ============================= */

                    const lightbox =
                        document.createElement("div");

                    lightbox.id =
                        "lightboxEstadisticas";


                    /* =============================
                       VENTANA
                       ============================= */

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


                    /* =============================
                       CERRAR
                       ============================= */

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


                }
                catch (
                    error
                ) {

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
