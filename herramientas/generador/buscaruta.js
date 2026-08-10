/*
========================================================
PalEntropía
buscaruta.js v1.1 LTS

ADAPTADOR UNIVERSAL DE RUTAS DE IMAGEN

CASO 1 — ARQUITECTURA ANTIGUA
--------------------------------

001_01 → 005_15

Lee:

herramientas/generador/paleofichas.json

j1 → j2

Ejemplo:

j1 = 003_01
j2 = Nombre

Ruta:

paleofichas/vol003/003_01_nombre/Nombre_i0.png
paleofichas/vol003/003_01_nombre/Nombre_i2.png
paleofichas/vol003/003_01_nombre/Nombre_i3.png


IMPORTANTE:

DIRECTORIO:
- nombre completamente en minúsculas

ARCHIVO:
- primera letra mayúscula
- resto conserva el nombre de j2


CASO 2 — ARQUITECTURA NUEVA
--------------------------------

Busca j1 dentro de:

herramientas/multimedia/

Ejemplo:

016_02

Busca:

016_02_i0.xxx
016_02_i2.xxx
016_02_i3.xxx


FORMATOS:

.png
.jpg
.jpeg
.webp


========================================================
*/

window.BUSCARUTA_VERSION = "1.1 LTS";


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


IMAGENES:
    [
        "i0",
        "i2",
        "i3"
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
   DETERMINAR CASO 1

   001_01 → 005_15
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
   LEER PALEOFICHAS.JSON

   j1 → j2
====================================================== */

async obtenerPaleoficha(j1){

    try{

        let respuesta =
            await fetch(
                "paleofichas.json"
            );


        if(
            !respuesta.ok
        ){

            return null;

        }


        let datos =
            await respuesta.json();


        /*
        CASO ARRAY
        */

        if(
            Array.isArray(datos)
        ){

            let encontrada =
                datos.find(
                    elemento => {

                        if(
                            !elemento
                        ){

                            return false;

                        }


                        let codigo =
                            elemento.j1 ||
                            elemento.codigo ||
                            elemento.codigo_j1;


                        return (
                            String(codigo)
                            .trim()
                            ===
                            String(j1)
                            .trim()
                        );

                    }
                );


            return encontrada || null;

        }


        /*
        CASO OBJETO
        */

        if(
            datos &&
            typeof datos ===
            "object"
        ){

            /*
            Buscar por clave j1.
            */

            if(
                datos[j1]
            ){

                return datos[j1];

            }


            /*
            Buscar entre valores.
            */

            let valores =
                Object.values(
                    datos
                );


            let encontrada =
                valores.find(
                    elemento => {

                        if(
                            !elemento
                        ){

                            return false;

                        }


                        let codigo =
                            elemento.j1 ||
                            elemento.codigo ||
                            elemento.codigo_j1;


                        return (
                            String(codigo)
                            .trim()
                            ===
                            String(j1)
                            .trim()
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


    if(
        !ficha
    ){

        return null;

    }


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
        String(nombre)
        .trim();


    if(
        nombre === ""
    ){

        return null;

    }


    return nombre;

},


/* ======================================================
   NOMBRE PARA DIRECTORIO

   IMPORTANTE:

   Todo en minúsculas.

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

   IMPORTANTE:

   Primera letra MAYÚSCULA.

   No convertir el resto
   a minúsculas.

   Diplocaulus
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
        .trim();


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

   003_01
   ↓
   vol003
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


    let volumen =
        partes[0];


    if(
        !/^\d{3}$/.test(
            volumen
        )
    ){

        return null;

    }


    return (
        "vol"
        +
        volumen
    );

},


/* ======================================================
   COMPROBAR UNA IMAGEN

   Se prueba con HEAD.

====================================================== */

async comprobarImagen(ruta){

    try{

        let respuesta =
            await fetch(
                ruta,
                {
                    method:"HEAD"
                }
            );


        return respuesta.ok;

    }

    catch(error){

        return false;

    }

},


/* ======================================================
   CASO 1

   BUSCAR i0 / i2 / i3

   Ejemplo:

   paleofichas/vol003/
   003_01_nombre/
   Nombre_i0.png

====================================================== */

async caso1(j1){

    let nombre =
        await this.obtenerNombre(
            j1
        );


    if(
        !nombre
    ){

        return null;

    }


    let volumen =
        this.obtenerVolumen(
            j1
        );


    if(
        !volumen
    ){

        return null;

    }


    let nombreDirectorio =
        this.nombreDirectorio(
            nombre
        );


    let nombreArchivo =
        this.nombreArchivo(
            nombre
        );


    if(
        !nombreDirectorio ||
        !nombreArchivo
    ){

        return null;

    }


    let imagenes = [];


    /*
    =====================================================
    BUSCAR i0 / i2 / i3
    =====================================================
    */

    for(
        let tipo
        of this.IMAGENES
    ){

        let encontrada =
            null;


        /*
        Probar todas las extensiones.
        */

        for(
            let extension
            of this.EXTENSIONES
        ){

            let ruta =
                "paleofichas/"
                +
                volumen
                +
                "/"
                +
                j1
                +
                "_"
                +
                nombreDirectorio
                +
                "/"
                +
                nombreArchivo
                +
                "_"
                +
                tipo
                +
                extension;


            let existe =
                await this.comprobarImagen(
                    ruta
                );


            if(
                existe
            ){

                encontrada =
                    ruta;

                break;

            }

        }


        /*
        Si existe la imagen,
        añadirla.
        */

        if(
            encontrada
        ){

            imagenes.push(
                encontrada
            );

        }

    }


    /*
    =====================================================
    RESULTADO
    =====================================================
    */

    if(
        imagenes.length === 0
    ){

        return null;

    }


    return {

        caso:1,

        arquitectura:
            "antigua",

        j1:j1,

        j2:nombre,

        imagenes:imagenes

    };

},


/* ======================================================
   OBTENER ÍNDICE MAESTRO MULTIMEDIA
====================================================== */

async obtenerIndiceMultimedia(){

    try{

        let respuesta =
            await fetch(
                this.BASE_MULTIMEDIA
                +
                "index.html"
            );


        if(
            !respuesta.ok
        ){

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
   EXTRAER DIRECTORIOS

   Ejemplo:

   001_075/
   076_150/

====================================================== */

extraerDirectorios(html){

    if(
        !html
    ){

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
   OBTENER ÍNDICE DEL BLOQUE
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


        if(
            !respuesta.ok
        ){

            return null;

        }


        return await respuesta.text();

    }

    catch(error){

        return null;

    }

},


/* ======================================================
   EXTRAER TODAS LAS IMÁGENES DE UN J1

   Busca:

   016_02_i0.xxx
   016_02_i2.xxx
   016_02_i3.xxx

====================================================== */

extraerImagenes(
    html,
    j1
){

    if(
        !html
    ){

        return [];

    }


    let resultado = [];


    /*
    Escapar j1 para RegExp.
    */

    let codigo =
        String(j1)
        .replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    /*
    Buscar cualquier archivo:

    j1_i0.xxx
    j1_i2.xxx
    j1_i3.xxx

    Se permiten las cuatro extensiones.
    */

    let regex =
        new RegExp(
            codigo
            +
            "_(i0|i2|i3)"
            +
            "\\.(png|jpg|jpeg|webp)",
            "gi"
        );


    let coincidencia;


    while(
        (
            coincidencia =
                regex.exec(html)
        ) !== null
    ){

        let archivo =
            coincidencia[0];


        if(
            !resultado.includes(
                archivo
            )
        ){

            resultado.push(
                archivo
            );

        }

    }


    /*
    Ordenar siempre:

    i0
    i2
    i3
    */

    resultado.sort(
        (a,b) => {

            let orden = {

                i0:0,
                i2:1,
                i3:2

            };


            let ia =
                a.match(
                    /_(i0|i2|i3)\./i
                );


            let ib =
                b.match(
                    /_(i0|i2|i3)\./i
                );


            return (
                orden[
                    ia[1].toLowerCase()
                ]
                -
                orden[
                    ib[1].toLowerCase()
                ]
            );

        }
    );


    return resultado;

},


/* ======================================================
   CASO 2

   BUSCAR EN TODOS LOS BLOQUES
====================================================== */

async caso2(j1){

    let htmlMaestro =
        await this.obtenerIndiceMultimedia();


    if(
        !htmlMaestro
    ){

        return null;

    }


    let directorios =
        this.extraerDirectorios(
            htmlMaestro
        );


    if(
        directorios.length === 0
    ){

        return null;

    }


    /*
    Buscar bloque por bloque.

    En cuanto encontremos
    al menos una imagen,
    terminamos.

    Solo necesitamos una carpeta
    válida para ese j1.
    */

    for(
        let directorio
        of directorios
    ){

        let htmlBloque =
            await this.obtenerIndiceBloque(
                directorio
            );


        if(
            !htmlBloque
        ){

            continue;

        }


        let archivos =
            this.extraerImagenes(
                htmlBloque,
                j1
            );


        if(
            archivos.length === 0
        ){

            continue;

        }


        let imagenes =
            archivos.map(
                archivo => {

                    return (
                        this.BASE_MULTIMEDIA
                        +
                        directorio
                        +
                        "/"
                        +
                        archivo
                    );

                }
            );


        return {

            caso:2,

            arquitectura:
                "nueva",

            j1:j1,

            imagenes:imagenes

        };

    }


    return null;

},


/* ======================================================
   FUNCIÓN PRINCIPAL

   Entrada:

   j1

====================================================== */

async buscar(j1){

    if(
        !this.validarJ1(j1)
    ){

        return {

            ok:false,

            error:
                "J1 no tiene un formato válido."

        };

    }


    /*
    IMPORTANTE:

    NO modificar mayúsculas/minúsculas
    de j1.

    El código debe conservarse
    exactamente como:

    003_01
    016_02

    etc.
    */

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


        if(
            resultado1
        ){

            return {

                ok:true,

                ...resultado1

            };

        }


        return {

            ok:false,

            caso:1,

            arquitectura:
                "antigua",

            j1:j1,

            imagenes:[],

            error:
                "El registro pertenece a la arquitectura antigua, pero no se encontraron imágenes."

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


    if(
        resultado2
    ){

        return {

            ok:true,

            ...resultado2

        };

    }


    return {

        ok:false,

        caso:2,

        arquitectura:
            "nueva",

        j1:j1,

        imagenes:[],

        error:
            "No se encontró ninguna imagen para este código en los índices multimedia."

    };

}


};


/*
========================================================
FIN BUSCARUTA v1.1 LTS
========================================================
*/
