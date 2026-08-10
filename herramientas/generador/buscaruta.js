/*
========================================================
PalEntropía
buscaruta.js v1.3 LTS

ADAPTADOR UNIVERSAL DE RUTAS DE IMÁGENES

FUNCIÓN:

Recibe j1 y prepara las posibles rutas de imagen.

NO comprueba archivos.
NO descarga imágenes.
NO hace peticiones HEAD.
NO hace peticiones GET para verificar imágenes.

El elemento <img> del generador será quien
intente cargar la imagen.

--------------------------------------------------------

ARQUITECTURA ANTIGUA
--------------------------------------------------------

001_01 → 005_15

Lee:

herramientas/generador/paleofichas.json

j1
↓
j2
↓
ruta

Ejemplo:

j1 = 002_12
j2 = Diplocaulus

Resultado:

../../paleofichas/vol002/002_12_diplocaulus/Diplocaulus_i0.png
../../paleofichas/vol002/002_12_diplocaulus/Diplocaulus_i2.png
../../paleofichas/vol002/002_12_diplocaulus/Diplocaulus_i3.png

Cada imagen tiene cuatro posibles extensiones:

.png
.jpg
.jpeg
.webp

--------------------------------------------------------

ARQUITECTURA NUEVA
--------------------------------------------------------

Busca el código j1 dentro de los índices de:

herramientas/multimedia/

Ejemplo:

016_02

Puede encontrar:

016_02_i0.png
016_02_i2.jpg
016_02_i3.webp

El módulo devuelve las rutas encontradas
en el índice.

--------------------------------------------------------

IMPORTANTE

BUSCARUTA NO COMPRUEBA SI EL ARCHIVO EXISTE.

Su función es exclusivamente:

j1
↓
ruta/rutas posibles

========================================================
*/

window.BUSCARUTA_VERSION = "1.3 LTS";


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

   Permite encontrar j1 aunque el JSON
   tenga diferentes estructuras.

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

        /*
        COMPROBAR SI ESTE OBJETO
        ES EL REGISTRO.
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
        BUSCAR EN SUS PROPIEDADES.
        */

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


    return (

        String(nombre)
        .trim()
        .toLowerCase()

        /*
        Eliminar diacríticos
        */

        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        /*
        Espacios y caracteres
        no válidos → _
        */

        .replace(
            /[^a-z0-9]+/g,
            "_"
        )

        /*
        Quitar _ inicial/final
        */

        .replace(
            /^_+|_+$/g,
            ""

        )

    );

},


/* ======================================================
   NOMBRE DEL ARCHIVO

   Diplocaulus
   ↓
   Diplocaulus

   Primera letra mayúscula.

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
   GENERAR RUTAS DEL CASO 1

   NO COMPRUEBA NADA.

   Simplemente genera todas
   las posibilidades.

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


    /*
    =====================================================
    ORDEN DE BÚSQUEDA

    Primero i0
    después i2
    después i3

    Dentro de cada imagen:

    PNG
    JPG
    JPEG
    WEBP
    =====================================================
    */

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

   Se utiliza exclusivamente
   para localizar los archivos
   de la arquitectura nueva.

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
   EXTRAER DIRECTORIOS

   Busca:

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
   CARGAR ÍNDICE DE BLOQUE
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
   EXTRAER IMÁGENES NUEVAS

   Busca directamente:

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
    Ordenar:

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


    /*
    Ordenar bloques por inicio numérico.

    */

    directorios.sort(

        (a,b) => {

            return (
                Number(a.slice(0,3))
                -
                Number(b.slice(0,3))
            );

        }

    );


    /*
    Buscar el bloque que corresponda
    al código j1.

    */

    let numero =

        Number(
            String(j1)
            .split("_")[0]
        );


    for(
        let directorio of
        directorios
    ){

        let partes =

            directorio.split("_");


        let inicio =

            Number(
                partes[0]
            );


        let fin =

            Number(
                partes[1]
            );


        /*
        Si el volumen de j1
        está dentro del bloque.
        */

        if(
            numero < inicio ||
            numero > fin
        ){

            continue;

        }


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

   Entrada:

   j1

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


    /*
    Mantener exactamente:

    002_12
    016_02

    etc.
    */

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
            "No se encontró el código en la arquitectura nueva."

    };

}


};


/*
========================================================
FIN BUSCARUTA v1.3 LTS
========================================================
*/
