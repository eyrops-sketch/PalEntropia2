/*
========================================================
PalEntropía
buscaruta.js v1.5 LTS

ADAPTADOR UNIVERSAL DE RUTAS DE IMÁGENES

========================================================

ARQUITECTURA ANTIGUA
--------------------------------------------------------

001_01 → 005_15

Lee:

herramientas/generador/paleofichas.json

j1
↓
j2
↓
ruta de imagen

No utiliza PALDB.

--------------------------------------------------------

ARQUITECTURA NUEVA
--------------------------------------------------------

Busca j1 dentro de cualquier bloque de:

herramientas/multimedia/

El nombre del bloque NO determina el j1.

Ejemplo:

006_01

puede estar en:

herramientas/multimedia/076_150/

--------------------------------------------------------

IMÁGENES
--------------------------------------------------------

Solo se devuelven:

i0
i2
i3

Para cada imagen se prueba:

.png
.jpg
.jpeg
.webp

Las tres imágenes se resuelven
simultáneamente.

--------------------------------------------------------

EXCEPCIONES HISTÓRICAS
--------------------------------------------------------

001_12 → Hippopotamus creutzburgi
002_04 → Thyesthes verrucosus
003_14 → Cacops aspidephorus
004_14 → Albertonectes vanderveldei

Estas excepciones son únicamente de compatibilidad
con la arquitectura antigua.

PALDB NO SE UTILIZA.

========================================================
*/

window.BUSCARUTA_VERSION = "1.5 LTS";


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


BASE_MULTIMEDIA:
    "../multimedia/",


/* ======================================================
   EXCEPCIONES HISTÓRICAS
====================================================== */

EXCEPCIONES: {

    "001_12":
        "Hippopotamus creutzburgi",

    "002_04":
        "Thyesthes verrucosus",

    "003_14":
        "Cacops aspidephorus",

    "004_14":
        "Albertonectes vanderveldei"

},


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
   BUSCAR REGISTRO EN JSON
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
   OBTENER NOMBRE FÍSICO

   Primero mira si existe una excepción.

====================================================== */

obtenerNombreFisico(
    j1,
    nombre
){

    if(
        this.EXCEPCIONES[j1]
    ){

        return this.EXCEPCIONES[j1];

    }


    return nombre;

},


/* ======================================================
   NORMALIZAR NOMBRE PARA DIRECTORIO

   Ejemplo:

   Diplocaulus
   ↓
   diplocaulus

   Hippopotamus creutzburgi
   ↓
   hippopotamus_creutzburgi

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
   NORMALIZAR NOMBRE DE ARCHIVO

   Primera letra mayúscula.

   Ejemplo:

   diplocaulus
   ↓
   Diplocaulus

   hippopotamus creutzburgi
   ↓
   Hippopotamus_creutzburgi

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
        "vol" +
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
   INTENTAR CARGAR UNA IMAGEN

   Prueba las extensiones en orden:

   PNG
   JPG
   JPEG
   WEBP

====================================================== */

cargarPrimeraImagen(
    rutas
){

    return new Promise(
        resolve => {

            let indice = 0;


            const intentar = () => {

                if(
                    indice >= rutas.length
                ){

                    resolve(null);

                    return;

                }


                let ruta =
                    rutas[indice];


                let imagen =
                    new Image();


                imagen.onload = () => {

                    resolve(ruta);

                };


                imagen.onerror = () => {

                    indice++;

                    intentar();

                };


                imagen.src = ruta;

            };


            intentar();

        }
    );

},


/* ======================================================
   RESOLVER CASO 1

   i0, i2 e i3 se buscan
   simultáneamente.

   Resultado máximo: 3 imágenes.

====================================================== */

async resolverCaso1(
    j1,
    nombre
){

    let nombreFisico =

        this.obtenerNombreFisico(
            j1,
            nombre
        );


    let promesas = [];


    for(
        let tipo of
        this.IMAGENES
    ){

        let rutas = [];


        for(
            let extension of
            this.EXTENSIONES
        ){

            let ruta =

                this.crearRutaAntigua(
                    j1,
                    nombreFisico,
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


        promesas.push(

            this.cargarPrimeraImagen(
                rutas
            )

        );

    }


    let resultados =

        await Promise.all(
            promesas
        );


    return resultados.filter(
        ruta => ruta !== null
    );

},


/* ======================================================
   ÍNDICE PRINCIPAL MULTIMEDIA
====================================================== */

async obtenerIndiceMultimedia(){

    try{

        let respuesta =

            await fetch(

                this.BASE_MULTIMEDIA +
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
                !resultado.includes(nombre)
            ){

                resultado.push(nombre);

            }

        }

    }


    return resultado;

},


/* ======================================================
   COMPROBAR IMAGEN DIRECTAMENTE

   No se utiliza HEAD.

   Se utiliza Image().

====================================================== */

probarImagen(ruta){

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
   BUSCAR UNA IMAGEN DENTRO DE UN BLOQUE

   j1_i0
   j1_i2
   j1_i3

   Cada una prueba:

   PNG
   JPG
   JPEG
   WEBP

====================================================== */

async buscarImagenesBloque(
    directorio,
    j1
){

    let promesas = [];


    for(
        let tipo of
        this.IMAGENES
    ){

        promesas.push(

            (async () => {

                for(
                    let extension of
                    this.EXTENSIONES
                ){

                    let archivo =

                        j1
                        +
                        "_"
                        +
                        tipo
                        +
                        extension;


                    let ruta =

                        this.BASE_MULTIMEDIA
                        +
                        directorio
                        +
                        "/"
                        +
                        archivo;


                    let existe =

                        await this.probarImagen(
                            ruta
                        );


                    if(
                        existe
                    ){

                        return ruta;

                    }

                }


                return null;

            })()

        );

    }


    let resultados =

        await Promise.all(
            promesas
        );


    return resultados.filter(
        ruta => ruta !== null
    );

},


/* ======================================================
   CASO 2

   Busca j1 en TODOS los bloques.

   NO relaciona:

   006 → 001_075

   ni:

   006 → 076_150

   El bloque es solamente
   un contenedor físico.

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


    /*
    Buscar todos los bloques
    en paralelo.

    */

    let resultados =

        await Promise.all(

            directorios.map(

                directorio =>

                    this.buscarImagenesBloque(
                        directorio,
                        j1
                    )

            )

        );


    /*
    Primer bloque que contenga
    al menos una imagen.

    */

    for(
        let i = 0;
        i < resultados.length;
        i++
    ){

        if(
            resultados[i].length > 0
        ){

            return {

                caso:2,

                arquitectura:"nueva",

                j1:j1,

                directorio:
                    directorios[i],

                imagenes:
                    resultados[i]

            };

        }

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


    /* ==================================================
       CASO 1
    ================================================== */

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

                arquitectura:"antigua",

                j1:j1,

                imagenes:[],

                error:
                    "No se encontró j2 para este j1."

            };

        }


        let imagenes =

            await this.resolverCaso1(
                j1,
                nombre
            );


        if(
            imagenes.length > 0
        ){

            return {

                ok:true,

                caso:1,

                arquitectura:"antigua",

                j1:j1,

                j2:nombre,

                imagenes:imagenes

            };

        }


        /*
        Si no existe imagen antigua,
        intentamos arquitectura nueva.

        */

    }


    /* ==================================================
       CASO 2
    ================================================== */

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

        j1:j1,

        imagenes:[],

        error:
            "No se han encontrado imágenes para " +
            j1

    };

}


};


/*
========================================================
FIN BUSCARUTA v1.5 LTS
========================================================
*/




