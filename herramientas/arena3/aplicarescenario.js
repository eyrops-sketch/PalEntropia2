/*
============================================================
palentropía — arena
archivo: aplicarescenario.js
versión: 1.2
============================================================

APLICACIÓN DE ESCENARIO AL COMBATIENTE

FUNCIÓN:

Recibe:

- HP base
- bonificaciones del escenario

ÚNICAMENTE suma HP.

NO modifica:

- estadísticas
- ataque
- defensa
- velocidad
- resistencia
- inteligencia
- parámetros de combate

Cada bonificación conserva:

- nombre
- origen
- cantidad de HP

============================================================
*/


const PALARENA_APLICAR_ESCENARIO = {

    version:
        "1.2"

};


/*
============================================================
INDICADOR DE PRUEBA
============================================================

NO modifica ningún elemento HTML.

Solo confirma que la función está siendo ejecutada.

============================================================
*/

function mostrarIndicadorAplicarEscenario() {

    console.log(
        "🟢 APLICANDO ESCENARIO"
    );

}


/*
============================================================
APLICAR ESCENARIO
============================================================

Recibe:

hpBase
bonificacion

Ejemplo:

105

{

    bonificacionHabitats: 15,

    bonificacionModo: 10,

    bonificacionMedios: 20

}

Resultado:

105 + 15 + 10 + 20 = 150

============================================================
*/

function aplicarEscenarioArena(
    hpBase,
    bonificacion
) {


    /*
    ========================================================
    INDICADOR
    ========================================================
    */

    mostrarIndicadorAplicarEscenario();


    /*
    ========================================================
    HP BASE
    ========================================================
    */

    const base =
        Number(hpBase) || 0;


    /*
    ========================================================
    DATOS DEL ESCENARIO
    ========================================================
    */

    const datos =
        bonificacion || {};


    /*
    ========================================================
    LISTA DE BONIFICACIONES
    ========================================================
    */

    const bonificaciones = [];


    /*
    ========================================================
    HÁBITATS
    ========================================================
    */

    const hpHabitats =
        Number(
            datos.bonificacionHabitats
        ) || 0;


    if (
        hpHabitats > 0
    ) {

        bonificaciones.push({

            nombre:
                "Hábitats del escenario",

            origen:
                "hábitats",

            hp:
                hpHabitats

        });

    }


    /*
    ========================================================
    MODO DE VIDA
    ========================================================
    */

    const hpModo =
        Number(
            datos.bonificacionModo
        ) || 0;


    if (
        hpModo > 0
    ) {

        bonificaciones.push({

            nombre:
                "Modo de vida del escenario",

            origen:
                "modo",

            hp:
                hpModo

        });

    }


    /*
    ========================================================
    MEDIOS ECOLÓGICOS
    ========================================================
    */

    const hpMedios =
        Number(
            datos.bonificacionMedios
        ) || 0;


    if (
        hpMedios > 0
    ) {

        bonificaciones.push({

            nombre:
                "Medios ecológicos del escenario",

            origen:
                "medios",

            hp:
                hpMedios

        });

    }


    /*
    ========================================================
    SUMAR BONIFICACIONES
    ========================================================
    */

    let hpBonificado =
        0;


    bonificaciones.forEach(
        function(bonificacion) {

            hpBonificado +=
                Number(
                    bonificacion.hp
                ) || 0;

        }
    );


    /*
    ========================================================
    HP TOTAL
    ========================================================
    */

    const hpTotal =
        base +
        hpBonificado;


    /*
    ========================================================
    DEVOLVER RESULTADO
    ========================================================
    */

    return {

        hp_base:
            base,

        hp_bonificado:
            hpBonificado,

        hp_total:
            hpTotal,

        bonificaciones:
            bonificaciones

    };

}


/*
============================================================
FUNCIÓN DIRECTA PARA EL COMBATIENTE
============================================================
*/

function obtenerHPConEscenarioArena(
    hpBase,
    bonificacion
) {

    return aplicarEscenarioArena(
        hpBase,
        bonificacion
    );

}


/*
============================================================
EXPORTACIÓN GLOBAL
============================================================
*/

window.PALARENA_APLICAR_ESCENARIO =
    PALARENA_APLICAR_ESCENARIO;


window.aplicarEscenarioArena =
    aplicarEscenarioArena;


window.obtenerHPConEscenarioArena =
    obtenerHPConEscenarioArena;


/*
============================================================
FIN APLICARESCENARIO
============================================================
*/
