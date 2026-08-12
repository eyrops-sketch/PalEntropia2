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
- Consulta PALGEO mediante LEEPALGEO.
- Guarda los datos geológicos en CONT07.
- Muestra j3.
- Devuelve el registro.

NO:

- interpreta cronología directamente
- modifica PALGEO
- modifica cargacont.js
- modifica CAB01-CAB06

FLUJO:

master.csv
   ↓
CAB07
   ↓
CONT07
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


        function normalizarExtremo(valor) {


            valor =
                String(valor).trim();


            const partesValor =
                valor.split(".");


            /*
            -------------------------------------------------
            Si no tiene decimal,
            no modificar.
            -------------------------------------------------
            */

            if (
                partesValor.length !== 2
            ) {

                return valor;

            }


            let entero =
                partesValor[0];


            let decimal =
                partesValor[1];


            /*
            -------------------------------------------------
            ENTERO

            Debe tener exactamente
            cuatro cifras.
            -------------------------------------------------
            */

            entero =
                entero.padStart(
                    4,
                    "0"
                );


            /*
            -------------------------------------------------
            DECIMAL

            Debe tener exactamente
            cuatro cifras.
            -------------------------------------------------
            */

            decimal =
                decimal.padEnd(
                    4,
                    "0"
                );


            /*
            -------------------------------------------------
            RESULTADO
            -------------------------------------------------
            */

            return (
                entero +
                "." +
                decimal
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


        /*
        -----------------------------------------------------
        COMPROBAR CARGADOR MASTER
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
        OBTENER REGISTRO DESDE MASTER.CSV
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
        COMPROBAR CONT07
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


        /*
        -----------------------------------------------------
        GUARDAR REGISTRO EN CONT07
        -----------------------------------------------------
        */

        window.CONT07.guardar(
            datos
        );


        /*
        -----------------------------------------------------
        CONSULTAR PALGEO MEDIANTE LEEPALGEO
        -----------------------------------------------------
        */

        if (
            window.LEEPALGEO &&
            typeof window.LEEPALGEO.extraer ===
            "function"
        ) {


            const geologia =
                window.LEEPALGEO.extraer(
                    datos.j3
                );


            /*
            -------------------------------------------------
            GUARDAR GEOLOGÍA EN CONT07
            -------------------------------------------------
            */

            if (geologia) {

                if (
                    typeof window.CONT07.guardarGeologia ===
                    "function"
                ) {

                    window.CONT07.guardarGeologia(
                        geologia
                    );

                }

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
        RECUPERAR REGISTRO DESDE CONT07
        -----------------------------------------------------
        */

        const registroCont07 =
            typeof window.CONT07.obtener ===
            "function"

                ? window.CONT07.obtener()

                : datos;


        /*
        -----------------------------------------------------
        DEVOLVER REGISTRO
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
