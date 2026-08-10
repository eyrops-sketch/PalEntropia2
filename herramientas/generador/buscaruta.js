/*
========================================================
PalEntropía
buscaruta.js v1.4 LTS

ADAPTADOR UNIVERSAL DE RUTAS DE IMÁGENES

ARQUITECTURA ANTIGUA
--------------------

001_01 → 005_15

j1 → paleofichas.json → j2 → ruta

Ejemplo:

002_12
↓
j2 = Diplocaulus

paleofichas/vol002/002_12_diplocaulus/Diplocaulus_i0.png


ARQUITECTURA NUEVA
------------------

Busca j1 dentro de TODOS los bloques de:

herramientas/multimedia/

NO utiliza el nombre del bloque
para determinar el código j1.

Ejemplo válido:

006_01

puede encontrarse en:

herramientas/multimedia/076_150/006_01_i0.jpg

El bloque es solamente un contenedor.


EXTENSIONES:

.png
.jpg
.jpeg
.webp


IMPORTANTE:

BUSCARUTA NO comprueba previamente
la existencia de las imágenes antiguas.

Construye sus posibles rutas.

El generador será quien intente cargarlas.

========================================================
*/

window.BUSCARUTA_VERSION = "1.4 LTS";


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
   DETERMINAR ARQUITECTURA ANTIGUA

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

            "BUSCARUTA: error leyendo paleofichas.json",
            error

        );

        return null;

    }

},


/* ======================================================
   BUSCAR REGISTRO

   Busca j1 dentro de cualquier estructura JSON.

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
            let elemento of
            datos
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

            "BUSCARUTA: j1 no encontrado:",
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
   NOMBRE PARA DIRECTORIO

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
   NOMBRE PARA ARCHIVO

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

        "vol"
        +
        partes[0]

    );

},


/* ======================================================
   GENERAR RUTAS CASO 1

   NO COMPRUEBA ARCHIVOS.

====================================================== */

generarRutasCaso1(
    j1,
    nombre
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

        return [];

    }


    let rutas = [];


    for(
        let tipo of
        this.IMAGENES
    ){

        for(
            let extension of
            this.EXTENSIONES
        ){

            rutas.push(

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

        }

    }


    return rutas;

},


/* ======================================================
   ÍNDICE MULTIMEDIA
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

        console.error(

            "BUSCARUTA: error leyendo índice multimedia",
            error

        );

        return null;

    }

},


/* ======================================================
   EXTRAER TODOS LOS DIRECTORIOS

   NO interpreta sus rangos.

   Solo obtiene los contenedores.

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


        /*
        Aceptamos directorios tipo:

        001_075
        076_150
        151_225

        pero NO usamos esos números
        para decidir qué j1 contienen.
        */

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
   CARGAR ÍNDICE DE UN BLOQUE
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
   EXTRAER IMÁGENES DE UN ÍNDICE

   Busca:

   j1_i0.xxx
   j1_i2.xxx
   j1_i3.xxx

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

   BUSCA EN TODOS LOS BLOQUES.

   NO utiliza el rango del nombre
   del directorio.

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
    IMPORTANTE:

    Se recorren TODOS los bloques.

    No hacemos:

    006 → 001_075

    ni:

    076 → 076_150

    El contenido físico del bloque
    es la única verdad.

    */

    for(
        let directorio of
        directorios
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


        /*
        Con una sola imagen
        ya hemos localizado
        el código.

        */

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
                    "No se encontró j2 para este j1 en paleofichas.json."

            };

        }


        let rutas =

            this.generarRutasCaso1(
                j1,
                nombre
            );


        return {

            ok:true,

            caso:1,

            arquitectura:"antigua",

            j1:j1,

            j2:nombre,

            imagenes:rutas

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
            "No se encontró el código en ningún bloque multimedia."

    };

}


};


/*
========================================================
FIN BUSCARUTA v1.4 LTS
========================================================
*/
