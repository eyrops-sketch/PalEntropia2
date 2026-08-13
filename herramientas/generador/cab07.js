/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

FUNCIÓN:

- NO inicia cargas.
- NO llama a CARGACONT.cargar().
- NO llama a cargarMasterPorJ1().
- NO llama a BUSCARUTA.
- NO llama a PALGEOSIMPLIFICADO.analizar().
- NO llama a LEEPALGEO.

Recibe exclusivamente el registro producido por CARGACONT
mediante el evento:

    palentropia:contenedor-cargado

Obtiene del registro:

    j1
    j2
    j3
    rango
    codes
    periodo
    edad
    j7
    j8
    i0
    i2
    i3

Guarda el registro en CONT07.

Guarda la geología en CONT07.

Presenta:

    Rango geológico
    Período
    Edad

NO muestra códigos internos.

NO muestra la cronología interna.

NO modifica #cronologia.

NO modifica imágenes.

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


        /*
        -----------------------------------------------------
        GARANTIZAR XXXX.XXXX
        -----------------------------------------------------
        */

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


        /*
        -----------------------------------------------------
        SI HAY MÁS DE 3 ELEMENTOS
        -----------------------------------------------------
        */

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

        /*
        -----------------------------------------------------
        PRIMERA OPCIÓN:

        CARGACONT ya proporciona el rango humano.
        -----------------------------------------------------
        */

        if (
            geologia &&
            typeof geologia.rango ===
            "string" &&
            geologia.rango.trim()
        ) {

            return geologia.rango.trim();

        }


        /*
        -----------------------------------------------------
        SEGUNDA OPCIÓN:

        Conversión puramente visual.

        NO se realiza análisis geológico.
        -----------------------------------------------------
        */

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


        /*
        -----------------------------------------------------
        SI YA EXISTE
        -----------------------------------------------------
        */

        if (
            contenedor
        ) {

            return contenedor;

        }


        /*
        -----------------------------------------------------
        CREAR CONTENEDOR
        -----------------------------------------------------
        */

        contenedor =
            document.createElement(
                "div"
            );


        contenedor.id =
            "resultadoGeologiaCAB07";


        /*
        -----------------------------------------------------
        ESTILO
        -----------------------------------------------------
        */

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


        /*
        -----------------------------------------------------
        BUSCAR BOTÓN DE VÍDEO
        -----------------------------------------------------
        */

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


        /*
        -----------------------------------------------------
        INSERTAR DEBAJO DEL VÍDEO
        -----------------------------------------------------
        */

        if (
            botonVideo
        ) {

            botonVideo.insertAdjacentElement(
                "afterend",
                contenedor
            );

        } else {

            /*
            -------------------------------------------------
            RESPALDO
            -------------------------------------------------
            */

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

    },


    /* =====================================================
       MOSTRAR GEOLOGÍA
       ===================================================== */

    mostrarGeologia(datos) {

        const contenedor =
            this.obtenerContenedorVisual();


        /*
        -----------------------------------------------------
        OBTENER GEOLOGÍA DEL REGISTRO RECIBIDO
        -----------------------------------------------------
        */

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


        /*
        -----------------------------------------------------
        RANGO
        -----------------------------------------------------
        */

        const rango =
            this.obtenerRangoVisual(
                datos.j3,
                geologia
            );


        /*
        -----------------------------------------------------
        PERÍODO
        -----------------------------------------------------
        */

        const periodoVisual =
            this.formatearRangoLista(
                geologia.periodo
            );


        /*
        -----------------------------------------------------
        EDAD
        -----------------------------------------------------
        */

        const edadVisual =
            this.formatearRangoLista(
                geologia.edad
            );


        /*
        -----------------------------------------------------
        PRESENTACIÓN
        -----------------------------------------------------
        */

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
       
       IMPORTANTE:

       Esta función NO carga nada.

       Simplemente recibe el resultado de CARGACONT.
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
        NORMALIZAR J3 SOLO PARA PRESENTACIÓN
        -----------------------------------------------------
        */

        const registro =
            Object.assign(
                {},
                datos
            );


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
        PREPARAR GEOLOGÍA

        NO SE ANALIZA.

        Ya viene preparada por CARGACONT.
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
        ACTUALIZAR PRESENTACIÓN
        -----------------------------------------------------
        */

        this.limpiarPresentacion();


        this.mostrarGeologia(
            registro
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
        MOSTRAR

        NO SE REALIZA NINGUNA CARGA.
        -----------------------------------------------------
        */

        this.limpiarPresentacion();


        this.mostrarGeologia(
            datos
        );

    }

};


/* ========================================================
   ESCUCHAR EVENTO DE CARGACONT
======================================================== */

/*
--------------------------------------------------------
IMPORTANTE:

CARGACONT es quien genera este evento:

    palentropia:contenedor-cargado

CAB07 únicamente escucha.

CAB07 NO llama a CARGACONT.
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
