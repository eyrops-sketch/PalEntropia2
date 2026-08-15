/*
========================================================
CAB09.js v1.2
PalEntropía
Estadísticas y Análisis Estadístico
========================================================

FUENTE DE DATOS
---------------
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

CAB09:
- Lee e1-e11.
- Calcula estadísticas derivadas.
- Crea el botón ⓘ dentro de #ficha.
- Crea el visor a pantalla completa.
- Crea la ventana centrada.
- Muestra estadísticas.
- Muestra análisis.
- No modifica el registro.
========================================================
*/

(function(){

"use strict";


const CAB09 = {

    version: "1.2",


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


    /*====================================================
      OBTENER ESTADÍSTICAS
    ====================================================*/

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

        const numeros =
            valores.map(Number);

        if(
            numeros.some(
                valor =>
                    Number.isNaN(valor)
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


    /*====================================================
      MEDIA
    ====================================================*/

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


    /*====================================================
      ANÁLISIS
    ====================================================*/

    analizar(stats){

        if(!stats){
            return null;
        }

        return {

            indice_global:
                this.media([

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

            supervivencia:
                this.media([

                    stats.adaptabilidad,
                    stats.resistencia,
                    stats.defensa,
                    stats.plasticidad_ecologica

                ]),

            competencia:
                this.media([

                    stats.ofensiva,
                    stats.tamano,
                    stats.velocidad,
                    stats.inteligencia

                ]),

            movilidad:
                this.media([

                    stats.movilidad,
                    stats.velocidad

                ]),

            reproduccion:
                this.media([

                    stats.reproduccion,
                    stats.sociabilidad

                ])

        };

    },


    /*====================================================
      CREAR BOTÓN
    ====================================================*/

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
        El botón pertenece directamente
        a #ficha.
        */

        ficha.appendChild(boton);

        return boton;

    },


    /*====================================================
      CREAR LIGHTBOX
    ====================================================*/

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

        visor.setAttribute(
            "aria-hidden",
            "true"
        );


        /*================================================
          VENTANA
        =================================================*/

        const ventana =
            document.createElement("div");

        ventana.id =
            "ventanaInfoAvanzada";


        /*================================================
          BOTÓN CERRAR
        =================================================*/

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

        cerrar.innerHTML =
            "×";


        /*================================================
          TÍTULO
        =================================================*/

        const titulo =
            document.createElement("h2");

        titulo.textContent =
            "Información estadística";


        /*================================================
          BLOQUE ESTADÍSTICAS
        =================================================*/

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


        /*================================================
          BLOQUE ANÁLISIS
        =================================================*/

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


        /*================================================
          CONSTRUIR DOM
        =================================================*/

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

        /*
        El visor se añade directamente al body.
        NO queda dentro de #ficha.
        */

        document.body.appendChild(
            visor
        );


        /*================================================
          CERRAR
        =================================================*/

        cerrar.addEventListener(
            "click",
            () => {

                this.cerrarLightbox();

            }
        );


        /*================================================
          CERRAR PULSANDO EL FONDO
        =================================================*/

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


    /*====================================================
      MOSTRAR ESTADÍSTICAS
    ====================================================*/

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


    /*====================================================
      MOSTRAR ANÁLISIS
    ====================================================*/

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


    /*====================================================
      ABRIR
    ====================================================*/

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

        visor.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";

    },


    /*====================================================
      CERRAR
    ====================================================*/

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

        visor.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

    },


    /*====================================================
      EJECUTAR
    ====================================================*/

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


        const boton =
            this.crearBoton();


        this.crearLightbox();


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


window.CAB09 =
    CAB09;


})();
