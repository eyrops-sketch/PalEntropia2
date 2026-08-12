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
- Recupera el registro desde CONT07.
- Muestra j3.
- Devuelve el registro procedente de CONT07.

No interpreta cronología.
No utiliza PALGEO.

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


        function normalizarExtremo(valor) {

            valor =
                String(valor).trim();


            const partesValor =
                valor.split(".");


            if (
                partesValor.length !== 2
            ) {

                return valor;

            }


            let entero =
                partesValor[0];


            const decimal =
                partesValor[1];


            entero =
                entero.padStart(
                    4,
                    "0"
                );


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
        OBTENER REGISTRO DESDE MASTER
        -----------------------------------------------------
        */

        const datos =
            await window.cargarMasterPorJ1(
                j1
            );


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
        GUARDAR EN CONT07
        -----------------------------------------------------
        */

        if (
            !window.CONT07 ||
            typeof window.CONT07.guardar !==
            "function"
        ) {

            console.error(
                "CAB07: CONT07 no está disponible."
            );

            return null;

        }


        window.CONT07.guardar(
            datos
        );


        /*
        -----------------------------------------------------
        RECUPERAR DESDE CONT07
        -----------------------------------------------------
        */

        const registroCont07 =
            window.CONT07.obtener();


        if (!registroCont07) {

            console.error(
                "CAB07: CONT07 no devolvió ningún registro."
            );

            return null;

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
                registroCont07.j3 || "—";

        }


        /*
        -----------------------------------------------------
        DEVOLVER REGISTRO DE CONT07
        -----------------------------------------------------
        */

        return registroCont07;

    }

};


/*
========================================================
FIN CAB07.js
========================================================
*/
