/* ========================================================
   PalEntropía
   cargacont.js v1.1 LTS

   COMPUERTA DEL CONTENEDOR

   Funciones:
   - Carga un registro mediante j1
   - Carga aleatoriamente un j1
   - Obtiene datos desde LEEPALJSON
   - Obtiene rutas de imágenes desde BUSCARUTA
   - Convierte las rutas relativas en rutas reales
   - Devuelve un registro preparado al generador

   IMPORTANTE
   ----------
   El HTML NO debe calcular ni modificar rutas.

   CARGACONT entrega directamente:

   paleofichas/vol003/003_11_greererpeton/Greererpeton_i3.png

   o:

   herramientas/multimedia/new/006_01_i3.png

======================================================== */


/* ========================================================
   OBJETO GLOBAL
======================================================== */

window.CARGACONT = {


    /* ====================================================
       CONFIGURACIÓN
    ==================================================== */

    campoPuntero: "j1",


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
    ==================================================== */

    obtenerContenedor(){

        if(
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !== "function"
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
                "CARGACONT: el contenedor CSV está vacío."
            );

        }


        return contenedor;

    },


    /* ====================================================
       BUSCAR REGISTRO POR J1
    ==================================================== */

    buscarRegistro(j1){

        const contenedor =
            this.obtenerContenedor();


        for(
            const registro of contenedor
        ){

            if(!registro){

                continue;

            }


            const codigo =
                String(
                    registro.codigo || ""
                )
                .trim()
                .toUpperCase();


            if(
                codigo === j1
            ){

                return registro;

            }

        }


        return null;

    },


    /* ====================================================
       CONVERTIR RUTA A RUTA REAL DEL PROYECTO

       BUSCARUTA puede devolver:

       ../../paleofichas/vol003/...
       ../multimedia/new/...
       ../multimedia/001_075/...

       CARGACONT transforma:

       paleofichas/vol003/...
       herramientas/multimedia/new/...
       herramientas/multimedia/001_075/...

       El HTML recibe siempre la ruta final.
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
           MULTIMEDIA NUEVA

           ../multimedia/new/...

           → herramientas/multimedia/new/...
        ---------------------------------------------- */

        texto =
            texto.replace(
                /^(\.\.\/)+multimedia\/new\//i,
                "herramientas/multimedia/new/"
            );


        /* ----------------------------------------------
           EXCEPCIONES

           ../multimedia/001_075/...

           → herramientas/multimedia/001_075/...
        ---------------------------------------------- */

        texto =
            texto.replace(
                /^(\.\.\/)+multimedia\/001_075\//i,
                "herramientas/multimedia/001_075/"
            );


        /* ----------------------------------------------
           SEGURIDAD

           Si por alguna razón quedasen ../,
           eliminarlos del comienzo.
        ---------------------------------------------- */

        texto =
            texto.replace(
                /^(?:\.\.\/)+/,
                ""
            );


        return texto;

    },


    /* ====================================================
       CONVERTIR TODAS LAS IMÁGENES

       Recibe el resultado de BUSCARUTA y devuelve
       solamente las rutas finales.

       Entrada:

       {
           j1: "...",
           caso: "...",
           imagenes: [
               {
                   tipo: "i0",
                   ruta: "../../paleofichas/..."
               }
           ]
       }

       Salida:

       {
           i0: "paleofichas/...",
           i2: "paleofichas/...",
           i3: "paleofichas/..."
       }
    ==================================================== */

    prepararImagenes(resultadoBusqueda){

        const imagenes = {};


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
                !["i0", "i2", "i3"].includes(tipo)
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

            } else {

                imagenes[tipo] =
                    null;

            }

        }


        return imagenes;

    },


    /* ====================================================
       CARGAR REGISTRO POR J1
    ==================================================== */

    async cargar(j1){

        j1 =
            this.normalizarJ1(j1);


        if(!j1){

            throw new Error(
                "CARGACONT: no se ha indicado j1."
            );

        }


        /* ----------------------------------------------
           BUSCAR REGISTRO CSV
        ---------------------------------------------- */

        const registroCSV =
            this.buscarRegistro(j1);


        if(!registroCSV){

            throw new Error(
                "CARGACONT: no existe el registro " +
                j1 +
                " en el contenedor."
            );

        }


        /* ----------------------------------------------
           DATOS GENERALES

           Proceden del contenedor CSV.
        ---------------------------------------------- */

        const nombre =
            registroCSV.nombre || null;


        const dieta =
            registroCSV.dieta || null;


        const anatomia =
            registroCSV.anatomia || null;


        /* ----------------------------------------------
           BUSCAR IMÁGENES
        ---------------------------------------------- */

        let resultadoBusqueda =
            null;


        if(
            window.BUSCARUTA &&
            typeof window.BUSCARUTA.buscar ===
            "function"
        ){

            resultadoBusqueda =
                await window.BUSCARUTA.buscar(
                    j1
                );

        }


        /* ----------------------------------------------
           CONVERTIR RUTAS
        ---------------------------------------------- */

        const imagenes =
            this.prepararImagenes(
                resultadoBusqueda
            );


        /* ----------------------------------------------
           REGISTRO FINAL

           ESTE ES EL OBJETO QUE RECIBE EL HTML.
        ---------------------------------------------- */

        const resultado = {

            j1:
                j1,

            j2:
                nombre,

            j7:
                dieta,

            j8:
                anatomia,

            i0:
                imagenes.i0 || null,

            i2:
                imagenes.i2 || null,

            i3:
                imagenes.i3 || null

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
            "CARGACONT — registro cargado"
        );

        console.log(
            "j1:",
            resultado.j1
        );

        console.log(
            "j2:",
            resultado.j2
        );

        console.log(
            "j7:",
            resultado.j7
        );

        console.log(
            "j8:",
            resultado.j8
        );

        console.log(
            "i0:",
            resultado.i0
        );

        console.log(
            "i2:",
            resultado.i2
        );

        console.log(
            "i3:",
            resultado.i3
        );

        console.log(
            "========================================"
        );


        return resultado;

    },


    /* ====================================================
       CARGA ALEATORIA

       Selecciona un j1 existente en master.csv.
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


                    return (
                        String(
                            registro.codigo || ""
                        )
                        .trim() !== ""
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
   FIN CARGACONT v1.1 LTS
======================================================== */
