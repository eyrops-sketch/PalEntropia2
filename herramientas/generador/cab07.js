/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1
========================================================
*/

window.CAB07 = {

    /* =====================================================
       NORMALIZAR J3
       ===================================================== */

    normalizarJ3(j3) {

        if (
            j3 === undefined ||
            j3 === null
        ) {
            return "";
        }

        const partes =
            String(j3)
                .trim()
                .split("-");

        if (partes.length !== 2) {
            return String(j3).trim();
        }

        const normalizar =
            valor => {

                valor = valor.trim();

                if (
                    !/^\d+\.\d{4}$/.test(valor)
                ) {
                    return valor;
                }

                const partes =
                    valor.split(".");

                return (
                    partes[0].padStart(4, "0") +
                    "." +
                    partes[1]
                );
            };

        return (
            normalizar(partes[0]) +
            "-" +
            normalizar(partes[1])
        );
    },


    /* =====================================================
       FORMATO VISUAL DE EDADES
       ===================================================== */

    formatearEdades(edades) {

        if (
            !Array.isArray(edades) ||
            !edades.length
        ) {
            return "—";
        }

        if (edades.length <= 3) {

            return edades
                .filter(Boolean)
                .join(", ");

        }

        return (
            "Del " +
            edades[0] +
            " al " +
            edades[edades.length - 1]
        );
    },


    /* =====================================================
       PREPARAR CONTENEDOR VISUAL
       ===================================================== */

    prepararContenedor() {

        let contenedor =
            document.getElementById(
                "resultadoGeologiaCAB07"
            );

        if (contenedor) {
            return contenedor;
        }

        contenedor =
            document.createElement("div");

        contenedor.id =
            "resultadoGeologiaCAB07";

        contenedor.style.margin =
            "12px auto";

        contenedor.style.padding =
            "10px";

        contenedor.style.maxWidth =
            "700px";

        contenedor.style.borderRadius =
            "10px";

        contenedor.style.fontSize =
            "13px";


        const cronologia =
            document.getElementById(
                "cronologia"
            );

        if (cronologia) {

            cronologia.insertAdjacentElement(
                "afterend",
                contenedor
            );

        } else {

            const ficha =
                document.getElementById(
                    "ficha"
                );

            if (ficha) {

                ficha.appendChild(
                    contenedor
                );

            } else {

                document.body.appendChild(
                    contenedor
                );

            }
        }

        return contenedor;
    },


    /* =====================================================
       MOSTRAR GEOLOGÍA
       
       NO MUESTRA CÓDIGOS.
       ===================================================== */

    mostrarGeologia() {

        const contenedor =
            document.getElementById(
                "resultadoGeologiaCAB07"
            );

        if (!contenedor) {
            return;
        }

        let geologia = null;

        if (
            window.CONT07 &&
            typeof window.CONT07.obtenerGeologia ===
            "function"
        ) {

            geologia =
                window.CONT07.obtenerGeologia();

        }

        if (!geologia) {

            contenedor.innerHTML =
                `
                <strong>Geología</strong>
                <br>
                Sin datos geológicos.
                `;

            return;
        }


        const periodo =
            Array.isArray(
                geologia.periodo
            )
                ? geologia.periodo.filter(Boolean)
                : [];


        const edad =
            Array.isArray(
                geologia.edad
            )
                ? geologia.edad.filter(Boolean)
                : [];


        const textoPeriodo =
            periodo.length
                ? periodo.join(", ")
                : "—";


        const textoEdad =
            this.formatearEdades(
                edad
            );


        contenedor.innerHTML =
            `
            <strong>Geología</strong>

            <br><br>

            <strong>Período:</strong>
            ${textoPeriodo}

            <br><br>

            <strong>Edad:</strong>
            ${textoEdad}
            `;
    },


    /* =====================================================
       ACTUALIZAR PRESENTACIÓN
       ===================================================== */

    actualizarPresentacion() {

        this.prepararContenedor();

        this.mostrarGeologia();

    },


    /* =====================================================
       PROCESAR
       ===================================================== */

    async procesar(j1) {

        if (
            typeof window.cargarMasterPorJ1 !==
            "function"
        ) {

            console.error(
                "CAB07: cargarMasterPorJ1 no está disponible."
            );

            return null;
        }


        const datos =
            await window.cargarMasterPorJ1(
                j1
            );


        if (!datos) {

            console.warn(
                "CAB07: No se encontró el registro:",
                j1
            );

            return null;
        }


        datos.j3 =
            this.normalizarJ3(
                datos.j3
            );


        /* =================================================
           GUARDAR REGISTRO
           ================================================= */

        if (
            window.CONT07 &&
            typeof window.CONT07.guardar ===
            "function"
        ) {

            window.CONT07.guardar(
                datos
            );

        } else {

            console.warn(
                "CAB07: CONT07 no está disponible."
            );
        }


        /* =================================================
           GEOLOGÍA
           ================================================= */

        if (
            window.LEEPALGEO &&
            typeof window.LEEPALGEO.extraer ===
            "function"
        ) {

            try {

                const geologia =
                    window.LEEPALGEO.extraer(
                        datos.j3
                    );

                if (
                    geologia &&
                    window.CONT07 &&
                    typeof window.CONT07.guardarGeologia ===
                    "function"
                ) {

                    window.CONT07.guardarGeologia(
                        geologia
                    );

                }

            } catch (error) {

                console.warn(
                    "CAB07: Error al obtener datos geológicos.",
                    error
                );
            }

        } else {

            console.warn(
                "CAB07: LEEPALGEO no está disponible."
            );
        }


        /* =================================================
           CRONOLOGÍA
           ================================================= */

        const cronologia =
            document.getElementById(
                "cronologia"
            );

        if (cronologia) {

            cronologia.textContent =
                datos.j3 || "—";

        }


        /*
        La geología NO se muestra aquí.

        CARGACONT todavía debe terminar
        de construir la Paleoficha.
        */

        return datos;

    },

  /* =====================================================
   FIN DE CAB07
   ===================================================== */

};


/* =====================================================
   DISPONIBILIDAD GLOBAL
   ===================================================== */

window.CAB07 =
    CAB07;


/*
========================================================
FIN CAB07.js
========================================================
*/
