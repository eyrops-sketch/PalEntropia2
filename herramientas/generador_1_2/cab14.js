/*
========================================================
PalEntropía
CAB14.js v1.1
Generador de Paleofichas 1.1

HÁBITATS DE LA PALEOFICHA
========================================================

FUNCIÓN
--------------------------------------------------------
Presenta los hábitats de una Paleoficha utilizando:

    j5
    j6

El procesamiento de j5/j6 NO se realiza aquí.

Arquitectura:

    j5 + j6
       ↓
    PALHABDECODER
       ↓
    CAB14
       ↓
    PALHAB
       ↓
    nombre + descripción


========================================================
PRESENTACIÓN v1.1
========================================================

La sección muestra:

    Hábitats

    Predominante   Llanura
                   Descripción...

    Principal      Bosque
                   Descripción...

    Principales    Bosque
                   Descripción...

                   Matorral
                   Descripción...

    Secundario     Pastizal
                   Descripción...

    Secundarios    Pastizal
                   Descripción...

                   Bosque
                   Descripción...


REGLAS
--------------------------------------------------------

1. "Hábitats" aparece una sola vez.

2. "Predominante" aparece una sola vez.

3. Si existe un único hábitat principal:

       Principal

4. Si existen varios:

       Principales

5. Si existe un único hábitat secundario:

       Secundario

6. Si existen varios:

       Secundarios

7. Las etiquetas NO se repiten delante de cada
   hábitat.

8. Etiqueta + nombre aparecen en la misma línea.

9. Etiqueta y nombre utilizan el mismo color
   celeste definido por CSS.

10. La descripción aparece debajo en blanco.

11. CAB14 no modifica los datos originales.

========================================================
DEPENDENCIAS
========================================================

    PALHABDECODER.js
    PALHAB.js

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
  02 — CREAR ELEMENTO DE HÁBITAT
=========================================================*/

/*
---------------------------------------------------------
crearBloque(codigo)

Crea exclusivamente el contenido visual de un hábitat:

    Nombre
    Descripción

NO crea la etiqueta:

    Predominante
    Principal
    Principales
    Secundario
    Secundarios

Estas etiquetas pertenecen a la sección y aparecen
una sola vez.

---------------------------------------------------------
*/

crearBloque:function(codigo){

    var habitat =
        this.obtenerHabitat(codigo);


    /*-----------------------------------------------
      Hábitat inexistente
    -----------------------------------------------*/

    if(!habitat){

        return null;

    }


    /*-----------------------------------------------
      BLOQUE
    -----------------------------------------------*/

    var bloque =
        document.createElement("div");


    bloque.className =
        "bloqueHabitatCAB14";


    bloque.setAttribute(
        "data-codigo",
        codigo
    );


    /*-----------------------------------------------
      LÍNEA NOMBRE
    -----------------------------------------------*/

    var nombre =
        document.createElement("span");


    nombre.className =
        "nombreHabitatCAB14";


    nombre.textContent =
        habitat.nombre;


    bloque.appendChild(
        nombre
    );


    /*-----------------------------------------------
      DESCRIPCIÓN
    -----------------------------------------------*/

    if(habitat.descripcion){

        var descripcion =
            document.createElement("div");


        descripcion.className =
            "descripcionHabitatCAB14";


        descripcion.textContent =
            habitat.descripcion;


        bloque.appendChild(
            descripcion
        );

    }


    return bloque;

},


/*=========================================================
  03 — CREAR CABECERA DE SECCIÓN
=========================================================*/

/*
---------------------------------------------------------
crearCabeceraSeccion(texto)

Crea:

    Predominante
    Principal
    Principales
    Secundario
    Secundarios

La cabecera aparece una sola vez.

---------------------------------------------------------
*/

crearCabeceraSeccion:function(texto){

    var cabecera =
        document.createElement("div");


    cabecera.className =
        "cabeceraHabitatCAB14";


    cabecera.textContent =
        texto;


    return cabecera;

},


/*=========================================================
  04 — CREAR SECCIÓN DE HÁBITATS
=========================================================*/

/*
---------------------------------------------------------
crearSeccion(etiqueta,lista)

Construye:

    etiqueta

    habitat 1
    descripción

    habitat 2
    descripción

La etiqueta solamente aparece una vez.

---------------------------------------------------------
*/

crearSeccion:function(etiqueta,lista){

    if(
        !lista ||
        lista.length===0
    ){

        return null;

    }


    /*-----------------------------------------------
      SECCIÓN
    -----------------------------------------------*/

    var seccion =
        document.createElement("div");


    seccion.className =
        "seccionHabitatCAB14";


    /*-----------------------------------------------
      CABECERA
    -----------------------------------------------*/

    var cabecera =
        this.crearCabeceraSeccion(
            etiqueta
        );


    seccion.appendChild(
        cabecera
    );


    /*-----------------------------------------------
      HÁBITATS
    -----------------------------------------------*/

    for(
        var i=0;
        i<lista.length;
        i++
    ){

        var bloque =
            this.crearBloque(
                lista[i]
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
  05 — DETERMINAR ETIQUETA PRINCIPAL
=========================================================*/

/*
---------------------------------------------------------
obtenerEtiquetaPrincipal(lista)

Devuelve:

    Principal

si hay un único elemento.

Devuelve:

    Principales

si hay más de uno.
---------------------------------------------------------
*/

obtenerEtiquetaPrincipal:function(lista){

    if(
        !lista ||
        lista.length===0
    ){

        return null;

    }


    if(lista.length===1){

        return "Principal";

    }


    return "Principales";

},


/*=========================================================
  06 — DETERMINAR ETIQUETA SECUNDARIA
=========================================================*/

/*
---------------------------------------------------------
obtenerEtiquetaSecundaria(lista)

Devuelve:

    Secundario

si hay un único elemento.

Devuelve:

    Secundarios

si hay más de uno.
---------------------------------------------------------
*/

obtenerEtiquetaSecundaria:function(lista){

    if(
        !lista ||
        lista.length===0
    ){

        return null;

    }


    if(lista.length===1){

        return "Secundario";

    }


    return "Secundarios";

},


/*=========================================================
  07 — CREAR CONTENIDO COMPLETO
=========================================================*/

/*
---------------------------------------------------------
crearContenido(j5,j6)

Decodifica j5/j6 mediante PALHABDECODER y construye
el contenido completo de Hábitats.

---------------------------------------------------------
*/

crearContenido:function(j5,j6){


    /*===================================================
      COMPROBAR DECODIFICADOR
    ===================================================*/

    if(!window.PALHABDECODER){

        console.warn(
            "CAB14: palhabdecoder.js no está disponible."
        );

        return null;

    }


    /*===================================================
      DECODIFICAR
    ===================================================*/

    var datos =
        PALHABDECODER.decodificar(
            j5,
            j6
        );


    if(!datos){

        return null;

    }


    /*===================================================
      CONTENEDOR
    ===================================================*/

    var contenedor =
        document.createElement("div");


    contenedor.className =
        "contenedorHabitatCAB14";


    /*===================================================
      TÍTULO HÁBITATS
    ===================================================*/

    var titulo =
        document.createElement("h3");


    titulo.className =
        "tituloGeneralHabitatCAB14";


    titulo.textContent =
        "Hábitats";


    contenedor.appendChild(
        titulo
    );


    /*===================================================
      PREDOMINANTE
    ===================================================*/

    if(datos.predominante){

        var seccionPredominante =
            document.createElement("div");


        seccionPredominante.className =
            "seccionHabitatCAB14 predominanteHabitatCAB14";


        var cabeceraPredominante =
            this.crearCabeceraSeccion(
                "Predominante"
            );


        seccionPredominante.appendChild(
            cabeceraPredominante
        );


        var bloquePredominante =
            this.crearBloque(
                datos.predominante
            );


        if(bloquePredominante){

            seccionPredominante.appendChild(
                bloquePredominante
            );

        }


        contenedor.appendChild(
            seccionPredominante
        );

    }


    /*===================================================
      PRINCIPALES
    ===================================================*/

    var principales =
        datos.principales || [];


    if(principales.length>0){

        var etiquetaPrincipal =
            this.obtenerEtiquetaPrincipal(
                principales
            );


        var seccionPrincipal =
            this.crearSeccion(
                etiquetaPrincipal,
                principales
            );


        if(seccionPrincipal){

            contenedor.appendChild(
                seccionPrincipal
            );

        }

    }


    /*===================================================
      SECUNDARIOS
    ===================================================*/

    var secundarios =
        datos.secundarios || [];


    if(secundarios.length>0){

        var etiquetaSecundaria =
            this.obtenerEtiquetaSecundaria(
                secundarios
            );


        var seccionSecundaria =
            this.crearSeccion(
                etiquetaSecundaria,
                secundarios
            );


        if(seccionSecundaria){

            contenedor.appendChild(
                seccionSecundaria
            );

        }

    }


    /*===================================================
      SIN HÁBITATS
    ===================================================*/

    if(
        !datos.predominante &&
        principales.length===0 &&
        secundarios.length===0
    ){

        var vacio =
            document.createElement("div");


        vacio.className =
            "sinHabitatCAB14";


        vacio.textContent =
            "Hábitat no definido.";


        contenedor.appendChild(
            vacio
        );

    }


    return contenedor;

},


/*=========================================================
  08 — MOSTRAR HÁBITATS
=========================================================*/

/*
---------------------------------------------------------
mostrar(contenedor,ficha)

Muestra los hábitats dentro del contenedor proporcionado
por CAB10.

CAB10 ya crea:

    #cab14Ecologia

No se crea ningún lightbox adicional.

---------------------------------------------------------
*/

mostrar:function(contenedor,ficha){

    console.log(
        "CAB14: mostrando hábitats."
    );


    /*-----------------------------------------------
      COMPROBAR CONTENEDOR
    -----------------------------------------------*/

    if(!contenedor){

        console.warn(
            "CAB14: no existe contenedor."
        );

        return;

    }


    /*-----------------------------------------------
      COMPROBAR FICHA
    -----------------------------------------------*/

    if(!ficha){

        contenedor.innerHTML =
            "<h3>Hábitats</h3>" +
            "<p>Hábitat no definido.</p>";

        return;

    }


    /*-----------------------------------------------
      OBTENER j5
    -----------------------------------------------*/

    var j5 =
        ficha.j5 || "";


    /*-----------------------------------------------
      OBTENER j6
    -----------------------------------------------*/

    var j6 =
        ficha.j6 || "";


    console.log(
        "CAB14: j5:",
        j5
    );


    console.log(
        "CAB14: j6:",
        j6
    );


    /*-----------------------------------------------
      CREAR CONTENIDO
    -----------------------------------------------*/

    var contenido =
        this.crearContenido(
            j5,
            j6
        );


    if(!contenido){

        return;

    }


    /*-----------------------------------------------
      LIMPIAR CONTENEDOR
    -----------------------------------------------*/

    contenedor.innerHTML =
        "";


    /*-----------------------------------------------
      INSERTAR
    -----------------------------------------------*/

    contenedor.appendChild(
        contenido
    );


    console.log(
        "CAB14: hábitats mostrados correctamente."
    );

},


/*=========================================================
  09 — LIMPIAR
=========================================================*/

/*
---------------------------------------------------------
limpiar()

Elimina el contenido de hábitats actualmente mostrado.
---------------------------------------------------------
*/

limpiar:function(){

    var zonas =
        document.querySelectorAll(
            ".contenedorHabitatCAB14"
        );


    for(
        var i=0;
        i<zonas.length;
        i++
    ){

        zonas[i].innerHTML =
            "";

    }

}


};


/*
========================================================
FIN CAB14.js v1.1
========================================================
*/
