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
- Muestra temporalmente los resultados geológicos.
- No modifica PALGEO.
- No interpreta cronología.
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
       MOSTRAR GEOLOGÍA
       
       SALIDA PROVISIONAL DE PRUEBA
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

        if (!geologia) {

            contenedor.innerHTML =
                `
                <strong>Geología</strong>
                <br>
                Sin datos geológicos.
                `;

            return;

        }


        /*
        -----------------------------------------------------
        NORMALIZAR ARRAYS
        -----------------------------------------------------
        */

        const codes =
            Array.isArray(
                geologia.codes
            )
                ? geologia.codes
                : [];


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
        MOSTRAR RESULTADO
        -----------------------------------------------------
        */

        contenedor.innerHTML =
            `
            <strong>Geología</strong>

            <br><br>

            <strong>Códigos:</strong>
            ${codes.length
                ? codes.join(", ")
                : "—"}

            <br><br>

            <strong>Períodos:</strong>
            ${periodo.length
                ? periodo.join(", ")
                : "—"}

            <br><br>

            <strong>Edades:</strong>
            ${edad.length
                ? edad.join(", ")
                : "—"}
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
        MOSTRAR J3
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
FIN CAB07.js
========================================================
*/
