/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

VERSIÓN FINAL — PRUEBA DIRECTA J3

OBJETIVO:

001–005:
    Mantener comportamiento geológico existente.

006 en adelante:
    J1
     ↓
    LEEPALJSON.obtener()
     ↓
    registro.j3
     ↓
    TELEOBLIGATORIO

Para 006_01 debe mostrar:

    TELEOBLIGATORIO: 0068.6000-0066.0000

IMPORTANTE:

TELEOBLIGATORIO NO UTILIZA:

- CARGACONT
- CONT07
- PALGEOSIMPLIFICADO
- PALGEO

Para la lectura directa únicamente utiliza:

    LEEPALJSON.obtener()

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


        const texto =
            String(j3).trim();


        const partes =
            texto.split("-");


        if (
            partes.length !== 2
        ) {

            return texto;

        }


        let inicio =
            partes[0].trim();


        let fin =
            partes[1].trim();


        if (
            /^\d+\.\d{4}$/.test(inicio)
        ) {

            const partesInicio =
                inicio.split(".");


            inicio =
                partesInicio[0]
                    .padStart(4, "0")
                +
                "."
                +
                partesInicio[1];

        }


        if (
            /^\d+\.\d{4}$/.test(fin)
        ) {

            const partesFin =
                fin.split(".");


            fin =
                partesFin[0]
                    .padStart(4, "0")
                +
                "."
                +
                partesFin[1];

        }


        return (
            inicio +
            "-" +
            fin
        );

    },


    /* =====================================================
       OBTENER J3 DIRECTAMENTE DE LEEPALJSON

       NO utiliza CARGACONT.
       NO utiliza CONT07.
       NO utiliza PALGEO.
       NO utiliza PALGEOSIMPLIFICADO.

       Devuelve el j3 bruto del registro.
       ===================================================== */

    obtenerJ3Directo(j1) {

        if (
            j1 === undefined ||
            j1 === null
        ) {

            console.warn(
                "CAB07: J1 vacío en obtenerJ3Directo."
            );

            return "";

        }


        const codigoBuscado =
            String(j1)
                .trim()
                .toUpperCase();


        if (
            !codigoBuscado
        ) {

            return "";

        }


        if (
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ) {

            console.error(
                "CAB07: LEEPALJSON no está disponible."
            );

            return "";

        }


        let registros;


        try {

            registros =
                window.LEEPALJSON.obtener();

        } catch (error) {

            console.error(
                "CAB07: error leyendo LEEPALJSON.",
                error
            );

            return "";

        }


        if (
            !Array.isArray(registros)
        ) {

            console.error(
                "CAB07: LEEPALJSON.obtener() no devuelve un array."
            );

            return "";

        }


        for (
            const registro of registros
        ) {

            if (
                !registro
            ) {

                continue;

            }


            const codigoRegistro =
                String(
                    registro.codigo ||
                    registro.j1 ||
                    ""
                )
                .trim()
                .toUpperCase();


            if (
                codigoRegistro !==
                codigoBuscado
            ) {

                continue;

            }


            if (
                registro.j3 === undefined ||
                registro.j3 === null
            ) {

                console.error(
                    "CAB07: encontrado " +
                    codigoBuscado +
                    " pero no contiene j3."
                );

                return "";

            }


            /*
            -------------------------------------------------
            IMPORTANTE:

            AQUÍ NO SE TOCA EL VALOR.

            No normalizar.
            No analizar.
            No convertir.
            No interpretar.
            -------------------------------------------------
            */

            const j3Bruto =
                String(
                    registro.j3
                );


            console.log(
                "CAB07 — J3 DIRECTO DESDE CSV:",
                codigoBuscado,
                j3Bruto
            );


            return j3Bruto;

        }


        console.error(
            "CAB07: no se encontró " +
            codigoBuscado +
            " directamente en LEEPALJSON."
        );


        return "";

    },


    /* =====================================================
       MOSTRAR J3 DIRECTO

       001–005:
           No interviene.

       006 en adelante:
           muestra j3 bruto.
       ===================================================== */

    mostrarJ3Directo(j1) {

        if (
            !j1
        ) {

            return;

        }


        const codigo =
            String(j1)
                .trim()
                .toUpperCase();


        const prefijo =
            codigo.substring(
                0,
                3
            );


        /*
        -----------------------------------------------------
        REGLA DE COMPATIBILIDAD

        Las primeras 5 series no se tocan.
        -----------------------------------------------------
        */

        if (
            prefijo === "001" ||
            prefijo === "002" ||
            prefijo === "003" ||
            prefijo === "004" ||
            prefijo === "005"
        ) {

            return;

        }


        /*
        -----------------------------------------------------
        OBTENER J3 DIRECTO
        -----------------------------------------------------
        */

        const j3 =
            this.obtenerJ3Directo(
                codigo
            );


        if (
            j3 === ""
        ) {

            return;

        }


        /*
        -----------------------------------------------------
        ELIMINAR RESULTADO ANTERIOR
        -----------------------------------------------------
        */

        const anterior =
            document.getElementById(
                "teleobligatorioCAB07"
            );


        if (
            anterior
        ) {

            anterior.remove();

        }


        /*
        -----------------------------------------------------
        CREAR BLOQUE
        -----------------------------------------------------
        */

        const bloque =
            document.createElement(
                "div"
            );


        bloque.id =
            "teleobligatorioCAB07";


        bloque.style.display =
            "block";


        bloque.style.margin =
            "20px auto";


        bloque.style.padding =
            "15px";


        bloque.style.maxWidth =
            "700px";


        bloque.style.border =
            "2px solid currentColor";


        bloque.style.borderRadius =
            "10px";


        bloque.style.fontSize =
            "18px";


        bloque.style.fontWeight =
            "bold";


        bloque.style.textAlign =
            "center";


        bloque.style.zIndex =
            "99999";


        bloque.innerHTML =
            `
            <div>
                ${codigo}
            </div>

            <div>
                TELEOBLIGATORIO: ${j3}
            </div>
            `;


        /*
        -----------------------------------------------------
        INSERTAR DIRECTAMENTE EN BODY

        No depende de:

        - cronologia
        - resultadoGeologiaCAB07
        - CONT07
        - botón vídeo
        -----------------------------------------------------
        */

        document.body.appendChild(
            bloque
        );


        console.log(
            "========================================"
        );

        console.log(
            "CAB07 — TELEOBLIGATORIO DIRECTO"
        );

        console.log(
            "J1:",
            codigo
        );

        console.log(
            "J3:",
            j3
        );

        console.log(
            "========================================"
        );

    },


    /* =====================================================
       FORMATEAR LISTA
       ===================================================== */

    formatearRangoLista(lista) {

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


        if (
            !valores.length
        ) {

            return "—";

        }


        const unicos =
            Array.from(
                new Set(
                    valores
                )
            );


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
       OBTENER RANGO VISUAL
       ===================================================== */

    obtenerRangoVisual(j3, geologia) {

        if (
            geologia &&
            typeof geologia.rango ===
            "string" &&
            geologia.rango.trim()
        ) {

            return geologia.rango.trim();

        }


        if (
            window.PALGEOSIMPLIFICADO &&
            typeof window.PALGEOSIMPLIFICADO
                .decodificarRango ===
            "function"
        ) {

            try {

                const rango =
                    window.PALGEOSIMPLIFICADO
                        .decodificarRango(
                            j3
                        );


                if (
                    rango &&
                    typeof rango ===
                    "string"
                ) {

                    return rango;

                }

            } catch (error) {

                console.warn(
                    "CAB07: no se pudo convertir visualmente el rango.",
                    error
                );

            }

        }


        return "—";

    },


    /* =====================================================
       OBTENER CONTENEDOR VISUAL
       ===================================================== */

    obtenerContenedorVisual() {

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


        const botones =
            document.querySelectorAll(
                "button, a"
            );


        let botonVideo =
            null;


        for (
            const elemento of botones
        ) {

            const texto =
                String(
                    elemento.textContent || ""
                )
                .trim()
                .toLowerCase();


            if (
                texto.includes("ver vídeo") ||
                texto.includes("ver video")
            ) {

                botonVideo =
                    elemento;

                break;

            }

        }


        if (
            botonVideo
        ) {

            botonVideo.insertAdjacentElement(
                "afterend",
                contenedor
            );

        } else {

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

        }


        return contenedor;

    },


    /* =====================================================
       LIMPIAR PRESENTACIÓN
       ===================================================== */

    limpiarPresentacion() {

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


        const tele =
            document.getElementById(
                "teleobligatorioCAB07"
            );


        if (
            tele
        ) {

            tele.remove();

        }

    },


    /* =====================================================
       MOSTRAR GEOLOGÍA
       ===================================================== */

    mostrarGeologia(datos) {

        const contenedor =
            this.obtenerContenedorVisual();


        const geologia = {

            rango:
                datos.rango,

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


        const rango =
            this.obtenerRangoVisual(
                datos.j3,
                geologia
            );


        const periodoVisual =
            this.formatearRangoLista(
                geologia.periodo
            );


        const edadVisual =
            this.formatearRangoLista(
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
                ${periodoVisual}
            </div>

            <div>
                <strong>
                    Edad:
                </strong>
                ${edadVisual}
            </div>
            `;

    },

        /* =====================================================
       PROCESAR REGISTRO RECIBIDO
       ===================================================== */

    procesar(datos) {

        /*
        -----------------------------------------------------
        VALIDAR DATOS
        -----------------------------------------------------
        */

        if (
            !datos ||
            typeof datos !== "object"
        ) {

            console.warn(
                "CAB07: registro recibido no válido."
            );

            return null;

        }


        /*
        -----------------------------------------------------
        COPIA DEL REGISTRO

        No modificamos el objeto original.
        -----------------------------------------------------
        */

        const registro =
            Object.assign(
                {},
                datos
            );


        /*
        -----------------------------------------------------
        J3 NORMALIZADO

        Se conserva el comportamiento anterior
        para la presentación geológica existente.
        -----------------------------------------------------
        */

        registro.j3 =
            this.normalizarJ3(
                registro.j3
            );


        /*
        -----------------------------------------------------
        GUARDAR REGISTRO EN CONT07
        -----------------------------------------------------
        */

        if (
            window.CONT07 &&
            typeof window.CONT07.guardar ===
            "function"
        ) {

            try {

                window.CONT07.guardar(
                    registro
                );

            } catch (error) {

                console.warn(
                    "CAB07: error al guardar registro en CONT07.",
                    error
                );

            }

        }


        /*
        -----------------------------------------------------
        PREPARAR GEOLOGÍA EXISTENTE
        -----------------------------------------------------
        */

        const geologia = {

            rango:
                registro.rango,

            codes:
                Array.isArray(
                    registro.codes
                )
                    ? registro.codes
                    : [],

            periodo:
                Array.isArray(
                    registro.periodo
                )
                    ? registro.periodo
                    : [],

            edad:
                Array.isArray(
                    registro.edad
                )
                    ? registro.edad
                    : []

        };


        /*
        -----------------------------------------------------
        GUARDAR GEOLOGÍA EN CONT07
        -----------------------------------------------------
        */

        if (
            window.CONT07 &&
            typeof window.CONT07.guardarGeologia ===
            "function"
        ) {

            try {

                window.CONT07.guardarGeologia(
                    geologia
                );

            } catch (error) {

                console.warn(
                    "CAB07: error al guardar geología en CONT07.",
                    error
                );

            }

        }


        /*
        -----------------------------------------------------
        LIMPIAR PRESENTACIÓN ANTERIOR
        -----------------------------------------------------
        */

        this.limpiarPresentacion();


        /*
        -----------------------------------------------------
        MOSTRAR GEOLOGÍA NORMAL
        -----------------------------------------------------
        */

        this.mostrarGeologia(
            registro
        );


        /*
        -----------------------------------------------------
        TELEOBLIGATORIO

        IMPORTANTE:

        Esta llamada se hace AQUÍ, dentro de procesar().

        No depende de actualizarPresentacion().

        Para 001–005 no hace nada.

        Para 006+ lee directamente LEEPALJSON.
        -----------------------------------------------------
        */

        this.mostrarJ3Directo(
            registro.j1
        );


        /*
        -----------------------------------------------------
        DEVOLVER REGISTRO
        -----------------------------------------------------
        */

        return registro;

    },


    /* =====================================================
       ACTUALIZAR DESDE CONT07
       ===================================================== */

    actualizarPresentacion() {

        let datos =
            null;


        /*
        -----------------------------------------------------
        OBTENER REGISTRO
        -----------------------------------------------------
        */

        if (
            window.CONT07 &&
            typeof window.CONT07.obtener ===
            "function"
        ) {

            datos =
                window.CONT07.obtener();

        }


        if (
            !datos
        ) {

            return;

        }


        /*
        -----------------------------------------------------
        MOSTRAR GEOLOGÍA NORMAL
        -----------------------------------------------------
        */

        this.limpiarPresentacion();


        this.mostrarGeologia(
            datos
        );


        /*
        -----------------------------------------------------
        TELEOBLIGATORIO

        También se ejecuta aquí por si el generador
        actualiza posteriormente la presentación.
        -----------------------------------------------------
        */

        this.mostrarJ3Directo(
            datos.j1
        );

    }


};


/* ========================================================
   ESCUCHAR EVENTO DE CARGACONT
======================================================== */

/*
--------------------------------------------------------
CARGACONT genera:

    palentropia:contenedor-cargado

CAB07 únicamente escucha.

--------------------------------------------------------
*/

document.addEventListener(
    "palentropia:contenedor-cargado",
    function(evento) {

        try {

            const datos =
                evento &&
                evento.detail;


            if (
                !datos
            ) {

                console.warn(
                    "CAB07: evento recibido sin datos."
                );

                return;

            }


            window.CAB07.procesar(
                datos
            );

        } catch (error) {

            /*
            ------------------------------------------------
            LA GEOLOGÍA NO DEBE ROMPER LA FICHA
            ------------------------------------------------
            */

            console.warn(
                "CAB07: error procesando el evento geológico.",
                error
            );

        }

    }
);


/* ========================================================
   DISPONIBILIDAD GLOBAL
======================================================== */

window.CAB07 =
    window.CAB07;


/*
========================================================
FIN CAB07.js
========================================================
*/
