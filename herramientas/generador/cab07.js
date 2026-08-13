/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

CAB07 v2.1 LTS — MODELO LIMPIO

001–005:
    Utiliza la geología que ya llega preparada.

006+:
    LEEPALJSON
        ↓
    j3 directo de master.csv
        ↓
    PALGEOSIMPLIFICADO
        ↓
    rango / período / edad

NO:
- carga fichas
- llama a CARGACONT.cargar()
- utiliza BUSCARUTA
- utiliza PALVIDEO
- modifica master.csv
========================================================
*/

window.CAB07 = {

    version: "2.1 LTS",


    /* =====================================================
       COMPROBAR SERIE ANTIGUA
       ===================================================== */

    esSerieAntigua(j1) {

        const codigo =
            String(j1 || "")
                .trim()
                .toUpperCase();

        return /^(001|002|003|004|005)_/.test(
            codigo
        );

    },


    /* =====================================================
       OBTENER J3 DIRECTAMENTE DE MASTER.CSV
       
       Solo se utiliza para 006 en adelante.
       ===================================================== */

    obtenerJ3Directo(j1) {

        if (
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ) {

            console.warn(
                "CAB07: LEEPALJSON no disponible."
            );

            return "";

        }

        let registros;

        try {

            registros =
                window.LEEPALJSON.obtener();

        } catch (error) {

            console.warn(
                "CAB07: no se pudo leer master.csv.",
                error
            );

            return "";

        }

        if (
            !Array.isArray(registros)
        ) {

            return "";

        }

        const codigo =
            String(j1 || "")
                .trim()
                .toUpperCase();

        const registro =
            registros.find(
                item =>
                    item &&
                    String(
                        item.codigo ||
                        item.j1 ||
                        ""
                    )
                    .trim()
                    .toUpperCase() ===
                    codigo
            );

        if (
            !registro ||
            registro.j3 === undefined ||
            registro.j3 === null
        ) {

            console.warn(
                "CAB07: j3 no encontrado para " +
                codigo
            );

            return "";

        }

        return String(
            registro.j3
        );

    },


    /* =====================================================
       ANALIZAR J3
       ===================================================== */

    analizarJ3(j3) {

        const vacio = {

            rango: null,
            periodo: [],
            edad: []

        };

        if (
            !j3 ||
            !window.PALGEOSIMPLIFICADO ||
            typeof window.PALGEOSIMPLIFICADO.analizar !==
            "function"
        ) {

            return vacio;

        }

        try {

            const resultado =
                window.PALGEOSIMPLIFICADO
                    .analizar(j3);

            if (
                !resultado
            ) {

                return vacio;

            }

            return {

                rango:
                    resultado.rango || null,

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

            return vacio;

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
            [
                ...new Set(
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
                        )
                )
            ];

        if (
            !valores.length
        ) {

            return "—";

        }

        if (
            valores.length > 3
        ) {

            return (
                "Del " +
                valores[0] +
                " al " +
                valores[
                    valores.length - 1
                ]
            );

        }

        return valores.join(", ");

    },

        /* =====================================================
       CONTENEDOR VISUAL
       ===================================================== */

    obtenerContenedor() {

        let contenedor =
            document.getElementById(
                "resultadoGeologiaCAB07"
            );

        if (
            contenedor
        ) {

            return contenedor;

        }

        contenedor =
            document.createElement(
                "div"
            );

        contenedor.id =
            "resultadoGeologiaCAB07";

        contenedor.style.cssText =
            `
            margin:12px auto;
            padding:10px;
            max-width:700px;
            border-radius:10px;
            font-size:15px;
            line-height:1.5;
            `;

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

        contenedor.innerHTML =
            `
            <div>
                <strong>Rango geológico:</strong>
                ${geologia.rango || "—"}
            </div>

            <div>
                <strong>Período:</strong>
                ${this.formatearLista(
                    geologia.periodo
                )}
            </div>

            <div>
                <strong>Edad:</strong>
                ${this.formatearLista(
                    geologia.edad
                )}
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

        if (
            contenedor
        ) {

            contenedor.innerHTML =
                "";

        }

    },


    /* =====================================================
       GEOLOGÍA QUE YA LLEGA DE CARGACONT
       
       Para 001–005.
       ===================================================== */

    obtenerGeologiaExistente(datos) {

        return {

            rango:
                datos.rango || null,

            periodo:
                Array.isArray(
                    datos.periodo
                )
                    ? datos.periodo
                    : [],

            edad:
                Array.isArray(
                    datos.edad
                )
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

            return null;

        }

        const j1 =
            String(
                datos.j1 || ""
            )
            .trim()
            .toUpperCase();

        if (
            !j1
        ) {

            return null;

        }


        /* =================================================
           001–005
           
           SE CONSERVA LA RUTA QUE YA FUNCIONA.
           ================================================= */

        if (
            this.esSerieAntigua(j1)
        ) {

            const geologia =
                this.obtenerGeologiaExistente(
                    datos
                );

            if (
                window.CONT07 &&
                typeof window.CONT07.guardar ===
                "function"
            ) {

                window.CONT07.guardar(
                    datos
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

            return datos;

        }


        /* =================================================
           006+
           
           NUEVA RUTA LIMPIA.
           ================================================= */

        const j3 =
            this.obtenerJ3Directo(
                j1
            );

        if (
            !j3
        ) {

            console.warn(
                "CAB07: no se pudo obtener j3 para " +
                j1
            );

            return datos;

        }


        const geologia =
            this.analizarJ3(
                j3
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
                {
                    ...datos,
                    j3: j3
                }
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


        /* =================================================
           MOSTRAR
           ================================================= */

        this.limpiar();

        this.mostrarGeologia(
            geologia
        );


        console.log(
            "CAB07:",
            j1,
            "j3:",
            j3
        );


        return {

            ...datos,
            j3: j3

        };

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

        if (
            !datos
        ) {

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
========================================================
*/
