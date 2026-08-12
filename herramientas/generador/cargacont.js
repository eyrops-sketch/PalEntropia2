/* ========================================================
   PalEntropía
   cargacont.js v1.5 LTS

   COMPUERTA DEL CONTENEDOR

   FUENTE ÚNICA:
   master.csv
   ↓
   LEEPALJSON
   ↓
   CARGACONT
   ↓
   GENERADOR

   j3 pasa por PALGEOSIMPLIFICADO
======================================================== */

window.CARGACONT = {

    campoPuntero: "j1",

    dominio:
        "https://palentropia.es/",

    ultimo: null,


    /* ====================================================
       NORMALIZAR J1
    ==================================================== */

    normalizarJ1(j1){

        return String(j1 || "")
            .trim()
            .toUpperCase();

    },


    /* ====================================================
       OBTENER CONTENEDOR
    ==================================================== */

    obtenerContenedor(){

        if(
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ){

            throw new Error(
                "CARGACONT: LEEPALJSON no está disponible."
            );

        }


        const contenedor =
            window.LEEPALJSON.obtener();


        if(
            !Array.isArray(contenedor) ||
            !contenedor.length
        ){

            throw new Error(
                "CARGACONT: master.csv está vacío."
            );

        }


        return contenedor;

    },


    /* ====================================================
       BUSCAR J1 EN MASTER.CSV
    ==================================================== */

    buscarJ1EnCSV(j1){

        const contenedor =
            this.obtenerContenedor();


        for(
            const registro of contenedor
        ){

            if(!registro){

                continue;

            }


            const codigo =
                this.normalizarJ1(
                    registro.codigo ||
                    registro.j1
                );


            if(
                codigo === j1
            ){

                return registro;

            }

        }


        return null;

    },


    /* ====================================================
       OBTENER CAMPO
    ==================================================== */

    obtenerCampo(
        registro,
        campo
    ){

        if(
            !registro ||
            typeof registro !== "object"
        ){

            return null;

        }


        if(
            registro[campo] !== undefined &&
            registro[campo] !== null
        ){

            return registro[campo];

        }


        return null;

    },


    /* ====================================================
       OBTENER DATOS DEL MASTER
    ==================================================== */

    obtenerDatosMaster(
        registro,
        j1
    ){

        if(!registro){

            throw new Error(
                "CARGACONT: registro vacío para " +
                j1 +
                "."
            );

        }


        const j2 =
            this.obtenerCampo(
                registro,
                "j2"
            );


        if(
            j2 === null ||
            String(j2).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j2/nombre vacío para " +
                j1 +
                "."
            );

        }


        const j3 =
            this.obtenerCampo(
                registro,
                "j3"
            );


        if(
            j3 === null ||
            String(j3).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j3/cronología vacía para " +
                j1 +
                "."
            );

        }


        const j7 =
            this.obtenerCampo(
                registro,
                "j7"
            );


        if(
            j7 === null ||
            String(j7).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j7/dieta vacío para " +
                j1 +
                "."
            );

        }


        const j8 =
            this.obtenerCampo(
                registro,
                "j8"
            );


        if(
            j8 === null ||
            String(j8).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j8/anatomía vacío para " +
                j1 +
                "."
            );

        }


        /* =================================================
           ESTADÍSTICAS e1 → e11
        ================================================= */

        const estadisticas = {};


        for(
            let i = 1;
            i <= 11;
            i++
        ){

            const campo =
                "e" + i;


            let valor =
                this.obtenerCampo(
                    registro,
                    campo
                );


            if(
                valor !== null &&
                valor !== ""
            ){

                const numero =
                    Number(valor);


                if(
                    Number.isFinite(numero)
                ){

                    valor = numero;

                }

            }


            estadisticas[campo] =
                valor;

        }


        return {

            j2:
                String(j2).trim(),

            j3:
                String(j3).trim(),

            j7:
                String(j7).trim(),

            j8:
                String(j8).trim(),

            estadisticas:
                estadisticas

        };

    },


    /* ====================================================
       PROCESAR PALGEO

       j3
       ↓
       PALGEOSIMPLIFICADO
    ==================================================== */

    procesarPALGEO(
        j3,
        j1
    ){

        if(
            !window.PALGEOSIMPLIFICADO ||
            typeof window.PALGEOSIMPLIFICADO.analizar !==
            "function"
        ){

            throw new Error(
                "CARGACONT: PALGEOSIMPLIFICADO " +
                "no está disponible."
            );

        }


        const cronologia =
            String(j3 || "").trim();


        if(!cronologia){

            throw new Error(
                "CARGACONT: j3 vacío para " +
                j1 +
                "."
            );

        }


        const datos =
            window.PALGEOSIMPLIFICADO.analizar(
                cronologia
            );


        if(!datos){

            throw new Error(
                "CARGACONT: PALGEOSIMPLIFICADO " +
                "no pudo procesar j3 de " +
                j1 +
                ": " +
                cronologia
            );

        }


        return {

            cronologia:
                datos.cronologia,

            inicio_ma:
                datos.inicio_ma,

            fin_ma:
                datos.fin_ma,

            rango:
                datos.rango || null,

            codes:
                Array.isArray(datos.codes)
                    ? datos.codes
                    : [],

            periodo:
                Array.isArray(datos.periodo)
                    ? datos.periodo
                    : [],

            edad:
                Array.isArray(datos.edad)
                    ? datos.edad
                    : []

        };

    },


    /* ====================================================
       CONVERTIR RUTA EN URL ABSOLUTA
    ==================================================== */

    convertirRuta(ruta){

        if(!ruta){

            return null;

        }


        const texto =
            String(ruta).trim();


        if(!texto){

            return null;

        }


        if(
            /^https?:\/\//i.test(texto)
        ){

            return texto;

        }


        if(
            texto.startsWith("/")
        ){

            return new URL(
                texto,
                this.dominio
            ).href;

        }


        const base =
            new URL(
                "herramientas/generador/",
                this.dominio
            );


        return new URL(
            texto,
            base
        ).href;

    },


    /* ====================================================
       PREPARAR IMÁGENES
    ==================================================== */

    prepararImagenes(
        resultadoBusqueda
    ){

        const imagenes = {

            i0: null,

            i2: null,

            i3: null

        };


        if(
            !resultadoBusqueda
        ){

            return imagenes;

        }


        if(
            !Array.isArray(
                resultadoBusqueda.imagenes
            )
        ){

            return imagenes;

        }


        for(
            const imagen of
            resultadoBusqueda.imagenes
        ){

            if(
                !imagen ||
                !imagen.tipo
            ){

                continue;

            }


            const tipo =
                String(
                    imagen.tipo
                )
                .trim()
                .toLowerCase();


            if(
                tipo !== "i0" &&
                tipo !== "i2" &&
                tipo !== "i3"
            ){

                continue;

            }


            if(
                imagen.ruta
            ){

                imagenes[tipo] =
                    this.convertirRuta(
                        imagen.ruta
                    );

            }

        }


        return imagenes;

    },


    /* ====================================================
       CARGAR POR J1
    ==================================================== */

    async cargar(j1){

        j1 =
            this.normalizarJ1(
                j1
            );


        if(!j1){

            throw new Error(
                "CARGACONT: no se ha indicado j1."
            );

        }


        /* =================================================
           BUSCAR EN MASTER.CSV
        ================================================= */

        const registroCSV =
            this.buscarJ1EnCSV(
                j1
            );


        if(!registroCSV){

            throw new Error(
                "CARGACONT: el j1 " +
                j1 +
                " no existe en master.csv."
            );

        }


        /* =================================================
           OBTENER DATOS DEL MASTER
        ================================================= */

        const datosMaster =
            this.obtenerDatosMaster(
                registroCSV,
                j1
            );


        /* =================================================
           PROCESAR J3
        ================================================= */

        const palgeo =
            this.procesarPALGEO(
                datosMaster.j3,
                j1
            );


        /* =================================================
           COMPROBAR BUSCARUTA
        ================================================= */

        if(
            !window.BUSCARUTA ||
            typeof window.BUSCARUTA.buscar !==
            "function"
        ){

            throw new Error(
                "CARGACONT: BUSCARUTA no está disponible."
            );

        }


        /* =================================================
           BUSCAR IMÁGENES
        ================================================= */

        const resultadoBusqueda =
            await window.BUSCARUTA.buscar(
                j1
            );


        /* =================================================
           PREPARAR IMÁGENES
        ================================================= */

        const imagenes =
            this.prepararImagenes(
                resultadoBusqueda
            );


        /* =================================================
           CONSTRUCCIÓN DEL REGISTRO FINAL

           PARTE 1 TERMINA AQUÍ
        ================================================= */

        const resultado = {

         /* ========================================================
   CONTINUACIÓN — CARGACONT v1.5 LTS
   PARTE 2
======================================================== */


/* ====================================================
   OBTENER DATOS FINALES
==================================================== */

    async obtenerDatosFinales(j1){

        const registro =
            await this.buscarEnJSON(
                j1
            );


        if(!registro){

            throw new Error(
                "CARGACONT: no existe " +
                j1 +
                " en paleofichas.json."
            );

        }


        const nombre =
            registro.nombre;

        const dieta =
            registro.dieta;

        const anatomia =
            registro.anatomia;


        if(
            !nombre ||
            String(nombre).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j2/nombre vacío para " +
                j1 +
                "."
            );

        }


        if(
            !dieta ||
            String(dieta).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j7/dieta vacío para " +
                j1 +
                "."
            );

        }


        if(
            !anatomia ||
            String(anatomia).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j8/anatomia vacío para " +
                j1 +
                "."
            );

        }


        return {

            j2:
                String(nombre).trim(),

            j7:
                String(dieta).trim(),

            j8:
                String(anatomia).trim()

        };

    },


/* ====================================================
   OBTENER CRONOLOGÍA MEDIANTE LEEPALJSON

   IMPORTANTE:

   master.csv es la FUENTE ÚNICA de datos.

   j3 procede directamente del registro CSV.

   No se utiliza paleofichas.json para la cronología.
==================================================== */

    obtenerCronologia(registroCSV){

        if(
            !registroCSV
        ){

            throw new Error(
                "CARGACONT: no existe registro CSV."
            );

        }


        const cronologia =
            registroCSV.j3;


        if(
            cronologia === undefined ||
            cronologia === null ||
            String(cronologia).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j3 vacío."
            );

        }


        return String(
            cronologia
        ).trim();

    },


/* ====================================================
   TRANSFORMAR CRONOLOGÍA

   master.csv
        ↓
   j3 interno
        ↓
   PALGEOSIMPLIFICADO
        ↓
   datos preparados para CAB07

   LEEPALGEO no es necesario aquí.

   La transformación definitiva se realiza
   mediante PALGEOSIMPLIFICADO.
==================================================== */

    transformarCronologia(cronologia){

        if(
            !window.PALGEOSIMPLIFICADO
        ){

            throw new Error(
                "CARGACONT: PALGEOSIMPLIFICADO no está disponible."
            );

        }


        if(
            typeof window.PALGEOSIMPLIFICADO.analizar !==
            "function"
        ){

            throw new Error(
                "CARGACONT: PALGEOSIMPLIFICADO.analizar() no está disponible."
            );

        }


        const datos =
            window.PALGEOSIMPLIFICADO.analizar(
                cronologia
            );


        if(
            !datos
        ){

            throw new Error(
                "CARGACONT: no se pudo transformar la cronología " +
                cronologia +
                "."
            );

        }


        return {

            j3:
                datos.cronologia,

            intervalo:
                datos.rango || null,

            periodo:
                Array.isArray(datos.periodo)
                    ? datos.periodo
                    : [],

            edad:
                Array.isArray(datos.edad)
                    ? datos.edad
                    : [],

            codes:
                Array.isArray(datos.codes)
                    ? datos.codes
                    : []

        };

    },


/* ====================================================
   CONVERTIR RUTA EN URL ABSOLUTA
==================================================== */

    convertirRuta(ruta){

        if(!ruta){

            return null;

        }


        const texto =
            String(ruta).trim();


        if(!texto){

            return null;

        }


        if(
            /^https?:\/\//i.test(texto)
        ){

            return texto;

        }


        if(
            texto.startsWith("/")
        ){

            return new URL(
                texto,
                this.dominio
            ).href;

        }


        const base =
            new URL(
                "herramientas/generador/",
                this.dominio
            );


        return new URL(
            texto,
            base
        ).href;

    },


/* ====================================================
   PREPARAR IMÁGENES
==================================================== */

    prepararImagenes(
        resultadoBusqueda
    ){

        const imagenes = {

            i0: null,
            i2: null,
            i3: null

        };


        if(
            !resultadoBusqueda
        ){

            return imagenes;

        }


        if(
            !Array.isArray(
                resultadoBusqueda.imagenes
            )
        ){

            return imagenes;

        }


        for(
            const imagen of
            resultadoBusqueda.imagenes
        ){

            if(
                !imagen ||
                !imagen.tipo
            ){

                continue;

            }


            const tipo =
                String(
                    imagen.tipo
                )
                .trim()
                .toLowerCase();


            if(
                tipo !== "i0" &&
                tipo !== "i2" &&
                tipo !== "i3"
            ){

                continue;

            }


            if(
                imagen.ruta
            ){

                imagenes[tipo] =
                    this.convertirRuta(
                        imagen.ruta
                    );

            }

        }


        return imagenes;

    },


/* ====================================================
   CARGAR POR J1
==================================================== */

    async cargar(j1){

        j1 =
            this.normalizarJ1(
                j1
            );


        if(!j1){

            throw new Error(
                "CARGACONT: no se ha indicado j1."
            );

        }


        /* --------------------------------------------
           MASTER.CSV
        -------------------------------------------- */

        const registroCSV =
            this.buscarJ1EnCSV(
                j1
            );


        if(!registroCSV){

            throw new Error(
                "CARGACONT: el j1 " +
                j1 +
                " no existe en master.csv."
            );

        }


        /* --------------------------------------------
           DATOS DEFINITIVOS
        -------------------------------------------- */

        const datosFinales =
            await this.obtenerDatosFinales(
                j1
            );


        /* --------------------------------------------
           CRONOLOGÍA

           SALE DEL MASTER.CSV
        -------------------------------------------- */

        const cronologia =
            this.obtenerCronologia(
                registroCSV
            );


        /* --------------------------------------------
           TRANSFORMACIÓN GEOCRONOLÓGICA
        -------------------------------------------- */

        const datosGeo =
            this.transformarCronologia(
                cronologia
            );


        /* --------------------------------------------
           COMPROBAR BUSCARUTA
        -------------------------------------------- */

        if(
            !window.BUSCARUTA ||
            typeof window.BUSCARUTA.buscar !==
            "function"
        ){

            throw new Error(
                "CARGACONT: BUSCARUTA no está disponible."
            );

        }


        /* --------------------------------------------
           BUSCAR IMÁGENES
        -------------------------------------------- */

        const resultadoBusqueda =
            await window.BUSCARUTA.buscar(
                j1
            );


        /* --------------------------------------------
           PREPARAR IMÁGENES
        -------------------------------------------- */

        const imagenes =
            this.prepararImagenes(
                resultadoBusqueda
            );


        /* --------------------------------------------
           REGISTRO FINAL

           ESTE ES EL REGISTRO QUE RECIBE
           EL GENERADOR.

           CAB07 puede trabajar directamente
           con los campos geológicos.
        -------------------------------------------- */

        const resultado = {

            j1:
                j1,

            j2:
                datosFinales.j2,

            j3:
                datosGeo.j3,

            j7:
                datosFinales.j7,

            j8:
                datosFinales.j8,

            intervalo:
                datosGeo.intervalo,

            periodo:
                datosGeo.periodo,

            edad:
                datosGeo.edad,

            codes:
                datosGeo.codes,

            i0:
                imagenes.i0,

            i2:
                imagenes.i2,

            i3:
                imagenes.i3

        };


        /* --------------------------------------------
           CACHE
        -------------------------------------------- */

        this.ultimo =
            resultado;


        /* --------------------------------------------
           EVENTO
        -------------------------------------------- */

        document.dispatchEvent(

            new CustomEvent(
                "palentropia:contenedor-cargado",
                {
                    detail:
                        resultado
                }
            )

        );


        /* --------------------------------------------
           CONSOLA
        -------------------------------------------- */

        console.log(
            "========================================"
        );

        console.log(
            "PalEntropía — CARGACONT v1.5 LTS"
        );

        console.log(
            "Registro final:"
        );

        console.log(
            resultado
        );

        console.log(
            "Geología:"
        );

        console.log(
            datosGeo
        );

        console.log(
            "========================================"
        );


        return resultado;

    },


/* ====================================================
   CARGA ALEATORIA
==================================================== */

    async aleatorio(){

        const contenedor =
            this.obtenerContenedor();


        const registros =
            contenedor.filter(

                registro => {

                    if(!registro){

                        return false;

                    }


                    const codigo =
                        this.normalizarJ1(
                            registro.codigo
                        );


                    return /^\d{3}_\d{2}$/.test(
                        codigo
                    );

                }

            );


        if(
            !registros.length
        ){

            throw new Error(
                "CARGACONT: no existen j1 válidos."
            );

        }


        const indice =
            Math.floor(
                Math.random() *
                registros.length
            );


        const j1 =
            this.normalizarJ1(
                registros[indice].codigo
            );


        return await this.cargar(
            j1
        );

    },


/* ====================================================
   OBTENER ÚLTIMO REGISTRO
==================================================== */

    obtener(){

        return this.ultimo || null;

    },


/* ====================================================
   ESTADO
==================================================== */

    estado(){

        return {

            disponible:
                !!this.ultimo,

            j1:
                this.ultimo
                    ? this.ultimo.j1
                    : null

        };

    }

};


/* ========================================================
   FIN CARGACONT v1.5 LTS
======================================================== */ 





