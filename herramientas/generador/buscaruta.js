/*
========================================================
PalEntropía
buscaruta.js v0.1

BUSCARUTA — MÓDULO INICIAL

Esta versión trabaja únicamente con las
cuatro excepciones conocidas.

EXCEPCIONES:

001_12
002_04
003_14
004_14

Las rutas de las imágenes están escritas
directamente y NO se construyen mediante cadenas.

No utiliza PALDB.

No procesa todavía el Caso 1 normal.

========================================================
*/

window.BUSCARUTA = {


    /* ==================================================
       RUTAS FIJAS DE LAS EXCEPCIONES
    ================================================== */

    excepciones: {

        "001_12": {

            i0:
                "../multimedia/001_075/001_012_i0.jpg",

            i2:
                "../multimedia/001_075/001_012_i2.jpg",

            i3:
                "../multimedia/001_075/001_012_i3.jpg"

        },


        "002_04": {

            i0:
                "../multimedia/001_075/002_004_i0.jpg",

            i2:
                "../multimedia/001_075/002_004_i2.jpg",

            i3:
                "../multimedia/001_075/002_004_i3.jpg"

        },


        "003_14": {

            i0:
                "../multimedia/001_075/003_014_i0.jpg",

            i2:
                "../multimedia/001_075/003_014_i2.jpg",

            i3:
                "../multimedia/001_075/003_014_i3.jpg"

        },


        "004_14": {

            i0:
                "../multimedia/001_075/004_014_i0.jpg",

            i2:
                "../multimedia/001_075/004_014_i2.jpg",

            i3:
                "../multimedia/001_075/004_014_i3.jpg"

        }

    },


    /* ==================================================
       COMPROBAR SI J1 ES UNA EXCEPCIÓN
    ================================================== */

    esExcepcion(j1){

        return Object.prototype.hasOwnProperty.call(

            this.excepciones,

            j1

        );

    },


    /* ==================================================
       COMPROBAR IMAGEN

       Image() permite comprobar si el recurso
       realmente puede cargarse.

       No se muestra ningún 404 al usuario.
    ================================================== */

    comprobarImagen(ruta){

        return new Promise(

            resolve => {

                const imagen =
                    new Image();


                imagen.onload =
                    function(){

                        resolve(true);

                    };


                imagen.onerror =
                    function(){

                        resolve(false);

                    };


                imagen.src =
                    ruta;

            }

        );

    },


    /* ==================================================
       BUSCAR EXCEPCIÓN
    ================================================== */

    async buscarExcepcion(j1){

        const rutas =
            this.excepciones[j1];


        const resultado = {

            j1:
                j1,

            excepcion:
                true,

            imagenes:
                []

        };


        /*
        Comprobamos i0, i2 e i3
        */

        for(
            const tipo of
            ["i0", "i2", "i3"]
        ){

            const ruta =
                rutas[tipo];


            const existe =
                await this.comprobarImagen(
                    ruta
                );


            if(existe){

                resultado.imagenes.push({

                    tipo:
                        tipo,

                    ruta:
                        ruta,

                    estado:
                        "ok"

                });

            }

            else{

                resultado.imagenes.push({

                    tipo:
                        tipo,

                    ruta:
                        ruta,

                    estado:
                        "imagen no subida"

                });

            }

        }


        return resultado;

    },


    /* ==================================================
       FUNCIÓN PRINCIPAL
    ================================================== */

    async buscar(j1){

        /*
        Normalizar código
        */

        j1 =
            String(j1)
            .trim()
            .toUpperCase();


        /*
        Comprobar excepción
        */

        if(
            !this.esExcepcion(j1)
        ){

            return {

                j1:
                    j1,

                excepcion:
                    false,

                imagenes:
                    [],

                mensaje:
                    "El código no pertenece a las excepciones."

            };

        }


        /*
        Resolver las tres imágenes
        */

        return await this.buscarExcepcion(
            j1
        );

    }

};


/*
========================================================
FIN BUSCARUTA v0.1
========================================================
*/
