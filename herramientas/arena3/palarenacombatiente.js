/* ==========================================================
   PALENTROPÍA — ARENA
   archivo: palarenacombatiente.js
   versión: 1.3
   ========================================================== */


/* ==========================================================
   CREAR COMBATIENTE
   ========================================================== */

function crearCombatienteArena(datos) {


    /*
    ==========================================================
    STATS BASE
    ==========================================================
    */

    const stats =
        obtenerStatsArena(datos);


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
    */

    let hpBonificacionEscenario =
        0;


    let bonificacionesEscenario =
        [];


    /*
    ----------------------------------------------------------
    INDICADOR
    ----------------------------------------------------------
    */

    console.log(
        "🟢 APLICANDO ESCENARIO"
    );


    /*
    ----------------------------------------------------------
    OBTENER RESULTADO
    ----------------------------------------------------------
    */

    if (
        window.PALARENA_ESCENARIO &&
        typeof window.PALARENA_ESCENARIO.evaluar ===
        "function"
    ) {

        const resultadoEscenario =
            window.PALARENA_ESCENARIO.evaluar(
                datos.j1
            );


        if (
            resultadoEscenario &&
            resultadoEscenario.bonificacion
        ) {


            const bonificacion =
                resultadoEscenario.bonificacion;


            /*
            ==================================================
            HÁBITATS
            ==================================================
            */

            const coincidenciasHabitats =
                Number(
                    bonificacion.habitats
                ) || 0;


            if (
                coincidenciasHabitats > 0
            ) {

                hpBonificacionEscenario +=
                    Math.round(
                        coincidenciasHabitats *
                        5
                    );


                bonificacionesEscenario.push({

                    nombre:
                        "Hábitats",

                    origen:
                        "habitats",

                    coincidencias:
                        coincidenciasHabitats,

                    hp:
                        Math.round(
                            coincidenciasHabitats * 5
                        )

                });

            }


            /*
            ==================================================
            MODO
            ==================================================
            */

            if (
                bonificacion.modo === true
            ) {

                hpBonificacionEscenario +=
                    10;


                bonificacionesEscenario.push({

                    nombre:
                        "Modo de vida",

                    origen:
                        "modo",

                    coincidencias:
                        1,

                    hp:
                        10

                });

            }


            /*
            ==================================================
            MEDIOS
            ==================================================
            */

            const bonificacionMedios =
                Number(
                    bonificacion
                        .bonificacionMedios
                ) || 0;


            if (
                bonificacionMedios > 0
            ) {

                hpBonificacionEscenario +=
                    bonificacionMedios;


                bonificacionesEscenario.push({

                    nombre:
                        "Medios ecológicos",

                    origen:
                        "medios",

                    coincidencias:
                        Number(
                            bonificacion
                                .medios
                                ?.coincidencias
                        ) || 0,

                    hp:
                        bonificacionMedios

                });

            }

        }

    }


    /*
    ==========================================================
    HP FINAL
    ==========================================================
    */

    const hpFinal =
        hpBase +
        hpBonificacionEscenario;


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
        INDICADORES
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
