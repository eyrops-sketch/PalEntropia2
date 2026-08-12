/*
========================================================
PalEntropía
leepalgeo.js v1.0 LTS

LECTOR DE PALGEO

FUNCIÓN:

- Recibe una cronología interna.
- Solicita el análisis a PALGEOSIMPLIFICADO.
- Devuelve los datos geológicos.
- No modifica la cronología.
- No modifica CONT07.
- No interpreta ni inventa datos.

FLUJO:

CONT07
   ↓
LEEPALGEO
   ↓
PALGEOSIMPLIFICADO
   ↓
PALGEO
   ↓
LEEPALGEO
   ↓
CONT07

========================================================
*/


window.LEEPALGEO = {


    /* =====================================================
       ANALIZAR CRONOLOGÍA
       ===================================================== */

    analizar(cronologia) {


        /*
        -----------------------------------------------------
        COMPROBAR CRONOLOGÍA
        -----------------------------------------------------
        */

        if (
            cronologia === undefined ||
            cronologia === null ||
            String(cronologia).trim() === ""
        ) {

            return null;

        }


        /*
        -----------------------------------------------------
        COMPROBAR PALGEOSIMPLIFICADO
        -----------------------------------------------------
        */

        if (
            !window.PALGEOSIMPLIFICADO ||
            typeof window.PALGEOSIMPLIFICADO.analizar !==
            "function"
        ) {

            console.error(
                "LEEPALGEO: PALGEOSIMPLIFICADO no está disponible."
            );

            return null;

        }


        /*
        -----------------------------------------------------
        SOLICITAR ANÁLISIS
        -----------------------------------------------------
        */

        const resultado =
            window.PALGEOSIMPLIFICADO.analizar(
                String(cronologia).trim()
            );


        /*
        -----------------------------------------------------
        COMPROBAR RESULTADO
        -----------------------------------------------------
        */

        if (!resultado) {

            console.warn(
                "LEEPALGEO: No se pudo analizar la cronología:",
                cronologia
            );

            return null;

        }


        /*
        -----------------------------------------------------
        DEVOLVER RESULTADO
        -----------------------------------------------------
        */

        return resultado;

    },


    /* =====================================================
       EXTRAER DATOS GEOLOGICOS
       
       Devuelve únicamente:
       
       codes
       periodo
       edad
       
       ===================================================== */

    extraer(cronologia) {


        const resultado =
            this.analizar(
                cronologia
            );


        if (!resultado) {

            return null;

        }


        return {

            codes:
                Array.isArray(
                    resultado.codes
                )
                    ? [...resultado.codes]
                    : [],


            periodo:
                Array.isArray(
                    resultado.periodo
                )
                    ? [...resultado.periodo]
                    : [],


            edad:
                Array.isArray(
                    resultado.edad
                )
                    ? [...resultado.edad]
                    : []

        };

    }

};


/*
========================================================
FIN leepalgeo.js
========================================================
*/
