/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

PRIMERA FUNCIÓN

- Recibe j1
- Obtiene el registro completo desde master.csv
- Guarda el resultado en MASTER_ACTUAL
- Normaliza j3
- Muestra j3
- No utiliza PALGEO todavía

FORMATO CRONOLÓGICO:

xxxx.xxxx-xxxx.xxxx

Ejemplo:

002.5800-0000.0117
↓
0002.5800-0000.0117

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


        /*
        -----------------------------------------------------
        SEPARAR LOS DOS EXTREMOS
        -----------------------------------------------------
        */

        const partes =
            texto.split("-");


        if (
            partes.length !== 2
        ) {

            return texto;

        }


        /*
        -----------------------------------------------------
        NORMALIZAR CADA EXTREMO
        -----------------------------------------------------
        */

        function normalizarExtremo(valor) {


            valor =
                String(valor).trim();


            const partesValor =
                valor.split(".");


            /*
            Si no tiene decimal,
            no modificar.
            */

            if (
                partesValor.length !== 2
            ) {

                return valor;

            }


            let entero =
                partesValor[0];


            const decimal =
                partesValor[1];


            /*
            -------------------------------------------------
            AÑADIR CEROS A LA IZQUIERDA
            HASTA 4 CIFRAS
            -------------------------------------------------
            */

            entero =
                entero.padStart(
                    4,
                    "0"
                );


            /*
            -------------------------------------------------
            ASEGURAR 4 DECIMALES
            -------------------------------------------------
            */

            const decimalNormalizado =
                decimal.padEnd(
                    4,
                    "0"
                );


            return (
                entero +
                "." +
                decimalNormalizado
            );

        }


        const inicio =
            normalizarExtremo(
                partes[0]
            );


        const fin =
            normalizarExtremo(
                partes[1]
            );


        /*
        -----------------------------------------------------
        RESULTADO
        -----------------------------------------------------
        */

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

        const j3Normalizado =
            this.normalizarJ3(
                datos.j3
            );


        /*
        -----------------------------------------------------
        ACTUALIZAR EL REGISTRO
        -----------------------------------------------------

        Conservamos todos los demás datos
        exactamente como llegan.

        Solo normalizamos j3.
        -----------------------------------------------------
        */

        datos.j3 =
            j3Normalizado;


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
        DEVOLVER REGISTRO COMPLETO
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
