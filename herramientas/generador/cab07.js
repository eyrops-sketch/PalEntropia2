/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

PRUEBA DIRECTA J3 — TELEOBLIGATORIO v2

OBJETIVO:

Para las fichas 001–005:
    mantener comportamiento existente.

Para fichas distintas de 001–005:

    LEEPALJSON
        ↓
    master.csv
        ↓
    buscar j1
        ↓
    obtener j3 BRUTO
        ↓
    mostrar directamente en BODY

IMPORTANTE:

Esta prueba NO utiliza para TELEOBLIGATORIO:

- CARGACONT
- CON07
- CONT07
- PALGEOSIMPLIFICADO
- PALGEO
- resultadoGeologiaCAB07

El valor debe salir directamente de:

    LEEPALJSON.obtener()
        ↓
    registro.j3

Para 006_01 esperamos:

    006_01
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
       OBTENER J3 DIRECTAMENTE DE LEEPALJSON

       ESTA ES LA PRUEBA AISLADA.

       No utiliza ningún dato procedente de CARGACONT.

       No analiza j3.

       No transforma j3.

       Devuelve exactamente el contenido de:

           registro.j3
       ===================================================== */

    obtenerJ3Directo(j1) {

        /*
        -----------------------------------------------------
        COMPROBAR J1
        -----------------------------------------------------
        */

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


        /*
        -----------------------------------------------------
        COMPROBAR LEEPALJSON
        -----------------------------------------------------
        */

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


        /*
        -----------------------------------------------------
        OBTENER DATOS DIRECTAMENTE
        -----------------------------------------------------
        */

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


        /*
        -----------------------------------------------------
        COMPROBAR ARRAY
        -----------------------------------------------------
        */

        if (
            !Array.isArray(registros)
        ) {

            console.error(
                "CAB07: LEEPALJSON.obtener() no devuelve un array."
            );

            return "";

        }


        /*
        -----------------------------------------------------
        BUSCAR REGISTRO POR J1
        -----------------------------------------------------
        */

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


            /*
            -------------------------------------------------
            REGISTRO ENCONTRADO

            NO TOCAR J3.

            NO NORMALIZAR.

            NO ANALIZAR.

            NO CONVERTIR.

            DEVOLVER BRUTO.
            -------------------------------------------------
            */

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


        /*
        -----------------------------------------------------
        NO ENCONTRADO
        -----------------------------------------------------
        */

        console.error(
            "CAB07: no se encontró " +
            codigoBuscado +
            " directamente en LEEPALJSON."
        );


        return "";

    },


    /* =====================================================
       MOSTRAR J3 DIRECTO EN BODY

       ESTA FUNCIÓN NO DEPENDE DE NINGÚN CONTENEDOR
       DE GEOLOGÍA.

       Se utiliza exclusivamente para la prueba.
       ===================================================== */

    mostrarJ3Directo(j1) {

        const codigo =
            String(
                j1 || ""
            )
            .trim()
            .toUpperCase();


        /*
        -----------------------------------------------------
        REGLA 001–005

        No hacer nada nuevo.
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
        OBTENER J3 BRUTO
        -----------------------------------------------------
        */

        const j3 =
            this.obtenerJ3Directo(
                codigo
            );


        /*
        -----------------------------------------------------
        SI NO HAY J3
        -----------------------------------------------------
        */

        if (
            j3 === ""
        ) {

            return;

        }


        /*
        -----------------------------------------------------
        ELIMINAR PRUEBA ANTERIOR

        Esto evita duplicados si la ficha se refresca
        internamente sin reconstruir todo el DOM.
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
        CREAR ELEMENTO DIRECTAMENTE EN BODY
        -----------------------------------------------------
        */

        const bloque =
            document.createElement(
                "div"
            );


        bloque.id =
            "teleobligatorioCAB07";


        bloque.style.position =
            "relative";

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

        SIN:

        - CON07
        - cronologia
        - botón vídeo
        - contenedor geológico
        - generador
        -----------------------------------------------------
        */

        document.body.appendChild(
            bloque
        );


        /*
        -----------------------------------------------------
        CONFIRMACIÓN
        -----------------------------------------------------
        */

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


        /*
        -----------------------------------------------------
        ELIMINAR TAMBIÉN LA PRUEBA DIRECTA ANTERIOR
        -----------------------------------------------------
        */

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
        PRESENTACIÓN NORMAL
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
        CREAR COPIA

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
        NORMALIZAR J3

        Esto mantiene el comportamiento anterior
        de CAB07 para las fichas que ya funcionan.
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

        NO TOCAMOS ESTA PARTE.

        Sirve para conservar el funcionamiento
        de las primeras 75 fichas.
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
        =====================================================
        PRUEBA DIRECTA
        =====================================================

        IMPORTANTE:

        Se ejecuta DESPUÉS de toda la lógica anterior.

        Por tanto:

        - no sustituye datos;
        - no modifica registro.j3;
        - no modifica CON07;
        - no modifica CONT07;
        - no depende de la geología calculada.

        Para 001–005 no hace nada.

        Para 006_01 y posteriores:

            LEEPALJSON → j3 → BODY
        =====================================================
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
        PRUEBA DIRECTA

        También se puede ejecutar desde aquí si
        actualizarPresentacion() es llamada por el
        generador después de procesar la ficha.
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

  
  
