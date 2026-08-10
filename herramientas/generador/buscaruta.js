/*
========================================================
PalEntropía
buscaruta.js v1.6 LTS

ADAPTADOR DE RUTAS — ARQUITECTURA ANTIGUA

CASO 1
--------------------------------------------------------
001_01 → 005_15

Lee:

herramientas/generador/paleofichas.json

Obtiene:

j1 → j2

Y construye las rutas de las imágenes antiguas.

Imágenes:

i0
i2
i3

Extensiones:

png
jpg
jpeg
webp


EXCEPCIONES
--------------------------------------------------------

Las siguientes cuatro fichas NO utilizan j2
para construir la ruta.

Se buscan exclusivamente en:

herramientas/multimedia/001_075/

001_12
002_04
003_14
004_14

Formato físico:

001_012_i0.jpg
001_012_i2.jpg
001_012_i3.jpg

etc.

Si una imagen de una excepción no existe:

NO se devuelve ERROR.

Se devuelve información:

"Subir imagen al directorio 001_075"


IMPORTANTE
--------------------------------------------------------

PALDB NO SE UTILIZA.

La arquitectura nueva todavía NO se procesa aquí.

========================================================
*/

window.BUSCARUTA_VERSION = "1.6 LTS";


window.BUSCARUTA = {


/* ======================================================
   CONFIGURACIÓN
====================================================== */

EXTENSIONES: [

    ".png",
    ".jpg",
    ".jpeg",
    ".webp"

],


IMAGENES: [

    "i0",
    "i2",
    "i3"

],


/* ======================================================
   EXCEPCIONES
====================================================== */

EXCEPCIONES: {

    "001_12": true,

    "002_04": true,

    "003_14": true,

    "004_14": true

},


/* ======================================================
   DIRECTORIO FIJO DE EXCEPCIONES
====================================================== */

DIRECTORIO_EXCEPCIONES:

    "../multimedia/001_075/",


/* ======================================================
   VALIDAR J1
====================================================== */

validarJ1(j1){

    if(
        j1 === undefined ||
        j1 === null
    ){

        return false;

    }


    return /^\d{3}_\d{2}$/.test(

        String(j1).trim()

    );

},


/* ======================================================
   COMPROBAR SI ES CASO 1
====================================================== */

esCaso1(j1){

    if(
        !this.validarJ1(j1)
    ){

        return false;

    }


    let partes =

        String(j1)
        .trim()
        .split("_");


    let volumen =

        Number(
            partes[0]
        );


    let numero =

        Number(
            partes[1]
        );


    return (

        Number.isFinite(volumen) &&

        Number.isFinite(numero) &&

        volumen >= 1 &&

        volumen <= 5 &&

        numero >= 1 &&

        numero <= 15

    );

},


/* ======================================================
   CARGAR PALEOFICHAS.JSON
====================================================== */

async cargarPaleofichas(){

    try{

        let respuesta =

            await fetch(

                "paleofichas.json",

                {
                    cache:"no-store"
                }

            );


        if(
            !respuesta.ok
        ){

            console.error(

                "BUSCARUTA: no se pudo cargar paleofichas.json"

            );

            return null;

        }


        return await respuesta.json();

    }

    catch(error){

        console.error(

            "BUSCARUTA: error cargando paleofichas.json",

            error

        );

        return null;

    }

},


/* ======================================================
   BUSCAR REGISTRO

   Permite localizar j1 aunque el JSON
   esté organizado como array u objeto.

====================================================== */

buscarRegistro(
    datos,
    j1
){

    if(
        datos === null ||
        datos === undefined
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
            let elemento of datos
        ){

            let encontrado =

                this.buscarRegistro(
                    elemento,
                    j1
                );


            if(
                encontrado
            ){

                return encontrado;

            }

        }


        return null;

    }


    /*
    OBJETO
    */

    if(
        typeof datos === "object"
    ){

        let codigo =

            datos.j1 ||
            datos.codigo ||
            datos.codigo_j1;


        if(

            codigo !== undefined &&

            String(codigo).trim() ===
            String(j1).trim()

        ){

            return datos;

        }


        for(
            let clave of
            Object.keys(datos)
        ){

            let encontrado =

                this.buscarRegistro(
                    datos[clave],
                    j1
                );


            if(
                encontrado
            ){

                return encontrado;

            }

        }

    }


    return null;

},


/* ======================================================
   OBTENER J2
====================================================== */

async obtenerNombre(j1){

    let datos =

        await this.cargarPaleofichas();


    if(
        !datos
    ){

        return null;

    }


    let registro =

        this.buscarRegistro(
            datos,
            j1
        );


    if(
        !registro
    ){

        console.error(

            "BUSCARUTA: no se encontró el registro:",
            j1

        );

        return null;

    }


    let nombre =

        registro.j2 ||
        registro.nombre;


    if(
        nombre === undefined ||
        nombre === null
    ){

        return null;

    }


    nombre =

        String(nombre).trim();


    if(
        nombre === ""
    ){

        return null;

    }


    return nombre;

},


/* ======================================================
   NORMALIZAR NOMBRE PARA DIRECTORIO

   Ejemplo:

   Diplocaulus
   ↓
   diplocaulus

====================================================== */

nombreDirectorio(nombre){

    if(
        !nombre
    ){

        return null;

    }


    return (

        String(nombre)

        .trim()

        .toLowerCase()

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

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


/* ======================================================
   NORMALIZAR NOMBRE PARA ARCHIVO

   Primera letra mayúscula.

   Ejemplo:

   diplocaulus
   ↓
   Diplocaulus

====================================================== */

nombreArchivo(nombre){

    if(
        !nombre
    ){

        return null;

    }


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
        texto === ""
    ){

        return null;

    }


    return (

        texto.charAt(0).toUpperCase()

        +

        texto.slice(1)

    );

},


/* ======================================================
   OBTENER VOLUMEN
====================================================== */

obtenerVolumen(j1){

    let partes =

        String(j1)
        .split("_");


    if(
        partes.length !== 2
    ){

        return null;

    }


    return (

        "vol"

        +

        partes[0]

    );

},


/* ======================================================
   CREAR RUTA ANTIGUA
====================================================== */

crearRutaAntigua(

    j1,

    nombre,

    tipo,

    extension

){

    let volumen =

        this.obtenerVolumen(
            j1
        );


    let directorio =

        this.nombreDirectorio(
            nombre
        );


    let archivo =

        this.nombreArchivo(
            nombre
        );


    if(
        !volumen ||
        !directorio ||
        !archivo
    ){

        return null;

    }


    return (

        "../../paleofichas/"

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


/* ======================================================
   COMPROBAR IMAGEN

   Utiliza Image()

   No utiliza HEAD.

====================================================== */

comprobarImagen(ruta){

    return new Promise(

        resolve => {

            let imagen =
                new Image();


            imagen.onload = () => {

                resolve(true);

            };


            imagen.onerror = () => {

                resolve(false);

            };


            imagen.src = ruta;

        }

    );

},


/* ======================================================
   BUSCAR PRIMERA EXTENSIÓN VÁLIDA

   Orden:

   PNG
   JPG
   JPEG
   WEBP

====================================================== */

async buscarPrimeraExtension(
    rutas
){

    for(
        let ruta of rutas
    ){

        let existe =

            await this.comprobarImagen(
                ruta
            );


        if(
            existe
        ){

            return ruta;

        }

    }


    return null;

},


/* ======================================================
   RESOLVER UNA IMAGEN NORMAL

   i0 / i2 / i3

====================================================== */

async resolverImagenNormal(

    j1,

    nombre,

    tipo

){

    let rutas = [];


    for(
        let extension of
        this.EXTENSIONES
    ){

        let ruta =

            this.crearRutaAntigua(

                j1,

                nombre,

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


    return this.buscarPrimeraExtension(
        rutas
    );

},


/* ======================================================
   RESOLVER CASO 1 NORMAL

   Las tres imágenes se buscan
   simultáneamente.

====================================================== */

async resolverCaso1Normal(

    j1,

    nombre

){

    let promesas = [];


    for(
        let tipo of
        this.IMAGENES
    ){

        promesas.push(

            this.resolverImagenNormal(

                j1,

                nombre,

                tipo

            )

        );

    }


    let resultados =

        await Promise.all(
            promesas
        );


    return resultados.filter(

        ruta =>

            ruta !== null

    );

},


/* ======================================================
   CREAR RUTA DE EXCEPCIÓN

   Ejemplo:

   004_14

   ↓

   004_014_i0.jpg

====================================================== */

crearRutaExcepcion(

    j1,

    tipo,

    extension

){

    let partes =

        String(j1)
        .split("_");


    if(
        partes.length !== 2
    ){

        return null;

    }


    let volumen =

        partes[0];


    let numero =

        Number(
            partes[1]
        );


    if(
        !Number.isFinite(numero)
    ){

        return null;

    }


    /*
    El número de ficha se convierte
    a tres dígitos.

    14 → 014
    4  → 004
    */

    let numeroFormateado =

        String(numero)
        .padStart(
            3,
            "0"
        );


    /*
    Ejemplo:

    004_14

    ↓

    004_014_i0.jpg

    */

    let archivo =

        volumen

        +

        "_"

        +

        numeroFormateado

        +

        "_"

        +

        tipo

        +

        extension;


    return (

        this.DIRECTORIO_EXCEPCIONES

        +

        archivo

    );

},


/* ======================================================
   RESOLVER UNA IMAGEN DE EXCEPCIÓN
====================================================== */

async resolverImagenExcepcion(

    j1,

    tipo

){

    let rutas = [];


    for(
        let extension of
        this.EXTENSIONES
    ){

        let ruta =

            this.crearRutaExcepcion(

                j1,

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


    let encontrada =

        await this.buscarPrimeraExtension(
            rutas
        );


    return encontrada;

},


/* ======================================================
   RESOLVER EXCEPCIÓN

   Devuelve imágenes encontradas
   y avisos informativos para
   las que falten.

====================================================== */

async resolverExcepcion(j1){

    let promesas = [];


    for(
        let tipo of
        this.IMAGENES
    ){

        promesas.push(

            this.resolverImagenExcepcion(

                j1,

                tipo

            )

        );

    }


    let resultados =

        await Promise.all(
            promesas
        );


    let imagenes = [];


    let informacion = [];


    for(
        let i = 0;
        i < this.IMAGENES.length;
        i++
    ){

        let tipo =
            this.IMAGENES[i];


        let ruta =
            resultados[i];


        if(
            ruta
        ){

            imagenes.push(
                ruta
            );

        }

        else{

            informacion.push({

                tipo:tipo,

                mensaje:
                    "Subir imagen al directorio 001_075",

                directorio:
                    "001_075"

            });

        }

    }


    return {

        imagenes:
            imagenes,

        informacion:
            informacion

    };

},


/* ======================================================
   FUNCIÓN PRINCIPAL

====================================================== */

async buscar(j1){

    /*
    VALIDACIÓN
    */

    if(
        !this.validarJ1(j1)
    ){

        return {

            ok:false,

            j1:j1,

            imagenes:[],

            informacion:[],

            error:
                "El código j1 no tiene un formato válido."

        };

    }


    j1 =

        String(j1).trim();


    /*
    =====================================================
    EXCEPCIONES
    =====================================================

    Se comprueban ANTES del caso normal.

    No se utiliza j2.

    No se busca en ninguna otra carpeta.

    */

    if(
        this.EXCEPCIONES[j1]
    ){

        let resultado =

            await this.resolverExcepcion(
                j1
            );


        return {

            ok:

                resultado.imagenes.length > 0,

            caso:
                "excepcion",

            j1:
                j1,

            imagenes:
                resultado.imagenes,

            informacion:
                resultado.informacion

        };

    }


    /*
    =====================================================
    CASO 1 NORMAL
    =====================================================
    */

    if(
        this.esCaso1(j1)
    ){

        let nombre =

            await this.obtenerNombre(
                j1
            );


        if(
            !nombre
        ){

            return {

                ok:false,

                caso:1,

                j1:j1,

                imagenes:[],

                informacion:[],

                error:
                    "No se encontró j2 para " +
                    j1

            };

        }


        let imagenes =

            await this.resolverCaso1Normal(

                j1,

                nombre

            );


        return {

            ok:
                imagenes.length > 0,

            caso:
                1,

            j1:
                j1,

            j2:
                nombre,

            imagenes:
                imagenes,

            informacion:[]

        };

    }


    /*
    =====================================================
    FUERA DEL CASO 1
    =====================================================
    */

    return {

        ok:false,

        j1:j1,

        imagenes:[],

        informacion:[],

        error:
            "El código no pertenece todavía a la arquitectura antigua."

    };

}


};


/*
========================================================
FIN BUSCARUTA v1.6 LTS
========================================================
*/
