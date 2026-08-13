/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

PRUEBA DIRECTA DE J3 — TELEOBLIGATORIO

FUNCIÓN:

- Mantiene el funcionamiento actual de CAB07.
- NO modifica CARGACONT.
- NO modifica CON07.
- NO modifica CONT07.
- NO utiliza PALGEOSIMPLIFICADO para obtener TELEOBLIGATORIO.
- Para códigos 001–005 mantiene el comportamiento existente.
- Para códigos distintos de 001–005 realiza una lectura
  directa del registro disponible en LEEPALJSON.
- Extrae directamente registro.j3.
- Conserva el valor bruto sin normalizar.
- Lo muestra como TELEOBLIGATORIO.

OBJETIVO DE LA PRUEBA:

Para 006_01 debe aparecer literalmente:

TELEOBLIGATORIO: 0068.6000-0066.0000

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
       OBTENER J3 DIRECTAMENTE DE MASTER.CSV
       
       PRUEBA TELEOBLIGATORIO

       Esta función NO utiliza:
       - CARGACONT.ultimo
       - CON07
       - CONT07
       - PALGEOSIMPLIFICADO

       Utiliza directamente:

       LEEPALJSON.obtener()
    ===================================================== */

    obtenerTeleobligatorio(j1) {

        /*
        -----------------------------------------------------
        VALIDAR J1
        -----------------------------------------------------
        */

        if (
            j1 === undefined ||
            j1 === null
        ) {

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


        /*
        -----------------------------------------------------
        OBTENER CONTENEDOR ORIGINAL
        -----------------------------------------------------
        */

        if (
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ) {

            console.warn(
                "CAB07: LEEPALJSON no está disponible para TELEOBLIGATORIO."
            );

            return "";

        }


        let contenedor = null;


        try {

            contenedor =
                window.LEEPALJSON.obtener();

        } catch (error) {

            console.warn(
                "CAB07: no se pudo obtener master.csv para TELEOBLIGATORIO.",
                error
            );

            return "";

        }


        /*
        -----------------------------------------------------
        VALIDAR CONTENEDOR
        -----------------------------------------------------
        */

        if (
            !Array.isArray(contenedor)
        ) {

            console.warn(
                "CAB07: el contenedor de master.csv no es un array."
            );

            return "";

        }


        /*
        -----------------------------------------------------
        BUSCAR J1 DIRECTAMENTE
        -----------------------------------------------------
        */

        for (
            const registro of contenedor
        ) {

            if (
                !registro
            ) {

                continue;

            }


            const codigo =
                String(
                    registro.codigo ||
                    registro.j1 ||
                    ""
                )
                .trim()
                .toUpperCase();


            if (
                codigo !== codigoBuscado
            ) {

                continue;

            }


            /*
            -------------------------------------------------
            EXTRAER J3 BRUTO

            IMPORTANTE:

            NO NORMALIZAR.
            NO ANALIZAR.
            NO CONVERTIR.
            NO PASAR POR PALGEO.

            Se devuelve exactamente el valor que contiene
            el registro original.
            -------------------------------------------------
            */

            if (
                registro.j3 === undefined ||
                registro.j3 === null
            ) {

                console.warn(
                    "CAB07: TELEOBLIGATORIO encontró " +
                    codigoBuscado +
                    " pero j3 no existe."
                );

                return "";

            }


            return String(
                registro.j3
            );

        }


        /*
        -----------------------------------------------------
        NO ENCONTRADO
        -----------------------------------------------------
        */

        console.warn(
            "CAB07: TELEOBLIGATORIO no encontró " +
            codigoBuscado +
            " en master.csv."
        );


        return "";

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
       MOSTRAR TELEOBLIGATORIO
       
       SOLO PARA CÓDIGOS DISTINTOS DE 001–005
       ===================================================== */

    mostrarTeleobligatorio(datos) {

        if (
            !datos ||
            !datos.j1
        ) {

            return;

        }


        const codigo =
            String(
                datos.j1
            )
            .trim()
            .toUpperCase();


        /*
        -----------------------------------------------------
        REGLA:

        001–005 mantienen completamente
        el comportamiento anterior.
        -----------------------------------------------------
        */

        const prefijo =
            codigo.substring(
                0,
                3
            );


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
        OBTENER J3 DIRECTAMENTE DEL CSV
        -----------------------------------------------------
        */

        const teleobligatorio =
            this.obtenerTeleobligatorio(
                codigo
            );


        /*
        -----------------------------------------------------
        SI NO EXISTE J3
        -----------------------------------------------------
        */

        if (
            teleobligatorio === ""
        ) {

            return;

        }


        const contenedor =
            this.obtenerContenedorVisual();


        /*
        -----------------------------------------------------
        AÑADIR SIN TOCAR LA PRESENTACIÓN ANTERIOR

        Se utiliza un bloque independiente para que
        TELEOBLIGATORIO no sustituya ni sobrescriba
        rango, período o edad.
        -----------------------------------------------------
        */

        const bloque =
            document.createElement(
                "div"
            );


        bloque.id =
            "teleobligatorioCAB07";


        bloque.style.marginTop =
            "12px";


        bloque.style.paddingTop =
            "10px";


        bloque.style.borderTop =
            "1px solid rgba(128,128,128,0.35)";


        bloque.innerHTML =
            `
            <div>
                <strong>
                    TELEOBLIGATORIO:
                </strong>
                ${teleobligatorio}
            </div>
            `;


        contenedor.appendChild(
            bloque
        );


        /*
        -----------------------------------------------------
        CONSOLA

        También dejamos el valor visible en consola
        para comprobar que coincide exactamente con
        master.csv.
        -----------------------------------------------------
        */

        console.log(
            "CAB07 — TELEOBLIGATORIO",
            codigo,
            teleobligatorio
        );

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
        ACTUALIZAR PRESENTACIÓN NORMAL
        -----------------------------------------------------
        */

        this.limpiarPresentacion();


        this.mostrarGeologia(
            registro
        );


        /*
        -----------------------------------------------------
        PRUEBA TELEOBLIGATORIO

        Se ejecuta DESPUÉS de la presentación normal.

        No modifica registro.j3.
        No modifica CONT07.
        No modifica geología.
        -----------------------------------------------------
        */

        this.mostrarTeleobligatorio(
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
        -----------------------------------------------------
        */

        this.limpiarPresentacion();


        this.mostrarGeologia(
            datos
        );


        /*
        -----------------------------------------------------
        TELEOBLIGATORIO

        Se vuelve a consultar directamente el CSV.
        -----------------------------------------------------
        */

        this.mostrarTeleobligatorio(
            datos
        );

    }

};


/* ========================================================
   ESCUCHAR EVENTO DE CARGACONT
======================================================== */

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






    
