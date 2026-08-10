/*
========================================================
PalEntropía
buscaruta.js v1.0 LTS

BUSCARUTA
Cargador universal de imágenes para el Generador

========================================================

FUNCIONES ACTUALES
--------------------------------------------------------

CASO 1 — EXCEPCIONES

001_12
002_04
003_14
004_14

Estas cuatro fichas tienen rutas físicas fijas
dentro de:

herramientas/multimedia/001_075/

No se construyen sus rutas.


CASO 2 — ARQUITECTURA ANTIGUA

001_01 → 001_15
002_01 → 002_15
003_01 → 003_15
004_01 → 004_15
005_01 → 005_15

EXCEPTO:

001_12
002_04
003_14
004_14


========================================================

FORMATOS ADMITIDOS

PNG
JPG
JPEG
WEBP

Orden de búsqueda:

PNG → JPG → JPEG → WEBP


========================================================

IMÁGENES

i0
i2
i3


========================================================

PRINCIPIOS

- No utiliza PALDB.
- Lee paleofichas.json para obtener j2.
- paleofichas.json se carga una sola vez.
- i0, i2 e i3 se buscan en paralelo.
- Cada imagen deja de buscarse en cuanto encuentra
  una extensión válida.
- Las imágenes inexistentes devuelven:
  "imagen no subida"
- No se generan errores 404 visibles al usuario.
- La arquitectura nueva se añadirá posteriormente.

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
       
       RUTAS FÍSICAS FIJAS
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
       
       El archivo se carga una sola vez.
    ================================================== */

    _datosJSON: null,

    _cargandoJSON: null,


    /* ==================================================
       COMPROBAR SI ES EXCEPCIÓN
    ================================================== */

    esExcepcion(j1){

        return Object.prototype.hasOwnProperty.call(

            this.excepciones,

            j1

        );

    },


    /* ==================================================
       COMPROBAR SI PERTENECE AL CASO 2
       
       001_01 → 005_15
    ================================================== */

    esCaso2(j1){

        /*
        Formato obligatorio:
        XXX_XX
        */

        if(
            !/^\d{3}_\d{2}$/.test(j1)
        ){

            return false;

        }


        /*
        Las excepciones quedan fuera.
        */

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
       
       CACHEADO
    ================================================== */

    async cargarJSON(){

        /*
        Ya cargado
        */

        if(
            this._datosJSON
        ){

            return this._datosJSON;

        }


        /*
        Carga en curso
        */

        if(
            this._cargandoJSON
        ){

            return this._cargandoJSON;

        }


        /*
        paleofichas.json está junto a buscaruta.js
        dentro de herramientas/generador/
        */

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
       
       Compatible con JSON en array u objeto.
    ================================================== */

    buscarRegistro(datos, j1){

        if(
            !datos
        ){

            return null;

        }


        /*
        ARRAY
        */

        if(
            Array.isArray(datos)
        ){

            for(
                const registro of datos
            ){

                if(
                    registro &&
                    typeof registro ===
                    "object"
                ){

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

        }


        /*
        OBJETO
        */

        if(
            typeof datos ===
            "object"
        ){

            /*
            Puede estar indexado directamente por j1.
            */

            if(
                datos[j1] &&
                typeof datos[j1] ===
                "object"
            ){

                return datos[j1];

            }


            /*
            Buscar dentro de sus valores.
            */

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


        return String(j2).trim();

    },


    /* ==================================================
       NORMALIZAR J2 PARA DIRECTORIO
       
       Ejemplo:
       
       Diplocaulus
       ↓
       diplocaulus
    ================================================== */

    normalizarDirectorio(nombre){

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
       NORMALIZAR NOMBRE DEL ARCHIVO
       
       Ejemplo:
       
       diplocaulus
       ↓
       Diplocaulus
    ================================================== */

    normalizarArchivo(nombre){

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
       CREAR RUTA DEL CASO 2
       
       Ejemplo:
       
       002_02
       Diplocaulus
       
       ↓
       
       ../../paleofichas/vol002/
       002_02_diplocaulus/
       Diplocaulus_i0.png
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
       COMPROBAR UNA IMAGEN
       
       No utiliza HEAD.
       
       Image() es suficiente para nuestro cargador.
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
       BUSCAR UNA IMAGEN
       
       PNG → JPG → JPEG → WEBP
       
       En cuanto encuentra una,
       deja de buscar.
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
       CONSTRUIR CANDIDATAS DE UNA IMAGEN
    ================================================== */

    crearCandidatas(

        j1,
        j2,
        tipo

    ){

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


        return rutas;

    },


    /* ==================================================
       BUSCAR LAS TRES IMÁGENES DEL CASO 2
       
       i0, i2 e i3 EN PARALELO
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
        Crear las tres búsquedas
        simultáneamente.
        */

        const promesas =

            this.imagenes.map(

                tipo => {

                    const rutas =

                        this.crearCandidatas(

                            j1,
                            j2,
                            tipo

                        );


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
       BUSCAR UNA EXCEPCIÓN
       
       Las rutas son fijas.
    ================================================== */

    async buscarExcepcion(

        j1

    ){

        const rutas =
            this.excepciones[j1];


        /*
        Las tres comprobaciones
        también se ejecutan en paralelo.
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
       FUNCIÓN PRINCIPAL
       
       Determina qué caso corresponde.
    ================================================== */

    async buscar(j1){

        /*
        Normalización mínima.
        */

        j1 =

            String(j1)

            .trim()

            .toUpperCase();


        /*
        ================================================
        CASO 1
        EXCEPCIONES
        ================================================
        */

        if(
            this.esExcepcion(j1)
        ){

            return await this.buscarExcepcion(
                j1
            );

        }


        /*
        ================================================
        CASO 2
        ARQUITECTURA ANTIGUA NORMAL
        ================================================
        */

        if(
            this.esCaso2(j1)
        ){

            return await this.buscarCaso2(
                j1
            );

        }


        /*
        ================================================
        CÓDIGO NO CONTEMPLADO
        ================================================
        */

        return {

            j1:
                j1,

            caso:
                "no contemplado",

            imagenes:
                [],

            error:
                "Código no contemplado por BUSCARUTA."

        };

    }

};


/*
========================================================
FIN BUSCARUTA v1.0 LTS
========================================================
*/
