/*
========================================================
PalEntropía
CAB14.js v1.0
HÁBITATS DE LA PALEOFICHA
========================================================

FUNCIÓN
--------------------------------------------------------
Presenta los hábitats de una Paleoficha utilizando:

    j5
    j6

El procesamiento de j5/j6 NO se realiza aquí.

La arquitectura es:

    j5 + j6
       ↓
    PALHABDECODER
       ↓
    CAB14
       ↓
    PALHAB
       ↓
    nombre + descripción


DEPENDENCIAS
--------------------------------------------------------

    PALHABDECODER.js
    PALHAB.js

CAB14 NO modifica:

    CAB12
    CAB13
    PALHAB
    PALHABDECODER


REGLAS VISUALES
--------------------------------------------------------

    Hábitat predominante
    Nombre
    Descripción

    Hábitats principales
    Nombre
    Descripción

    Hábitats secundarios
    Nombre
    Descripción


========================================================
*/


window.CAB14 = {


/*=========================================================
  01 — OBTENER DATOS DEL HÁBITAT
=========================================================*/

/*
---------------------------------------------------------
obtenerHabitat(codigo)

Consulta PALHAB utilizando el código:

    H100

Devuelve el objeto correspondiente.

Si no existe, devuelve null.
---------------------------------------------------------
*/

obtenerHabitat:function(codigo){

    if(!codigo){

        return null;

    }


    if(!window.PALHAB){

        console.warn(
            "CAB14: PALHAB.js no está disponible."
        );

        return null;

    }


    return PALHAB[codigo] || null;

},


/*=========================================================
  02 — CREAR BLOQUE DE HÁBITAT
=========================================================*/

/*
---------------------------------------------------------
crearBloque(codigo,tipo)

Construye visualmente un hábitat.

tipo puede ser:

    predominante
    principal
    secundario
---------------------------------------------------------
*/

crearBloque:function(codigo,tipo){

    var habitat=this.obtenerHabitat(codigo);


    /*-----------------------------------------------
      Si no existe el código en PALHAB
    -----------------------------------------------*/

    if(!habitat){

        return null;

    }


    var bloque=document.createElement("div");

    bloque.className=
        "bloqueHabitatCAB14";


    bloque.setAttribute(
        "data-codigo",
        codigo
    );


    bloque.setAttribute(
        "data-tipo",
        tipo
    );


    /*-----------------------------------------------
      Línea etiqueta + nombre
    -----------------------------------------------*/

    var linea=document.createElement("div");

    linea.className=
        "lineaHabitatCAB14";


    var etiqueta=document.createElement("span");

    etiqueta.className=
        "etiquetaHabitatCAB14";


    var nombreTipo="Hábitat";


    if(tipo==="predominante"){

        nombreTipo="Hábitat predominante";

    }


    if(tipo==="principal"){

        nombreTipo="Hábitat principal";

    }


    if(tipo==="secundario"){

        nombreTipo="Hábitat secundario";

    }


    etiqueta.textContent=
        nombreTipo+":";


    var nombre=document.createElement("span");

    nombre.className=
        "nombreHabitatCAB14";


    nombre.textContent=
        habitat.nombre;


    linea.appendChild(etiqueta);

    linea.appendChild(nombre);


    /*-----------------------------------------------
      Descripción
    -----------------------------------------------*/

    var descripcion=document.createElement("div");

    descripcion.className=
        "descripcionHabitatCAB14";


    descripcion.textContent=
        habitat.descripcion;


    /*-----------------------------------------------
      Montaje
    -----------------------------------------------*/

    bloque.appendChild(linea);

    bloque.appendChild(descripcion);


    return bloque;

},


/*=========================================================
  03 — CREAR SECCIÓN
=========================================================*/

/*
---------------------------------------------------------
crearSeccion(titulo,lista,tipo)

Construye una sección completa de hábitats.

Ejemplo:

    Hábitats principales

        Bosque templado
        Descripción...

        Llanura
        Descripción...
---------------------------------------------------------
*/

crearSeccion:function(titulo,lista,tipo){

    if(!lista || lista.length===0){

        return null;

    }


    var seccion=document.createElement("div");

    seccion.className=
        "seccionHabitatCAB14";


    var tituloElemento=document.createElement("h4");

    tituloElemento.className=
        "tituloHabitatCAB14";


    tituloElemento.textContent=
        titulo;


    seccion.appendChild(
        tituloElemento
    );


    for(var i=0;i<lista.length;i++){

        var bloque=this.crearBloque(
            lista[i],
            tipo
        );


        if(bloque){

            seccion.appendChild(
                bloque
            );

        }

    }


    return seccion;

},


/*=========================================================
  04 — CREAR CONTENIDO COMPLETO
=========================================================*/

/*
---------------------------------------------------------
crearContenido(j5,j6)

Decodifica j5/j6 y genera el contenido completo.

Devuelve un elemento DIV.
---------------------------------------------------------
*/

crearContenido:function(j5,j6){

    /*-----------------------------------------------
      Comprobar decodificador
    -----------------------------------------------*/

    if(!window.PALHABDECODER){

        console.warn(
            "CAB14: palhabdecoder.js no está disponible."
        );

        return null;

    }


    /*-----------------------------------------------
      Decodificar
    -----------------------------------------------*/

    var datos=
        PALHABDECODER.decodificar(
            j5,
            j6
        );


    /*-----------------------------------------------
      Contenedor
    -----------------------------------------------*/

    var contenedor=document.createElement("div");

    contenedor.className=
        "contenedorHabitatCAB14";


    /*=================================================
      PREDOMINANTE
    =================================================*/

    if(datos.predominante){

        var bloquePredominante=
            this.crearBloque(
                datos.predominante,
                "predominante"
            );


        if(bloquePredominante){

            contenedor.appendChild(
                bloquePredominante
            );

        }

    }


    /*=================================================
      PRINCIPALES
    =================================================*/

    var principales=
        this.crearSeccion(
            "Hábitats principales",
            datos.principales,
            "principal"
        );


    if(principales){

        contenedor.appendChild(
            principales
        );

    }


    /*=================================================
      SECUNDARIOS
    =================================================*/

    var secundarios=
        this.crearSeccion(
            "Hábitats secundarios",
            datos.secundarios,
            "secundario"
        );


    if(secundarios){

        contenedor.appendChild(
            secundarios
        );

    }


    /*=================================================
      SIN HÁBITATS
    =================================================*/

    if(
        !datos.predominante &&
        datos.principales.length===0 &&
        datos.secundarios.length===0
    ){

        var vacio=
            document.createElement("div");


        vacio.className=
            "sinHabitatCAB14";


        vacio.textContent=
            "Hábitat no definido.";


        contenedor.appendChild(
            vacio
        );

    }


    return contenedor;

},


/*=========================================================
  05 — MOSTRAR HÁBITATS
=========================================================*/

/*
---------------------------------------------------------
mostrar(j5,j6)

Busca el lightbox de Ecología y añade el contenido
de hábitats.

No crea ni modifica el lightbox.

El lightbox debe existir previamente.
---------------------------------------------------------
*/

mostrar:function(j5,j6){

    var lightbox=
        document.getElementById(
            "lightboxEcologia"
        );


    if(!lightbox){

        console.warn(
            "CAB14: No existe #lightboxEcologia."
        );

        return;

    }


    var contenido=
        this.crearContenido(
            j5,
            j6
        );


    if(!contenido){

        return;

    }


    /*-----------------------------------------------
      Buscar contenedor específico de hábitats
    -----------------------------------------------*/

    var zona=
        lightbox.querySelector(
            ".contenidoHabitatCAB14"
        );


    /*-----------------------------------------------
      Si no existe, crearlo
    -----------------------------------------------*/

    if(!zona){

        zona=document.createElement("div");

        zona.className=
            "contenidoHabitatCAB14";


        lightbox.appendChild(
            zona
        );

    }


    /*-----------------------------------------------
      Limpiar contenido anterior
    -----------------------------------------------*/

    zona.innerHTML="";


    /*-----------------------------------------------
      Insertar contenido nuevo
    -----------------------------------------------*/

    zona.appendChild(
        contenido
    );

},


/*=========================================================
  06 — LIMPIAR
=========================================================*/

/*
---------------------------------------------------------
limpiar()

Elimina los hábitats actualmente mostrados.
---------------------------------------------------------
*/

limpiar:function(){

    var zonas=
        document.querySelectorAll(
            ".contenidoHabitatCAB14"
        );


    for(var i=0;i<zonas.length;i++){

        zonas[i].innerHTML="";

    }

}


};


/*
========================================================
FIN CAB14.js v1.0
========================================================
*/
