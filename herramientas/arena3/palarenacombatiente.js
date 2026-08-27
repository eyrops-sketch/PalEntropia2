/* ==========================================================
   CREAR COMBATIENTE
   ========================================================== */

function crearCombatienteArena(datos) {

    /*
    ==========================================================
    STATS BASE
    ==========================================================
    */

    const statsBase =
        obtenerStatsArena(datos);


    /*
    ==========================================================
    INDICADORES DE COMBATE
    ==========================================================
    */

    let stats =
        statsBase;


    if (
        datos &&
        datos.indicadoresArena
    ) {

        stats = {

            ...statsBase,

            ataque:
                Number(
                    datos.indicadoresArena.ataque
                ) || 0,

            defensa:
                Number(
                    datos.indicadoresArena.defensa
                ) || 0,

            velocidad:
                Number(
                    datos.indicadoresArena.velocidad
                ) || 0,

            resistencia:
                Number(
                    datos.indicadoresArena.resistencia
                ) || 0,

            tactica:
                Number(
                    datos.indicadoresArena.tactica
                ) || 0

        };

    }


    /*
    ==========================================================
    HP BASE
    ==========================================================
    */

    const hpBase =
        limitarArena(
            Math.round(
                PALARENA.configuracion.hp_base +
                (stats.resistencia - 50) * 0.35 +
                (stats.defensa - 50) * 0.20 +
                (stats.tamano - 50) * 0.15
            ),
            70,
            140
        );


    /*
    ==========================================================
    ESCENARIO
    ==========================================================
    
    El escenario NO modifica estadísticas.

    Solo añade HP al HP base.

    El resultado del escenario debe estar disponible
    en datos.resultadoEscenario.
    */

    let hp =
        hpBase;

    let hpBonificacionEscenario =
        0;

    let bonificacionesEscenario =
        [];


    if (
        datos &&
        datos.resultadoEscenario &&
        typeof obtenerHPConEscenarioArena ===
        "function"
    ) {

        const hpEscenario =
            obtenerHPConEscenarioArena(
                {
                    ...datos,
                    hp_max: hpBase
                },
                datos.resultadoEscenario
            );


        if (
            hpEscenario
        ) {

            hp =
                hpEscenario.hp;

            hpBonificacionEscenario =
                hpEscenario.hp_bonificado;

            bonificacionesEscenario =
                hpEscenario.bonificaciones;

        }

    }


    /*
    ==========================================================
    INICIATIVA
    ==========================================================
    */

    const iniciativa =
        Math.round(
            stats.velocidad * 0.6 +
            stats.movilidad * 0.4
        );


    /*
    ==========================================================
    ATAQUE ESPECIAL
    ==========================================================
    */

    let ataqueEspecial =
        "A001";


    if (
        typeof asignarAtaqueArena ===
        "function"
    ) {

        ataqueEspecial =
            asignarAtaqueArena(datos);

    }


    /*
    ==========================================================
    COMBATIENTE
    ==========================================================
    */

    return {

        datos:
            datos,

        codigo:
            datos.j1 || "",

        nombre:
            datos.j2 || "Desconocido",

        imagen:
            datos.i3 || "",


        /*
        ------------------------------------------------------
        STATS
        ------------------------------------------------------
        */

        stats:
            stats,


        /*
        ------------------------------------------------------
        INDICADORES DEL ESCENARIO
        ------------------------------------------------------
        */

        indicadoresArena:
            datos.indicadoresArena || null,


        /*
        ------------------------------------------------------
        HP
        ------------------------------------------------------
        */

        hp_base:
            hpBase,

        hp_bonificacion_escenario:
            hpBonificacionEscenario,

        bonificaciones_escenario:
            bonificacionesEscenario,

        hp_max:
            hp,

        hp:
            hp,


        /*
        ------------------------------------------------------
        INICIATIVA
        ------------------------------------------------------
        */

        iniciativa:
            iniciativa,


        /*
        ------------------------------------------------------
        ATAQUE ESPECIAL
        ------------------------------------------------------
        */

        ataque_especial:
            ataqueEspecial,


        /*
        ------------------------------------------------------
        ESTADO DE COMBATE
        ------------------------------------------------------
        */

        defendiendo:
            false,

        efectos:
            [],

        derrotado:
            false

    };

}
