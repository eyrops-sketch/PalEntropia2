/*
========================================================
PalEntropía
cargacont.js v1.1

COMPUERTA DEL CONTENEDOR
Generador — Carga de registro

========================================================

FUNCIÓN
-------

Construye un registro completo a partir de un único j1.

Si se proporciona j1:
    → carga ese registro.

Si NO se proporciona j1:
    → selecciona aleatoriamente un registro disponible.

El módulo NO modifica las fuentes originales.

FUENTES
-------

LEEPALJSON
    └── paleofichas.json
        ├── codigo → j1
        ├── nombre → j2
        ├── dieta → j7
        └── anatomia → j8

BUSCARUTA
    └── j1
        ├── i0
        ├── i2
        └── i3

========================================================

SALIDA

Registro único:

{
    j1: "...",
    j2: "...",
    j7: "...",
    j8: "...",
    i0: "...",
    i2: "...",
    i3: "..."
}

========================================================

PRINCIPIO DE FUNCIONAMIENTO

CARGACONT.cargar("001_01")
        ↓
    carga 001_01

CARGACONT.cargar()
        ↓
    selecciona j1 aleatorio

========================================================
*/


window.CARGACONT = {


    /* ==================================================
       CONTENEDOR ACTUAL
       
       En esta versión solamente existe
       un registro activo.
    ================================================== */

    registro: null,


    /* ==================================================
       NORMALIZAR J1
    ================================================== */

    normalizarJ1(j1){

        if(
            j1 === undefined ||
            j1 === null
        ){

            return "";

        }


        return String(j1)
            .trim()
            .toUpperCase();

    },


    /* ==================================================
       OBTENER FUENTE DE DATOS
       
       LEEPALJSON ya debe haber cargado
       paleofichas.json.
    ================================================== */

    obtenerFuente(){

        if(
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ){

            throw new Error(
                "CARGACONT: LEEPALJSON no está disponible."
            );

        }


        const datos =
            window.LEEPALJSON.obtener();


        if(
            !Array.isArray(datos) ||
            datos.length === 0
        ){

            throw new Error(
                "CARGACONT: no existen registros disponibles."
            );

        }


        return datos;

    },


    /* ==================================================
       BUSCAR REGISTRO POR J1
    ================================================== */

    buscarPorJ1(
        datos,
        j1
    ){

        return datos.find(

            registro => {

                if(
                    !registro ||
                    typeof registro !==
                    "object"
                ){

                    return false;

                }


                const codigo =

                    this.normalizarJ1(
                        registro.codigo
                    );


                return codigo === j1;

            }

        ) || null;

    },


    /* ==================================================
       SELECCIÓN ALEATORIA
       
       Selecciona un registro real de la fuente.
    ================================================== */

    seleccionarAleatorio(
        datos
    ){

        const posicion =

            Math.floor(
                Math.random() *
                datos.length
            );


        return datos[posicion];

    },


    /* ==================================================
       OBTENER J1 EFECTIVO
       
       Determina si se utiliza el j1 solicitado
       o uno aleatorio.
    ================================================== */

    determinarJ1(
        datos,
        j1
    ){

        const j1Normalizado =
            this.normalizarJ1(j1);


        /* ----------------------------------------------
           J1 EXPLÍCITO
        ---------------------------------------------- */

        if(
            j1Normalizado
        ){

            const registro =

                this.buscarPorJ1(
                    datos,
                    j1Normalizado
                );


            if(!registro){

                throw new Error(
                    "CARGACONT: no se encontró el j1 " +
                    j1Normalizado +
                    "."
                );

            }


            return {

                j1:
                    j1Normalizado,

                registro:
                    registro,

                origen:
                    "solicitado"

            };

        }


        /* ----------------------------------------------
           J1 ALEATORIO
        ---------------------------------------------- */

        const registroAleatorio =

            this.seleccionarAleatorio(
                datos
            );


        if(
            !registroAleatorio
        ){

            throw new Error(
                "CARGACONT: no se pudo seleccionar " +
                "un registro aleatorio."
            );

        }


        const codigoAleatorio =

            this.normalizarJ1(
                registroAleatorio.codigo
            );


        if(
            !codigoAleatorio
        ){

            throw new Error(
                "CARGACONT: el registro aleatorio " +
                "no contiene código."
            );

        }


        return {

            j1:
                codigoAleatorio,

            registro:
                registroAleatorio,

            origen:
                "aleatorio"

        };

    },


    /* ==================================================
       OBTENER IMÁGENES
    ================================================== */

    async obtenerImagenes(
        j1
    ){

        if(
            !window.BUSCARUTA ||
            typeof window.BUSCARUTA.buscar !==
            "function"
        ){

            throw new Error(
                "CARGACONT: BUSCARUTA no está disponible."
            );

        }


        return await window.BUSCARUTA.buscar(
            j1
        );

    },


    /* ==================================================
       EXTRAER RUTAS
    ================================================== */

    extraerRutas(
        resultadoImagenes
    ){

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


        return {

            i0:
                i0,

            i2:
                i2,

            i3:
                i3

        };

    },


    /* ==================================================
       CONSTRUIR REGISTRO
    ================================================== */

    construirRegistro(
        j1,
        datos,
        rutas
    ){

        return {

            j1:
                j1,

            j2:
                datos.nombre || "",

            j7:
                datos.dieta || "",

            j8:
                datos.anatomia || "",

            i0:
                rutas.i0,

            i2:
                rutas.i2,

            i3:
                rutas.i3

        };

    },


    /* ==================================================
       CARGAR
       
       Uso:

       CARGACONT.cargar("001_01")

       o:

       CARGACONT.cargar()
    ================================================== */

    async cargar(
        j1
    ){

        try {


            /* ------------------------------------------
               OBTENER FUENTE
            ------------------------------------------ */

            const datos =
                this.obtenerFuente();


            /* ------------------------------------------
               DETERMINAR J1
            ------------------------------------------ */

            const seleccion =

                this.determinarJ1(
                    datos,
                    j1
                );


            const codigo =
                seleccion.j1;


            const registroFuente =
                seleccion.registro;


            /* ------------------------------------------
               BUSCAR IMÁGENES
            ------------------------------------------ */

            const resultadoImagenes =

                await this.obtenerImagenes(
                    codigo
                );


            /* ------------------------------------------
               EXTRAER RUTAS
            ------------------------------------------ */

            const rutas =

                this.extraerRutas(
                    resultadoImagenes
                );


            /* ------------------------------------------
               CONSTRUIR REGISTRO
            ------------------------------------------ */

            const registro =

                this.construirRegistro(
                    codigo,
                    registroFuente,
                    rutas
                );


            /* ------------------------------------------
               GUARDAR EN EL CONTENEDOR
            ------------------------------------------ */

            this.registro =
                registro;


            /* ------------------------------------------
               EVENTO
            ------------------------------------------ */

            document.dispatchEvent(

                new CustomEvent(
                    "palentropia:contenedor-cargado",
                    {

                        detail: {

                            registro:
                                registro,

                            origen:
                                seleccion.origen

                        }

                    }
                )

            );


            /* ------------------------------------------
               DEPURACIÓN
            ------------------------------------------ */

            console.log(
                "========================================"
            );

            console.log(
                "PalEntropía — CARGACONT v1.1"
            );

            console.log(
                "J1:",
                codigo
            );

            console.log(
                "Origen:",
                seleccion.origen
            );

            console.log(
                "Registro:",
                registro
            );

            console.log(
                "========================================"
            );


            return registro;


        }
        catch(error){

            console.error(
                "ERROR CARGACONT:",
                error
            );


            this.registro =
                null;


            document.dispatchEvent(

                new CustomEvent(
                    "palentropia:error-contenedor",
                    {

                        detail:
                            error

                    }

                )

            );


            throw error;

        }

    },


    /* ==================================================
       OBTENER REGISTRO ACTUAL
    ================================================== */

    obtener(){

        return this.registro;

    },


    /* ==================================================
       LIMPIAR CONTENEDOR
    ================================================== */

    limpiar(){

        this.registro =
            null;

    }

};


/*
========================================================
FIN cargacont.js v1.1
========================================================
*/






