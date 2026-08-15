/*
========================================================
CAB09.js v1.2
Estadísticas + Análisis Estadístico + Lightbox
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

CAB09:
- SOLO lee e1-e11.
- NO inventa datos.
- NO modifica el registro.
- NO modifica el CSV.
- Calcula únicamente las fórmulas establecidas.
========================================================
*/

(function(){

"use strict";


/*========================================================
CONFIGURACIÓN
========================================================*/

const CAB09 = {

    version: "1.2",


/*========================================================
OBTENER ESTADÍSTICAS
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
        console.warn(
            "CAB09: faltan uno o varios campos e1-e11."
        );

        return null;
    }

    const numeros = valores.map(Number);

    if(
        numeros.some(
            valor => Number.isNaN(valor)
        )
    ){
        console.warn(
            "CAB09: uno o varios campos e1-e11 no son numéricos."
        );

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
        return null;
    }

    return Math.round(
        valores.reduce(
            (suma, valor) => suma + valor,
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


/*========================================================
CREAR BOTÓN
========================================================*/

crearBoton(){

    const ficha =
        document.getElementById("ficha");

    if(!ficha){
        return;
    }


    /*
    Evitar duplicados.
    */

    if(
        document.getElementById(
            "botonEstadisticasCAB09"
        )
    ){
        return;
    }


    const boton =
        document.createElement("button");


    boton.id =
        "botonEstadisticasCAB09";


    boton.type =
        "button";


    boton.title =
        "Estadísticas";


    boton.setAttribute(
        "aria-label",
        "Abrir estadísticas"
    );


    boton.innerHTML =
        "Σ";


    /*
    IMPORTANTE:
    El botón se inserta DIRECTAMENTE
    dentro de #ficha.
    */

    ficha.appendChild(boton);


    boton.addEventListener(
        "click",
        () => {

            this.abrirLightbox();

        }
    );

},


/*========================================================
CREAR LIGHTBOX
========================================================*/

crearLightbox(){

    if(
        document.getElementById(
            "visorEstadisticasCAB09"
        )
    ){
        return;
    }


    const visor =
        document.createElement("div");


    visor.id =
        "visorEstadisticasCAB09";


    visor.innerHTML = `

        <div
            id="ventanaEstadisticasCAB09"
            role="dialog"
            aria-modal="true"
            aria-label="Estadísticas"
        >

            <button
                id="cerrarEstadisticasCAB09"
                type="button"
                aria-label="Cerrar estadísticas"
            >
                ×
            </button>


            <h2>
                Estadísticas
            </h2>


            <div
                id="estadisticas"
                class="stats"
            ></div>


            <h2>
                Análisis estadístico
            </h2>


            <div
                id="bloqueAnalisis"
                class="analisisEstadisticoCAB09"
            ></div>

        </div>

    `;


    document.body.appendChild(visor);


    const cerrar =
        document.getElementById(
            "cerrarEstadisticasCAB09"
        );


    cerrar.addEventListener(
        "click",
        () => {

            this.cerrarLightbox();

        }
    );


    /*
    Cerrar pulsando fuera de la ventana.
    */

    visor.addEventListener(
        "click",
        (evento) => {

            if(
                evento.target === visor
            ){

                this.cerrarLightbox();

            }

        }
    );


    /*
    Cerrar con ESC.
    */

    document.addEventListener(
        "keydown",
        (evento) => {

            if(
                evento.key === "Escape"
            ){

                this.cerrarLightbox();

            }

        }
    );

},


/*========================================================
ABRIR LIGHTBOX
========================================================*/

abrirLightbox(){

    const visor =
        document.getElementById(
            "visorEstadisticasCAB09"
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
            "visorEstadisticasCAB09"
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
MOSTRAR ESTADÍSTICAS
========================================================*/

mostrarEstadisticas(stats){

    const contenedor =
        document.getElementById(
            "estadisticas"
        );

    if(!contenedor){
        return;
    }


    contenedor.innerHTML = `

        <div>
            Adaptabilidad: ${stats.adaptabilidad}
        </div>

        <div>
            Resistencia: ${stats.resistencia}
        </div>

        <div>
            Sociabilidad: ${stats.sociabilidad}
        </div>

        <div>
            Reproducción: ${stats.reproduccion}
        </div>

        <div>
            Ofensiva: ${stats.ofensiva}
        </div>

        <div>
            Defensa: ${stats.defensa}
        </div>

        <div>
            Movilidad: ${stats.movilidad}
        </div>

        <div>
            Plasticidad ecológica:
            ${stats.plasticidad_ecologica}
        </div>

        <div>
            Tamaño: ${stats.tamano}
        </div>

        <div>
            Velocidad: ${stats.velocidad}
        </div>

        <div>
            Inteligencia: ${stats.inteligencia}
        </div>

    `;

},


/*========================================================
MOSTRAR ANÁLISIS
========================================================*/

mostrarAnalisis(analisis){

    const contenedor =
        document.getElementById(
            "bloqueAnalisis"
        );

    if(!contenedor){
        return;
    }


    contenedor.innerHTML = `

        <div>
            Índice global:
            ${analisis.indice_global}
        </div>

        <div>
            Supervivencia:
            ${analisis.supervivencia}
        </div>

        <div>
            Competencia:
            ${analisis.competencia}
        </div>

        <div>
            Movilidad:
            ${analisis.movilidad}
        </div>

        <div>
            Reproducción:
            ${analisis.reproduccion}
        </div>

    `;

},


/*========================================================
EJECUTAR
========================================================*/

ejecutar(registro){

    /*
    Crear infraestructura visual.
    */

    this.crearBoton();

    this.crearLightbox();


    /*
    Leer e1-e11.
    */

    const stats =
        this.obtenerEstadisticas(
            registro
        );


    /*
    Si faltan datos:
    no mostrar datos falsos.
    */

    if(!stats){

        const estadisticas =
            document.getElementById(
                "estadisticas"
            );

        const analisis =
            document.getElementById(
                "bloqueAnalisis"
            );


        if(estadisticas){
            estadisticas.innerHTML = "";
        }


        if(analisis){
            analisis.innerHTML = "";
        }


        return null;

    }


    /*
    Calcular análisis.
    */

    const analisis =
        this.analizar(stats);


    /*
    Mostrar datos reales.
    */

    this.mostrarEstadisticas(
        stats
    );


    this.mostrarAnalisis(
        analisis
    );


    /*
    Devolver resultado.
    */

    return {

        estadisticas: stats,

        analisis: analisis

    };

}

};


/*========================================================
EXPORTAR
========================================================*/

window.CAB09 = CAB09;


/*========================================================
FIN CAB09
========================================================*/

})();
