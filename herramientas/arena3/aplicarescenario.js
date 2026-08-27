/*
============================================================
palentropía — arena
archivo: aplicarescenario.js
versión: 1.0
============================================================

APLICACIÓN DE ESCENARIO AL COMBATIENTE

FUNCIÓN:

Recibe una Paleoficha y el resultado del escenario.

Calcula exclusivamente la bonificación de HP
producida por el escenario.

REGLA:

0 coincidencias  = +0 HP
10 coincidencias = +50 HP

Los valores intermedios se calculan proporcionalmente.

IMPORTANTE:

Este módulo NO modifica:

- estadísticas
- ofensiva
- defensa
- velocidad
- resistencia
- inteligencia
- parámetros de combate

Únicamente añade HP procedente del escenario.

Cada bonificación conserva:

- cantidad de HP
- denominación
- origen

============================================================
*/


const PALARENA_APLICAR_ESCENARIO = {

    version: "1.0",


    /*
    ========================================================
    CONFIGURACIÓN
    ========================================================
    */

    hp_maximo_bonificacion: 50,

    coincidencias_maximas: 10


};


/*
============================================================
CALCULAR HP PROPORCIONAL
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


    if (limitado === 0) {

        return 0;

    }


    const hp =
        limitado /
        PALARENA_APLICAR_ESCENARIO
            .coincidencias_maximas
        *
        PALARENA_APLICAR_ESCENARIO
            .hp_maximo_bonificacion;


    return Math.round(hp);

}


/*
============================================================
APLICAR ESCENARIO
============================================================

Recibe:

ficha
resultado de PALARENA_ESCENARIO.evaluar()

Devuelve:

{

    hp_base,
    hp_bonificado,
    hp_total,
    bonificaciones: []

}

============================================================
*/

function aplicarEscenarioArena(
    ficha,
    resultado
) {

    if (!ficha || !resultado) {

        return null;

    }


    /*
    --------------------------------------------------------
    HP BASE
    --------------------------------------------------------
    */

    const hpBase =
        Number(
            ficha.hp_max
        ) ||
        Number(
            ficha.hp
        ) ||
        100;


    /*
    --------------------------------------------------------
    BONIFICACIÓN DEL ESCENARIO
    --------------------------------------------------------
    */

    const bonificacion =
        resultado.bonificacion || {};


    /*
    ========================================================
    LISTA DE BONIFICACIONES
    ========================================================
    */

    const bonificaciones = [];


    /*
    --------------------------------------------------------
    HÁBITATS
    --------------------------------------------------------
    */

    const coincidenciasHabitats =
        Number(
            bonificacion.habitats
        ) || 0;


    if (
        coincidenciasHabitats > 0
    ) {

        const hp =
            calcularHPBonificacionEscenario(
                coincidenciasHabitats
            );


        bonificaciones.push({

            nombre:
                "Hábitats del escenario",

            origen:
                "hábitats",

            coincidencias:
                coincidenciasHabitats,

            hp:
                hp

        });

    }


    /*
    --------------------------------------------------------
    MODO DE VIDA
    --------------------------------------------------------
    */

    if (
        bonificacion.modo
    ) {

        const hp =
            calcularHPBonificacionEscenario(
                1
            );


        bonificaciones.push({

            nombre:
                "Modo de vida del escenario",

            origen:
                "modo",

            coincidencias:
                1,

            hp:
                hp

        });

    }


    /*
    --------------------------------------------------------
    MEDIOS ECOLÓGICOS
    --------------------------------------------------------
    */

    const coincidenciasMedios =
        Number(
            bonificacion
                .medios
                ?.coincidencias
        ) || 0;


    if (
        coincidenciasMedios > 0
    ) {

        const hp =
            calcularHPBonificacionEscenario(
                coincidenciasMedios
            );


        bonificaciones.push({

            nombre:
                "Medios ecológicos del escenario",

            origen:
                "medios",

            coincidencias:
                coincidenciasMedios,

            hp:
                hp

        });

    }


    /*
    ========================================================
    TOTAL HP DE ESCENARIO
    ========================================================
    */

    let hpBonificado = 0;


    bonificaciones.forEach(
        function(bonificacion) {

            hpBonificado +=
                bonificacion.hp;

        }
    );


    /*
    --------------------------------------------------------
    HP TOTAL
    --------------------------------------------------------
    */

    const hpTotal =
        hpBase +
        hpBonificado;


    /*
    ========================================================
    RESULTADO
    ========================================================
    */

    return {

        hp_base:
            hpBase,

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
FUNCIÓN DIRECTA PARA UN COMBATIENTE
============================================================

Permite que cada combatiente llame directamente
a esta función.

============================================================
*/

function obtenerHPConEscenarioArena(
    ficha,
    resultado
) {

    const aplicacion =
        aplicarEscenarioArena(
            ficha,
            resultado
        );


    if (!aplicacion) {

        return null;

    }


    return {

        hp:
            aplicacion.hp_total,

        hp_base:
            aplicacion.hp_base,

        hp_bonificado:
            aplicacion.hp_bonificado,

        bonificaciones:
            aplicacion.bonificaciones

    };

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


window.calcularHPBonificacionEscenario =
    calcularHPBonificacionEscenario;
