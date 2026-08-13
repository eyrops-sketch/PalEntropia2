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
- Guarda TODOS los datos geológicos en CONT07.
- Presenta únicamente los datos geológicos necesarios.
- No muestra códigos geológicos.
- No muestra la cronología interna.
- Resume períodos y edades cuando existen más de 3.
- Limpia la geología anterior antes de cargar una nueva ficha.
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
       PREPARAR LISTA PARA PRESENTACIÓN

       Si hay 3 elementos o menos:
       muestra todos.

       Si hay más de 3:
       muestra únicamente:

       Del primero al último

       IMPORTANTE:

       Esto afecta SOLO a la presentación.

       Los arrays completos permanecen
       almacenados en CONT07.
       ===================================================== */

    presentarRango(lista) {

        if (
            !Array.isArray(lista) ||
            !lista.length
        ) {

            return "—";

        }


        const valores =
            lista
                .map(
                    valor =>
                        String(valor).trim()
                )
                .filter(Boolean);


        if (!valores.length) {

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

            return valores.join(", ");

        }


        /*
        -----------------------------------------------------
        MÁS DE 3 ELEMENTOS
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

        }


        /*
        -----------------------------------------------------
        OBTENER GEOLOGÍA ACTUAL
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
                `
                <div>
                    <strong>Período:</strong> —
                </div>

                <div>
                    <strong>Edad:</strong> —
                </div>
                `;

            return;

        }


        /*
        -----------------------------------------------------
        OBTENER PERÍODOS
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
        OBTENER EDADES / SUBPERÍODOS
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
        PREPARAR PRESENTACIÓN
        -----------------------------------------------------

        Los códigos NO se muestran.

        Los arrays originales permanecen intactos
        dentro de CONT07.
        -----------------------------------------------------
        */

        const periodoVisual =
            this.presentarRango(
                periodo
            );


        const edadVisual =
            this.presentarRango(
                edad
            );


        /*
        -----------------------------------------------------
        MOSTRAR ÚNICAMENTE INFORMACIÓN HUMANA
        -----------------------------------------------------
        */

        contenedor.innerHTML =
            `
            <div>
                <strong>Período:</strong>
                ${periodoVisual}
            </div>

            <div style="margin-top:6px;">
                <strong>Edad:</strong>
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
        LIMPIAR GEOLOGÍA ANTERIOR
        =====================================================

        Esto es importante para las búsquedas.

        Si la ficha anterior tenía geología y la nueva
        no tiene datos, no debemos conservar la anterior.
        =====================================================
        */

        if (
            window.CONT07 &&
            typeof window.CONT07.guardarGeologia ===
            "function"
        ) {

            window.CONT07.guardarGeologia({

                codes: [],

                periodo: [],

                edad: []

            });

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

                Aquí se guardan TODOS los códigos,
                períodos y edades.

                La reducción a "Del X al Y" solamente
                ocurre posteriormente en mostrarGeologia().
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
        NO MOSTRAR CRONOLOGÍA INTERNA
        -----------------------------------------------------

        El elemento cronologia puede seguir existiendo
        para compatibilidad, pero CAB07 ya no introduce
        aquí el valor interno de j3.
        -----------------------------------------------------
        */

        const cronologia =
            document.getElementById(
                "cronologia"
            );


        if (cronologia) {

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




