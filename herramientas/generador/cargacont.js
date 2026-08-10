/* ========================================================
   PalEntropía
   cargacont.js v1.2 LTS

   COMPUERTA DEL CONTENEDOR

   ARQUITECTURA
   --------------------------------------------------------

   master.csv
       ↓
      j1

   paleofichas.json
       ↓
      j2
      j7
      j8

   BUSCARUTA
       ↓
      i0
      i2
      i3

   CARGACONT
       ↓
   REGISTRO FINAL PARA EL GENERADOR


   IMPORTANTE
   --------------------------------------------------------
   master.csv NO contiene los valores finales de j2, j7, j8.

   El CSV se utiliza únicamente como fuente de j1.

   paleofichas.json contiene los valores finales.

   El HTML no calcula ni busca rutas.

======================================================== */


/* ========================================================
   OBJETO GLOBAL
======================================================== */

window.CARGACONT = {


    /* ====================================================
       CONFIGURACIÓN
    ==================================================== */

    campoPuntero: "j1",

    rutaJSON: "paleofichas.json",


    /* ====================================================
       CACHE JSON
    ==================================================== */

    _datosJSON: null,

    _cargandoJSON: null,


    /* ====================================================
       ÚLTIMO REGISTRO
    ==================================================== */

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
       
       El CSV se utiliza como índice de j1.
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
       
       Solo necesitamos el código.
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
       
       Se carga una sola vez.
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
                    cache: "default"
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
                            "CARGACONT: paleofichas.json " +
                            "no contiene un array válido."
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
       BUSCAR REGISTRO EN PALEOFICHAS.JSON
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
       OBTENER VALORES FINALES DEL JSON

       j2 ← nombre
       j7 ← dieta
       j8 ← anatomia
    ==================================================== */

    async obtenerDatosFinales(j1){

        const registro =
            await this.buscarEnJSON(
                j1
            );


        if(
            !registro
        ){

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
            nombre === undefined ||
            nombre === null ||
            String(nombre).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j2/nombre vacío para " +
                j1 +
                "."
            );

        }


        if(
            dieta === undefined ||
            dieta === null ||
            String(dieta).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j7/dieta vacío para " +
                j1 +
                "."
            );

        }


        if(
            anatomia === undefined ||
            anatomia === null ||
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
       CONVERTIR RUTA A RUTA REAL DEL PROYECTO

       BUSCARUTA puede devolver rutas relativas
       respecto al HTML que lo utiliza.

       CARGACONT elimina esa dependencia y entrega
       una ruta desde la raíz del proyecto.
    ==================================================== */

    convertirRuta(ruta){

        if(
            !ruta
        ){

            return null;

        }


        let texto =
            String(ruta).trim();


        if(
            !texto
        ){

            return null;

        }


        /* ----------------------------------------------
           Eliminar ./ inicial
        ---------------------------------------------- */

        texto =
            texto.replace(
                /^\.\/+/,
                ""
            );


        /* ----------------------------------------------
           CASO 2

           ../../paleofichas/...

           → paleofichas/...
        ---------------------------------------------- */

        texto =
            texto.replace(
                /^(\.\.\/)+paleofichas\//i,
                "paleofichas/"
            );


        /* ----------------------------------------------
           CASO 1

           ../multimedia/001_075/...

           → herramientas/multimedia/001_075/...
        ---------------------------------------------- */

        texto =
            texto.replace(
                /^(\.\.\/)+multimedia\/001_075\//i,
                "herramientas/multimedia/001_075/"
            );


        /* ----------------------------------------------
           CASO 3

           ../multimedia/new/...

           → herramientas/multimedia/new/...
        ---------------------------------------------- */

        texto =
            texto.replace(
                /^(\.\.\/)+multimedia\/new\//i,
                "herramientas/multimedia/new/"
            );


        /* ----------------------------------------------
           SEGURIDAD
        ---------------------------------------------- */

        texto =
            texto.replace(
                /^(?:\.\.\/)+/,
                ""
            );


        return texto;

    },


    /* ====================================================
       PREPARAR IMÁGENES

       BUSCARUTA devuelve:

       imagenes: [
           {
               tipo: "i0",
               ruta: "..."
           }
       ]

       CARGACONT devuelve:

       i0: "ruta final"
       i2: "ruta final"
       i3: "ruta final"
    ==================================================== */

    prepararImagenes(resultadoBusqueda){

        const imagenes = {

            i0: null,

            i2: null,

            i3: null

        };


        if(
            !resultadoBusqueda ||
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
                !["i0", "i2", "i3"]
                    .includes(tipo)
            ){

                continue;

            }


            imagenes[tipo] =
                imagen.ruta
                    ? this.convertirRuta(
                        imagen.ruta
                    )
                    : null;

        }


        return imagenes;

    },


    /* ====================================================
       CARGAR REGISTRO POR J1
    ==================================================== */

    async cargar(j1){

        /* ----------------------------------------------
           NORMALIZAR
        ---------------------------------------------- */

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


        /* ----------------------------------------------
           VALIDAR J1 EN CSV

           El CSV es solamente el índice maestro.
        ---------------------------------------------- */

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


        /* ----------------------------------------------
           OBTENER J2 / J7 / J8 DEL JSON
        ---------------------------------------------- */

        const datosFinales =
            await this.obtenerDatosFinales(
                j1
            );


        /* ----------------------------------------------
           OBTENER IMÁGENES
        ---------------------------------------------- */

        let resultadoBusqueda =
            null;


        if(
            !window.BUSCARUTA ||
            typeof window.BUSCARUTA.buscar !==
            "function"
        ){

            throw new Error(
                "CARGACONT: BUSCARUTA no está disponible."
            );

        }


        resultadoBusqueda =
            await window.BUSCARUTA.buscar(
                j1
            );


        /* ----------------------------------------------
           CONVERTIR RUTAS
        ---------------------------------------------- */

        const imagenes =
            this.prepararImagenes(
                resultadoBusqueda
            );


        /* ----------------------------------------------
           REGISTRO FINAL
        ---------------------------------------------- */

        const resultado = {

            j1:
                j1,

            j2:
                datosFinales.j2,

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


        /* ----------------------------------------------
           CACHE
        ---------------------------------------------- */

        this.ultimo =
            resultado;


        /* ----------------------------------------------
           EVENTO
        ---------------------------------------------- */

        document.dispatchEvent(

            new CustomEvent(
                "palentropia:contenedor-cargado",
                {
                    detail:
                        resultado
                }
            )

        );


        /* ----------------------------------------------
           CONSOLA
        ---------------------------------------------- */

        console.log(
            "========================================"
        );

        console.log(
            "PalEntropía — CARGACONT v1.2 LTS"
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
       
       Selecciona un j1 real existente en master.csv.
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


                    return (
                        /^\d{3}_\d{2}$/
                            .test(codigo)
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
   FIN cargacont.js v1.2 LTS
======================================================== */
