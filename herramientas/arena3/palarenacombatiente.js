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

    El escenario ya sabe calcular las coincidencias.

    Aquí solamente obtenemos ese resultado y lo
    entregamos a aplicarescenario.js.

    NO modificamos estadísticas.
    */

    let hpFinal =
        hpBase;


    let bonificacionesEscenario =
        [];


    if (
        window.PALARENA_ESCENARIO &&
        typeof window.PALARENA_ESCENARIO.evaluar ===
        "function" &&
        typeof window.aplicarEscenarioArena ===
        "function"
    ) {

        const resultadoEscenario =
            window.PALARENA_ESCENARIO.evaluar(
                datos.j1
            );


        if (
            resultadoEscenario
        ) {

            const aplicado =
                window.aplicarEscenarioArena(
                    hpBase,
                    resultadoEscenario.bonificacion
                );


            if (
                aplicado
            ) {

                hpFinal =
                    aplicado.hp_total;


                bonificacionesEscenario =
                    aplicado.bonificaciones;

            }

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
            hpFinal -
            hpBase,

        bonificaciones_escenario:
            bonificacionesEscenario,

        hp_max:
            hpFinal,

        hp:
            hpFinal,


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
        ESTADO
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
