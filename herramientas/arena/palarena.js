/*
============================================================
palentropía — arena
archivo: palarena.js
versión: 1.0
parte: 1/2
============================================================

motor de combate por turnos.

incluye:
- configuración
- utilidades
- estadísticas
- creación de combatientes
- efectos
- modificadores
- esquiva
- críticos
- cálculo de daño
- ejecución de ataques

============================================================
*/

const PALARENA = {

    version: "1.0",

    configuracion: {

        hp_base: 100,

        dano_minimo: 1,

        multiplicador_critico: 1.5,

        probabilidad_esquiva_base: 5,

        max_turnos: 100,

        variacion_dano: 10

    }

};


/* ==========================================================
   UTILIDADES
   ========================================================== */

function arenaAleatorio(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


function arenaAleatorioDecimal(min, max) {

    return Math.random() * (max - min) + min;

}


function limitarArena(valor, minimo, maximo) {

    return Math.max(
        minimo,
        Math.min(maximo, valor)
    );

}


/* ==========================================================
   ESTADÍSTICAS
   ========================================================== */

function obtenerStatsArena(datos) {

    return {

        adaptabilidad: Number(datos.e1) || 0,
        sociabilidad: Number(datos.e2) || 0,
        resistencia: Number(datos.e3) || 0,
        reproduccion: Number(datos.e4) || 0,
        ofensiva: Number(datos.e5) || 0,
        defensa: Number(datos.e6) || 0,
        movilidad: Number(datos.e7) || 0,
        plasticidad: Number(datos.e8) || 0,
        tamano: Number(datos.e9) || 0,
        velocidad: Number(datos.e10) || 0,
        inteligencia: Number(datos.e11) || 0

    };

}


/* ==========================================================
   CREAR COMBATIENTE
   ========================================================== */

function crearCombatienteArena(datos) {

    const stats =
        obtenerStatsArena(datos);

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

    const iniciativa =
        Math.round(
            stats.velocidad * 0.6 +
            stats.movilidad * 0.4
        );

    let ataqueEspecial = "A001";

    if (
        typeof asignarAtaqueArena === "function"
    ) {

        ataqueEspecial =
            asignarAtaqueArena(datos);

    }

    return {

        datos: datos,

        codigo: datos.j1 || "",

        nombre: datos.j2 || "Desconocido",

        imagen: datos.i3 || "",

        stats: stats,

        hp_max: hp,

        hp: hp,

        iniciativa: iniciativa,

        ataque_especial: ataqueEspecial,

        defendiendo: false,

        efectos: [],

        derrotado: false

    };

}


/* ==========================================================
   EFECTOS
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


function aplicarEfectoArena(
    atacante,
    objetivo,
    codigo
) {

    if (!codigo) {
        return null;
    }

    if (
        typeof obtenerEfectoArena !== "function"
    ) {

        return null;

    }

    const efectoBase =
        obtenerEfectoArena(codigo);

    if (!efectoBase) {
        return null;
    }

    if (codigo === "E001") {

        return {

            codigo: codigo,

            nombre: efectoBase.nombre,

            instantaneo: true,

            potencia: efectoBase.potencia

        };

    }

    const efecto = {

        codigo: codigo,

        nombre: efectoBase.nombre,

        turnos: efectoBase.duracion,

        potencia: efectoBase.potencia

    };

    objetivo.efectos.push(efecto);

    return efecto;

}


/* ==========================================================
   ACTUALIZAR EFECTOS
   ========================================================== */

function actualizarEfectosArena(combatiente) {

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
   MODIFICADORES
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

        defensa -= efecto.potencia;

    }

    return limitarArena(
        defensa,
        0,
        100
    );

}


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

        movilidad -= efecto.potencia;

    }

    return limitarArena(
        movilidad,
        0,
        100
    );

}


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

        iniciativa += efecto.potencia;

    }

    return iniciativa;

}


/* ==========================================================
   ESQUIVA
   ========================================================== */

function comprobarEsquivaArena(
    objetivo
) {

    let probabilidad =
        PALARENA.configuracion
            .probabilidad_esquiva_base;

    const efecto =
        obtenerEfectoActivoArena(
            objetivo,
            "E002"
        );

    if (efecto) {

        probabilidad +=
            efecto.potencia;

    }

    probabilidad +=
        obtenerMovilidadEfectivaArena(
            objetivo
        ) * 0.10;

    const dado =
        arenaAleatorioDecimal(0, 100);

    return dado < probabilidad;

}


/* ==========================================================
   CRÍTICO
   ========================================================== */

function comprobarCriticoArena(
    ataque
) {

    const dado =
        arenaAleatorioDecimal(0, 100);

    return dado < ataque.critico;

}


/* ==========================================================
   DAÑO
   ========================================================== */

function calcularDanoArena(
    atacante,
    objetivo,
    ataque
) {

    let dano =
        Number(ataque.dano_base) || 1;

    dano *=
        0.75 +
        atacante.stats.ofensiva / 100;

    const defensa =
        obtenerDefensaEfectivaArena(
            objetivo
        );

    dano *=
        1 -
        (defensa / 250);

    if (ataque.efecto === "E007") {

        const efecto =
            obtenerEfectoArena("E007");

        if (efecto) {

            dano *=
                1 +
                efecto.potencia / 100;

        }

    }

    const variacion =
        arenaAleatorioDecimal(
            1 -
            PALARENA.configuracion
                .variacion_dano / 100,

            1 +
            PALARENA.configuracion
                .variacion_dano / 100
        );

    dano *= variacion;

    const critico =
        comprobarCriticoArena(
            ataque
        );

    if (critico) {

        dano *=
            PALARENA.configuracion
                .multiplicador_critico;

    }

    dano = Math.round(dano);

    return {

        dano: Math.max(
            PALARENA.configuracion.dano_minimo,
            dano
        ),

        critico: critico

    };

}


/* ==========================================================
   EJECUTAR ATAQUE
   ========================================================== */

function ejecutarAtaqueArena(
    atacante,
    objetivo,
    codigoAtaque
) {

    const resultado = {

        tipo: "ataque",

        atacante: atacante.nombre,

        objetivo: objetivo.nombre,

        ataque: null,

        dano: 0,

        critico: false,

        esquiva: false,

        efecto: null,

        mensaje: ""

    };

    if (
        typeof obtenerAtaqueArena !== "function"
    ) {

        resultado.mensaje =
            "No se ha cargado la base de datos de ataques.";

        return resultado;

    }

    const ataque =
        obtenerAtaqueArena(
            codigoAtaque
        );

    if (!ataque) {

        resultado.mensaje =
            "Ataque no encontrado.";

        return resultado;

    }

    resultado.ataque =
        ataque.nombre;

    const precision =
        Number(ataque.precision) || 100;

    const dadoPrecision =
        arenaAleatorioDecimal(0, 100);

    if (dadoPrecision > precision) {

        resultado.mensaje =
            atacante.nombre +
            " falla su ataque.";

        return resultado;

    }

    if (
        comprobarEsquivaArena(
            objetivo
        )
    ) {

        resultado.esquiva = true;

        resultado.mensaje =
            objetivo.nombre +
            " esquiva el ataque.";

        return resultado;

    }

    const calculo =
        calcularDanoArena(
            atacante,
            objetivo,
            ataque
        );

    resultado.dano =
        calculo.dano;

    resultado.critico =
        calculo.critico;

    objetivo.hp -=
        resultado.dano;

    if (objetivo.hp <= 0) {

        objetivo.hp = 0;

        objetivo.derrotado = true;

    }

    if (
        ataque.efecto &&
        !objetivo.derrotado
    ) {

        resultado.efecto =
            aplicarEfectoArena(
                atacante,
                objetivo,
                ataque.efecto
            );

    }

    resultado.mensaje =
        atacante.nombre +
        " usa " +
        ataque.nombre +
        " y causa " +
        resultado.dano +
        " de daño.";

    if (resultado.critico) {

        resultado.mensaje +=
            " ¡CRÍTICO!";

    }

    return resultado;

          }
/*
============================================================
palentropía — arena
archivo: palarena.js
versión: 1.0
parte: 2/2
============================================================

incluye:
- defensa
- ataque especial
- daño progresivo
- decisiones de ia
- iniciativa
- ejecución de acciones
- creación del combate
- ejecución de turnos
- finalización
- combate automático
- control manual
- exportación global

============================================================
*/


/* ==========================================================
   DEFENSA
   ========================================================== */

function ejecutarDefensaArena(combatiente) {

    combatiente.defendiendo = true;

    return {

        tipo: "defensa",

        atacante: combatiente.nombre,

        dano: 0,

        mensaje:
            combatiente.nombre +
            " adopta una posición defensiva."

    };

}


/* ==========================================================
   ATAQUE ESPECIAL
   ========================================================== */

function ejecutarEspecialArena(
    atacante,
    objetivo
) {

    return ejecutarAtaqueArena(
        atacante,
        objetivo,
        atacante.ataque_especial
    );

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
        Number(efecto.potencia) || 1;

    combatiente.hp -= dano;

    if (combatiente.hp <= 0) {

        combatiente.hp = 0;

        combatiente.derrotado = true;

    }

    return {

        dano: dano,

        mensaje:
            combatiente.nombre +
            " recibe " +
            dano +
            " de daño progresivo."

    };

}


/* ==========================================================
   APLICAR DEFENSA
   ========================================================== */

function aplicarDefensaArena(
    dano,
    objetivo
) {

    if (
        !objetivo.defendiendo
    ) {

        return dano;

    }

    return Math.max(
        1,
        Math.round(
            dano * 0.5
        )
    );

}


/* ==========================================================
   DECISIÓN DE IA
   ========================================================== */

function decidirAccionArena(
    combatiente,
    objetivo
) {

    const hpPorcentaje =
        combatiente.hp /
        combatiente.hp_max *
        100;


    /*
    ----------------------------------------------------------
    Criatura muy herida
    ----------------------------------------------------------
    */

    if (hpPorcentaje <= 25) {

        const dado =
            arenaAleatorio(1, 100);

        if (dado <= 35) {

            return "defender";

        }

    }


    /*
    ----------------------------------------------------------
    Inteligencia alta:
    mayor utilización del ataque especial.
    ----------------------------------------------------------
    */

    if (
        combatiente.stats.inteligencia >= 70
    ) {

        const dado =
            arenaAleatorio(1, 100);

        if (dado <= 55) {

            return "especial";

        }

    }


    /*
    ----------------------------------------------------------
    Comportamiento general.
    ----------------------------------------------------------
    */

    const dado =
        arenaAleatorio(1, 100);

    if (dado <= 65) {

        return "atacar";

    }

    if (dado <= 85) {

        return "especial";

    }

    return "defender";

}


/* ==========================================================
   INICIATIVA
   ========================================================== */

function determinarPrimeroArena(
    combatiente1,
    combatiente2
) {

    const iniciativa1 =
        obtenerIniciativaEfectivaArena(
            combatiente1
        );

    const iniciativa2 =
        obtenerIniciativaEfectivaArena(
            combatiente2
        );


    if (iniciativa1 > iniciativa2) {

        return combatiente1;

    }


    if (iniciativa2 > iniciativa1) {

        return combatiente2;

    }


    /*
    Empate de iniciativa.
    */

    return (
        Math.random() < 0.5
            ? combatiente1
            : combatiente2
    );

}


/* ==========================================================
   EJECUTAR ACCIÓN
   ========================================================== */

function ejecutarAccionArena(
    atacante,
    objetivo,
    accion
) {

    atacante.defendiendo = false;


    if (accion === "atacar") {

        return ejecutarAtaqueArena(
            atacante,
            objetivo,
            "A001"
        );

    }


    if (accion === "especial") {

        return ejecutarEspecialArena(
            atacante,
            objetivo
        );

    }


    if (accion === "defender") {

        return ejecutarDefensaArena(
            atacante
        );

    }


    return {

        tipo: "error",

        mensaje:
            "Acción no reconocida."

    };

}


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


        /*
        Si estaba defendiendo del turno anterior,
        pierde esa postura al comenzar su acción.
        */

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


/* ==========================================================
   FINALIZAR COMBATE
   ========================================================== */

function finalizarCombateArena(
    combate,
    ganador
) {

    combate.estado =
        "finalizado";

    combate.ganador =
        ganador.codigo;

    combate.actual =
        ganador.codigo;

}


/* ==========================================================
   LÍMITE DE TURNOS
   ========================================================== */

function finalizarCombatePorLimiteArena(
    combate
) {

    const c1 =
        combate.combatiente1;

    const c2 =
        combate.combatiente2;


    /*
    Primero se compara HP restante.
    */

    let ganador;


    if (c1.hp > c2.hp) {

        ganador = c1;

    } else if (c2.hp > c1.hp) {

        ganador = c2;

    } else {

        /*
        Empate absoluto:
        se utiliza ofensiva + defensa + resistencia.
        */

        const puntuacion1 =
            c1.stats.ofensiva +
            c1.stats.defensa +
            c1.stats.resistencia;


        const puntuacion2 =
            c2.stats.ofensiva +
            c2.stats.defensa +
            c2.stats.resistencia;


        if (
            puntuacion1 >
            puntuacion2
        ) {

            ganador = c1;

        } else if (
            puntuacion2 >
            puntuacion1
        ) {

            ganador = c2;

        } else {

            ganador =
                Math.random() < 0.5
                    ? c1
                    : c2;

        }

    }


    finalizarCombateArena(
        combate,
        ganador
    );

}


/* ==========================================================
   COMBATE AUTOMÁTICO
   ========================================================== */

function ejecutarCombateArena(
    datos1,
    datos2
) {

    const combate =
        crearCombateArena(
            datos1,
            datos2
        );


    while (
        combate.estado !==
        "finalizado"
    ) {

        ejecutarTurnoArena(
            combate
        );

    }


    return combate;

}


/* ==========================================================
   CONTROL MANUAL
   ========================================================== */

function ejecutarAccionJugadorArena(
    combate,
    accion
) {

    if (
        !combate ||
        combate.estado === "finalizado"
    ) {

        return null;

    }


    const jugador =
        combate.combatiente1;

    const rival =
        combate.combatiente2;


    /*
    ----------------------------------------------------------
    Acción del jugador.
    ----------------------------------------------------------
    */

    const resultadoJugador =
        ejecutarAccionArena(
            jugador,
            rival,
            accion
        );


    combate.historial.push({

        turno:
            combate.turno,

        codigo_atacante:
            jugador.codigo,

        atacante:
            jugador.nombre,

        codigo_objetivo:
            rival.codigo,

        objetivo:
            rival.nombre,

        accion:
            accion,

        resultado:
            resultadoJugador

    });


    /*
    ----------------------------------------------------------
    Victoria del jugador.
    ----------------------------------------------------------
    */

    if (
        rival.derrotado
    ) {

        finalizarCombateArena(
            combate,
            jugador
        );

        return {

            jugador:
                resultadoJugador,

            ia:
                null,

            combate:
                combate

        };

    }


    /*
    ----------------------------------------------------------
    Turno de la IA.
    ----------------------------------------------------------
    */

    const accionIA =
        decidirAccionArena(
            rival,
            jugador
        );


    const resultadoIA =
        ejecutarAccionArena(
            rival,
            jugador,
            accionIA
        );


    combate.historial.push({

        turno:
            combate.turno,

        codigo_atacante:
            rival.codigo,

        atacante:
            rival.nombre,

        codigo_objetivo:
            jugador.codigo,

        objetivo:
            jugador.nombre,

        accion:
            accionIA,

        resultado:
            resultadoIA

    });


    /*
    ----------------------------------------------------------
    Victoria de la IA.
    ----------------------------------------------------------
    */

    if (
        jugador.derrotado
    ) {

        finalizarCombateArena(
            combate,
            rival
        );

    }


    /*
    ----------------------------------------------------------
    Avanza el turno.
    ----------------------------------------------------------
    */

    combate.turno++;


    return {

        jugador:
            resultadoJugador,

        ia:
            resultadoIA,

        combate:
            combate

    };

}


/* ==========================================================
   RESUMEN DEL COMBATE
   ========================================================== */

function obtenerResumenCombateArena(
    combate
) {

    if (!combate) {

        return null;

    }


    return {

        estado:
            combate.estado,

        turno:
            combate.turno,

        jugador: {

            codigo:
                combate.combatiente1.codigo,

            nombre:
                combate.combatiente1.nombre,

            hp:
                combate.combatiente1.hp,

            hp_max:
                combate.combatiente1.hp_max,

            ataque_especial:
                combate.combatiente1
                    .ataque_especial

        },

        rival: {

            codigo:
                combate.combatiente2.codigo,

            nombre:
                combate.combatiente2.nombre,

            hp:
                combate.combatiente2.hp,

            hp_max:
                combate.combatiente2.hp_max,

            ataque_especial:
                combate.combatiente2
                    .ataque_especial

        },

        ganador:
            combate.ganador,

        acciones:
            combate.historial.length

    };

}


/* ==========================================================
   EXPORTACIÓN GLOBAL
   ========================================================== */

window.PALARENA =
    PALARENA;


window.crearCombatienteArena =
    crearCombatienteArena;


window.crearCombateArena =
    crearCombateArena;


window.ejecutarTurnoArena =
    ejecutarTurnoArena;


window.ejecutarCombateArena =
    ejecutarCombateArena;


window.ejecutarAccionJugadorArena =
    ejecutarAccionJugadorArena;


window.decidirAccionArena =
    decidirAccionArena;


window.finalizarCombateArena =
    finalizarCombateArena;


window.obtenerResumenCombateArena =
    obtenerResumenCombateArena;
