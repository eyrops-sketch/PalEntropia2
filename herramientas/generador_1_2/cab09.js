/*
========================================================
CAB09.js v1.1
Estadísticas y Análisis Estadístico
PalEntropía
Generador de Paleofichas 1.2
========================================================

FUENTE ÚNICA DE DATOS
---------------------
e1  = Adaptabilidad
e2  = Resistencia
e3  = Sociabilidad
e4  = Reproducción
e5  = Ofensiva
e6  = Defensa
e7  = Movilidad
e8  = Plasticidad ecológica
e9  = Tamaño
e10 = Velocidad
e11 = Inteligencia

CAB09 NO INVENTA DATOS.
CAB09 NO MODIFICA EL REGISTRO.
CAB09 SOLO LEE Y CALCULA.

FUNCIONES:
- Lee e1-e11 del registro actual.
- Calcula las estadísticas derivadas.
- Crea el botón circular de información avanzada.
- Crea el lightbox.
- Muestra estadísticas y análisis.
========================================================
*/

(function(){

"use strict";


/*========================================================
CONFIGURACIÓN
========================================================*/

const CAB09 = {

    version: "1.1",

    campos: [
        "adaptabilidad",
        "resistencia",
        "sociabilidad",
        "reproduccion",
        "ofensiva",
        "defensa",
        "movilidad",
        "plasticidad_ecologica",
        "tamano",
        "velocidad",
        "inteligencia"
    ],


/*========================================================
OBTENER ESTADÍSTICAS DESDE e1-e11
========================================================*/

obtenerEstadisticas(registro){

    if(!registro){
        return null;
    }

    const valores = [

        registro.e1,
        registro.e2,
        registro.e3,
        registro.e4,
        registro.e5,
        registro.e6,
        registro.e7,
        registro.e8,
        registro.e9,
        registro.e10,
        registro.e11

    ];

    if(
        valores.some(
            valor =>
                valor === undefined ||
                valor === null ||
                valor === ""
        )
    ){
        return null;
    }

    const numeros = valores.map(Number);

    if(
        numeros.some(
            valor => Number.isNaN(valor)
        )
    ){
        return null;
    }

    return {

        adaptabilidad: numeros[0],
        resistencia: numeros[1],
        sociabilidad: numeros[2],
        reproduccion: numeros[3],
        ofensiva: numeros[4],
        defensa: numeros[5],
        movilidad: numeros[6],
        plasticidad_ecologica: numeros[7],
        tamano: numeros[8],
        velocidad: numeros[9],
        inteligencia: numeros[10]

    };

},


/*========================================================
MEDIA
========================================================*/

media(valores){

    if(
        !Array.isArray(valores) ||
        valores.length === 0
    ){
        return 0;
    }

    return Math.round(
        valores.reduce(
            (suma, valor) =>
                suma + Number(valor),
            0
        ) / valores.length
    );

},


/*========================================================
ANÁLISIS NIVEL 1
========================================================*/

analizar(stats){

    if(!stats){
        return null;
    }

    return {

        indice_global: this.media([

            stats.adaptabilidad,
            stats.resistencia,
            stats.sociabilidad,
            stats.reproduccion,
            stats.ofensiva,
            stats.defensa,
            stats.movilidad,
            stats.plasticidad_ecologica,
            stats.tamano,
            stats.velocidad,
            stats.inteligencia

        ]),

        supervivencia: this.media([

            stats.adaptabilidad,
            stats.resistencia,
            stats.defensa,
            stats.plasticidad_ecologica

        ]),

        competencia: this.media([

            stats.ofensiva,
            stats.tamano,
            stats.velocidad,
            stats.inteligencia

        ]),

        movilidad: this.media([

            stats.movilidad,
            stats.velocidad

        ]),

        reproduccion: this.media([

            stats.reproduccion,
            stats.sociabilidad

        ])

    };

},


/*========================================================
CREAR BOTÓN
========================================================*/

crearBoton(){

    const ficha =
        document.getElementById("ficha");

    if(!ficha){
        console.warn(
            "CAB09: no existe #ficha."
        );
        return null;
    }

    let boton =
        document.getElementById(
            "botonInfoAvanzada"
        );

    if(boton){
        return boton;
    }

    boton =
        document.createElement("button");

    boton.id =
        "botonInfoAvanzada";

    boton.type =
        "button";

    boton.title =
        "Información estadística";

    boton.setAttribute(
        "aria-label",
        "Abrir información estadística"
    );

    boton.innerHTML = "ⓘ";

    /*
    #ficha ya es position:relative
    mediante CAB09.css podemos colocar
    el botón en la esquina superior derecha.
    */

    ficha.appendChild(boton);

    return boton;

},


/*========================================================
CREAR LIGHTBOX
========================================================*/

crearLightbox(){

    let visor =
        document.getElementById(
            "visorInfoAvanzada"
        );

    if(visor){
        return visor;
    }

    visor =
        document.createElement("div");

    visor.id =
        "visorInfoAvanzada";


    /*====================================================
    VENTANA
    ====================================================*/

    const ventana =
        document.createElement("div");

    ventana.id =
        "ventanaInfoAvanzada";


    /*====================================================
    BOTÓN CERRAR
    ====================================================*/

    const cerrar =
        document.createElement("button");

    cerrar.id =
        "cerrarInfoAvanzada";

    cerrar.type =
        "button";

    cerrar.title =
        "Cerrar";

    cerrar.setAttribute(
        "aria-label",
        "Cerrar información estadística"
    );

    cerrar.innerHTML = "×";


    /*====================================================
    TÍTULO
    ====================================================*/

    const titulo =
        document.createElement("h2");

    titulo.textContent =
        "Información estadística";


    /*====================================================
    BLOQUE ESTADÍSTICAS
    ====================================================*/

    const bloqueStats =
        document.createElement("div");

    bloqueStats.className =
        "bloqueFase2";

    const tituloStats =
        document.createElement("h3");

    tituloStats.textContent =
        "Estadísticas";

    const estadisticas =
        document.createElement("div");

    estadisticas.id =
        "fase2Estadisticas";

    bloqueStats.appendChild(
        tituloStats
    );

    bloqueStats.appendChild(
        estadisticas
    );


    /*====================================================
    BLOQUE ANÁLISIS
    ====================================================*/

    const bloqueAnalisis =
        document.createElement("div");

    bloqueAnalisis.className =
        "bloqueFase2";

    const tituloAnalisis =
        document.createElement("h3");

    tituloAnalisis.textContent =
        "Análisis estadístico";

    const analisis =
        document.createElement("div");

    analisis.id =
        "fase2Analisis";

    bloqueAnalisis.appendChild(
        tituloAnalisis
    );

    bloqueAnalisis.appendChild(
        analisis
    );


    /*====================================================
    CONSTRUIR
    ====================================================*/

    ventana.appendChild(
        cerrar
    );

    ventana.appendChild(
        titulo
    );

    ventana.appendChild(
        bloqueStats
    );

    ventana.appendChild(
        bloqueAnalisis
    );

    visor.appendChild(
        ventana
    );

    document.body.appendChild(
        visor
    );


    /*====================================================
    EVENTOS
    ====================================================*/

    cerrar.addEventListener(
        "click",
        () => {

            this.cerrarLightbox();

        }
    );


    visor.addEventListener(
        "click",
        evento => {

            if(
                evento.target === visor
            ){

                this.cerrarLightbox();

            }

        }
    );


    return visor;

},


/*========================================================
MOSTRAR ESTADÍSTICAS EN LIGHTBOX
========================================================*/

mostrarEstadisticasLightbox(stats){

    const contenedor =
        document.getElementById(
            "fase2Estadisticas"
        );

    if(!contenedor){
        return;
    }

    contenedor.innerHTML = "";


    const nombres = {

        adaptabilidad:
            "Adaptabilidad",

        resistencia:
            "Resistencia",

        sociabilidad:
            "Sociabilidad",

        reproduccion:
            "Reproducción",

        ofensiva:
            "Ofensiva",

        defensa:
            "Defensa",

        movilidad:
            "Movilidad",

        plasticidad_ecologica:
            "Plasticidad ecológica",

        tamano:
            "Tamaño",

        velocidad:
            "Velocidad",

        inteligencia:
            "Inteligencia"

    };


    this.campos.forEach(
        campo => {

            const bloque =
                document.createElement("div");

            bloque.className =
                "fase2Stat";

            const etiqueta =
                document.createElement("strong");

            etiqueta.textContent =
                nombres[campo] + ":";

            bloque.appendChild(
                etiqueta
            );

            bloque.appendChild(
                document.createTextNode(
                    " " + stats[campo]
                )
            );

            contenedor.appendChild(
                bloque
            );

        }
    );

},


/*========================================================
MOSTRAR ANÁLISIS EN LIGHTBOX
========================================================*/

mostrarAnalisisLightbox(analisis){

    const contenedor =
        document.getElementById(
            "fase2Analisis"
        );

    if(!contenedor){
        return;
    }

    contenedor.innerHTML = "";


    const datos = [

        [
            "Índice global",
            analisis.indice_global
        ],

        [
            "Supervivencia",
            analisis.supervivencia
        ],

        [
            "Competencia",
            analisis.competencia
        ],

        [
            "Movilidad",
            analisis.movilidad
        ],

        [
            "Reproducción",
            analisis.reproduccion
        ]

    ];


    datos.forEach(
        dato => {

            const bloque =
                document.createElement("div");

            bloque.className =
                "fase2Analisis";

            const etiqueta =
                document.createElement("strong");

            etiqueta.textContent =
                dato[0] + ":";

            bloque.appendChild(
                etiqueta
            );

            bloque.appendChild(
                document.createTextNode(
                    " " + dato[1]
                )
            );

            contenedor.appendChild(
                bloque
            );

        }
    );

},


/*========================================================
ABRIR LIGHTBOX
========================================================*/

abrirLightbox(){

    const visor =
        document.getElementById(
            "visorInfoAvanzada"
        );

    if(!visor){
        return;
    }

    visor.style.display =
        "flex";

    document.body.style.overflow =
        "hidden";

},


/*========================================================
CERRAR LIGHTBOX
========================================================*/

cerrarLightbox(){

    const visor =
        document.getElementById(
            "visorInfoAvanzada"
        );

    if(!visor){
        return;
    }

    visor.style.display =
        "none";

    document.body.style.overflow =
        "";

},


/*========================================================
EJECUTAR
========================================================*/

ejecutar(registro){

    const stats =
        this.obtenerEstadisticas(
            registro
        );

    if(!stats){

        console.warn(
            "CAB09: no existen e1-e11 válidos en el registro."
        );

        return null;
    }


    const analisis =
        this.analizar(
            stats
        );


    /*
    Crear interfaz.
    */

    const boton =
        this.crearBoton();

    this.crearLightbox();


    /*
    Evitar registrar el evento varias veces.
    */

    if(
        boton &&
        !boton.dataset.cab09Activo
    ){

        boton.addEventListener(
            "click",
            () => {

                this.mostrarEstadisticasLightbox(
                    stats
                );

                this.mostrarAnalisisLightbox(
                    analisis
                );

                this.abrirLightbox();

            }
        );

        boton.dataset.cab09Activo =
            "true";

    }


    return {

        estadisticas:
            stats,

        analisis:
            analisis

    };

}

};


/*========================================================
EXPORTAR
========================================================*/

window.CAB09 =
    CAB09;


/*========================================================
INICIALIZACIÓN
========================================================
CAB09 NO inventa ni busca registros por su cuenta.
El generador debe llamar:

CAB09.ejecutar(registroActual);

cuando tenga disponible el registro de la Paleoficha.
========================================================*/


})(); 
