/*
============================================================
palentropía — arena
archivo: aplicarescenario.js
versión: 1.1
============================================================

APLICACIÓN DE ESCENARIO AL COMBATIENTE

FUNCIÓN:

Recibe:

- HP base del combatiente
- bonificación ya calculada por el escenario

NO recalcula el escenario.

NO modifica estadísticas.

ÚNICAMENTE:

HP BASE
+
BONIFICACIÓN ESCENARIO
=
HP TOTAL

Además conserva la denominación de cada bonificación.

============================================================
*/


const PALARENA_APLICAR_ESCENARIO = {

    version:
        "1.1"

};


/*
============================================================
INDICADOR DE PRUEBA
============================================================

Sirve para comprobar visualmente que esta función
está siendo ejecutada.

============================================================
*/

function mostrarIndicadorAplicarEscenario() {

    const resultado =
        document.getElementById("resultado");


    if (!resultado) {

        return;

    }


    resultado.innerHTML = `

        <div
            style="
                padding:12px;
                margin-bottom:12px;
                border:2px solid #00ff88;
                border-radius:8px;
                text-align:center;
                font-weight:bold;
            "
        >

            🟢 APLICANDO ESCENARIO

        </div>

    `;

}


/*
============================================================
APLICAR ESCENARIO
============================================================

Recibe:

hpBase
bonificacion

Ejemplo:

aplicarEscenarioArena(
    105,
    {
        bonificacionHabitats: 15,
        bonificacionModo: 10,
        bonificacionMedios: 20
    }
);

Resultado:

HP base: 105

+15 HP — Hábitats del escenario
+10 HP — Modo de vida del escenario
+20 HP — Medios ecológicos del escenario

Total bonificación: +45 HP

HP total: 150

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
    BONIFICACIÓN
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
    --------------------------------------------------------
    HÁBITATS
    --------------------------------------------------------
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
    --------------------------------------------------------
    MODO DE VIDA
    --------------------------------------------------------
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
    --------------------------------------------------------
    MEDIOS ECOLÓGICOS
    --------------------------------------------------------
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
    TOTAL DE BONIFICACIÓN
    ========================================================
    */

    let hpBonificado = 0;


    bonificaciones.forEach(
        function(item) {

            hpBonificado +=
                Number(item.hp) || 0;

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
OBTENER HP CON ESCENARIO
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
FIN
============================================================
*/
