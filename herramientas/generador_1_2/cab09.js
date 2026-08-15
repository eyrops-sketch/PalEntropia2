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
OBTENER ESTADÍSTICAS E1-E11
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
            v => v === undefined ||
                 v === null ||
                 v === ""
        )
    ){
        return null;
    }

    const numeros = valores.map(Number);

    if(
        numeros.some(
            v => Number.isNaN(v)
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
CREAR BOTÓN ESTADÍSTICAS
========================================================*/

crearBoton(){

    if(
        document.getElementById(
            "botonEstadisticasCAB09"
        )
    ){
        return;
    }

    const ficha =
        document.getElementById("ficha");

    if(!ficha){
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

    boton.innerHTML = "Σ";

    boton.addEventListener(
        "click",
        () => {

            const visor =
                document.getElementById(
                    "visorEstadisticasCAB09"
                );

            if(visor){
                visor.style.display =
                    "flex";
            }

        }
    );

    ficha.appendChild(boton);

},


/*========================================================
CREAR VISOR ESTADÍSTICO
========================================================*/

crearVisor(){

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
        >

            <button
                type="button"
                id="cerrarEstadisticasCAB09"
                class="botonCerrarEstadisticasCAB09"
                aria-label="Cerrar estadísticas"
            >
                ×
            </button>

            <h2>Estadísticas</h2>

            <div
                id="estadisticasCAB09"
                class="stats"
            ></div>

            <h2>Análisis estadístico</h2>

            <div
                id="bloqueAnalisisCAB09"
                class="analisisCAB09"
            ></div>

        </div>

    `;

    document.body.appendChild(visor);


    /*----------------------------------------------
    CERRAR
    ----------------------------------------------*/

    const cerrar =
        document.getElementById(
            "cerrarEstadisticasCAB09"
        );

    cerrar.addEventListener(
        "click",
        () => {

            visor.style.display =
                "none";

        }
    );


    /*----------------------------------------------
    CERRAR AL PULSAR FUERA
    ----------------------------------------------*/

    visor.addEventListener(
        "click",
        (evento) => {

            if(
                evento.target === visor
            ){

                visor.style.display =
                    "none";

            }

        }
    );


    /*----------------------------------------------
    ESC
    ----------------------------------------------*/

    document.addEventListener(
        "keydown",
        (evento) => {

            if(
                evento.key === "Escape"
            ){

                visor.style.display =
                    "none";

            }

        }
    );

},


/*========================================================
MOSTRAR ESTADÍSTICAS
========================================================*/

mostrarEstadisticas(stats){

    const contenedor =
        document.getElementById(
            "estadisticasCAB09"
        );

    if(!contenedor){
        return;
    }

    contenedor.innerHTML = `

        <div>
            Adaptabilidad:
            ${stats.adaptabilidad}
        </div>

        <div>
            Resistencia:
            ${stats.resistencia}
        </div>

        <div>
            Sociabilidad:
            ${stats.sociabilidad}
        </div>

        <div>
            Reproducción:
            ${stats.reproduccion}
        </div>

        <div>
            Ofensiva:
            ${stats.ofensiva}
        </div>

        <div>
            Defensa:
            ${stats.defensa}
        </div>

        <div>
            Movilidad:
            ${stats.movilidad}
        </div>

        <div>
            Plasticidad ecológica:
            ${stats.plasticidad_ecologica}
        </div>

        <div>
            Tamaño:
            ${stats.tamano}
        </div>

        <div>
            Velocidad:
            ${stats.velocidad}
        </div>

        <div>
            Inteligencia:
            ${stats.inteligencia}
        </div>

    `;

},


/*========================================================
MOSTRAR ANÁLISIS
========================================================*/

mostrarAnalisis(analisis){

    const contenedor =
        document.getElementById(
            "bloqueAnalisisCAB09"
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
        this.analizar(stats);


    /*
    Crear elementos visuales
    */

    this.crearBoton();

    this.crearVisor();


    /*
    Mostrar datos
    */

    this.mostrarEstadisticas(
        stats
    );

    this.mostrarAnalisis(
        analisis
    );


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
FIN CAB09
========================================================*/

})();

