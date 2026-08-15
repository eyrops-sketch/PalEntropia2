/*
========================================================
CAB09.js v1.0
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

    version: "1.0",

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
OBTENER VALORES E1-E11
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

    /*
    Todos los valores deben existir
    y ser numéricos.
    */

    if(valores.some(v => v === undefined || v === null || v === "")){
        return null;
    }

    const numeros = valores.map(Number);

    if(numeros.some(v => Number.isNaN(v))){
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
        valores.reduce((suma, valor) => suma + valor, 0)
        / valores.length
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
MOSTRAR ESTADÍSTICAS
========================================================*/

mostrarEstadisticas(stats){

    const contenedor =
        document.getElementById("estadisticas");

    if(!contenedor){
        return;
    }

    contenedor.innerHTML = `

        <div>Adaptabilidad: ${stats.adaptabilidad}</div>

        <div>Resistencia: ${stats.resistencia}</div>

        <div>Sociabilidad: ${stats.sociabilidad}</div>

        <div>Reproducción: ${stats.reproduccion}</div>

        <div>Ofensiva: ${stats.ofensiva}</div>

        <div>Defensa: ${stats.defensa}</div>

        <div>Movilidad: ${stats.movilidad}</div>

        <div>Plasticidad ecológica: ${stats.plasticidad_ecologica}</div>

        <div>Tamaño: ${stats.tamano}</div>

        <div>Velocidad: ${stats.velocidad}</div>

        <div>Inteligencia: ${stats.inteligencia}</div>

    `;

},


/*========================================================
MOSTRAR ANÁLISIS
========================================================*/

mostrarAnalisis(analisis){

    const contenedor =
        document.getElementById("bloqueAnalisis");

    if(!contenedor){
        return;
    }

    contenedor.innerHTML = `

        <div>Índice global: ${analisis.indice_global}</div>

        <div>Supervivencia: ${analisis.supervivencia}</div>

        <div>Competencia: ${analisis.competencia}</div>

        <div>Movilidad: ${analisis.movilidad}</div>

        <div>Reproducción: ${analisis.reproduccion}</div>

    `;

},


/*========================================================
EJECUTAR
========================================================*/

ejecutar(registro){

    const stats =
        this.obtenerEstadisticas(registro);

    if(!stats){
        console.warn(
            "CAB09: no existen e1-e11 válidos en el registro."
        );
        return null;
    }

    const analisis =
        this.analizar(stats);

    this.mostrarEstadisticas(stats);

    this.mostrarAnalisis(analisis);

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
