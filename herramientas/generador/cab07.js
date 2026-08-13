/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

MODELO BASE PARA CAB08, CAB09...

FUNCIÓN:

001–005
    → conserva la geología que ya llega funcionando.

006+
    → obtiene j3 directamente de LEEPALJSON
    → analiza ese j3 con PALGEOSIMPLIFICADO
    → muestra rango / período / edad.

NO:
    - carga fichas
    - llama a CARGACONT.cargar()
    - modifica master.csv
    - modifica CONT07
    - utiliza BUSCARUTA
    - utiliza PALVIDEO

========================================================
*/

window.CAB07 = {

    version: "2.0 LTS",

    /* =====================================================
       SERIES ANTIGUAS
       ===================================================== */

    esSerieAntigua(j1) {

        const codigo =
            String(j1 || "")
                .trim()
                .toUpperCase();

        const prefijo =
            codigo.substring(0, 3);

        return (
            prefijo === "001" ||
            prefijo === "002" ||
            prefijo === "003" ||
            prefijo === "004" ||
            prefijo === "005"
        );

    },


    /* =====================================================
       OBTENER J3 DIRECTO
       
       ÚNICA FUENTE PARA 006+
       
       LEEPALJSON
           ↓
       registro.codigo
           ↓
       registro.j3
       
       NO SE MODIFICA EL VALOR.
       ===================================================== */

    obtenerJ3Directo(j1) {

        const codigo =
            String(j1 || "")
                .trim()
                .toUpperCase();

        if (!codigo) {

            return "";

        }

        if (
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ) {

            console.error(
                "CAB07: LEEPALJSON no disponible."
            );

            return "";

        }

        let registros;

        try {

            registros =
                window.LEEPALJSON.obtener();

        } catch (error) {

            console.error(
                "CAB07: error obteniendo master.csv.",
                error
            );

            return "";

        }

        if (!Array.isArray(registros)) {

            console.error(
                "CAB07: LEEPALJSON no devuelve un array."
            );

            return "";

        }

        const registro =
            registros.find(
                item => {

                    if (!item) {

                        return false;

                    }

                    const codigoRegistro =
                        String(
                            item.codigo ||
                            item.j1 ||
                            ""
                        )
                        .trim()
                        .toUpperCase();

                    return (
                        codigoRegistro ===
                        codigo
                    );

                }
            );

        if (!registro) {

            console.error(
                "CAB07: no existe " +
                codigo +
                " en master.csv."
            );

            return "";

        }

        if (
            registro.j3 === undefined ||
            registro.j3 === null
        ) {

            console.error(
                "CAB07: " +
                codigo +
                " no contiene j3."
            );

            return "";

        }

        return String(
            registro.j3
        );

    },


    /* =====================================================
       ANALIZAR J3 PARA 006+
       
       El j3 ya procede directamente de master.csv.
       ===================================================== */

    analizarJ3(j3) {

        if (!j3) {

            return {

                rango: null,
                codes: [],
                periodo: [],
                edad: []

            };

        }

        if (
            !window.PALGEOSIMPLIFICADO ||
            typeof window.PALGEOSIMPLIFICADO.analizar !==
            "function"
        ) {

            console.warn(
                "CAB07: PALGEOSIMPLIFICADO no disponible."
            );

            return {

                rango: null,
                codes: [],
                periodo: [],
                edad: []

            };

        }

        try {

            const resultado =
                window.PALGEOSIMPLIFICADO
                    .analizar(j3);

            if (!resultado) {

                return {

                    rango: null,
                    codes: [],
                    periodo: [],
                    edad: []

                };

            }

            return {

                rango:
                    resultado.rango || null,

                codes:
                    Array.isArray(
                        resultado.codes
                    )
                        ? resultado.codes
                        : [],

                periodo:
                    Array.isArray(
                        resultado.periodo
                    )
                        ? resultado.periodo
                        : [],

                edad:
                    Array.isArray(
                        resultado.edad
                    )
                        ? resultado.edad
                        : []

            };

        } catch (error) {

            console.warn(
                "CAB07: error analizando j3.",
                error
            );

            return {

                rango: null,
                codes: [],
                periodo: [],
                edad: []

            };

        }

    },


    /* =====================================================
       FORMATEAR LISTA
       ===================================================== */

    formatearLista(lista) {

        if (
            !Array.isArray(lista) ||
            !lista.length
        ) {

            return "—";

        }

        const valores =
            lista
                .filter(
                    valor =>
                        valor !== undefined &&
                        valor !== null &&
                        String(valor).trim() !== ""
                )
                .map(
                    valor =>
                        String(valor).trim()
                );

        if (!valores.length) {

            return "—";

        }

        const unicos =
            [...new Set(valores)];

        if (
            unicos.length > 3
        ) {

            return (
                "Del " +
                unicos[0] +
                " al " +
                unicos[
                    unicos.length - 1
                ]
            );

        }

        return unicos.join(", ");

    },


    /* =====================================================
       CONTENEDOR VISUAL
       ===================================================== */

    obtenerContenedor() {

        let contenedor =
            document.getElementById(
                "resultadoGeologiaCAB07"
            );

        if (contenedor) {

            return contenedor;

        }

        contenedor =
            document.createElement(
                "div"
            );

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
            "15px";

        contenedor.style.lineHeight =
            "1.5";

        const cronologia =
            document.getElementById(
                "cronologia"
            );

        if (
            cronologia &&
            cronologia.parentElement
        ) {

            cronologia.parentElement
                .appendChild(
                    contenedor
                );

        } else {

            document.body.appendChild(
                contenedor
            );

        }

        return contenedor;

    },


    /* =====================================================
       MOSTRAR GEOLOGÍA
       ===================================================== */

    mostrarGeologia(geologia) {

        const contenedor =
            this.obtenerContenedor();

        const rango =
            geologia.rango ||
            "—";

        const periodo =
            this.formatearLista(
                geologia.periodo
            );

        const edad =
            this.formatearLista(
                geologia.edad
            );

        contenedor.innerHTML =
            `
            <div>
                <strong>
                    Rango geológico:
                </strong>
                ${rango}
            </div>

            <div>
                <strong>
                    Período:
                </strong>
                ${periodo}
            </div>

            <div>
                <strong>
                    Edad:
                </strong>
                ${edad}
            </div>
            `;

    },


    /* =====================================================
       LIMPIAR
       ===================================================== */

    limpiar() {

        const contenedor =
            document.getElementById(
                "resultadoGeologiaCAB07"
            );

        if (contenedor) {

            contenedor.remove();

        }

    },


    /* =====================================================
       GEOLOGÍA PARA 001–005
       
       Utiliza exclusivamente los datos que ya llegan
       preparados por la cadena antigua.
       ===================================================== */

    geologiaExistente(datos) {

        return {

            rango:
                datos.rango || null,

            codes:
                Array.isArray(datos.codes)
                    ? datos.codes
                    : [],

            periodo:
                Array.isArray(datos.periodo)
                    ? datos.periodo
                    : [],

            edad:
                Array.isArray(datos.edad)
                    ? datos.edad
                    : []

        };

    },

        /* =====================================================
       PROCESAR
       ===================================================== */

    procesar(datos) {

        if (
            !datos ||
            typeof datos !== "object"
        ) {

            console.warn(
                "CAB07: datos inválidos."
            );

            return null;

        }

        const registro =
            Object.assign(
                {},
                datos
            );

        const j1 =
            String(
                registro.j1 || ""
            )
            .trim()
            .toUpperCase();

        if (!j1) {

            console.warn(
                "CAB07: registro sin j1."
            );

            return null;

        }


        /* =================================================
           001–005
           
           NO TOCAR EL SISTEMA EXISTENTE.
           ================================================= */

        if (
            this.esSerieAntigua(j1)
        ) {

            const geologia =
                this.geologiaExistente(
                    registro
                );

            if (
                window.CONT07 &&
                typeof window.CONT07.guardar ===
                "function"
            ) {

                window.CONT07.guardar(
                    registro
                );

            }

            if (
                window.CONT07 &&
                typeof window.CONT07.guardarGeologia ===
                "function"
            ) {

                window.CONT07.guardarGeologia(
                    geologia
                );

            }

            this.limpiar();

            this.mostrarGeologia(
                geologia
            );

            return registro;

        }


        /* =================================================
           006 EN ADELANTE
           
           NUEVA RUTA LIMPIA:

           LEEPALJSON
               ↓
           j3 bruto
               ↓
           PALGEOSIMPLIFICADO
               ↓
           geología
           ================================================= */

        const j3 =
            this.obtenerJ3Directo(
                j1
            );

        if (!j3) {

            console.warn(
                "CAB07: no se obtuvo j3 para " +
                j1
            );

            return registro;

        }


        /*
        -----------------------------------------------------
        GUARDAR EL J3 DIRECTO

        Aquí sustituimos únicamente el j3 del registro
        recibido para que la nueva ruta trabaje con
        el valor real del CSV.
        -----------------------------------------------------
        */

        registro.j3 =
            j3;


        /*
        -----------------------------------------------------
        ANALIZAR J3
        -----------------------------------------------------
        */

        const geologia =
            this.analizarJ3(
                j3
            );


        /*
        -----------------------------------------------------
        GUARDAR EN CONT07
        -----------------------------------------------------
        */

        if (
            window.CONT07 &&
            typeof window.CONT07.guardar ===
            "function"
        ) {

            window.CONT07.guardar(
                registro
            );

        }

        if (
            window.CONT07 &&
            typeof window.CONT07.guardarGeologia ===
            "function"
        ) {

            window.CONT07.guardarGeologia(
                geologia
            );

        }


        /*
        -----------------------------------------------------
        MOSTRAR
        -----------------------------------------------------
        */

        this.limpiar();

        this.mostrarGeologia(
            geologia
        );


        /*
        -----------------------------------------------------
        CONFIRMACIÓN DE LA NUEVA RUTA
        -----------------------------------------------------
        */

        console.log(
            "CAB07:",
            j1,
            "→ j3 directo:",
            j3
        );


        return registro;

    },


    /* =====================================================
       ACTUALIZAR PRESENTACIÓN
       
       No vuelve a leer CSV.

       Utiliza únicamente CONT07.
       ===================================================== */

    actualizarPresentacion() {

        if (
            !window.CONT07 ||
            typeof window.CONT07.obtener !==
            "function"
        ) {

            return;

        }

        const datos =
            window.CONT07.obtener();

        if (!datos) {

            return;

        }

        const geologia =
            this.geologiaExistente(
                datos
            );

        this.limpiar();

        this.mostrarGeologia(
            geologia
        );

    }

};


/* ========================================================
   EVENTO DE CARGACONT
======================================================== */

document.addEventListener(
    "palentropia:contenedor-cargado",
    function(evento) {

        const datos =
            evento &&
            evento.detail;

        if (!datos) {

            return;

        }

        try {

            window.CAB07.procesar(
                datos
            );

        } catch (error) {

            console.warn(
                "CAB07: error procesando ficha.",
                error
            );

        }

    }
);


/* ========================================================
   FIN CAB07.js
======================================================== */
