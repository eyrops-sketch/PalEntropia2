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

    Si prepararCombateArena() ya ha calculado
    indicadoresArena, utilizamos esos valores modificados.

    Los demás valores originales permanecen intactos.
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

    El HP se calcula exactamente como antes.

    Todavía no se aplica el escenario.
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
    BONIFICACIÓN DEL ESCENARIO
    ==========================================================

    El escenario se aplica DESPUÉS de obtener
    el HP base.

    No modificamos estadísticas.
    No hacemos conversiones de parámetros.

    Simplemente recibimos una cantidad de HP
    adicional y la información de las
    bonificaciones que la han producido.
    */

    let bonificacionEscenario = {

        total: 0,

        bonificaciones: []

    };


    if (
        typeof aplicarEscenarioArena ===
        "function"
    ) {

        const resultadoEscenario =
            aplicarEscenarioArena(
                datos,
                hpBase
            );


        if (
            resultadoEscenario
        ) {

            bonificacionEscenario = {

                total:
                    Number(
                        resultadoEscenario.total
                    ) || 0,

                bonificaciones:
                    Array.isArray(
                        resultadoEscenario.bonificaciones
                    )
                        ? resultadoEscenario.bonificaciones
                        : []

            };

        }

    }


    /*
    ==========================================================
    HP FINAL
    ==========================================================

    HP final = HP base + bonificación del escenario.
    */

    const hp =
        hpBase +
        bonificacionEscenario.total;


    /*
    ==========================================================
    INICIATIVA
    ==========================================================

    VELOCIDAD puede estar modificada por el escenario.

    MOVILIDAD continúa siendo el stat original
    de la ficha.
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

        Guardamos por separado el HP base y la
        bonificación para poder mostrarla posteriormente.
        */

        hp_base:
            hpBase,

        hp_bonificacion_escenario:
            bonificacionEscenario.total,

        bonificaciones_escenario:
            bonificacionEscenario.bonificaciones,

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
