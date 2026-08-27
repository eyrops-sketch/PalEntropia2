/* ==========================================================
   PALENTROPÍA — ARENA
   archivo: palarenacombatiente.js
   versión: 1.5
   ========================================================== */


/* ==========================================================
   INDICADOR DE ESCENARIO
   ========================================================== */

function mostrarEstadoEscenarioArena(
    mensaje,
    tipo = "info"
) {

    const posibles = [

        "estadoEscenarioArena",
        "estado-escenario-arena",
        "indicadorEscenarioArena",
        "indicador-escenario-arena"

    ];


    let elemento = null;


    for (
        let i = 0;
        i < posibles.length;
        i++
    ) {

        elemento =
            document.getElementById(
                posibles[i]
            );


        if (elemento) {

            break;

        }

    }


    if (elemento) {

        elemento.textContent =
            mensaje;

        elemento.style.display =
            "block";

        elemento.dataset.estado =
            tipo;

    }


    console.log(
        "[PALARENA ESCENARIO]",
        mensaje
    );

}


/* ==========================================================
   INDICADORES DE COMBATE BASE
   ========================================================== */

function obtenerIndicadoresArena(
    stats,
    datos
) {

    /*
    ----------------------------------------------------------
    Si CONTENEDOR ya proporciona indicadores específicos,
    se utilizan directamente.
    ----------------------------------------------------------
    */

    if (
        datos &&
        datos.indicadoresArena
    ) {

        const indicadores =
            datos.indicadoresArena;


        return {

            ataque:
                Number(indicadores.ataque) ||
                Number(stats.ofensiva) ||
                0,

            defensa:
                Number(indicadores.defensa) ||
                Number(stats.defensa) ||
                0,

            velocidad:
                Number(indicadores.velocidad) ||
                Number(stats.velocidad) ||
                0,

            resistencia:
                Number(indicadores.resistencia) ||
                Number(stats.resistencia) ||
                0,

            tactica:
                Number(indicadores.tactica) ||
                Number(stats.inteligencia) ||
                0

        };

    }


    /*
    ----------------------------------------------------------
    Conversión directa desde las estadísticas existentes.
    ----------------------------------------------------------
    */

    return {

        ataque:
            Number(stats.ofensiva) || 0,

        defensa:
            Number(stats.defensa) || 0,

        velocidad:
            Number(stats.velocidad) || 0,

        resistencia:
            Number(stats.resistencia) || 0,

        tactica:
            Number(stats.inteligencia) || 0

    };

}


/* ==========================================================
   CREAR COMBATIENTE
   ========================================================== */

function crearCombatienteArena(
    datos
) {


    /*
    ==========================================================
    COMPROBACIÓN INICIAL
    ==========================================================
    */

    mostrarEstadoEscenarioArena(
        "🟢 CREANDO COMBATIENTE",
        "info"
    );


    /*
    ==========================================================
    STATS BASE
    ==========================================================
    */

    const stats =
        obtenerStatsArena(
            datos
        );


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
    INDICADORES DE COMBATE BASE
    ==========================================================
    */

    const indicadoresBase =
        obtenerIndicadoresArena(
            stats,
            datos
        );


    /*
    ==========================================================
    BONIFICACIÓN DE ESCENARIO
    ==========================================================
    */

    let resultadoEscenario =
        null;


    if (
        window.PALARENA_ESCENARIO &&
        typeof
        window.PALARENA_ESCENARIO.evaluar ===
        "function"
    ) {

        mostrarEstadoEscenarioArena(
            "🟡 EVALUANDO ESCENARIO...",
            "warning"
        );


        resultadoEscenario =
            window.PALARENA_ESCENARIO.evaluar(
                datos.j1
            );

    }
    else {

        mostrarEstadoEscenarioArena(
            "⚠️ ESCENARIO NO DISPONIBLE",
            "warning"
        );

    }


    /*
    ==========================================================
    HP DEL ESCENARIO
    ==========================================================
    */

    let resultadoHP =
        {

            hp_base:
                hpBase,

            hp_bonificado:
                0,

            hp_total:
                hpBase,

            bonificaciones:
                []

        };


    if (
        resultadoEscenario &&
        typeof aplicarEscenarioArena ===
        "function"
    ) {

        resultadoHP =
            aplicarEscenarioArena(
                hpBase,
                resultadoEscenario
            );

    }


    /*
    ==========================================================
    INDICADORES BONIFICADOS
    ==========================================================
    */

    let indicadoresFinales =
        indicadoresBase;


    let resultadoIndicadores =
        null;


    if (
        resultadoEscenario &&
        resultadoEscenario.bonificacion &&
        window.PALARENA_BONIFICACIONES &&
        typeof
        window.PALARENA_BONIFICACIONES.aplicar ===
        "function"
    ) {

        resultadoIndicadores =
            window.PALARENA_BONIFICACIONES.aplicar(
                indicadoresBase,
                resultadoEscenario.bonificacion
            );


        if (resultadoIndicadores) {

            indicadoresFinales = {

                ataque:
                    resultadoIndicadores.ataque,

                defensa:
                    resultadoIndicadores.defensa,

                velocidad:
                    resultadoIndicadores.velocidad,

                resistencia:
                    resultadoIndicadores.resistencia,

                tactica:
                    resultadoIndicadores.tactica

            };

        }

    }


    /*
    ==========================================================
    MOSTRAR RESULTADO DEL ESCENARIO
    ==========================================================
    */

    if (
        resultadoEscenario
    ) {

        mostrarEstadoEscenarioArena(
            "🌎 ESCENARIO APLICADO — +" +
            resultadoHP.hp_bonificado +
            " HP",
            "ok"
        );

    }


    /*
    ==========================================================
    HP FINAL
    ==========================================================
    */

    const hpFinal =
        resultadoHP.hp_total;


    /*
    ==========================================================
    INICIATIVA
    ==========================================================
    */

    const iniciativa =
        Math.round(
            indicadoresFinales.velocidad *
            0.6 +
            stats.movilidad *
            0.4
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
            asignarAtaqueArena(
                datos
            );

    }


    /*
    ==========================================================
    COMBATIENTE
    ==========================================================
    */

    const combatiente = {

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
        ESTADÍSTICAS ORIGINALES
        ------------------------------------------------------
        */

        stats:
            stats,


        /*
        ------------------------------------------------------
        INDICADORES DE COMBATE
        ------------------------------------------------------
        */

        indicadoresArena:
            indicadoresFinales,


        indicadoresBase:
            indicadoresBase,


        indicadoresBonificacion:
            resultadoIndicadores
                ?.bonificacion || {

                ataque: 0,
                defensa: 0,
                velocidad: 0,
                resistencia: 0,
                tactica: 0

            },


        detallesBonificaciones:
            resultadoIndicadores
                ?.detalles || [],


        /*
        ------------------------------------------------------
        HP
        ------------------------------------------------------
        */

        hp_base:
            resultadoHP.hp_base,

        hp_bonificacion_escenario:
            resultadoHP.hp_bonificado,

        bonificaciones_escenario:
            resultadoHP.bonificaciones,

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


    /*
    ==========================================================
    RESULTADO FINAL
    ==========================================================
    */

    mostrarEstadoEscenarioArena(
        "❤️ " +
        combatiente.nombre +
        " — HP " +
        hpFinal +
        " | ATQ " +
        indicadoresFinales.ataque +
        " | DEF " +
        indicadoresFinales.defensa +
        " | VEL " +
        indicadoresFinales.velocidad +
        " | RES " +
        indicadoresFinales.resistencia +
        " | TAC " +
        indicadoresFinales.tactica,
        "ok"
    );


    return combatiente;

}
