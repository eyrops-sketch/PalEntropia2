/*
========================================================
PalEntropía
buscaruta.js v0.2

BUSCARUTA — PRUEBA INICIAL

FUNCIONAMIENTO
--------------------------------------------------------
Recibe j1.

Comprueba si pertenece a una de las cuatro
excepciones conocidas.

Cada excepción tiene sus TRES rutas escritas
directamente.

No construye rutas.

No utiliza PALDB.

No utiliza j2.

No busca otras extensiones.

No busca otras carpetas.

Si la imagen existe:
    estado = "ok"

Si no existe:
    estado = "imagen no subida"

========================================================
*/

window.BUSCARUTA = {


    /* ==================================================
       RUTAS FIJAS
    ================================================== */

    excepciones: {

        "001_12": {

            i0:
                "../multimedia/001_075/001_12_i0.jpg",

            i2:
                "../multimedia/001_075/001_12_i2.jpg",

            i3:
                "../multimedia/001_075/001_12_i3.jpg"

        },


        "002_04": {

            i0:
                "../multimedia/001_075/002_04_i0.jpg",

            i2:
                "../multimedia/001_075/002_04_i2.jpg",

            i3:
                "../multimedia/001_075/002_04_i3.jpg"

        },


        "003_14": {

            i0:
                "../multimedia/001_075/003_14_i0.jpg",

            i2:
                "../multimedia/001_075/003_14_i2.jpg",

            i3:
                "../multimedia/001_075/003_14_i3.jpg"

        },


        "004_14": {

            i0:
                "../multimedia/001_075/004_14_i0.jpg",

            i2:
                "../multimedia/001_075/004_14_i2.jpg",

            i3:
                "../multimedia/001_075/004_14_i3.jpg"

        }

    },


    /* ==================================================
       COMPROBAR EXCEPCIÓN
    ================================================== */

    esExcepcion(j1){

        return Object.prototype.hasOwnProperty.call(
            this.excepciones,
            j1
        );

    },


    /* ==================================================
       COMPROBAR IMAGEN
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
       BUSCAR LAS TRES IMÁGENES
    ================================================== */

    async buscarExcepcion(j1){

        const rutas =
            this.excepciones[j1];


        const resultado = {

            j1:
                j1,

            caso:
                "excepcion",

            imagenes:
                []

        };


        /*
        i0
        i2
        i3
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


            resultado.imagenes.push({

                tipo:
                    tipo,

                ruta:
                    ruta,

                estado:
                    existe
                        ? "ok"
                        : "imagen no subida"

            });

        }


        return resultado;

    },


    /* ==================================================
       FUNCIÓN PRINCIPAL
    ================================================== */

    async buscar(j1){

        /*
        Normalización mínima
        */

        j1 =
            String(j1)
            .trim()
            .toUpperCase();


        /*
        Determinar caso
        */

        if(
            !this.esExcepcion(j1)
        ){

            return {

                j1:
                    j1,

                caso:
                    "desconocido",

                imagenes:
                    [],

                mensaje:
                    "Código no contemplado."

            };

        }


        /*
        Resolver las tres rutas
        */

        return await this.buscarExcepcion(
            j1
        );

    }

};


/*
========================================================
FIN BUSCARUTA v0.2
========================================================
*/
