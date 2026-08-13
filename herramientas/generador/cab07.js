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
- Envía j3 a LEEPALGEO / PALGEOSIMPLIFICADO.
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

       Regla visual:

       1 elemento
       → elemento

       2 elementos
       → elemento 1, elemento 2

       3 elementos
       → elemento 1, elemento 2, elemento 3

       Más de 3
       → Del primero al último

       IMPORTANTE:

       Esto es SOLO PRESENTACIÓN.

       Los arrays completos permanecen
       disponibles internamente.
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

        PRESENTACIÓN COMPACTA
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


        /*
        -----------------------------------------------------
        HASTA 3 ELEMENTOS
        -----------------------------------------------------
        */

        return unicos.join(", ");

    },


    /* =====================================================
       OBTENER TEXTO DEL RANGO

       PRIORIDAD:

       1. geologia.rango
       2. PALGEOSIMPLIFICADO.decodificarRango(j3)

       NUNCA devuelve j3 directamente como
       texto visible.
       ===================================================== */

    obtenerRangoVisual(j3, geologia) {

        /*
        -----------------------------------------------------
        PRIMERA OPCIÓN

        El objeto geológico ya contiene el rango
        convertido a formato humano.
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
        SEGUNDA OPCIÓN

        Intentar convertir mediante
        PALGEOSIMPLIFICADO.
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
        SI NO SE PUEDE CONVERTIR

        NO mostrar nunca j3 bruto.
        -----------------------------------------------------
        */

        return "—";

    },


    /* =====================================================
       OBTENER CONTENEDOR VISUAL DE GEOLOGÍA
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


        /*
        Un poco mayor que la versión anterior.
        -----------------------------------------------------
        */

        contenedor.style.fontSize =
            "15px";


        contenedor.style.lineHeight =
            "1.5";


        /*
        -----------------------------------------------------
        BUSCAR BOTÓN DE VÍDEO

        El bloque debe quedar debajo
        del botón "Ver vídeo".
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

            Si todavía no existe el botón,
            buscamos la zona de ficha.
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


        /*
        -----------------------------------------------------
        OBTENER CONTENEDOR
        -----------------------------------------------------
        */

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
                    <strong>Rango de tiempo geológico:</strong>
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

        IMPORTANTE:

        Aquí NO usamos:

        geologia.cronologia

        ni:

        j3

        directamente.

        Solo utilizamos el rango ya convertido.
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

        ORDEN OBLIGATORIO:

        Rango
        Período
        Edad

        SIN:

        - etiqueta "Geología"
        - códigos PALGEO
        - cronología interna
        -----------------------------------------------------
        */

        contenedor.innerHTML =
            `
            <div>
                <strong>
                    Rango de tiempo geológico:
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


        if (
            window.PALGEOSIMPLIFICADO &&
            typeof window.PALGEOSIMPLIFICADO.analizar ===
            "function"
        ) {

            /*
            -------------------------------------------------
            USAR PALGEOSIMPLIFICADO

            Es la fuente de interpretación del rango.

            PALGEO continúa siendo la fuente de datos.
            -------------------------------------------------
            */

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

        Si el sistema antiguo todavía está presente
        y PALGEOSIMPLIFICADO no ha devuelto datos,
        intentamos utilizarlo.

        NO se modifica PALGEO.
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
        GUARDAR GEOLOGÍA

        CONT07 conserva TODOS los datos.

        La reducción a "Del X al Y"
        solo afecta a la presentación.
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

        Esto es importante cuando se cambia de
        Paleoficha mediante el buscador.

        Evita que quede información de la ficha anterior.
        -----------------------------------------------------
        */

        this.limpiarPresentacion();


        /*
        -----------------------------------------------------
        MOSTRAR GEOLOGÍA

        IMPORTANTE:

        Solo se pasa j3 como dato interno para que
        PALGEOSIMPLIFICADO pueda convertirlo si fuese
        necesario.

        Nunca se escribe j3 directamente en pantalla.
        -----------------------------------------------------
        */

        this.mostrarGeologia(
            datos.j3
        );


        /*
        =====================================================
        MUY IMPORTANTE

        NO HACER:

        document.getElementById("cronologia")
            .textContent = datos.j3;

        La cronología interna pertenece al sistema
        de datos y NO a la presentación visual.

        CAB07 NO TOCA #cronologia.
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
