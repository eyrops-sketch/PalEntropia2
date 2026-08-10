/*
========================================================
PalEntropía
cargacont.js v1.1

COMPUERTA DEL CONTENEDOR

FUNCIONES
---------
- Carga un registro mediante j1
- Carga un registro aleatorio
- j1 procede de master.csv
- j2, j7, j8 proceden de paleofichas.json
- i0, i2, i3 proceden de BUSCARUTA
- Devuelve un registro preparado para generador.html

ARQUITECTURA
------------
master.csv
    │
    └── j1
         │
         ▼
     CARGACONT
       │    │
       │    └── BUSCARUTA
       │          └── i0 / i2 / i3
       │
       └──── LEEPALJSON / paleofichas.json
              └── j2 / j7 / j8

========================================================
*/


window.CARGACONT = {


    /* ==================================================
       CONFIGURACIÓN
    ================================================== */

    campoPuntero: "j1",


    /* ==================================================
       ÚLTIMO REGISTRO
    ================================================== */

    ultimo: null,


    /* ==================================================
       BUSCAR REGISTRO DEL CSV POR J1
    ================================================== */

    buscarCSV(j1){

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
                "CARGACONT: el contenedor CSV está vacío."
            );

        }


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


    /* ==================================================
       OBTENER DATOS FINALES DESDE PALEOFICHAS.JSON
       
       BUSCARUTA ya contiene el lector de JSON.
    ================================================== */

    async obtenerDatosFinales(j1){

        if(
            !window.BUSCARUTA ||
            typeof window.BUSCARUTA.obtenerJ2 !==
            "function"
        ){

            throw new Error(
                "CARGACONT: BUSCARUTA no está disponible."
            );

        }


        /*
        BUSCARUTA ya sabe localizar
        el registro correcto mediante j1.
        */

        const datos =
            await window.BUSCARUTA.cargarJSON();


        const registro =

            window.BUSCARUTA.buscarRegistro(
                datos,
                j1
            );


        if(!registro){

            throw new Error(
                "CARGACONT: no se encontró " +
                j1 +
                " en paleofichas.json."
            );

        }


        const j2 =

            registro.j2 !== undefined
                ? registro.j2
                : registro.nombre;


        const j7 =

            registro.j7 !== undefined
                ? registro.j7
                : registro.dieta;


        const j8 =

            registro.j8 !== undefined
                ? registro.j8
                : registro.anatomia;


        return {

            j2:
                j2 !== undefined &&
                j2 !== null
                    ? String(j2).trim()
                    : null,

            j7:
                j7 !== undefined &&
                j7 !== null
                    ? String(j7).trim()
                    : null,

            j8:
                j8 !== undefined &&
                j8 !== null
                    ? String(j8).trim()
                    : null

        };

    },


    /* ==================================================
       CARGAR REGISTRO POR J1
    ================================================== */

    async cargar(j1){

        /* ----------------------------------------------
           NORMALIZAR J1
        ---------------------------------------------- */

        j1 =

            String(j1 || "")
            .trim()
            .toUpperCase();


        if(!j1){

            throw new Error(
                "CARGACONT: no se ha indicado j1."
            );

        }


        /* ----------------------------------------------
           COMPROBAR QUE EXISTE EN CSV
        ---------------------------------------------- */

        const registroCSV =
            this.buscarCSV(j1);


        if(!registroCSV){

            throw new Error(
                "CARGACONT: no existe " +
                j1 +
                " en master.csv."
            );

        }


        /* ----------------------------------------------
           OBTENER DATOS FINALES
        ---------------------------------------------- */

        const datosFinales =

            await this.obtenerDatosFinales(
                j1
            );


        /* ----------------------------------------------
           BUSCAR IMÁGENES
        ---------------------------------------------- */

        let resultadoImagenes = null;


        if(
            window.BUSCARUTA &&
            typeof window.BUSCARUTA.buscar ===
            "function"
        ){

            resultadoImagenes =

                await window.BUSCARUTA.buscar(
                    j1
                );

        }


        /* ----------------------------------------------
           PREPARAR IMÁGENES
           
           Se entregan directamente como:
           
           i0
           i2
           i3
        ---------------------------------------------- */

        let i0 = null;
        let i2 = null;
        let i3 = null;


        if(
            resultadoImagenes &&
            Array.isArray(
                resultadoImagenes.imagenes
            )
        ){

            for(
                const imagen of
                resultadoImagenes.imagenes
            ){

                if(!imagen){
                    continue;
                }


                if(
                    imagen.tipo === "i0"
                ){

                    i0 =
                        imagen.ruta || null;

                }


                if(
                    imagen.tipo === "i2"
                ){

                    i2 =
                        imagen.ruta || null;

                }


                if(
                    imagen.tipo === "i3"
                ){

                    i3 =
                        imagen.ruta || null;

                }

            }

        }


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
                i0,

            i2:
                i2,

            i3:
                i3

        };


        /* ----------------------------------------------
           GUARDAR ÚLTIMO REGISTRO
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
            "PalEntropía — CARGACONT"
        );

        console.log(
            "Registro cargado:",
            j1
        );

        console.log(
            resultado
        );

        console.log(
            "========================================"
        );


        return resultado;

    },


    /* ==================================================
       CARGA ALEATORIA
       
       Selecciona un j1 existente en master.csv.
    ================================================== */

    async aleatorio(){

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


        /* ----------------------------------------------
           OBTENER J1 VÁLIDOS
        ---------------------------------------------- */

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


        if(!registros.length){

            throw new Error(
                "CARGACONT: no existen j1 válidos."
            );

        }


        /* ----------------------------------------------
           SELECCIÓN ALEATORIA
        ---------------------------------------------- */

        const indice =

            Math.floor(

                Math.random() *
                registros.length

            );


        const j1 =

            String(
                registros[indice].codigo
            )
            .trim()
            .toUpperCase();


        /* ----------------------------------------------
           CARGAR REGISTRO
        ---------------------------------------------- */

        return await this.cargar(
            j1
        );

    },


    /* ==================================================
       OBTENER ÚLTIMO REGISTRO
    ================================================== */

    obtener(){

        return this.ultimo || null;

    },


    /* ==================================================
       LIMPIAR ÚLTIMO REGISTRO
    ================================================== */

    limpiar(){

        this.ultimo = null;

    },


    /* ==================================================
       ESTADO
    ================================================== */

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


/*
========================================================
FIN cargacont.js v1.1
========================================================
*/
