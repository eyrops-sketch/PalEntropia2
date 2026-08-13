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
- Guarda la geología completa en CONT07.
- Presenta visualmente los datos geológicos.
- NO muestra códigos geológicos.
- NO muestra la cronología interna.
- Si hay más de 3 períodos o edades,
  los presenta como rango visual.
- Los datos internos completos permanecen disponibles.
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
       FORMATEAR LISTA GEOLÓGICA
       
       REGLA VISUAL:
       
       1 elemento:
       X
       
       2 elementos:
       X, Y
       
       3 elementos:
       X, Y, Z
       
       Más de 3:
       Del X al Z
       
       IMPORTANTE:
       
       Esto SOLO modifica la presentación.
       
       Los arrays originales de PALGEO
       permanecen completos.
       ===================================================== */

    formatearListaGeologica(lista) {

        if (
            !Array.isArray(lista) ||
            !lista.length
        ) {

            return "—";

        }


        /*
        -----------------------------------------------------
        HASTA 3 ELEMENTOS
        -----------------------------------------------------
        */

        if (
            lista.length <= 3
        ) {

            return lista.join(", ");

        }


        /*
        -----------------------------------------------------
        MÁS DE 3 ELEMENTOS
        -----------------------------------------------------
        */

        return (
            "Del " +
            lista[0] +
            " al " +
            lista[lista.length - 1]
        );

    },


    /* =====================================================
       MOSTRAR GEOLOGÍA
       
       PRESENTACIÓN VISUAL:
       
       Tiempo geológico
       Período
       Edad
       
       NO SE MUESTRAN:
       
       - códigos PALGEO
       - cronología interna
       - códigos geológicos
       - etiqueta independiente "Geología"
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

        if (!contenedor) {

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
                "10px";


            contenedor.style.maxWidth =
                "700px";


            contenedor.style.borderRadius =
                "10px";


            /*
            LETRA 15 PX
            */

            contenedor.style.fontSize =
                "15px";


            contenedor.style.lineHeight =
                "1.5";


            /*
            -------------------------------------------------
            COLOCAR DESPUÉS DE CRONOLOGÍA
            -------------------------------------------------
            */

            const cronologia =
                document.getElementById(
                    "cronologia"
                );


            if (cronologia) {

                cronologia.insertAdjacentElement(
                    "afterend",
                    contenedor
                );

            } else {

                document.body.appendChild(
                    contenedor
                );

            }

        } else {

            /*
            -------------------------------------------------
            SI YA EXISTE, ASEGURAR 15 PX
            -------------------------------------------------
            */

            contenedor.style.fontSize =
                "15px";


            contenedor.style.lineHeight =
                "1.5";

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

            geologia =
                window.CONT07.obtenerGeologia();

        }


        /*
        -----------------------------------------------------
        SIN DATOS
        -----------------------------------------------------
        */

        if (!geologia) {

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
        OBTENER RANGO
        -----------------------------------------------------
        
        PALGEOSIMPLIFICADO devuelve "rango"
        ya preparado para presentación humana.
        
        Si por alguna razón no estuviera disponible,
        se intenta construir desde inicio_ma / fin_ma.
        -----------------------------------------------------
        */

        let rango =
            geologia.rango ||
            "";


        /*
        -----------------------------------------------------
        PRESENTACIÓN DEL RANGO
        -----------------------------------------------------
        */

        let rangoHTML =
            "";


        if (rango) {

            rangoHTML =
                `
                <div>
                    <strong>
                        Tiempo geológico:
                    </strong>
                    ${rango}
                </div>
                `;

        }


        /*
        -----------------------------------------------------
        PRESENTACIÓN DE PERÍODOS
        -----------------------------------------------------
        */

        let periodoHTML =
            "";


        if (
            periodo.length
        ) {

            periodoHTML =
                `
                <div>
                    <strong>
                        Período:
                    </strong>
                    ${this.formatearListaGeologica(
                        periodo
                    )}
                </div>
                `;

        }


        /*
        -----------------------------------------------------
        PRESENTACIÓN DE EDADES
        -----------------------------------------------------
        */

        let edadHTML =
            "";


        if (
            edad.length
        ) {

            edadHTML =
                `
                <div>
                    <strong>
                        Edad:
                    </strong>
                    ${this.formatearListaGeologica(
                        edad
                    )}
                </div>
                `;

        }


        /*
        -----------------------------------------------------
        PINTAR RESULTADO
        -----------------------------------------------------
        
        IMPORTANTE:
        
        No se muestra:
        
        - codes
        - cronologia
        - etiqueta "Geología"
        -----------------------------------------------------
        */

        contenedor.innerHTML =
            `
            ${rangoHTML}
            ${periodoHTML}
            ${edadHTML}
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

        if (!datos) {

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
        MOSTRAR CRONOLOGÍA
        -----------------------------------------------------
        
        IMPORTANTE:
        
        La cronología se utiliza como dato interno,
        pero NO debe mostrarse en el panel geológico.
        
        Se conserva aquí únicamente para mantener
        el funcionamiento existente del generador.
        -----------------------------------------------------
        */

        const cronologia =
            document.getElementById(
                "cronologia"
            );


        if (cronologia) {

            cronologia.textContent =
                datos.j3 || "—";

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
DISPONIBILIDAD GLOBAL
========================================================

CAB07 queda disponible como:

window.CAB07

========================================================
*/


/*
========================================================
FIN CAB07.js
========================================================
*/
