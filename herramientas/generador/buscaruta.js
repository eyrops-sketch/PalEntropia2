/* ========================================================
   PalEntropía
   buscaruta.js v3.0 LTS

   BUSCARUTA
   Cargador universal de imágenes del Generador

   FUNCIÓN
   -------
   Determina la ubicación de las imágenes según j1
   y devuelve SIEMPRE URLs públicas absolutas.

   CASO 1 — EXCEPCIONES
   --------------------------------------------------------
   001_12
   002_04
   003_14
   004_14

   Ubicación pública:

   https://palentropia.es/herramientas/multimedia/001_075/

   CASO 2 — ARQUITECTURA ANTIGUA
   --------------------------------------------------------
   001_01 → 005_15

   Obtiene j2 desde:

   paleofichas.json

   Ubicación pública:

   https://palentropia.es/paleofichas/volXXX/

   CASO 3 — ARQUITECTURA NUEVA
   --------------------------------------------------------
   Códigos posteriores.

   Repositorio único:

   herramientas/multimedia/new/

   Ejemplo:

   https://palentropia.es/herramientas/multimedia/new/006_01_i0.jpg

   ========================================================

   FORMATOS:
   PNG → JPG → JPEG → WEBP

   IMÁGENES:
   i0
   i2
   i3

======================================================== */


/* ========================================================
   CONFIGURACIÓN GLOBAL
======================================================== */

window.BUSCARUTA = {

    /* ----------------------------------------------------
       DOMINIO PÚBLICO
    ---------------------------------------------------- */

    dominio:
        "https://palentropia.es",


    /* ----------------------------------------------------
       EXTENSIONES ADMITIDAS
    ---------------------------------------------------- */

    extensiones: [

        ".png",
        ".jpg",
        ".jpeg",
        ".webp"

    ],


    /* ----------------------------------------------------
       IMÁGENES A BUSCAR
    ---------------------------------------------------- */

    imagenes: [

        "i0",
        "i2",
        "i3"

    ],


    /* ====================================================
       EXCEPCIONES
    ==================================================== */

    excepciones: {

        "001_12": {

            i0:
                "/herramientas/multimedia/001_075/001_12_i0.jpg",

            i2:
                "/herramientas/multimedia/001_075/001_12_i2.jpg",

            i3:
                "/herramientas/multimedia/001_075/001_12_i3.jpg"

        },


        "002_04": {

            i0:
                "/herramientas/multimedia/001_075/002_04_i0.jpg",

            i2:
                "/herramientas/multimedia/001_075/002_04_i2.jpg",

            i3:
                "/herramientas/multimedia/001_075/002_04_i3.jpg"

        },


        "003_14": {

            i0:
                "/herramientas/multimedia/001_075/003_14_i0.jpg",

            i2:
                "/herramientas/multimedia/001_075/003_14_i2.jpg",

            i3:
                "/herramientas/multimedia/001_075/003_14_i3.jpg"

        },


        "004_14": {

            i0:
                "/herramientas/multimedia/001_075/004_14_i0.jpg",

            i2:
                "/herramientas/multimedia/001_075/004_14_i2.jpg",

            i3:
                "/herramientas/multimedia/001_075/004_14_i3.jpg"

        }

    },


    /* ====================================================
       CACHE JSON
    ==================================================== */

    _datosJSON:
        null,

    _cargandoJSON:
        null,


    /* ====================================================
       NORMALIZAR J1
    ==================================================== */

    normalizarJ1(j1){

        return String(j1 || "")
            .trim()
            .toUpperCase();

    },


    /* ====================================================
       CREAR URL ABSOLUTA
    ==================================================== */

    crearURL(ruta){

        if(!ruta){

            return null;

        }


        const texto =
            String(ruta).trim();


        if(!texto){

            return null;

        }


        /* ----------------------------------------------
           Ya es URL absoluta
        ---------------------------------------------- */

        if(
            texto.startsWith("http://") ||
            texto.startsWith("https://")
        ){

            return texto;

        }


        /* ----------------------------------------------
           Convertir ruta del sitio en URL absoluta
        ---------------------------------------------- */

        if(
            texto.startsWith("/")
        ){

            return (
                this.dominio +
                texto
            );

        }


        /* ----------------------------------------------
           Cualquier otra ruta
        ---------------------------------------------- */

        return (
            this.dominio +
            "/" +
            texto
        );

    },


    /* ====================================================
       ¿ES EXCEPCIÓN?
    ==================================================== */

    esExcepcion(j1){

        return Object.prototype.hasOwnProperty.call(
            this.excepciones,
            j1
        );

    },


    /* ====================================================
       ¿ES CASO 2?
       
       001_01 → 005_15
    ==================================================== */

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
                            "BUSCARUTA: no se pudo cargar paleofichas.json (" +
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
                            "BUSCARUTA: paleofichas.json no contiene un array válido."
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
       BUSCAR REGISTRO POR J1
    ==================================================== */

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
           ARRAY
        ---------------------------------------------- */

        if(
            Array.isArray(datos)
        ){

            for(
                const registro of datos
            ){

                if(
                    !registro ||
                    typeof registro !== "object"
                ){

                    continue;

                }


                const codigo =

                    registro.codigo ||

                    registro.j1;


                if(
                    codigo &&
                    this.normalizarJ1(codigo) === j1
                ){

                    return registro;

                }

            }


            return null;

        }


        /* ----------------------------------------------
           OBJETO
        ---------------------------------------------- */

        if(
            typeof datos === "object"
        ){

            if(
                datos[j1] &&
                typeof datos[j1] === "object"
            ){

                return datos[j1];

            }


            for(
                const clave of Object.keys(datos)
            ){

                const registro =
                    datos[clave];


                if(
                    !registro ||
                    typeof registro !== "object"
                ){

                    continue;

                }


                const codigo =

                    registro.codigo ||

                    registro.j1;


                if(
                    codigo &&
                    this.normalizarJ1(codigo) === j1
                ){

                    return registro;

                }

            }

        }


        return null;

    },


    /* ====================================================
       OBTENER J2
    ==================================================== */

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


        const nombre =

            registro.nombre ||

            registro.j2;


        if(
            nombre === undefined ||
            nombre === null
        ){

            return null;

        }


        return String(
            nombre
        ).trim();

    },


    /* ====================================================
       NORMALIZAR DIRECTORIO
    ==================================================== */

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


    /* ====================================================
       NORMALIZAR ARCHIVO
    ==================================================== */

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


    /* ====================================================
       CREAR RUTA CASO 2
    ==================================================== */

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


        const ruta =

            "/paleofichas/" +

            "vol" +

            volumen +

            "/" +

            j1 +

            "_" +

            directorio +

            "/" +

            archivo +

            "_" +

            tipo +

            extension;


        return this.crearURL(
            ruta
        );

    },


    /* ====================================================
       CREAR RUTA CASO 3
    ==================================================== */

    crearRutaCaso3(

        j1,
        tipo,
        extension

    ){

        const ruta =

            "/herramientas/multimedia/new/" +

            j1 +

            "_" +

            tipo +

            extension;


        return this.crearURL(
            ruta
        );

    },


    /* ====================================================
       COMPROBAR IMAGEN
    ==================================================== */

    comprobarImagen(
        ruta
    ){

        return new Promise(

            resolve => {

                if(
                    !ruta
                ){

                    resolve(false);

                    return;

                }


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


    /* ====================================================
       BUSCAR UNA IMAGEN
       
       PNG → JPG → JPEG → WEBP
    ==================================================== */

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
                "Imagen no subida"

        };

    },


    /* ====================================================
       CASO 1 — EXCEPCIONES
    ==================================================== */

    async buscarExcepcion(
        j1
    ){

        const definicion =
            this.excepciones[j1];


        const promesas =

            this.imagenes.map(

                tipo => {

                    const ruta =
                        definicion[tipo];


                    return (

                        this.comprobarImagen(
                            this.crearURL(ruta)
                        )

                        .then(

                            existe => ({

                                tipo:
                                    tipo,

                                ruta:
                                    existe
                                        ? this.crearURL(ruta)
                                        : null,

                                estado:
                                    existe
                                        ? "ok"
                                        : "Imagen no subida"

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


    /* ====================================================
       CASO 2 — ARQUITECTURA ANTIGUA
    ==================================================== */

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


    /* ====================================================
       CASO 3 — ARQUITECTURA NUEVA
    ==================================================== */

    async buscarCaso3(
        j1
    ){

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

                 
