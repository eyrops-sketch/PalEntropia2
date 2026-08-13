/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

FUNCIÓN:

- Recibe j1.
- Utiliza CARGACONT como fuente única del contenedor.
- Obtiene el registro completo ya preparado.
- La geología NO se vuelve a analizar aquí.
- CARGACONT ya obtiene:
      j3
      rango
      codes
      periodo
      edad
- Guarda el registro en CONT07.
- Guarda la geología en CONT07.
- Presenta la información geológica en formato humano.
- NO muestra códigos internos.
- NO muestra la cronología interna.
- NO modifica el campo superior de cronología.
- El bloque geológico se presenta debajo de "Ver vídeo".
- Si la geología falla, la ficha continúa funcionando.

RUTA:

master.csv
    ↓
LEEPALJSON
    ↓
CARGACONT
    ↓
PALGEOSIMPLIFICADO
    ↓
BUSCARUTA
    ↓
CAB07
    ↓
CONT07 / PRESENTACIÓN

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
       FORMATEAR LISTA GEOLÓGICA
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


        /*
        -----------------------------------------------------
        ELIMINAR DUPLICADOS SOLO PARA PRESENTACIÓN
        -----------------------------------------------------
        */

        const unicos =
            Array.from(
                new Set(
                    valores
                )
            );


        /*
        -----------------------------------------------------
        MÁS DE 3
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
       OBTENER TEXTO DEL RANGO
       ===================================================== */

    obtenerRangoVisual(j3, geologia) {

        /*
        -----------------------------------------------------
        PRIMERA OPCIÓN:
        rango proporcionado directamente por CARGACONT
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
        SOLO COMO PRESENTACIÓN DE RESPALDO.

        NO SE ANALIZA LA GEOLOGÍA.
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
                    "CAB07: No se pudo convertir el rango geológico.",
                    error
                );

            }

        }


        /*
        -----------------------------------------------------
        NO MOSTRAR J3 BRUTO
        -----------------------------------------------------
        */

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
                texto.includes(
                    "ver vídeo"
                ) ||
                texto.includes(
                    "ver video"
                )
            ) {

                botonVideo =
                    elemento;

                break;

            }

        }


        /*
        -----------------------------------------------------
        INSERTAR DEBAJO DEL BOTÓN
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
       LIMPIAR PRESENTACIÓN ANTERIOR
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

    mostrarGeologia(j3) {

        const contenedor =
            this.obtenerContenedorVisual();


        /*
        -----------------------------------------------------
        OBTENER GEOLOGÍA DESDE CONT07
        -----------------------------------------------------
        */

        let geologia =
            null;


        if (
            window.CONT07 &&
            typeof window.CONT07.obtenerGeologia ===
            "function"
        ) {

            geologia =
                window.CONT07.obtenerGeologia();

        }


        /*
        -----------------------------------------------------
        SIN DATOS
        -----------------------------------------------------
        */

        if (
            !geologia
        ) {

            contenedor.innerHTML =
                `
                <div>
                    <strong>Rango geológico:</strong>
                    —
                </div>

                <div>
                    <strong>Período:</strong>
                    —
                </div>

                <div>
                    <strong>Edad:</strong>
                    —
                </div>
                `;

            return;

        }


        /*
        -----------------------------------------------------
        RANGO HUMANO
        -----------------------------------------------------
        */

        const rango =
            this.obtenerRangoVisual(
                j3,
                geologia
            );


        /*
        -----------------------------------------------------
        PERÍODOS
        -----------------------------------------------------
        */

        const periodo =
            Array.isArray(
                geologia.periodo
            )
                ? geologia.periodo
                : [];


        /*
        -----------------------------------------------------
        EDADES
        -----------------------------------------------------
        */

        const edad =
            Array.isArray(
                geologia.edad
            )
                ? geologia.edad
                : [];


        /*
        -----------------------------------------------------
        PRESENTACIÓN COMPACTA
        -----------------------------------------------------
        */

        const periodoVisual =
            this.formatearRangoLista(
                periodo
            );


        const edadVisual =
            this.formatearRangoLista(
                edad
            );


        /*
        -----------------------------------------------------
        MOSTRAR
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
       ACTUALIZAR PRESENTACIÓN
       
       Se ejecuta después de CARGACONT.
       
       Vuelve a leer la geología almacenada en CONT07.
       
       NO toca:
       - #cronologia
       - CARGACONT
       - PALNAVEGADOR
       - el resto de la ficha
       ===================================================== */

    actualizarPresentacion() {

        /*
        -----------------------------------------------------
        OBTENER J3 DESDE CONT07
        -----------------------------------------------------
        */

        let j3 = "";


        if (
            window.CONT07 &&
            typeof window.CONT07.obtenerJ3 ===
            "function"
        ) {

            j3 =
                window.CONT07.obtenerJ3();

        }


        /*
        -----------------------------------------------------
        SI NO EXISTE J3
        -----------------------------------------------------
        */

        if (
            !j3
        ) {

            this.limpiarPresentacion();

            return;

        }


        /*
        -----------------------------------------------------
        VOLVER A MOSTRAR GEOLOGÍA
        -----------------------------------------------------
        */

        this.limpiarPresentacion();


        this.mostrarGeologia(
            j3
        );

    },


    /* =====================================================
       PROCESAR
       
       CARGACONT ES AHORA LA FUENTE ÚNICA.
       ===================================================== */

    async procesar(j1) {

        /*
        -----------------------------------------------------
        COMPROBAR CARGACONT
        -----------------------------------------------------
        */

        if (
            !window.CARGACONT ||
            typeof window.CARGACONT.cargar !==
            "function"
        ) {

            console.error(
                "CAB07: CARGACONT no está disponible."
            );

            return null;

        }


        /*
        -----------------------------------------------------
        OBTENER REGISTRO FINAL
       
        CARGACONT ya realiza:
       
        - búsqueda en master.csv
        - obtención de j3
        - análisis PALGEOSIMPLIFICADO
        - búsqueda BUSCARUTA
        - preparación de imágenes
        -----------------------------------------------------
        */

        let datos = null;


        try {

            datos =
                await window.CARGACONT.cargar(
                    j1
                );

        } catch (error) {

            console.error(
                "CAB07: Error al cargar el registro mediante CARGACONT.",
                error
            );

            return null;

        }


        /*
        -----------------------------------------------------
        COMPROBAR RESULTADO
        -----------------------------------------------------
        */

        if (
            !datos
        ) {

            console.warn(
                "CAB07: CARGACONT no devolvió datos para:",
                j1
            );

            return null;

        }


        /*
        -----------------------------------------------------
        NORMALIZAR J3 ÚNICAMENTE PARA PRESENTACIÓN
       
        NO SE VUELVE A ANALIZAR.
        -----------------------------------------------------
        */

        datos.j3 =
            this.normalizarJ3(
                datos.j3
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

            window.CONT07.guardar(
                datos
            );

        } else {

            console.warn(
                "CAB07: CONT07 no está disponible."
            );

        }


        /*
        =====================================================
        GEOLOGÍA

        CARGACONT YA HA EJECUTADO:

            j3
             ↓
        PALGEOSIMPLIFICADO
             ↓
        rango
        codes
        periodo
        edad

        CAB07 NO vuelve a llamar a analizar().
        =====================================================
        */

        const geologia = {

            rango:
                datos.rango,

            codes:
                Array.isArray(
                    datos.codes
                )
                    ? datos.codes
                    : [],

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
                    "CAB07: No se pudo guardar la geología en CONT07.",
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
        MOSTRAR GEOLOGÍA
        -----------------------------------------------------
        */

        this.mostrarGeologia(
            datos.j3
        );


        /*
        =====================================================
        IMPORTANTE

        CAB07 NO MODIFICA #cronologia.

        La cronología superior pertenece a la presentación
        general de la Paleoficha.

        La información geológica se presenta únicamente
        en #resultadoGeologiaCAB07.
        =====================================================
        */


        /*
        -----------------------------------------------------
        DEVOLVER REGISTRO FINAL
        -----------------------------------------------------
        */

        return datos;

    }

};


/*
========================================================
DISPONIBILIDAD GLOBAL
========================================================
*/

window.CAB07 =
    window.CAB07;


/*
========================================================
FIN CAB07.js
========================================================
*/

    
    
