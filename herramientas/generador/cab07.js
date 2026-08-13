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
- Envía j3 a LEEPALGEO.
- Guarda la geología en CONT07.
- Presenta la información geológica de forma humana.
- Oculta los códigos geológicos internos.
- Oculta la cronología interna.
- Resume períodos y edades cuando hay más de 3.
- No modifica PALGEO.
- No interpreta cronología por sí mismo.
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
        GARANTIZAR FORMATO XXXX.XXXX
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
       FORMATEAR RANGO TEMPORAL
       
       PALGEOSIMPLIFICADO ES LA FUENTE DE INTERPRETACIÓN.
       
       CAB07 no interpreta los valores geológicos.
       Solo solicita la conversión.
       ===================================================== */

    obtenerRangoTemporal(cronologia) {

        if (
            !cronologia
        ) {

            return "";

        }


        /*
        -----------------------------------------------------
        UTILIZAR PALGEOSIMPLIFICADO
        -----------------------------------------------------
        */

        if (
            window.PALGEOSIMPLIFICADO &&
            typeof window.PALGEOSIMPLIFICADO.decodificarRango ===
            "function"
        ) {

            try {

                const rango =
                    window.PALGEOSIMPLIFICADO.decodificarRango(
                        cronologia
                    );


                if (
                    rango
                ) {

                    return rango;

                }

            } catch (error) {

                console.warn(
                    "CAB07: No se pudo formatear el rango temporal.",
                    error
                );

            }

        }


        /*
        -----------------------------------------------------
        FALLBACK
       
        Solo se utiliza si el módulo simplificado
        todavía no está disponible.
        -----------------------------------------------------
        */

        return "";

    },


    /* =====================================================
       RESUMIR LISTA GEOLÓGICA
       
       REGLA VISUAL:
       
       0 elementos → —
       1 elemento  → elemento
       2 elementos → elemento 1, elemento 2
       3 elementos → elemento 1, elemento 2, elemento 3
       >3         → Del primero al último
       
       IMPORTANTE:
       
       Esto es SOLO presentación.
       
       Los valores completos permanecen
       disponibles internamente.
       ===================================================== */

    resumirLista(lista) {

        if (
            !Array.isArray(lista)
        ) {

            return "—";

        }


        /*
        -----------------------------------------------------
        LIMPIAR VALORES VACÍOS
        -----------------------------------------------------
        */

        const valores =
            lista
                .map(
                    valor =>
                        String(
                            valor ?? ""
                        ).trim()
                )
                .filter(
                    valor =>
                        valor !== ""
                );


        if (
            valores.length === 0
        ) {

            return "—";

        }


        /*
        -----------------------------------------------------
        HASTA 3 ELEMENTOS
        -----------------------------------------------------
        */

        if (
            valores.length <= 3
        ) {

            return valores.join(
                ", "
            );

        }


        /*
        -----------------------------------------------------
        MÁS DE 3 ELEMENTOS
       
        PRESENTACIÓN COMPACTA
        -----------------------------------------------------
        */

        return (
            "Del " +
            valores[0] +
            " al " +
            valores[valores.length - 1]
        );

    },


    /* =====================================================
       MOSTRAR GEOLOGÍA
       
       PRESENTACIÓN FINAL
       
       NO SE MUESTRAN:
       
       - códigos geológicos
       - cronología interna
       - etiqueta "Geología"
       
       SE MUESTRAN:
       
       Tiempo geológico
       Período
       Edad
       
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
        CREAR CONTENEDOR
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


            /*
            -------------------------------------------------
            ESTILO DEL PANEL
            -------------------------------------------------
            */

            contenedor.style.margin =
                "12px auto";


            contenedor.style.padding =
                "10px 12px";


            contenedor.style.maxWidth =
                "700px";


            contenedor.style.borderRadius =
                "10px";


            /*
            -------------------------------------------------
            LETRA
           
            Un poco mayor que la versión anterior.
            -------------------------------------------------
            */

            contenedor.style.fontSize =
                "14px";


            contenedor.style.lineHeight =
                "1.45";


            /*
            -------------------------------------------------
            INSERTAR DESPUÉS DEL BOTÓN DE VÍDEO
           
            Primero intentamos localizar el botón.
            -------------------------------------------------
            */

            const botonVideo =
                document.getElementById(
                    "botonVideo"
                );


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
                FALLBACK:
                Si todavía no existe el botón de vídeo,
                se intenta utilizar el bloque de cronología.
                -------------------------------------------------
                */

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

        }


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

            try {

                geologia =
                    window.CONT07.obtenerGeologia();

            } catch (error) {

                console.warn(
                    "CAB07: Error al obtener geología desde CONT07.",
                    error
                );

            }

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
                "";

            return;

        }


        /*
        -----------------------------------------------------
        NORMALIZAR ARRAYS
        -----------------------------------------------------
        */

        const periodo =
            Array.isArray(
                geologia.periodo
            )
                ? geologia.periodo
                : [];


        const edad =
            Array.isArray(
                geologia.edad
            )
                ? geologia.edad
                : [];


        /*
        -----------------------------------------------------
        CRONOLOGÍA INTERNA
       
        SE CONSERVA EN LOS DATOS INTERNOS,
        PERO NO SE PRESENTA.
        -----------------------------------------------------
        */

        const cronologia =
            geologia.cronologia ||
            geologia.j3 ||
            "";


        /*
        -----------------------------------------------------
        OBTENER RANGO HUMANO
        -----------------------------------------------------
        */

        let rangoTemporal =
            this.obtenerRangoTemporal(
                cronologia
            );


        /*
        -----------------------------------------------------
        SI CONT07 NO GUARDA LA CRONOLOGÍA,
        UTILIZAR EL ELEMENTO CRONOLOGÍA DE LA FICHA
        COMO ÚLTIMO RECURSO INTERNO.
       
        NUNCA SE MUESTRA EL CÓDIGO BRUTO.
        -----------------------------------------------------
        */

        if (
            !rangoTemporal
        ) {

            const elementoCronologia =
                document.getElementById(
                    "cronologia"
                );


            if (
                elementoCronologia &&
                elementoCronologia.textContent
            ) {

                rangoTemporal =
                    this.obtenerRangoTemporal(
                        elementoCronologia.textContent.trim()
                    );

            }

        }


        /*
        -----------------------------------------------------
        CONSTRUIR PRESENTACIÓN
       
        IMPORTANTE:
       
        No aparece:
       
        "Geología"
       
        No aparece:
       
        "Cronología interna"
       
        No aparecen:
       
        códigos PALGEO.
        -----------------------------------------------------
        */

        let html =
            "";


        /*
        -----------------------------------------------------
        TIEMPO GEOLÓGICO
       
        VA ENCIMA DE PERÍODO Y EDAD.
        -----------------------------------------------------
        */

        if (
            rangoTemporal
        ) {

            html +=
                `
                <div class="cab07-tiempo-geologico">
                    <strong>Tiempo geológico:</strong>
                    ${rangoTemporal}
                </div>
                `;

        }


        /*
        -----------------------------------------------------
        PERÍODO
        -----------------------------------------------------
        */

        html +=
            `
            <div class="cab07-periodo">
                <strong>Período:</strong>
                ${this.resumirLista(periodo)}
            </div>
            `;


        /*
        -----------------------------------------------------
        EDAD
        -----------------------------------------------------
        */

        html +=
            `
            <div class="cab07-edad">
                <strong>Edad:</strong>
                ${this.resumirLista(edad)}
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
               
                No eliminamos códigos.
                No eliminamos períodos.
                No eliminamos edades.
               
                La reducción es únicamente visual.
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

            } catch (error) {

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
        ACTUALIZAR PRESENTACIÓN GEOLOGÍA
        -----------------------------------------------------
        */

        this.mostrarGeologia();


        /*
        -----------------------------------------------------
        DEVOLVER REGISTRO
        -----------------------------------------------------
        */

        return datos;

    },

        /* =====================================================
       RECARGAR PRESENTACIÓN GEOLOGÍA
       
       ÚTIL CUANDO LA FICHA CAMBIA SIN RECARGAR LA PÁGINA.
       
       No modifica los datos internos.
       Solo vuelve a pintar CAB07.
       ===================================================== */

    refrescar() {

        try {

            this.mostrarGeologia();

        } catch (error) {

            console.warn(
                "CAB07: Error al refrescar la presentación geológica.",
                error
            );

        }

    },


    /* =====================================================
       LIMPIAR PRESENTACIÓN
       
       IMPORTANTE:
       
       Solo elimina lo que CAB07 muestra.
       
       NO elimina:
       
       - CONT07
       - PALGEO
       - códigos geológicos
       - períodos internos
       - edades internas
       - cronología
       
       Esto permite que el siguiente resultado
       sustituya correctamente al anterior.
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
       ACTUALIZAR
       
       Alias de refrescar().
       
       Permite que otros módulos puedan solicitar
       una actualización visual de CAB07 sin conocer
       la implementación interna.
       ===================================================== */

    actualizar() {

        this.refrescar();

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
