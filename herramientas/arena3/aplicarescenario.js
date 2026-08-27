/*
============================================================
palentropía — arena
archivo: aplicarescenario.js
versión: 1.0
============================================================

APLICACIÓN DIRECTA DEL ESCENARIO

FUNCIÓN:

Recibe:

- HP base del combatiente
- bonificaciones obtenidas por el escenario

NO modifica estadísticas.

NO convierte estadísticas.

NO modifica ofensiva, defensa, velocidad,
resistencia ni inteligencia.

ÚNICAMENTE SUMA HP.

Cada bonificación conserva:

- nombre
- HP

============================================================
*/


const PALARENA_APLICAR_ESCENARIO = {

    version: "1.0",

    hp_maximo:
        50,

    coincidencias_maximas:
        10

};


/*
============================================================
CONVERSIÓN PROPORCIONAL
============================================================

0  coincidencias = 0 HP
10 coincidencias = 50 HP

============================================================
*/

function calcularHPBonificacionEscenario(
    coincidencias
) {

    const valor =
        Number(coincidencias) || 0;


    const limitado =
        Math.max(
            0,
            Math.min(
                PALARENA_APLICAR_ESCENARIO
                    .coincidencias_maximas,
                valor
            )
        );


    return Math.round(
        limitado /
        PALARENA_APLICAR_ESCENARIO
            .coincidencias_maximas
        *
        PALARENA_APLICAR_ESCENARIO
            .hp_maximo
    );

}


/*
============================================================
APLICAR BONIFICACIONES AL HP
============================================================

hpBase:

HP que ya tenía el combatiente.

bonificaciones:

Array con:

{
    nombre: "...",
    coincidencias: 3
}

============================================================
*/

function aplicarEscenarioArena(
    hpBase,
    bonificaciones
) {

    const base =
        Number(hpBase) || 0;


    if (
        !Array.isArray(bonificaciones)
    ) {

        return {

            hp_base:
                base,

            hp_bonificado:
                0,

            hp_total:
                base,

            bonificaciones:
                []

        };

    }


    const lista = [];


    bonificaciones.forEach(
        function(bonificacion) {

            const coincidencias =
                Number(
                    bonificacion.coincidencias
                ) || 0;


            if (
                coincidencias <= 0
            ) {

                return;

            }


            const hp =
                calcularHPBonificacionEscenario(
                    coincidencias
                );


            lista.push({

                nombre:
                    bonificacion.nombre ||
                    "Bonificación del escenario",

                hp:
                    hp

            });

        }
    );


    /*
    ========================================================
    SUMA TOTAL
    ========================================================
    */

    let totalBonificacion = 0;


    lista.forEach(
        function(bonificacion) {

            totalBonificacion +=
                bonificacion.hp;

        }
    );


    /*
    ========================================================
    RESULTADO
    ========================================================
    */

    return {

        hp_base:
            base,

        hp_bonificado:
            totalBonificacion,

        hp_total:
            base +
            totalBonificacion,

        bonificaciones:
            lista

    };

}


/*
============================================================
EXPORTACIÓN
============================================================
*/

window.PALARENA_APLICAR_ESCENARIO =
    PALARENA_APLICAR_ESCENARIO;


window.aplicarEscenarioArena =
    aplicarEscenarioArena;


window.calcularHPBonificacionEscenario =
    calcularHPBonificacionEscenario;
