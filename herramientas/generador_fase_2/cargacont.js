/* ========================================================
   PalEntropía
   cargacont.js v1.6 LTS

   PARTE 1 DE 2

   CAMBIO:
   - j3 sigue procediendo de master.csv
   - Se analiza j3 mediante PALGEOSIMPLIFICADO
   - Se preparan los datos geológicos:
       geo.rango
       geo.codes
       geo.periodo
       geo.edad

   IMPORTANTE:
   - PALGEO sigue siendo la fuente geológica.
   - PALGEOSIMPLIFICADO realiza únicamente el análisis.
   - No se modifica BUSCARUTA.
   - No se modifica PALVIDEO.
   - No se modifica paleofichas.json.

======================================================== */


/* ========================================================
   CONFIGURACIÓN GLOBAL
======================================================== */

window.CARGACONT = {

    campoPuntero: "j1",

    rutaJSON: "paleofichas.json",

    dominio:
        "https://palentropia.es/",

    _datosJSON: null,

    _cargandoJSON: null,

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
       OBTENER CONTENEDOR CSV
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
                    registro.codigo
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
       CARGAR PALEOFICHAS.JSON
    ==================================================== */

    async cargarJSON(){

        if(
            this._datosJSON
        ){

            return this._datosJSON;

        }


        if(
            this._cargandoJSON
        ){

            return this._cargandoJSON;

        }


        this._cargandoJSON =

            fetch(
                this.rutaJSON,
                {
                    cache:
                        "default"
                }
            )

            .then(

                respuesta => {

                    if(
                        !respuesta.ok
                    ){

                        throw new Error(
                            "CARGACONT: no se pudo cargar " +
                            this.rutaJSON +
                            " (" +
                            respuesta.status +
                            ")"
                        );

                    }


                    return respuesta.json();

                }

            )

            .then(

                datos => {

                    if(
                        !Array.isArray(datos)
                    ){

                        throw new Error(
                            "CARGACONT: paleofichas.json no contiene un array válido."
                        );

                    }


                    this._datosJSON =
                        datos;


                    return datos;

                }

            )

            .catch(

                error => {

                    this._cargandoJSON =
                        null;


                    throw error;

                }

            );


        return this._cargandoJSON;

    },


    /* ====================================================
       BUSCAR J1 EN PALEOFICHAS.JSON
    ==================================================== */

    async buscarEnJSON(j1){

        const datos =
            await this.cargarJSON();


        for(
            const registro of datos
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
       ANALIZAR GEOLOGÍA
       
       j3 → PALGEOSIMPLIFICADO
    ==================================================== */

    analizarGeologia(j3){

        if(
            !window.PALGEOSIMPLIFICADO ||
            typeof window.PALGEOSIMPLIFICADO.analizar !==
            "function"
        ){

            throw new Error(
                "CARGACONT: PALGEOSIMPLIFICADO no está disponible."
            );

        }


        const analisis =
            window.PALGEOSIMPLIFICADO.analizar(
                j3
            );


        if(!analisis){

            throw new Error(
                "CARGACONT: no se pudo analizar la cronología j3: " +
                j3
            );

        }


        return {

            rango:
                analisis.rango,

            codes:
                Array.isArray(
                    analisis.codes
                )
                    ? analisis.codes
                    : [],

            periodo:
                Array.isArray(
                    analisis.periodo
                )
                    ? analisis.periodo
                    : [],

            edad:
                Array.isArray(
                    analisis.edad
                )
                    ? analisis.edad
                    : []

        };

    },


    /* ====================================================
       CONVERTIR RUTA EN URL ABSOLUTA
    ==================================================== */

    convertirRuta(ruta){

        if(
            !ruta
        ){

            return null;

        }


        const texto =
            String(ruta).trim();


        if(
            !texto
        ){

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

            i0:
                null,

            i2:
                null,

            i3:
                null

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


/* ========================================================
   FIN PARTE 1
======================================================== */

/* ========================================================
   PARTE 2 DE 2
   CONTINUACIÓN DIRECTA DE CARGACONT v1.6 LTS
======================================================== */


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
       COMPROBAR J1 EN MASTER.CSV
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
       OBTENER J3 DESDE MASTER.CSV

       j3 = cronología oficial
    -------------------------------------------- */

    const j3 =
        registroCSV.j3;


    /* --------------------------------------------
       COMPROBAR J3
    -------------------------------------------- */

    if(
        j3 === undefined ||
        j3 === null ||
        String(j3).trim() === ""
    ){

        throw new Error(
            "CARGACONT: j3/cronología vacío para " +
            j1 +
            "."
        );

    }


    const j3Normalizado =
        String(j3).trim();


    /* --------------------------------------------
       ANALIZAR GEOLOGÍA

       j3
       ↓
       PALGEOSIMPLIFICADO
    -------------------------------------------- */

    const geologia =
        this.analizarGeologia(
            j3Normalizado
        );


    /* --------------------------------------------
       DATOS FINALES DESDE JSON
    -------------------------------------------- */

    const datosFinales =
        await this.obtenerDatosFinales(
            j1
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
       CONVERTIR A URL ABSOLUTAS
    -------------------------------------------- */

    const imagenes =
        this.prepararImagenes(
            resultadoBusqueda
        );


    /* ==================================================
       REGISTRO FINAL
       
       NUEVOS DATOS GEO:
       rango
       codes
       periodo
       edad
    ================================================== */

    const resultado = {

        j1:
            j1,

        j2:
            datosFinales.j2,

        j3:
            j3Normalizado,

        rango:
            geologia.rango,

        codes:
            geologia.codes,

        periodo:
            geologia.periodo,

        edad:
            geologia.edad,

        j7:
            datosFinales.j7,

        j8:
            datosFinales.j8,

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
        "PalEntropía — CARGACONT v1.6 LTS"
    );

    console.log(
        "Registro final:"
    );

    console.log(
        resultado
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
   FIN CARGACONT v1.6 LTS
======================================================== */
