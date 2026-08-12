/* ========================================================
   PalEntropía
   leepalgeo.js v1.0 LTS

   LECTOR DE GEOLOGÍA
   CAB07 — Integración con CARGACONT

   Función principal:

       LEEPALGEO.leer(registro)

   Entrada:

       registro.j3

   Formato:

       MMMM.DDDD-MMMM.DDDD

   Ejemplo:

       0521.0000-0201.3000

   Utiliza:

       PALGEOSIMPLIFICADO

   PALGEOSIMPLIFICADO utiliza:

       PALGEO

   LEEPALGEO NO interpreta PALGEO directamente.

   LEEPALGEO NO modifica j3.

   LEEPALGEO NO inventa datos.

   Su función es conectar:

       CONTENEDOR
            ↓
           j3
            ↓
       PALGEOSIMPLIFICADO
            ↓
       datos geológicos
            ↓
       CARGACONT / GENERADOR

======================================================== */


/* ========================================================
   CONFIGURACIÓN
======================================================== */

window.LEEPALGEO = {


    /* ====================================================
       LEER REGISTRO
    ==================================================== */

    leer(registro){


        /*
        -----------------------------------------------
        VALIDAR REGISTRO
        -----------------------------------------------
        */

        if(
            !registro ||
            typeof registro !== "object"
        ){

            return null;

        }


        /*
        -----------------------------------------------
        COMPROBAR J3
        -----------------------------------------------
        */

        const cronologia =
            String(
                registro.j3 || ""
            ).trim();


        if(!cronologia){

            return null;

        }


        /*
        -----------------------------------------------
        COMPROBAR
        PALGEOSIMPLIFICADO
        -----------------------------------------------
        */

        if(
            !window.PALGEOSIMPLIFICADO ||
            typeof
            window.PALGEOSIMPLIFICADO.analizar
            !== "function"
        ){

            console.error(
                "LEEPALGEO: " +
                "PALGEOSIMPLIFICADO no está disponible."
            );

            return null;

        }


        /*
        -----------------------------------------------
        ANALIZAR J3
        -----------------------------------------------

        PALGEOSIMPLIFICADO es quien realiza:

        - validación
        - conversión temporal
        - extracción de PALGEO
        - período
        - edad
        - códigos
        -----------------------------------------------
        */

        const datos =
            window.PALGEOSIMPLIFICADO.analizar(
                cronologia
            );


        /*
        -----------------------------------------------
        SI NO SE PUDO ANALIZAR
        -----------------------------------------------
        */

        if(!datos){

            console.error(
                "LEEPALGEO: " +
                "cronología no válida: " +
                cronologia
            );

            return null;

        }


        /*
        -----------------------------------------------
        RESULTADO PARA EL CONTENEDOR
        -----------------------------------------------

        Estos son los datos preparados
        para presentación.

        j3 original permanece intacto.
        -----------------------------------------------
        */

        return {

            intervalo:
                datos.rango || "",

            periodo:
                Array.isArray(
                    datos.periodo
                )
                ?
                datos.periodo.join(
                    " · "
                )
                :
                "",

            subperiodo:
                Array.isArray(
                    datos.edad
                )
                ?
                datos.edad.join(
                    " - "
                )
                :
                "",

            codes:
                Array.isArray(
                    datos.codes
                )
                ?
                [
                    ...datos.codes
                ]
                :
                [],

            periodo_codes:
                Array.isArray(
                    datos.codes
                )
                ?
                [
                    ...datos.codes
                ]
                :
                [],

            cronologia:
                datos.cronologia || cronologia,

            inicio_ma:
                datos.inicio_ma,

            fin_ma:
                datos.fin_ma

        };

    },


    /* ====================================================
       OBTENER SOLO CRONOLOGÍA
       ----------------------------------------------------

       Atajo para otros módulos.

    ==================================================== */

    obtener(cronologia){


        if(
            !cronologia
        ){

            return null;

        }


        return this.leer({

            j1:"",

            j2:"",

            j3:cronologia

        });

    },


    /* ====================================================
       VALIDAR J3
    ==================================================== */

    validar(cronologia){


        if(
            !window.PALGEOSIMPLIFICADO ||
            typeof
            window.PALGEOSIMPLIFICADO.validarCronologia
            !== "function"
        ){

            return false;

        }


        return
            window.PALGEOSIMPLIFICADO
            .validarCronologia(
                cronologia
            );

    }


};


/* ========================================================
   FIN LEEPALGEO v1.0 LTS
======================================================== */




