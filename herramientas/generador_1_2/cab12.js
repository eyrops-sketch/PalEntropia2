/*
========================================================
PalEntropía
CAB12.js
Generador de Paleofichas 1.1

ECOLOGÍA — MODO DE VIDA

CAB12
- Obtiene j1 de la ficha actual
- Lee j9 directamente de master.csv
- j9 → PALMODO
========================================================
*/

window.CAB12 = {

    mostrar: async function(contenedor, ficha) {

        if (!contenedor) {
            console.error("CAB12: no existe contenedor.");
            return;
        }

        contenedor.innerHTML =
            "<h3>Modo de vida</h3>" +
            "<p>Cargando...</p>";

        /* =========================================
           OBTENER CÓDIGO
        ========================================= */

        let codigo = null;

        if (ficha && ficha.j1) {
            codigo = String(ficha.j1).trim();
        }

        if (!codigo) {

            const parametros =
                new URLSearchParams(
                    window.location.search
                );

            codigo =
                parametros.get("codigo");
        }

        if (!codigo) {

            contenedor.innerHTML =
                "<h3>Modo de vida</h3>" +
                "<p>No se ha podido obtener el código.</p>";

            return;
        }


        console.log(
            "CAB12: código actual =",
            codigo
        );


        /* =========================================
           COMPROBAR PALMODO
        ========================================= */

        if (!window.PALMODO) {

            contenedor.innerHTML =
                "<h3>Modo de vida</h3>" +
                "<p>No se ha podido cargar el catálogo.</p>";

            console.error(
                "CAB12: PALMODO no está cargado."
            );

            return;
        }


        /* =========================================
           LEER MASTER.CSV
        ========================================= */

        try {

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
                texto
                    .trim()
                    .split(/\r?\n/)
                    .map(
                        fila =>
                            fila.split(",")
                    );


            if (!filas.length) {

                throw new Error(
                    "master.csv está vacío"
                );

            }


            /* =====================================
               CABECERA
            ===================================== */

            const cabecera =
                filas[0].map(
                    campo =>
                        campo
                            .replace(
                                /^\uFEFF/,
                                ""
                            )
                            .trim()
                            .toLowerCase()
                );


            const indiceJ1 =
                cabecera.indexOf("j1");


            const indiceJ9 =
                cabecera.indexOf("j9");


            if (
                indiceJ1 === -1 ||
                indiceJ9 === -1
            ) {

                throw new Error(
                    "No se encontraron j1 y/o j9 en master.csv"
                );

            }


            /* =====================================
               BUSCAR FICHA
            ===================================== */

            const registro =
                filas.find(
                    fila =>
                        fila[indiceJ1] &&
                        fila[indiceJ1].trim() ===
                        codigo
                );


            if (!registro) {

                throw new Error(
                    "No se encontró " +
                    codigo +
                    " en master.csv"
                );

            }


            /* =====================================
               OBTENER j9
            ===================================== */

            const j9 =
                String(
                    registro[indiceJ9] || ""
                ).trim();


            console.log(
                "CAB12: j9 =",
                j9
            );


            if (!j9) {

                contenedor.innerHTML =
                    "<h3>Modo de vida</h3>" +
                    "<p>Modo de vida no definido.</p>";

                return;
            }


            /* =====================================
               CONSTRUIR CLAVE PALMODO
            ===================================== */

            const clave =
                "MV" +
                j9.padStart(3, "0");


            console.log(
                "CAB12: buscando",
                clave
            );


            const modo =
                window.PALMODO[clave];


            if (!modo) {

                contenedor.innerHTML =
                    "<h3>Modo de vida</h3>" +
                    "<p>Modo de vida no definido.</p>";

                console.error(
                    "CAB12: no existe",
                    clave
                );

                return;
            }


            /* =====================================
               MOSTRAR
            ===================================== */

            contenedor.innerHTML = "";


            const titulo =
                document.createElement("h3");

            titulo.textContent =
                "Modo de vida";


            contenedor.appendChild(
                titulo
            );


            const codigoModo =
                document.createElement("div");

            codigoModo.className =
                "codigoModoVidaCAB12";

            codigoModo.textContent =
                modo.codigo;


            contenedor.appendChild(
                codigoModo
            );


            const nombre =
                document.createElement("div");

            nombre.className =
                "nombreModoVidaCAB12";

            nombre.textContent =
                modo.nombre;


            contenedor.appendChild(
                nombre
            );


            const descripcion =
                document.createElement("p");

            descripcion.className =
                "descripcionModoVidaCAB12";

            descripcion.textContent =
                modo.descripcion;


            contenedor.appendChild(
                descripcion
            );


            console.log(
                "CAB12: mostrado correctamente:",
                codigo,
                j9,
                modo.nombre
            );


        } catch (error) {

            console.error(
                "CAB12:",
                error
            );


            contenedor.innerHTML =
                "<h3>Modo de vida</h3>" +
                "<p>No se ha podido obtener el modo de vida.</p>";

        }

    }

};
