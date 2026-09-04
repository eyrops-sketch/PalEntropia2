window.PALARENA_STANDAR = (function() {
    let configuracionGlobal = {
        hp_base: 100,
        bonificacion_dominante: 0.15,
        factor_imprevisible_min: 0.78,
        factor_imprevisible_max: 1.22,
        coeficiente_combate: 1.00,
        coeficiente_combate_min: 0.50,
        coeficiente_combate_max: 1.50,
        iniciativa_velocidad: 0.70,
        iniciativa_tactica: 0.30,
        dano_base: 4,
        dano_por_ataque: 0.10,
        defensa_divisor: 200,
        variacion_dano: 0.25,
        multiplicador_critico: 2.50,
        critico_base: 10,
        critico_tactica: 0.15,
        fatiga_minima_critico: 20,
        esquiva_velocidad: 0.15,
        fallo_base: 14,
        fallo_reduccion_tactica: 0.03,
        coste_ataque_potente_hp: 0.14,
        fatiga_minima_ataque_potente: 65,
        fatiga_max: 100,
        fatiga_inicial: 100,
        fatiga_regeneracion_turno: 6,
        coste_fatiga_A001: 8,
        coste_fatiga_A002: 38,
        coste_fatiga_A003: 10,
        coste_fatiga_D001: 20,
        fatiga_defensa_atacante: 15,
        reduccion_defensa: 0.35,
        error_defensa_base: 45,
        error_defensa_reduccion_inteligencia: 0.03,
        error_defensa_reduccion_tactica: 0.02,
        error_defensa_fatiga_umbral: 50,
        error_defensa_fatiga_incremento: 0.20,
        error_defensa_min: 15,
        error_defensa_max: 65,
        golpe_mortal: false,
        dano_vida_75: 1.00,
        dano_vida_50: 1.05,
        dano_vida_25: 1.15,
        dano_vida_10: 1.25,
        dano_vida_critica: 1.35,
        max_turnos: 100,
        general: 1,
        escenariojug1: 1,
        escenariojug2: 1
    };

    function sincronizarConfiguracionDesdeStorage() {
        const guardado = localStorage.getItem("palentropia_reglas_torneo");
        if (guardado) {
            try {
                const reglas = JSON.parse(guardado);
                const coefs = reglas.coeficientes || reglas;
                if (coefs && typeof coefs === "object") {
                    configuracionGlobal = {
                        ...configuracionGlobal,
                        ...coefs
                    };
                }
            } catch (e) {
                console.warn("No se pudieron parsear los coeficientes del localStorage:", e);
            }
        }
    }

    sincronizarConfiguracionDesdeStorage();

    window.addEventListener("storage", function(evento) {
        if (evento.key === "palentropia_reglas_torneo") {
            sincronizarConfiguracionDesdeStorage();
        }
    });

    function calcularStatsEfectivos(ficha, config) {
        const coefGeneral = Number(config.general) || 1;
        const e = ficha.e || [];
        const baseAtq = Number(e[0]) || 50;
        const baseDef = Number(e[1]) || 50;
        const baseVel = Number(e[2]) || 50;
        const baseRes = Number(e[3]) || 50;
        const baseTac = Number(e[4]) || 50;

        return {
            ataque: baseAtq * coefGeneral,
            defensa: baseDef * coefGeneral,
            velocidad: baseVel * coefGeneral,
            resistencia: baseRes * coefGeneral,
            tactica: baseTac * coefGeneral
        };
    }
        function crearCombatiente(ficha, esJugador2 = false) {
        sincronizarConfiguracionDesdeStorage();
        const config = configuracionGlobal;
        const efectivos = calcularStatsEfectivos(ficha, config);
        const hpMax = config.hp_base * (efectivos.resistencia / 50);

        return {
            codigo: ficha.j1 || ficha.codigo || "Desconocido",
            nombre: ficha.j2 || ficha.nombre || "Sin nombre",
            perfil: ficha.perfil || "standard",
            hp_max: hpMax,
            hp: hpMax,
            fatiga_max: config.fatiga_max,
            fatiga: config.fatiga_inicial,
            efectivos: efectivos,
            defendiendo: false,
            derrotado: false,
            efectos: []
        };
    }

    function crearCombateEstandar(ficha1, ficha2) {
        sincronizarConfiguracionDesdeStorage();
        const c1 = crearCombatiente(ficha1, false);
        const c2 = crearCombatiente(ficha2, true);

        return {
            combatiente1: c1,
            combatiente2: c2,
            turno: 1,
            estado: "en_curso",
            historial: [],
            ganador: null
        };
    }

    function regenerarFatiga(combatiente) {
        sincronizarConfiguracionDesdeStorage();
        const config = configuracionGlobal;
        combatiente.fatiga = Math.min(
            combatiente.fatiga_max,
            combatiente.fatiga + config.fatiga_regeneracion_turno
        );
    }

    function ejecutarAccion(atacante, objetivo, codigoAccion) {
        sincronizarConfiguracionDesdeStorage();
        const config = configuracionGlobal;
        let costeFatiga = 0;

        if (codigoAccion === "A001") costeFatiga = config.coste_fatiga_A001;
        else if (codigoAccion === "A002") costeFatiga = config.coste_fatiga_A002;
        else if (codigoAccion === "A003") costeFatiga = config.coste_fatiga_A003;
        else if (codigoAccion === "D001") costeFatiga = config.coste_fatiga_D001;

        atacante.fatiga = Math.max(0, atacante.fatiga - costeFatiga);

        if (codigoAccion === "D001") {
            atacante.defendiendo = true;
            return {
                mensaje: `${atacante.nombre} adopta una postura defensiva.`,
                defensa: "acierto"
            };
        }

        let danoBase = config.dano_base + (atacante.efectivos.ataque * config.dano_por_ataque);
        let critico = false;

        if (codigoAccion === "A002") {
            danoBase *= config.multiplicador_critico;
            critico = true;
        }

        const defensaObjetivo = objetivo.defendiendo ? objetivo.efectivos.defensa * (1 + config.reduccion_defensa) : objetivo.efectivos.defensa;
        let danoFinal = Math.max(1, danoBase - (defensaObjetivo / config.defensa_divisor));

        objetivo.hp = Math.max(0, objetivo.hp - danoFinal);
        if (objetivo.hp <= 0) {
            objetivo.derrotado = true;
        }

        return {
            mensaje: `${atacante.nombre} ejecuta ${codigoAccion} contra ${objetivo.nombre}.`,
            dano: Math.round(danoFinal),
            critico: critico
        };
    }

    function decidirAccion(atacante, objetivo) {
        if (atacante.fatiga < configuracionGlobal.fatiga_minima_ataque_potente) {
            return "A001";
        }
        return Math.random() < 0.5 ? "A001" : "A003";
    }

    function obtenerCombatiente(combate, codigo) {
        if (combate.combatiente1.codigo === codigo) return combate.combatiente1;
        if (combate.combatiente2.codigo === codigo) return combate.combatiente2;
        return null;
    }
        return {
        get configuracion() {
            sincronizarConfiguracionDesdeStorage();
            return configuracionGlobal;
        },
        crearCombateEstandar,
        ejecutarAccion,
        decidirAccion,
        regenerarFatiga,
        obtenerCombatiente
    };
})();

window.crearCombateEstandar = window.PALARENA_STANDAR.crearCombateEstandar;
window.ejecutarTurnoEstandar = function(combate) {
    if (combate.estado === "finalizado") return;
    const c1 = combate.combatiente1;
    const c2 = combate.combatiente2;

    const res1 = window.PALARENA_STANDAR.ejecutarAccion(c1, c2, "A001");
    combate.historial.push({ tipo: "accion", atacante: c1.codigo, objetivo: c2.codigo, resultado: res1 });

    if (c2.derrotado) {
        combate.estado = "finalizado";
        combate.ganador = c1.codigo;
        return;
    }

    const res2 = window.PALARENA_STANDAR.ejecutarAccion(c2, c1, "A001");
    combate.historial.push({ tipo: "accion", atacante: c2.codigo, objetivo: c1.codigo, resultado: res2 });

    if (c1.derrotado) {
        combate.estado = "finalizado";
        combate.ganador = c2.codigo;
        return;
    }

    window.PALARENA_STANDAR.regenerarFatiga(c1);
    window.PALARENA_STANDAR.regenerarFatiga(c2);
    c1.defendiendo = false;
    c2.defendiendo = false;
    combate.turno++;

    if (combate.turno > window.PALARENA_STANDAR.configuracion.max_turnos) {
        combate.estado = "finalizado";
        combate.ganador = c1.hp >= c2.hp ? c1.codigo : c2.codigo;
    }
};
