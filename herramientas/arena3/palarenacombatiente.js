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
    HP
    ==========================================================

    Utiliza los indicadores modificados de:

    RESISTENCIA
    DEFENSA

    y mantiene TAMAÑO como característica original.
    */

    const hp =
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
    INICIATIVA
    ==========================================================

    VELOCIDAD puede estar modificada por el escenario.

    MOVILIDAD continúa siendo el stat original de la ficha.
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

        datos: datos,

        codigo:
            datos.j1 || "",

        nombre:
            datos.j2 || "Desconocido",

        imagen:
            datos.i3 || "",

        /*
        Stats completos para el motor.
        Los 5 indicadores afectados por
        escenario ya están modificados.
        */

        stats:
            stats,

        /*
        Guardamos también explícitamente
        los indicadores modificados.
        */

        indicadoresArena:
            datos.indicadoresArena || null,

        hp_max:
            hp,

        hp:
            hp,

        iniciativa:
            iniciativa,

        ataque_especial:
            ataqueEspecial,

        defendiendo:
            false,

        efectos:
            [],

        derrotado:
            false

    };

}
