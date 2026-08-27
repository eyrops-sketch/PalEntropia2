/*
============================================================
palentropía — arena
archivo: aplicarescenario.js
versión: 1.1
============================================================

APLICACIÓN DEL ESCENARIO

Recibe:

    hpBase
    resultadoEscenario

Convierte las bonificaciones del escenario
en sumandos de HP.

REGLA:

    0  = +0 HP
    10 = +50 HP

Los valores intermedios son proporcionales.

NO modifica estadísticas.

SOLO modifica HP.

============================================================
*/


const PALARENA_APLICAR_ESCENARIO = {

    version:
        "1.1",

    hp_maximo:
        50,

    coincidencias_maximas:
        10

};


/*
============================================================
CONVERSIÓN PROPORCIONAL
============================================================
*/

function calcularHPBonificacionEscenario(
    valor
) {

    const coincidencias =
        Math.max(
            0,
            Math.min(
                PALARENA_APLICAR_ESCENARIO
                    .coincidencias_maximas,
                Number(valor) || 0
            )
        );


    if (
        coincidencias === 0
    ) {

        return 0;

    }


    return Math.round(
        (
            coincidencias /
            PALARENA_APLICAR_ESCENARIO
                .coincidencias_maximas
        ) *
        PALARENA_APLICAR_ESCENARIO
            .hp_maximo
    );

}


/*
============================================================
APLICAR ESCENARIO
============================================================

IMPORTANTE:

    hpBase
        = HP que ya tenía el combatiente

    resultado
        = resultado de PALARENA_ESCENARIO.evaluar()

============================================================
*/

function aplicarEscenarioArena(
    hpBase,
    resultado
) {

    /*
    --------------------------------------------------------
    HP BASE
    --------------------------------------------------------
    */

    const base =
        Number(hpBase) || 0;


    /*
    --------------------------------------------------------
    COMPROBAR RESULTADO
    --------------------------------------------------------
    */

    if (
        !resultado ||
        !resultado.bonificacion
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


    const bonificacion =
        resultado.bonificacion;


    /*
    ========================================================
    LISTA DE SUMANDOS
    ========================================================
    */

    const bonificaciones = [];


    /*
    ========================================================
    HÁBITATS
    ========================================================
    */

    const habitats =
        Number(
            bonificacion.habitats
        ) || 0;


    if (
        habitats > 0
    ) {

        const hp =
            calcularHPBonificacionEscenario(
                habitats
            );


        bonificaciones.push({

            nombre:
                "Hábitats",

            origen:
                "habitats",

            coincidencias:
                habitats,

            hp:
                hp

        });

    }


    /*
    ========================================================
    MODO DE VIDA
    ========================================================
    */

    if (
        bonificacion.modo === true
    ) {

        /*
        Una coincidencia de modo
        equivale a 1 coincidencia
        dentro de la escala proporcional.
        */

        const hp =
            calcularHPBonificacionEscenario(
                1
            );


        bonificaciones.push({

            nombre:
                "Modo de vida",

            origen:
                "modo",

            coincidencias:
                1,

            hp:
                hp

        });

    }


    /*
    ========================================================
    MEDIOS ECOLÓGICOS
    ========================================================
    */

    const medios =
        Number(
            bonificacion
                .medios
                ?.coincidencias
        ) || 0;


    if (
        medios > 0
    ) {

        const hp =
            calcularHPBonificacionEscenario(
                medios
            );


        bonificaciones.push({

            nombre:
                "Medios ecológicos",

            origen:
                "medios",

            coincidencias:
                medios,

            hp:
                hp

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
        function(item) {

            hpBonificado +=
                item.hp;

        }
    );


    /*
    ========================================================
    HP FINAL
    ========================================================
    */

    const hpTotal =
        base +
        hpBonificado;


    /*
    ========================================================
    RESULTADO
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
EXPORTACIÓN
============================================================
*/

window.PALARENA_APLICAR_ESCENARIO =
    PALARENA_APLICAR_ESCENARIO;


window.aplicarEscenarioArena =
    aplicarEscenarioArena;


window.calcularHPBonificacionEscenario =
    calcularHPBonificacionEscenario;
