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
- No modifica PALGEO.
- No interpreta cronología.
- No rompe la ficha si la geología falla.
- Muestra j3.
- Devuelve el registro.

FLUJO:

master.csv
    ↓
  CAB07
    ↓
CONT07.registro
    ↓
     j3
    ↓
LEEPALGEO
    ↓
PALGEOSIMPLIFICADO
    ↓
PALGEO
    ↓
CONT07.geologia

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

        Se utiliza el j3 ya normalizado.

        Si LEEPALGEO está disponible,
        solicitamos el análisis.

        Si falla, NO se interrumpe la ficha.
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
                GUARDAR GEOLOGÍA EN CONT07
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
