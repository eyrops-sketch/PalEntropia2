/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

FUNCIÓN:

- Recibe j1.
- Obtiene el registro completo desde master.csv.
- Normaliza j3.
- Guarda el registro en CONT07.
- Envía j3 a PALGEOSIMPLIFICADO / LEEPALGEO.
- Guarda la geología en CONT07.
- Presenta la información geológica en formato humano.
- NO muestra códigos internos.
- NO muestra la cronología interna.
- NO modifica el campo superior de cronología.
- El bloque geológico se presenta debajo de "Ver vídeo".
- Si la geología falla, la ficha continúa funcionando.

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


        if (!valores.length) {

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
        rango proporcionado por PALGEOSIMPLIFICADO
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
        conversión mediante PALGEOSIMPLIFICADO
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
        NO MOSTRAR NUNCA J3 BRUTO
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
       
       Vuelve a leer la geología almacenada en CONT07
       y actualiza únicamente el bloque geológico.
       
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
       ===================================================== */

    async procesar(j1) {

        /*
        -----------------------------------------------------
        COMPROBAR FUNCIÓN MAESTRA
        -----------------------------------------------------
        */

        if (
            typeof window.cargarMasterPorJ1 !==
            "function"
        ) {

            console.error(
                "CAB07: cargarMasterPorJ1 no está disponible."
            );

            return null;

        }


        /*
        -----------------------------------------------------
        OBTENER REGISTRO COMPLETO
        -----------------------------------------------------
        */

        const datos =
            await window.cargarMasterPorJ1(
                j1
            );


        /*
        -----------------------------------------------------
        COMPROBAR RESULTADO
        -----------------------------------------------------
        */

        if (
            !datos
        ) {

            console.warn(
                "CAB07: No se encontró el registro:",
                j1
            );

            return null;

        }


        /*
        -----------------------------------------------------
        NORMALIZAR J3
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
        =====================================================
        */

        let geologia =
            null;


        /*
        -----------------------------------------------------
        PALGEOSIMPLIFICADO
        -----------------------------------------------------
        */

        if (
            window.PALGEOSIMPLIFICADO &&
            typeof window.PALGEOSIMPLIFICADO.analizar ===
            "function"
        ) {

            try {

                geologia =
                    window.PALGEOSIMPLIFICADO
                        .analizar(
                            datos.j3
                        );

            } catch (error) {

                console.warn(
                    "CAB07: Error al analizar la geología.",
                    error
                );

                geologia =
                    null;

            }

        }


        /*
        -----------------------------------------------------
        COMPATIBILIDAD CON LEEPALGEO
        -----------------------------------------------------
        */

        if (
            !geologia &&
            window.LEEPALGEO &&
            typeof window.LEEPALGEO.extraer ===
            "function"
        ) {

            try {

                geologia =
                    window.LEEPALGEO.extraer(
                        datos.j3
                    );

            } catch (error) {

                console.warn(
                    "CAB07: Error al obtener datos geológicos.",
                    error
                );

            }

        }


        /*
        -----------------------------------------------------
        GUARDAR GEOLOGÍA EN CONT07
        -----------------------------------------------------
        */

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
        DEVOLVER REGISTRO
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

