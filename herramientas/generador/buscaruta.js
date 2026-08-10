/*
========================================================
PalEntropía
buscaruta.js v1.2 LTS

ADAPTADOR UNIVERSAL DE RUTAS DE IMÁGENES

ARQUITECTURA ANTIGUA
--------------------

001_01 → 005_15

Lee:

paleofichas.json

j1 → j2

Ejemplo:

002_12
↓
j2

Construye:

paleofichas/vol002/002_12_nombre/Nombre_i0.png
paleofichas/vol002/002_12_nombre/Nombre_i2.png
paleofichas/vol002/002_12_nombre/Nombre_i3.png


ARQUITECTURA NUEVA
------------------

Cualquier j1 fuera del bloque antiguo.

Busca en:

herramientas/multimedia/

Bloques:

001_075
076_150
etc.

Ejemplo:

016_02_i0.webp
016_02_i2.webp
016_02_i3.webp


EXTENSIONES:

.png
.jpg
.jpeg
.webp

========================================================
*/

window.BUSCARUTA_VERSION = "1.2 LTS";


window.BUSCARUTA = {


/* ======================================================
   CONFIGURACIÓN
====================================================== */

EXTENSIONES:[
    ".png",
    ".jpg",
    ".jpeg",
    ".webp"
],

IMAGENES:[
    "i0",
    "i2",
    "i3"
],

BASE_MULTIMEDIA:
    "../multimedia/",


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
   CASO 1

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
            "BUSCARUTA: error leyendo paleofichas.json",
            error
        );

        return null;

    }

},


/* ======================================================
   BUSCAR REGISTRO RECURSIVAMENTE

   Permite:

   [
      {...},
      {...}
   ]

   o:

   {
      fichas:[...]
   }

   o:

   {
      datos:[...]
   }

====================================================== */

buscarRegistro(datos,j1){

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

        /*
        COMPROBAR ESTE OBJETO
        */

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


        /*
        BUSCAR DENTRO DE SUS PROPIEDADES
        */

        for(
            let clave of Object.keys(datos)
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
            "BUSCARUTA: no se encontró j1 en paleofichas.json:",
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
   NOMBRE DEL DIRECTORIO

   j2:

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
   NOMBRE DEL ARCHIVO

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
        String(nombre).trim();


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
   VOLUMEN

   002_12
   ↓
   vol002
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
   COMPROBAR IMAGEN

   GET en lugar de HEAD.

   Esto evita problemas con servidores
   que no responden correctamente a HEAD.

====================================================== */

async comprobarImagen(ruta){

    try{

        let respuesta =
            await fetch(
                ruta,
                {
                    method:"GET",
                    cache:"no-store"
                }
            );


        if(
            !respuesta.ok
        ){

            return false;

        }


        /*
        La imagen existe.
        No necesitamos descargarla
        completamente para esta comprobación.
        */

        return true;

    }

    catch(error){

        return false;

    }

},


/* ======================================================
   CASO 1

   ARQUITECTURA ANTIGUA
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


    let imagenes = [];


    /*
    i0
    i2
    i3
    */

    for(
        let tipo of this.IMAGENES
    ){

        for(
            let extension of this.EXTENSIONES
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
                extension;


            let existe =
                await this.comprobarImagen(
                    ruta
                );


            if(
                existe
            ){

                imagenes.push(
                    ruta
                );

                break;

            }

        }

    }


    if(
        imagenes.length === 0
    ){

        return null;

    }


    return {

        caso:1,

        arquitectura:"antigua",

        j1:j1,

        j2:nombre,

        imagenes:imagenes

    };

},


/* ======================================================
   LEER ÍNDICE MULTIMEDIA
====================================================== */

async obtenerIndiceMultimedia(){

    try{

        let respuesta =
            await fetch(
                this.BASE_MULTIMEDIA
                +
                "index.html",
                {
                    cache:"no-store"
                }
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
   EXTRAER DIRECTORIOS MULTIMEDIA
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
   ÍNDICE DE BLOQUE
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
                "/index.html",
                {
                    cache:"no-store"
                }
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
   EXTRAER IMÁGENES DEL ÍNDICE
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


    let codigo =
        String(j1)
        .replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


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
    ORDEN:

    i0
    i2
    i3
    */

    resultado.sort(
        (a,b) => {

            const orden = {
                i0:0,
                i2:1,
                i3:2
            };


            let ma =
                a.match(
                    /_(i0|i2|i3)\./i
                );


            let mb =
                b.match(
                    /_(i0|i2|i3)\./i
                );


            return (
                orden[
                    ma[1].toLowerCase()
                ]
                -
                orden[
                    mb[1].toLowerCase()
                ]
            );

        }
    );


    return resultado;

},


/* ======================================================
   CASO 2

   ARQUITECTURA NUEVA
====================================================== */

async caso2(j1){

    let indice =
        await this.obtenerIndiceMultimedia();


    if(
        !indice
    ){

        return null;

    }


    let directorios =
        this.extraerDirectorios(
            indice
        );


    for(
        let directorio
        of directorios
    ){

        let indiceBloque =
            await this.obtenerIndiceBloque(
                directorio
            );


        if(
            !indiceBloque
        ){

            continue;

        }


        let archivos =
            this.extraerImagenes(
                indiceBloque,
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

            arquitectura:"nueva",

            j1:j1,

            imagenes:imagenes

        };

    }


    return null;

},


/* ======================================================
   FUNCIÓN PRINCIPAL
====================================================== */

async buscar(j1){

    if(
        !this.validarJ1(j1)
    ){

        return {

            ok:false,

            imagenes:[],

            error:
                "J1 no tiene un formato válido."

        };

    }


    j1 =
        String(j1).trim();


    /*
    =====================================================
    CASO 1
    =====================================================
    */

    if(
        this.esCaso1(j1)
    ){

        let resultado =
            await this.caso1(
                j1
            );


        if(
            resultado
        ){

            return {

                ok:true,

                ...resultado

            };

        }


        return {

            ok:false,

            caso:1,

            arquitectura:"antigua",

            j1:j1,

            imagenes:[],

            error:
                "No se encontraron imágenes en la arquitectura antigua."

        };

    }


    /*
    =====================================================
    CASO 2
    =====================================================
    */

    let resultado =
        await this.caso2(
            j1
        );


    if(
        resultado
    ){

        return {

            ok:true,

            ...resultado

        };

    }


    return {

        ok:false,

        caso:2,

        arquitectura:"nueva",

        j1:j1,

        imagenes:[],

        error:
            "No se encontró ninguna imagen en la arquitectura nueva."

    };

}


};


/*
========================================================
FIN BUSCARUTA v1.2 LTS
========================================================
*/
