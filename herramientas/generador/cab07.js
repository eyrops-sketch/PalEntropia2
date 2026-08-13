/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

FUNCIÓN:

- Recibe j1.
- Obtiene el registro completo desde master.csv.
- Normaliza j3.
- Guarda el registro completo en CONT07.
- Envía j3 a LEEPALGEO.
- Guarda TODA la geología en CONT07.
- Presenta únicamente la información geológica
  destinada al usuario.
- No muestra códigos geológicos.
- No muestra la cronología interna.
- Si hay más de 3 subperíodos/series,
  los resume visualmente como:

  Del PRIMERO al ÚLTIMO

IMPORTANTE:

Los datos internos NO se reducen.

CONT07 conserva todos los códigos,
períodos y edades recibidos.

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
       FORMATEAR RANGO TEMPORAL PARA EL USUARIO

       Convierte:

       0521.0000-0509.0000

       en:

       521 Ma – 509 Ma

       Esta función es SOLO VISUAL.

       El j3 interno permanece intacto.
       ===================================================== */

    formatearRangoVisual(j3) {

        if (
            !j3
        ) {

            return "—";

        }


        /*
        -----------------------------------------------------
        INTENTAR USAR PALGEOSIMPLIFICADO
        -----------------------------------------------------
        */

        if (
            window.PALGEOSIMPLIFICADO &&
            typeof window.PALGEOSIMPLIFICADO
                .decodificarRango === "function"
        ) {

            const rango =
                window.PALGEOSIMPLIFICADO
                    .decodificarRango(j3);


            if (
                rango
            ) {

                return rango
                    .replace(
                        " - ",
                        " – "
                    );

            }

        }


        /*
        -----------------------------------------------------
        FALLBACK VISUAL
        -----------------------------------------------------
        */

        const partes =
            String(j3)
                .split("-");


        if (
            partes.length !== 2
        ) {

            return j3;

        }


        const inicio =
            Number(
                partes[0]
            );


        const fin =
            Number(
                partes[1]
            );


        if (
            !Number.isFinite(inicio) ||
            !Number.isFinite(fin)
        ) {

            return j3;

        }


        return (
            inicio +
            " Ma – " +
            fin +
            " Ma"
        );

    },


    /* =====================================================
       FORMATEAR SUBPERÍODOS / SERIES

       REGLA VISUAL:

       0 → no mostrar

       1 → elemento

       2 → elemento · elemento

       3 → elemento · elemento · elemento

       >3 →

       Del primero al último

       IMPORTANTE:

       SOLO afecta a la presentación.

       Los datos originales permanecen completos.
       ===================================================== */

    formatearSubperiodos(edad) {

        if (
            !Array.isArray(edad)
        ) {

            return "";

        }


        /*
        -----------------------------------------------------
        LIMPIAR SOLO PARA PRESENTACIÓN
        -----------------------------------------------------
        */

        const valores =
            edad
                .map(
                    valor =>
                        String(
                            valor || ""
                        ).trim()
                )
                .filter(
                    valor =>
                        valor !== ""
                );


        /*
        -----------------------------------------------------
        SIN DATOS
        -----------------------------------------------------
        */

        if (
            !valores.length
        ) {

            return "";

        }


        /*
        -----------------------------------------------------
        MÁS DE TRES
        -----------------------------------------------------

        Se muestra:

        Del primero al último
        -----------------------------------------------------
        */

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


        /*
        -----------------------------------------------------
        HASTA TRES
        -----------------------------------------------------
        */

        return valores.join(
            " · "
        );

    },


    /* =====================================================
       MOSTRAR GEOLOGÍA
       
       PRESENTACIÓN PARA EL USUARIO

       NO MUESTRA:

       - códigos PALGEO
       - j3 interno

       SÍ MUESTRA:

       - rango temporal
       - período
       - subperíodo / serie
       ===================================================== */

    mostrarGeologia() {


        /*
        -----------------------------------------------------
        OBTENER CONTENEDOR
        -----------------------------------------------------
        */

        let contenedor =
            document.getElementById(
                "resultadoGeologiaCAB07"
            );


        /*
        -----------------------------------------------------
        CREAR CONTENEDOR SI NO EXISTE
        -----------------------------------------------------
        */

        if (
            !contenedor
        ) {

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
                "13px";


            const cronologia =
                document.getElementById(
                    "cronologia"
                );


            if (
                cronologia
            ) {

                cronologia.insertAdjacentElement(
                    "afterend",
                    contenedor
                );

            } else {

                document.body.appendChild(
                    contenedor
                );

            }

        }


        /*
        -----------------------------------------------------
        OBTENER GEOLOGÍA
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
                <strong>Geología</strong>
                <br><br>
                <span>Sin datos geológicos.</span>
                `;

            return;

        }


        /*
        -----------------------------------------------------
        PERÍODOS

        Los datos completos permanecen
        en CONT07.

        Aquí solo preparamos
        la presentación.
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
        SUBPERÍODOS / SERIES
        -----------------------------------------------------

        Internamente siguen llamándose
        "edad" porque así los entrega
        LEEPALGEO.

        Aquí solo cambia la etiqueta visual.
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
        RANGO TEMPORAL

        Obtener j3 desde CONT07.
        -----------------------------------------------------
        */

        let rangoVisual =
            "—";


        if (
            window.CONT07 &&
            typeof window.CONT07.obtener ===
            "function"
        ) {

            const registro =
                window.CONT07.obtener();


            if (
                registro &&
                registro.j3
            ) {

                rangoVisual =
                    this.formatearRangoVisual(
                        registro.j3
                    );

            }

        }


        /*
        -----------------------------------------------------
        PREPARAR PERÍODOS
        -----------------------------------------------------
        */

        const periodoVisual =
            periodo
                .map(
                    valor =>
                        String(
                            valor || ""
                        ).trim()
                )
                .filter(
                    valor =>
                        valor !== ""
                );


        /*
        -----------------------------------------------------
        PREPARAR SUBPERÍODOS
        -----------------------------------------------------
        */

        const subperiodosVisual =
            this.formatearSubperiodos(
                edad
            );


        /*
        -----------------------------------------------------
        CONSTRUIR HTML
        -----------------------------------------------------
        */

        let html =
            `
            <div class="geologiaCAB07">

                <strong>Geología</strong>

                <br><br>

                <div>
                    <strong>Rango temporal</strong>
                    <br>
                    ${rangoVisual}
                </div>
            `;


        /*
        -----------------------------------------------------
        PERÍODO
        -----------------------------------------------------
        */

        if (
            periodoVisual.length
        ) {

            html +=
                `
                <br>

                <div>
                    <strong>Período</strong>
                    <br>
                    ${periodoVisual.join(
                        " · "
                    )}
                </div>
                `;

        }


        /*
        -----------------------------------------------------
        SUBPERÍODO / SERIE
        -----------------------------------------------------
        */

        if (
            subperiodosVisual
        ) {

            html +=
                `
                <br>

                <div>
                    <strong>Subperíodo / Serie</strong>
                    <br>
                    ${subperiodosVisual}
                </div>
                `;

        }


        /*
        -----------------------------------------------------
        CERRAR CONTENEDOR
        -----------------------------------------------------
        */

        html +=
            `
            </div>
            `;


        /*
        -----------------------------------------------------
        MOSTRAR
        -----------------------------------------------------
        */

        contenedor.innerHTML =
            html;

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


                /*
                -------------------------------------------------
                GUARDAR GEOLOGÍA COMPLETA

                NO SE REDUCE NADA.

                Los códigos siguen disponibles.
                Los períodos siguen disponibles.
                Las edades siguen disponibles.

                La reducción solo ocurre
                en mostrarGeologia().
                -------------------------------------------------
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

            } catch (
                error
            ) {

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


        /*
        -----------------------------------------------------
        NO MOSTRAR J3 BRUTO

        El elemento cronologia queda vacío
        porque la cronología interna es un dato técnico.

        El rango humano se presenta dentro
        del bloque de geología.
        -----------------------------------------------------
        */

        const cronologia =
            document.getElementById(
                "cronologia"
            );


        if (
            cronologia
        ) {

            cronologia.textContent =
                "";

        }


        /*
        -----------------------------------------------------
        MOSTRAR GEOLOGÍA
        -----------------------------------------------------
        */

        this.mostrarGeologia();


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
FIN CAB07.js
========================================================
*/
:::
