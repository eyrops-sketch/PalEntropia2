palarenacombate.js

/*
========================================================
PALARENA
palarenacombate.js v1.0
PalEntropía

CREACIÓN Y EJECUCIÓN DEL COMBATE.

Contiene:
- crearCombateArena()
- ejecutarTurnoArena()

No contiene interfaz.
========================================================
*/


/* ==========================================================
   CREAR COMBATE
   ========================================================== */

function crearCombateArena(
    datos1,
    datos2
) {

    const combatiente1 =
        crearCombatienteArena(
            datos1
        );

    const combatiente2 =
        crearCombatienteArena(
            datos2
        );


    return {

        estado: "preparado",

        turno: 0,

        combatiente1:
            combatiente1,

        combatiente2:
            combatiente2,

        actual: null,

        ganador: null,

        historial: []

    };

}


/* ==========================================================
   EJECUTAR TURNO
   ========================================================== */

function ejecutarTurnoArena(
    combate
) {

    if (
        combate.estado === "finalizado"
    ) {

        return {

            terminado: true,

            ganador:
                combate.ganador

        };

    }


    if (
        combate.turno >=
        PALARENA.configuracion.max_turnos
    ) {

        finalizarCombatePorLimiteArena(
            combate
        );

        return {

            terminado: true,

            ganador:
                combate.ganador

        };

    }


    combate.turno++;


    const c1 =
        combate.combatiente1;

    const c2 =
        combate.combatiente2;


    const primero =
        determinarPrimeroArena(
            c1,
            c2
        );


    const segundo =
        primero === c1
            ? c2
            : c1;


    const orden = [
        primero,
        segundo
    ];


    combate.actual =
        primero.codigo;


    /*
    ----------------------------------------------------------
    Las dos criaturas actúan en orden de iniciativa.
    ----------------------------------------------------------
    */

    for (
        let i = 0;
        i < orden.length;
        i++
    ) {

        const atacante =
            orden[i];

        const objetivo =
            atacante === c1
                ? c2
                : c1;


        if (
            atacante.derrotado ||
            objetivo.derrotado
        ) {

            continue;

        }


        const accion =
            decidirAccionArena(
                atacante,
                objetivo
            );


        let resultado;


        if (accion === "defender") {

            resultado =
                ejecutarDefensaArena(
                    atacante
                );

        } else {

            resultado =
                ejecutarAccionArena(
                    atacante,
                    objetivo,
                    accion
                );

        }


        /*
        ------------------------------------------------------
        Registrar acción.
        ------------------------------------------------------
        */

        combate.historial.push({

            turno:
                combate.turno,

            codigo_atacante:
                atacante.codigo,

            atacante:
                atacante.nombre,

            codigo_objetivo:
                objetivo.codigo,

            objetivo:
                objetivo.nombre,

            accion:
                accion,

            resultado:
                resultado

        });


        /*
        ------------------------------------------------------
        Comprobar derrota.
        ------------------------------------------------------
        */

        if (
            objetivo.derrotado
        ) {

            finalizarCombateArena(
                combate,
                atacante
            );

            break;

        }

    }


    /*
    ----------------------------------------------------------
    Daño progresivo al finalizar el turno.
    ----------------------------------------------------------
    */

    if (
        combate.estado !== "finalizado"
    ) {

        const dano1 =
            aplicarDanioProgresivoArena(c1);

        const dano2 =
            aplicarDanioProgresivoArena(c2);


        if (dano1) {

            combate.historial.push({

                turno:
                    combate.turno,

                tipo:
                    "efecto",

                objetivo:
                    c1.nombre,

                resultado:
                    dano1

            });

        }


        if (dano2) {

            combate.historial.push({

                turno:
                    combate.turno,

                tipo:
                    "efecto",

                objetivo:
                    c2.nombre,

                resultado:
                    dano2

            });

        }

    }


    /*
    ----------------------------------------------------------
    Comprobar derrota por efecto.
    ----------------------------------------------------------
    */

    if (
        combate.estado !== "finalizado"
    ) {

        if (
            c1.derrotado ||
            c2.derrotado
        ) {

            const ganador =
                c1.derrotado
                    ? c2
                    : c1;

            finalizarCombateArena(
                combate,
                ganador
            );

        }

    }


    /*
    ----------------------------------------------------------
    Actualizar duración de efectos.
    ----------------------------------------------------------
    */

    actualizarEfectosArena(c1);

    actualizarEfectosArena(c2);


    /*
    ----------------------------------------------------------
    Si continúa, limpiar defensas.
    ----------------------------------------------------------
    */

    if (
        combate.estado !== "finalizado"
    ) {

        c1.defendiendo = false;
        c2.defendiendo = false;

    }


    return {

        terminado:
            combate.estado === "finalizado",

        turno:
            combate.turno,

        historial:
            combate.historial,

        ganador:
            combate.ganador

    };

}


/*
========================================================
FIN PALARENA_COMBATE
========================================================
*/
