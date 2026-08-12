./* ========================================================
   PalEntropía
   cargacont.js v1.5 LTS

   COMPUERTA DEL CONTENEDOR

   FUENTE ÚNICA:
   master.csv

   FLUJO:

   master.csv
       ↓
   LEEPALJSON
       ↓
   CARGACONT
       ↓
   PALGEOSIMPLIFICADO
       ↓
   REGISTRO FINAL
       ↓
   GENERADOR

   Funciones:
   - Carga un registro mediante j1
   - Carga aleatoriamente un j1
   - Obtiene datos finales
   - Transforma j3 mediante PALGEOSIMPLIFICADO
   - Obtiene imágenes mediante BUSCARUTA
   - Convierte rutas relativas en URL absolutas
   - Entrega al generador un registro preparado

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


            /*
            LEEPALJSON utiliza "codigo"
            como representación del j1.
            */

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

       Estos campos continúan obteniéndose
       desde paleofichas.json:

       j2 = nombre
       j7 = dieta
       j8 = anatomía

       La cronología j3 NO procede de aquí.

       j3 procede exclusivamente de master.csv.
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
       OBTENER CRONOLOGÍA DESDE MASTER.CSV

       master.csv es la fuente única.

       j3 contiene:

       MMMM.DDDD-MMMM.DDDD

       Ejemplo:

       0521.0000-0509.0000
    ==================================================== */

    obtenerCronologia(registroCSV){

        if(
            !registroCSV
        ){

            throw new Error(
                "CARGACONT: no existe registro CSV."
            );

        }

console.log(
    "CARGACONT — registro master.csv:"
);

console.log(
    registroCSV
);

const cronologia =
    registroCSV.j3 ||
    registroCSV.cronologia ||
    registroCSV.J3;


        if(
            cronologia === undefined ||
            cronologia === null ||
            String(cronologia).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j3 vacío en master.csv."
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
       datos geológicos para el generador

       PALGEOSIMPLIFICADO utiliza PALGEO como
       fuente geológica.

       NO se utilizan decoders antiguos.
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
                "CARGACONT: PALGEOSIMPLIFICADO no pudo procesar " +
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
                Array.isArray(
                    datos.periodo
                )
                    ? datos.periodo
                    : [],

            edad:
                Array.isArray(
                    datos.edad
                )
                    ? datos.edad
                    : [],

            codes:
                Array.isArray(
                    datos.codes
                )
                    ? datos.codes
                    : []

        };

    },


    /* ====================================================
       AQUÍ TERMINA LA PARTE 1

       NO AÑADIR:

       };
       
       La PARTE 2 continúa directamente aquí.
    ==================================================== */

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


        /* --------------------------------------------
           YA ES URL ABSOLUTA
        -------------------------------------------- */

        if(
            /^https?:\/\//i.test(texto)
        ){

            return texto;

        }


        /* --------------------------------------------
           RUTA ABSOLUTA DEL SITIO
        -------------------------------------------- */

        if(
            texto.startsWith("/")
        ){

            return new URL(
                texto,
                this.dominio
            ).href;

        }


        /* --------------------------------------------
           RUTA RELATIVA

           BASE REAL DEL GENERADOR
        -------------------------------------------- */

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


        if(
            !j1
        ){

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


        if(
            !registroCSV
        ){

            throw new Error(
                "CARGACONT: el j1 " +
                j1 +
                " no existe en master.csv."
            );

        }


        /* --------------------------------------------
           OBTENER DATOS FINALES
        -------------------------------------------- */

        const datosFinales =
            await this.obtenerDatosFinales(
                j1
            );


        /* --------------------------------------------
           OBTENER J3 DESDE MASTER.CSV
        -------------------------------------------- */

        const cronologia =
            this.obtenerCronologia(
                registroCSV
            );


        /* --------------------------------------------
           TRANSFORMAR J3

           master.csv
              ↓
           PALGEOSIMPLIFICADO
              ↓
           datos geológicos
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

           Este es el registro que recibe
           el generador.

           Los datos geológicos ya llegan
           transformados.
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
           GUARDAR ÚLTIMO REGISTRO
        -------------------------------------------- */

        this.ultimo =
            resultado;


        /* --------------------------------------------
           EVENTO PARA EL GENERADOR
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

                    if(
                        !registro
                    ){

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


