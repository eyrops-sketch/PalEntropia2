/*
========================================================
PalEntropía
buscaruta.js v1.0 LTS

ADAPTADOR UNIVERSAL DE RUTAS DE IMAGEN

Función:

Recibe j1 del contenedor intermedio CSV y determina
la ruta de imagen correspondiente.

========================================================

CASO 1
--------------------------------------------------------

Códigos antiguos:

001_01 → 001_15
002_01 → 002_15
003_01 → 003_15
004_01 → 004_15
005_01 → 005_15

Proceso:

j1
 ↓
paleofichas.json
 ↓
j2
 ↓
ruta antigua

Ejemplo:

j1 = 002_02
j2 = Diplocaulus

Resultado:

paleofichas/vol002/002_02_diplocaulus/Diplocaulus_i2.png

Se comprueban:

.png
.jpg
.jpeg
.webp


========================================================

CASO 2
--------------------------------------------------------

Cualquier código que NO pertenezca al sistema antiguo.

Ejemplos:

005_17
016_02
076_01
150_15
151_01

Proceso:

j1
 ↓
herramientas/multimedia/index.html
 ↓
índices de bloques
 ↓
buscar una imagen cuyo nombre empiece por j1_
 ↓
devolver la primera imagen encontrada


Ejemplo:

j1 = 016_02

Encontrado:

herramientas/multimedia/076_150/016_02_i0.webp

Resultado:

esa ruta


========================================================

FORMATOS SOPORTADOS

.png
.jpg
.jpeg
.webp


========================================================
*/

window.BUSCARUTA_VERSION = "1.0 LTS";


window.BUSCARUTA = {


/* ======================================================
   CONFIGURACIÓN
====================================================== */

BASE_MULTIMEDIA:
    "../multimedia/",


EXTENSIONES:
    [
        ".png",
        ".jpg",
        ".jpeg",
        ".webp"
    ],


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
   DETERMINAR CASO

   CASO 1:

   001_01 → 005_15

   únicamente los 75 registros antiguos.

====================================================== */

esCaso1(j1){

    if(!this.validarJ1(j1)){

        return false;

    }


    let partes =
        String(j1)
        .trim()
        .split("_");


    let volumen =
        Number(partes[0]);


    let numero =
        Number(partes[1]);


    if(
        !Number.isFinite(volumen) ||
        !Number.isFinite(numero)
    ){

        return false;

    }


    return (

        volumen >= 1 &&
        volumen <= 5 &&

        numero >= 1 &&
        numero <= 15

    );

},


/* ======================================================
   OBTENER DATOS DEL JSON

   Archivo:

   herramientas/generador/paleofichas.json

====================================================== */

async obtenerPaleoficha(j1){

    try{

        let respuesta =
            await fetch(
                "paleofichas.json"
            );


        if(!respuesta.ok){

            return null;

        }


        let datos =
            await respuesta.json();


        /*
        Aceptar tanto:

        [
            {...},
            {...}
        ]

        como:

        {
            ...
        }
        */


        if(Array.isArray(datos)){

            let encontrada =
                datos.find(
                    elemento => {

                        return (
                            elemento &&
                            String(
                                elemento.j1 ||
                                elemento.codigo ||
                                elemento.codigo_j1 ||
                                ""
                            ).trim()
                            ===
                            String(j1).trim()
                        );

                    }
                );


            return encontrada || null;

        }


        /*
        Si el JSON es un objeto
        con registros internos.
        */

        if(
            datos &&
            typeof datos === "object"
        ){

            /*
            Buscar directamente por clave.
            */

            if(datos[j1]){

                return datos[j1];

            }


            /*
            Buscar dentro de los valores.
            */

            let valores =
                Object.values(
                    datos
                );


            let encontrada =
                valores.find(
                    elemento => {

                        return (
                            elemento &&
                            String(
                                elemento.j1 ||
                                elemento.codigo ||
                                elemento.codigo_j1 ||
                                ""
                            ).trim()
                            ===
                            String(j1).trim()
                        );

                    }
                );


            return encontrada || null;

        }


        return null;

    }

    catch(error){

        console.error(
            "BUSCARUTA: error leyendo paleofichas.json",
            error
        );

        return null;

    }

},


/* ======================================================
   OBTENER J2
====================================================== */

async obtenerNombre(j1){

    let ficha =
        await this.obtenerPaleoficha(
            j1
        );


    if(!ficha){

        return null;

    }


    /*
    j2 es el nombre oficial.
    */

    let nombre =
        ficha.j2 ||
        ficha.nombre;


    if(
        nombre === undefined ||
        nombre === null
    ){

        return null;

    }


    nombre =
        String(nombre).trim();


    if(nombre === ""){

        return null;

    }


    return nombre;

},


/* ======================================================
   NORMALIZAR NOMBRE DE CARPETA

   Ejemplo:

   Diplocaulus
   ↓
   diplocaulus

====================================================== */

nombreCarpeta(nombre){

    if(!nombre){

        return null;

    }


    return String(nombre)
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
        );

},


/* ======================================================
   NOMBRE PARA ARCHIVO

   Primera letra mayúscula.

   Ejemplo:

   diplocaulus
   ↓
   Diplocaulus

====================================================== */

nombreArchivo(nombre){

    if(!nombre){

        return null;

    }


    let texto =
        String(nombre)
        .trim();


    if(texto === ""){

        return null;

    }


    return (
        texto.charAt(0).toUpperCase()
        +
        texto.slice(1)
    );

},


/* ======================================================
   OBTENER VOLUMEN ANTIGUO

   001_01
   ↓
   vol001

   005_15
   ↓
   vol005

====================================================== */

obtenerVolumen(j1){

    let partes =
        String(j1)
        .split("_");


    if(partes.length !== 2){

        return null;

    }


    let volumen =
        partes[0];


    if(!/^\d{3}$/.test(volumen)){

        return null;

    }


    return (
        "vol"
        +
        volumen
    );

},


/* ======================================================
   BUSCAR EXTENSIÓN EN CASO 1

   No presupone que sea PNG.

====================================================== */

async comprobarImagenAntigua(
    carpeta,
    nombreArchivo
){

    for(
        let extension
        of this.EXTENSIONES
    ){

        let ruta =
            "paleofichas/"
            +
            carpeta.volumen
            +
            "/"
            +
            carpeta.j1
            +
            "_"
            +
            carpeta.nombreCarpeta
            +
            "/"
            +
            nombreArchivo
            +
            "_i2"
            +
            extension;


        try{

            let respuesta =
                await fetch(
                    ruta,
                    {
                        method:"HEAD"
                    }
                );


            if(
                respuesta.ok
            ){

                return ruta;

            }

        }

        catch(error){

            /*
            Continuar con
            la siguiente extensión.
            */

        }

    }


    return null;

},


/* ======================================================
   CASO 1

   Ruta antigua.

====================================================== */

async caso1(j1){

    let nombre =
        await this.obtenerNombre(
            j1
        );


    if(!nombre){

        return null;

    }


    let volumen =
        this.obtenerVolumen(
            j1
        );


    if(!volumen){

        return null;

    }


    let nombreCarpeta =
        this.nombreCarpeta(
            nombre
        );


    let nombreArchivo =
        this.nombreArchivo(
            nombre
        );


    if(
        !nombreCarpeta ||
        !nombreArchivo
    ){

        return null;

    }


    let datosCarpeta = {

        volumen:
            volumen,

        j1:
            j1,

        nombreCarpeta:
            nombreCarpeta

    };


    let ruta =
        await this.comprobarImagenAntigua(
            datosCarpeta,
            nombreArchivo
        );


    if(!ruta){

        return null;

    }


    return {

        caso:1,

        j1:j1,

        j2:nombre,

        ruta:ruta

    };

},


/* ======================================================
   OBTENER ÍNDICE MULTIMEDIA

   Archivo maestro:

   herramientas/multimedia/index.html

====================================================== */

async obtenerIndiceMultimedia(){

    try{

        let respuesta =
            await fetch(
                this.BASE_MULTIMEDIA
                +
                "index.html"
            );


        if(!respuesta.ok){

            return null;

        }


        return await respuesta.text();

    }

    catch(error){

        console.error(
            "BUSCARUTA: error leyendo índice multimedia",
            error
        );

        return null;

    }

},


/* ======================================================
   EXTRAER DIRECTORIOS DEL ÍNDICE MAESTRO

   Busca enlaces del tipo:

   001_075/
   076_150/
   151_225/

====================================================== */

extraerDirectorios(html){

    if(!html){

        return [];

    }


    let resultado = [];


    let regex =
        /href\s*=\s*["']([^"']+\/)["']/gi;


    let coincidencia;


    while(
        (
            coincidencia =
                regex.exec(html)
        ) !== null
    ){

        let ruta =
            coincidencia[1];


        /*
        Quedarnos solamente
        con directorios numéricos.
        */

        let nombre =
            ruta
            .replace(
                /\/$/,
                ""
            )
            .split("/")
            .pop();


        if(
            /^\d{3}_\d{3}$/.test(
                nombre
            )
        ){

            if(
                !resultado.includes(
                    nombre
                )
            ){

                resultado.push(
                    nombre
                );

            }

        }

    }


    return resultado;

},


/* ======================================================
   OBTENER ÍNDICE DE UN BLOQUE

   Ejemplo:

   076_150/index.html

====================================================== */

async obtenerIndiceBloque(
    directorio
){

    try{

        let respuesta =
            await fetch(
                this.BASE_MULTIMEDIA
                +
                directorio
                +
                "/index.html"
            );


        if(!respuesta.ok){

            return null;

        }


        return await respuesta.text();

    }

    catch(error){

        return null;

    }

},


/* ======================================================
   BUSCAR IMAGEN DENTRO DE UN ÍNDICE

   Busca:

   016_02_i0.png
   016_02_i2.jpg
   016_02_i3.jpeg
   016_02_ix.webp

   etc.

====================================================== */

extraerImagen(
    html,
    j1
){

    if(!html){

        return null;

    }


    /*
    Escapar j1 para expresión regular.
    */

    let codigo =
        String(j1)
        .replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    /*
    Buscar cualquier imagen
    que empiece exactamente por:

    j1_

    y termine en una extensión válida.
    */

    let regex =
        new RegExp(
            codigo
            +
            "_[^\"'<>\\s]+\\.(?:png|jpg|jpeg|webp)",
            "i"
        );


    let coincidencia =
        html.match(
            regex
        );


    if(!coincidencia){

        return null;

    }


    let archivo =
        coincidencia[0];


    /*
    Evitar devolver una ruta absoluta
    o una ruta externa.

    Nos interesa solamente
    el nombre del archivo.
    */

    archivo =
        archivo
        .split("/")
        .pop();


    return archivo;

},


/* ======================================================
   CASO 2

   Buscar j1 en todos los bloques multimedia.

====================================================== */

async caso2(j1){

    let htmlMaestro =
        await this.obtenerIndiceMultimedia();


    if(!htmlMaestro){

        return null;

    }


    let directorios =
        this.extraerDirectorios(
            htmlMaestro
        );


    /*
    Si el índice maestro no contiene
    directorios, no podemos continuar.
    */

    if(
        !Array.isArray(
            directorios
        ) ||
        directorios.length === 0
    ){

        return null;

    }


    /*
    Recorrer todos los bloques.

    En cuanto se encuentre
    una imagen válida se devuelve.

    No necesitamos más de una.
    */

    for(
        let directorio
        of directorios
    ){

        let htmlBloque =
            await this.obtenerIndiceBloque(
                directorio
            );


        if(!htmlBloque){

            continue;

        }


        let archivo =
            this.extraerImagen(
                htmlBloque,
                j1
            );


        if(!archivo){

            continue;

        }


        let ruta =
            this.BASE_MULTIMEDIA
            +
            directorio
            +
            "/"
            +
            archivo;


        return {

            caso:2,

            j1:j1,

            ruta:ruta

        };

    }


    return null;

},


/* ======================================================
   FUNCIÓN PRINCIPAL

   Entrada:

   j1

   Ejemplo:

   "002_02"

   o

   "016_02"

====================================================== */

async buscar(j1){

    if(!this.validarJ1(j1)){

        return {

            ok:false,

            error:
                "J1 no tiene un formato válido."

        };

    }


    j1 =
        String(j1)
        .trim();


    /*
    =====================================================
    CASO 1
    =====================================================
    */

    if(
        this.esCaso1(j1)
    ){

        let resultado1 =
            await this.caso1(
                j1
            );


        if(resultado1){

            return {

                ok:true,

                ...resultado1

            };

        }


        /*
        Si el registro pertenece
        al sistema antiguo pero
        la imagen no existe,
        no saltamos silenciosamente
        al caso 2.

        Esto permite detectar
        correctamente errores
        del sistema antiguo.
        */

        return {

            ok:false,

            caso:1,

            j1:j1,

            error:
                "El registro pertenece al sistema antiguo, pero no se encontró su imagen."

        };

    }


    /*
    =====================================================
    CASO 2
    =====================================================
    */

    let resultado2 =
        await this.caso2(
            j1
        );


    if(resultado2){

        return {

            ok:true,

            ...resultado2

        };

    }


    /*
    =====================================================
    NO ENCONTRADO
    =====================================================
    */

    return {

        ok:false,

        caso:2,

        j1:j1,

        error:
            "No se encontró ninguna imagen para este código en los índices multimedia."

    };

}


};


/*
========================================================
FIN BUSCARUTA v1.0 LTS
========================================================
*/




