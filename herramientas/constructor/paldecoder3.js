/*
========================================================
PALDECODER3.js v1.0
Motor de Análisis Estadístico
PalEntropía
========================================================
*/

window.PALDECODER3 = {

    // ==========
    // NIVEL 1
    // ==========

    indiceGlobal(stats){

        const suma =
            stats.adaptabilidad +
            stats.resistencia +
            stats.sociabilidad +
            stats.reproduccion +
            stats.ofensiva +
            stats.defensa +
            stats.movilidad +
            stats.plasticidad_ecologica +
            stats.tamano +
            stats.velocidad +
            stats.inteligencia;

        return Math.round(suma / 11);

    },

    supervivencia(stats){

        return Math.round(
            (
                stats.adaptabilidad +
                stats.resistencia +
                stats.defensa +
                stats.plasticidad_ecologica
            ) / 4
        );

    },

    competencia(stats){

        return Math.round(
            (
                stats.ofensiva +
                stats.tamano +
                stats.velocidad +
                stats.inteligencia
            ) / 4
        );

    },

    movilidad(stats){

        return Math.round(
            (
                stats.movilidad +
                stats.velocidad
            ) / 2
        );

    },

    reproduccion(stats){

        return Math.round(
            (
                stats.reproduccion +
                stats.sociabilidad
            ) / 2
        );

    },

    // ==========
    // NIVEL 2
    // ==========


        potencialDepredador(){},

    potencialPresa(){},

    adaptacionAmbiental(){},

    colonizacion(){},

    dominancia(){},

    resiliencia(){},

    // ==========
    // ANÁLISIS
    // ==========

    analizar(codigo){

        const stats = PALSTATS[codigo];

        if(!stats){
            return null;
        }

        return {

            codigo: codigo,
            nombre: stats.nombre,

            nivel1: {

                indice_global: this.indiceGlobal(stats),
                supervivencia: this.supervivencia(stats),
                competencia: this.competencia(stats),
                movilidad: this.movilidad(stats),
                reproduccion: this.reproduccion(stats)

            }

        };

    }

};



