/*
============================================================
palentropía — arena
archivo: palarenamodificadores.js
versión: 1.0

GESTIÓN DE MODIFICADORES DE COMBATE

incluye:
- comprobación de efectos activos
- obtención de efectos activos
- aplicación de efectos
- actualización de efectos
- defensa efectiva
- movilidad efectiva
- iniciativa efectiva
- daño progresivo

============================================================
*/


/* ==========================================================
   COMPROBAR EFECTO
   ========================================================== */

function tieneEfectoArena(
    combatiente,
    codigo
) {

    return combatiente.efectos.some(
        function(efecto) {

            return efecto.codigo === codigo &&
                   efecto.turnos > 0;

        }
    );

}


/* ==========================================================
   OBTENER EFECTO ACTIVO
   ========================================================== */

function obtenerEfectoActivoArena(
    combatiente,
    codigo
) {

    return combatiente.efectos.find(
        function(efecto) {

            return efecto.codigo === codigo &&
                   efecto.turnos > 0;

        }
    ) || null;

}


/* ==========================================================
   APLICAR EFECTO
   ========================================================== */

function aplicarEfectoArena(
    atacante,
    objetivo,
    codigo
) {

    if (!codigo) {

        return null;

    }


    if (
        typeof obtenerEfectoArena !==
        "function"
    ) {

        return null;

    }


    const efectoBase =
        obtenerEfectoArena(
            codigo
        );


    if (!efectoBase) {

        return null;

    }


    /*
    ----------------------------------------------------------
    EFECTO INSTANTÁNEO
    ----------------------------------------------------------
    */

    if (
        codigo === "E001"
    ) {

        return {

            codigo:
                codigo,

            nombre:
                efectoBase.nombre,

            instantaneo:
                true,

            potencia:
                efectoBase.potencia

        };

    }


    /*
    ----------------------------------------------------------
    EFECTO TEMPORAL
    ----------------------------------------------------------
    */

    const efecto = {

        codigo:
            codigo,

        nombre:
            efectoBase.nombre,

        turnos:
            efectoBase.duracion,

        potencia:
            efectoBase.potencia

    };


    objetivo.efectos.push(
        efecto
    );


    return efecto;

}


/* ==========================================================
   ACTUALIZAR EFECTOS
   ========================================================== */

function actualizarEfectosArena(
    combatiente
) {

    combatiente.efectos.forEach(
        function(efecto) {

            efecto.turnos--;

        }
    );


    combatiente.efectos =
        combatiente.efectos.filter(
            function(efecto) {

                return efecto.turnos > 0;

            }
        );

}


/* ==========================================================
   DEFENSA EFECTIVA
   ========================================================== */

function obtenerDefensaEfectivaArena(
    combatiente
) {

    let defensa =
        combatiente.stats.defensa;


    const efecto =
        obtenerEfectoActivoArena(
            combatiente,
            "E003"
        );


    if (efecto) {

        defensa -=
            efecto.potencia;

    }


    return limitarArena(
        defensa,
        0,
        100
    );

}


/* ==========================================================
   MOVILIDAD EFECTIVA
   ========================================================== */

function obtenerMovilidadEfectivaArena(
    combatiente
) {

    let movilidad =
        combatiente.stats.movilidad;


    const efecto =
        obtenerEfectoActivoArena(
            combatiente,
            "E004"
        );


    if (efecto) {

        movilidad -=
            efecto.potencia;

    }


    return limitarArena(
        movilidad,
        0,
        100
    );

}


/* ==========================================================
   INICIATIVA EFECTIVA
   ========================================================== */

function obtenerIniciativaEfectivaArena(
    combatiente
) {

    let iniciativa =
        combatiente.iniciativa;


    const efecto =
        obtenerEfectoActivoArena(
            combatiente,
            "E006"
        );


    if (efecto) {

        iniciativa +=
            efecto.potencia;

    }


    return iniciativa;

}


/* ==========================================================
   DAÑO PROGRESIVO
   ========================================================== */

function aplicarDanioProgresivoArena(
    combatiente
) {

    const efecto =
        obtenerEfectoActivoArena(
            combatiente,
            "E005"
        );


    if (!efecto) {

        return null;

    }


    const dano =
        Number(
            efecto.potencia
        ) || 1;


    combatiente.hp -=
        dano;


    if (
        combatiente.hp <= 0
    ) {

        combatiente.hp = 0;

        combatiente.derrotado = true;

    }


    return {

        dano:
            dano,

        mensaje:
            combatiente.nombre +
            " recibe " +
            dano +
            " de daño progresivo."

    };

}


/*
============================================================
FIN PALARENA_MODIFICADORES
============================================================
*/
