/* ==========================================================
   PALENTROPÍA — ARENA
   archivo: palarenacombatiente.js
   versión: 1.4
   ========================================================== */


/* ==========================================================
   INDICADOR DE ESCENARIO
   ========================================================== */

function mostrarEstadoEscenarioArena(
    mensaje,
    tipo = "info"
) {

    /*
    ----------------------------------------------------------
    BUSCAR CONTENEDOR
    ----------------------------------------------------------
    */

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


    /*
    ----------------------------------------------------------
    SI EXISTE EL CONTENEDOR
    ----------------------------------------------------------
    */

    if (elemento) {

        elemento.textContent =
            mensaje;

        elemento.style.display =
            "block";

        elemento.dataset.estado =
            tipo;

    }


    /*
    ----------------------------------------------------------
    CONSOLA
    ----------------------------------------------------------
    */

    console.log(
        "[PALARENA ESCENARIO]",
        mensaje
    );

}


/* ==========================================================
   CREAR COMBATIENTE
   ========================================================== */

function crearCombatienteArena(datos) {


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


    mostrarEstadoEscenarioArena(
        "🟢 ESCENARIO DETECTADO — HP base: " +
        hpBase,
        "ok"
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
    ==========================================================
    COMPROBAR PALARENA_ESCENARIO
    ==========================================================
    */

    if (
        !window.PALARENA_ESCENARIO
    ) {

        mostrarEstadoEscenarioArena(
            "🔴 PALARENA_ESCENARIO NO DISPONIBLE",
            "error"
        );

    }


    else if (
        typeof
        window.PALARENA_ESCENARIO.evaluar
        !== "function"
    ) {

        mostrarEstadoEscenarioArena(
            "🔴 PALARENA_ESCENARIO.evaluar() NO DISPONIBLE",
            "error"
        );

    }


    else {

        /*
        ======================================================
        EVALUANDO
        ======================================================
        */

        mostrarEstadoEscenarioArena(
            "🟡 EVALUANDO ESCENARIO...",
            "warning"
        );


        /*
        ------------------------------------------------------
        OBTENER RESULTADO
        ------------------------------------------------------
        */

        const resultadoEscenario =
            window.PALARENA_ESCENARIO.evaluar(
                datos.j1
            );


        /*
        ------------------------------------------------------
        COMPROBAR RESULTADO
        ------------------------------------------------------
        */

        if (
            !resultadoEscenario
        ) {

            mostrarEstadoEscenarioArena(
                "🔴 ESCENARIO SIN RESULTADO",
                "error"
            );

        }


        else if (
            !resultadoEscenario.bonificacion
        ) {

            mostrarEstadoEscenarioArena(
                "🔴 ESCENARIO SIN BONIFICACIÓN",
                "error"
            );

        }


        else {

            /*
            ==================================================
            APLICANDO
            ==================================================
            */

            mostrarEstadoEscenarioArena(
                "🟢 APLICANDO ESCENARIO",
                "ok"
            );


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

                const hpHabitats =
                    Math.round(
                        coincidenciasHabitats *
                        5
                    );


                hpBonificacionEscenario +=
                    hpHabitats;


                bonificacionesEscenario.push({

                    nombre:
                        "Hábitats",

                    origen:
                        "habitats",

                    coincidencias:
                        coincidenciasHabitats,

                    hp:
                        hpHabitats

                });

            }


            /*
            ==================================================
            MODO DE VIDA
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
            MEDIOS ECOLÓGICOS
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


            /*
            ==================================================
            MOSTRAR RESULTADO
            ==================================================
            */

            mostrarEstadoEscenarioArena(
                "➕ BONIFICACIÓN ESCENARIO: +" +
                hpBonificacionEscenario +
                " HP",
                "ok"
            );

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


    mostrarEstadoEscenarioArena(
        "❤️ HP FINAL: " +
        hpFinal,
        "ok"
    );


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
