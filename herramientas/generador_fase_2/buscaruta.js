/*
========================================================
PalEntropía
buscaruta.js v2.0 LTS

BUSCARUTA
Cargador universal de imágenes del Generador

========================================================

CASO 1 — EXCEPCIONES
--------------------------------------------------------

001_12
002_04
003_14
004_14

Rutas fijas:

herramientas/multimedia/001_075/


CASO 2 — ARQUITECTURA ANTIGUA
--------------------------------------------------------

001_01 → 005_15

EXCEPTO:

001_12
002_04
003_14
004_14

Obtiene j2 desde:

herramientas/generador/paleofichas.json


CASO 3 — ARQUITECTURA NUEVA
--------------------------------------------------------

Todo código posterior al Caso 2.

Repositorio único:

herramientas/multimedia/new/

Ejemplo:

006_01_i0.jpg
006_01_i2.jpg
006_01_i3.jpg

No utiliza j2.


========================================================

FORMATOS ADMITIDOS

PNG
JPG
JPEG
WEBP

Orden:

PNG → JPG → JPEG → WEBP


========================================================

IMÁGENES

i0
i2
i3


========================================================
*/


window.BUSCARUTA = {


    /* ==================================================
       CONFIGURACIÓN
    ================================================== */

    extensiones: [

        ".png",
        ".jpg",
        ".jpeg",
        ".webp"

    ],


    imagenes: [

        "i0",
        "i2",
        "i3"

    ],


    /* ==================================================
       EXCEPCIONES
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
       CACHE DEL JSON
    ================================================== */

    _datosJSON:
        null,

    _cargandoJSON:
        null,


    /* ==================================================
       ¿ES EXCEPCIÓN?
    ================================================== */

    esExcepcion(j1){

        return Object.prototype.hasOwnProperty.call(
            this.excepciones,
            j1
        );

    },


    /* ==================================================
       ¿ES CASO 2?
       
       001_01 → 005_15
    ================================================== */

    esCaso2(j1){

        if(
            !/^\d{3}_\d{2}$/.test(j1)
        ){

            return false;

        }


        if(
            this.esExcepcion(j1)
        ){

            return false;

        }


        const partes =
            j1.split("_");


        const volumen =
            Number(partes[0]);


        const ficha =
            Number(partes[1]);


        return (

            volumen >= 1 &&

            volumen <= 5 &&

            ficha >= 1 &&

            ficha <= 15

        );

    },


    /* ==================================================
       CARGAR PALEOFICHAS.JSON
       
       Solo se utiliza para el Caso 2.
       Se carga una sola vez.
    ================================================== */

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
                "paleofichas.json",
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
                            "No se pudo cargar paleofichas.json"
                        );

                    }


                    return respuesta.json();

                }

            )

            .then(

                datos => {

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


    /* ==================================================
       BUSCAR REGISTRO POR J1
    ================================================== */

    buscarRegistro(
        datos,
        j1
    ){

        if(
            !datos
        ){

            return null;

        }


        /* ----------------------------------------------
           JSON COMO ARRAY
        ---------------------------------------------- */

        if(
            Array.isArray(datos)
        ){

            for(
                const registro of datos
            ){

                if(
                    !registro ||
                    typeof registro !==
                    "object"
                ){

                    continue;

                }


                const codigo =

                    registro.j1 ||

                    registro.codigo;


                if(
                    codigo &&
                    String(codigo).trim() ===
                    j1
                ){

                    return registro;

                }

            }


            return null;

        }


        /* ----------------------------------------------
           JSON COMO OBJETO
        ---------------------------------------------- */

        if(
            typeof datos ===
            "object"
        ){

            if(
                datos[j1] &&
                typeof datos[j1] ===
                "object"
            ){

                return datos[j1];

            }


            for(
                const clave of
                Object.keys(datos)
            ){

                const registro =
                    datos[clave];


                if(
                    !registro ||
                    typeof registro !==
                    "object"
                ){

                    continue;

                }


                const codigo =

                    registro.j1 ||

                    registro.codigo;


                if(
                    codigo &&
                    String(codigo).trim() ===
                    j1
                ){

                    return registro;

                }

            }

        }


        return null;

    },


    /* ==================================================
       OBTENER J2
    ================================================== */

    async obtenerJ2(j1){

        const datos =
            await this.cargarJSON();


        const registro =

            this.buscarRegistro(
                datos,
                j1
            );


        if(
            !registro
        ){

            return null;

        }


        const j2 =

            registro.j2 ||

            registro.nombre;


        if(
            j2 === undefined ||
            j2 === null
        ){

            return null;

        }


        return String(
            j2
        ).trim();

    },


    /* ==================================================
       NORMALIZAR NOMBRE DE DIRECTORIO
    ================================================== */

    normalizarDirectorio(
        nombre
    ){

        return (

            String(nombre)

            .trim()

            .normalize("NFD")

            .replace(
                /[\u0300-\u036f]/g,
                ""
            )

            .toLowerCase()

            .replace(
                /[^a-z0-9]+/g,
                "_"
            )

            .replace(
                /^_+|_+$/g,
                ""
            )

        );

    },


    /* ==================================================
       NORMALIZAR NOMBRE DE ARCHIVO
    ================================================== */

    normalizarArchivo(
        nombre
    ){

        let texto =

            String(nombre)

            .trim()

            .normalize("NFD")

            .replace(
                /[\u0300-\u036f]/g,
                ""
            )

            .replace(
                /[^a-zA-Z0-9]+/g,
                "_"
            )

            .replace(
                /^_+|_+$/g,
                ""
            );


        if(
            !texto
        ){

            return "";

        }


        return (

            texto.charAt(0).toUpperCase()

            +

            texto.slice(1)

        );

    },


    /* ==================================================
       CREAR RUTA CASO 2
    ================================================== */

    crearRutaCaso2(

        j1,
        j2,
        tipo,
        extension

    ){

        const partes =
            j1.split("_");


        const volumen =
            partes[0];


        const directorio =

            this.normalizarDirectorio(
                j2
            );


        const archivo =

            this.normalizarArchivo(
                j2
            );


        if(
            !directorio ||
            !archivo
        ){

            return null;

        }


        return (

            "../../paleofichas/"

            +

            "vol"

            +

            volumen

            +

            "/"

            +

            j1

            +

            "_"

            +

            directorio

            +

            "/"

            +

            archivo

            +

            "_"

            +

            tipo

            +

            extension

        );

    },


    /* ==================================================
       CREAR RUTA CASO 3
       
       Ejemplo:
       
       006_01_i0.jpg
    ================================================== */

    crearRutaCaso3(

        j1,
        tipo,
        extension

    ){

        return (

            "../multimedia/new/"

            +

            j1

            +

            "_"

            +

            tipo

            +

            extension

        );

    },


    /* ==================================================
       COMPROBAR IMAGEN
    ================================================== */

    comprobarImagen(
        ruta
    ){

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
       BUSCAR UNA IMAGEN
       
       PNG → JPG → JPEG → WEBP
    ================================================== */

    async buscarImagen(
        rutas
    ){

        for(
            const ruta of rutas
        ){

            const existe =

                await this.comprobarImagen(
                    ruta
                );


            if(
                existe
            ){

                return {

                    ruta:
                        ruta,

                    estado:
                        "ok"

                };

            }

        }


        return {

            ruta:
                null,

            estado:
                "imagen no subida"

        };

    },


    /* ==================================================
       CASO 1 — EXCEPCIONES
    ================================================== */

    async buscarExcepcion(
        j1
    ){

        const rutas =
            this.excepciones[j1];


        /*
        Las tres imágenes
        se comprueban simultáneamente.
        */

        const promesas =

            this.imagenes.map(

                tipo => {

                    return (

                        this.comprobarImagen(
                            rutas[tipo]
                        )

                        .then(

                            existe => ({

                                tipo:
                                    tipo,

                                ruta:
                                    existe
                                        ? rutas[tipo]
                                        : null,

                                estado:
                                    existe
                                        ? "ok"
                                        : "imagen no subida"

                            })

                        )

                    );

                }

            );


        const imagenes =

            await Promise.all(
                promesas
            );


        return {

            j1:
                j1,

            caso:
                "excepcion",

            imagenes:
                imagenes

        };

    },


    /* ==================================================
       CASO 2 — ARQUITECTURA ANTIGUA
    ================================================== */

    async buscarCaso2(
        j1
    ){

        const j2 =
            await this.obtenerJ2(
                j1
            );


        if(
            !j2
        ){

            return {

                j1:
                    j1,

                caso:
                    "caso2",

                j2:
                    null,

                imagenes:
                    [],

                error:
                    "No se encontró j2 en paleofichas.json."

            };

        }


        /*
        Crear las cuatro posibilidades
        de cada imagen.
        */

        const promesas =

            this.imagenes.map(

                tipo => {

                    const rutas = [];


                    for(
                        const extension of
                        this.extensiones
                    ){

                        const ruta =

                            this.crearRutaCaso2(

                                j1,
                                j2,
                                tipo,
                                extension

                            );


                        if(
                            ruta
                        ){

                            rutas.push(
                                ruta
                            );

                        }

                    }


                    return (

                        this.buscarImagen(
                            rutas
                        )

                        .then(

                            resultado => ({

                                tipo:
                                    tipo,

                                ruta:
                                    resultado.ruta,

                                estado:
                                    resultado.estado

                            })

                        )

                    );

                }

            );


        const imagenes =

            await Promise.all(
                promesas
            );


        return {

            j1:
                j1,

            caso:
                "caso2",

            j2:
                j2,

            imagenes:
                imagenes

        };

    },


    /* ==================================================
       CASO 3 — ARQUITECTURA NUEVA
       
       Repositorio único:
       
       multimedia/new/
    ================================================== */

    async buscarCaso3(
        j1
    ){

        /*
        Las tres imágenes
        se buscan simultáneamente.
        */

        const promesas =

            this.imagenes.map(

                tipo => {

                    const rutas = [];


                    for(
                        const extension of
                        this.extensiones
                    ){

                        rutas.push(

                            this.crearRutaCaso3(

                                j1,
                                tipo,
                                extension

                            )

                        );

                    }


                    return (

                        this.buscarImagen(
                            rutas
                        )

                        .then(

                            resultado => ({

                                tipo:
                                    tipo,

                                ruta:
                                    resultado.ruta,

                                estado:
                                    resultado.estado

                            })

                        )

                    );

                }

            );


        const imagenes =

            await Promise.all(
                promesas
            );


        return {

            j1:
                j1,

            caso:
                "caso3",

            imagenes:
                imagenes

        };

    },


    /* ==================================================
       FUNCIÓN PRINCIPAL
       
       Determina el caso.
    ================================================== */

    async buscar(
        j1
    ){

        /*
        Normalización mínima.
        */

        j1 =

            String(j1)

            .trim()

            .toUpperCase();


        /* ----------------------------------------------
           CASO 1
        ---------------------------------------------- */

        if(
            this.esExcepcion(j1)
        ){

            return await this.buscarExcepcion(
                j1
            );

        }


        /* ----------------------------------------------
           CASO 2
        ---------------------------------------------- */

        if(
            this.esCaso2(j1)
        ){

            return await this.buscarCaso2(
                j1
            );

        }


        /* ----------------------------------------------
           CASO 3
           
           Nueva arquitectura.
        ---------------------------------------------- */

        if(
            /^\d{3}_\d{2}$/.test(j1)
        ){

            return await this.buscarCaso3(
                j1
            );

        }


        /* ----------------------------------------------
           NO CONTEMPLADO
        ---------------------------------------------- */

        return {

            j1:
                j1,

            caso:
                "no contemplado",

            imagenes:
                [],

            error:
                "Código j1 no válido."

        };

    }

};


/*
========================================================
FIN BUSCARUTA v2.0 LTS
========================================================
*/
    
