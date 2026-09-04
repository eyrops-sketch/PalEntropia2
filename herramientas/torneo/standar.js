/* ========================================================
   PALARENA standar.js — REEQUILIBRADO TÁCTICO Y BLINDADO
   PalEntropía
   ======================================================== */

window.PALARENA_STANDAR = {
    version: "1.3.3",
    configuracion: {
        hp_base: 100,
        bonificacion_dominante: 0.15,
        factor_imprevisible_min: 0.92,
        factor_imprevisible_max: 1.08,
        coeficiente_combate: 1.00,
        coeficiente_combate_min: 0.50,
        coeficiente_combate_max: 1.50,
        iniciativa_velocidad: 0.60,
        iniciativa_tactica: 0.40,
        dano_base: 8,
        dano_por_ataque: 0.15,
        defensa_divisor: 120,
        variacion_dano: 0.08,
        multiplicador_critico: 1.40,
        critico_base: 5,
        critico_tactica: 0.08,
        fatiga_minima_critico: 35,
        esquiva_velocidad: 0.08,
        fallo_base: 10,
        fallo_reduccion_tactica: 0.05,
        coste_ataque_potente_hp: 0.04,
        fatiga_minima_ataque_potente: 45,
        fatiga_max: 100,
        fatiga_inicial: 100,
        fatiga_regeneracion_turno: 7,
        coste_fatiga_A001: 7,
        coste_fatiga_A002: 18,
        coste_fatiga_A003: 10,
        coste_fatiga_D001: 4,
        fatiga_defensa_atacante: 10,
        reduccion_defensa: 0.50,
        error_defensa_base: 12,
        error_defensa_reduccion_inteligencia: 0.04,
        error_defensa_reduccion_tactica: 0.04,
        error_defensa_fatiga_umbral: 40,
        error_defensa_fatiga_incremento: 0.08,
        error_defensa_min: 4,
        error_defensa_max: 20,
        golpe_mortal: false,
        dano_vida_75: 1.00,
        dano_vida_50: 1.04,
        dano_vida_25: 1.10,
        dano_vida_10: 1.18,
        dano_vida_critica: 1.25,
        max_turnos: 100
    },

    numero(valor) {
        const numero = Number(valor);
        return Number.isFinite(numero) ? numero : 0;
    },

    limitar(valor) {
        return Math.max(0, Math.min(100, Math.round(valor)));
    },

    limitarCoeficiente(valor) {
        const minimo = this.configuracion.coeficiente_combate_min;
        const maximo = this.configuracion.coeficiente_combate_max;
        return Math.max(minimo, Math.min(maximo, this.numero(valor)));
    },

    aleatorio(min, max) {
        return Math.random() * (max - min) + min;
    },

    enteroAleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    obtenerCoeficienteCombate(ficha, reglas) {
        let coeficiente = this.configuracion.coeficiente_combate;
        if (ficha && Number.isFinite(Number(ficha.coeficiente_combate))) {
            coeficiente = Number(ficha.coeficiente_combate);
        }
        if (reglas && reglas.coeficientes_combate && ficha) {
            const codigo = ficha.j1 || ficha.codigo || "";
            if (Number.isFinite(Number(reglas.coeficientes_combate[codigo]))) {
                coeficiente = Number(reglas.coeficientes_combate[codigo]);
            }
        }
        if (reglas && Number.isFinite(Number(reglas.coeficiente_combate))) {
            coeficiente = Number(reglas.coeficiente_combate);
        }
        return this.limitarCoeficiente(coeficiente);
    },

    obtenerFactorImprevisible() {
        return this.aleatorio(this.configuracion.factor_imprevisible_min, this.configuracion.factor_imprevisible_max);
    },

    obtenerDominante(indicadores) {
        const atributos = [
            { atributo: "ataque", valor: indicadores.ataque },
            { atributo: "defensa", valor: indicadores.defensa },
            { atributo: "velocidad", valor: indicadores.velocidad },
            { atributo: "resistencia", valor: indicadores.resistencia },
            { atributo: "tactica", valor: indicadores.tactica }
        ];
        const maximo = Math.max(...atributos.map(function(item) { return item.valor; }));
        let candidatos = atributos.filter(function(item) { return item.valor === maximo; });
        if (candidatos.length > 1) {
            const tactica = candidatos.find(function(item) { return item.atributo === "tactica"; });
            if (tactica) { candidatos = [tactica]; }
        }
        const elegido = candidatos[this.enteroAleatorio(0, candidatos.length - 1)];
        return {
            atributo: elegido.atributo,
            valor: elegido.valor,
            bonificacion: this.configuracion.bonificacion_dominante
        };
    },

    obtenerPerfil(atributo) {
        const perfiles = {
            ataque: "agresivo",
            defensa: "defensivo",
            velocidad: "rapido",
            resistencia: "aguante",
            tactica: "tactico"
        };
        return perfiles[atributo] || "equilibrado";
    },

    obtenerEfectivos(indicadores, dominante, factor, coeficiente) {
        const efectivos = {
            ataque: this.limitar(indicadores.ataque),
            defensa: this.limitar(indicadores.defensa),
            velocidad: this.limitar(indicadores.velocidad),
            resistencia: this.limitar(indicadores.resistencia),
            tactica: this.limitar(indicadores.tactica)
        };
        efectivos[dominante.atributo] = this.limitar(efectivos[dominante.atributo] * (1 + dominante.bonificacion));
        coeficiente = this.limitarCoeficiente(coeficiente);
        efectivos.ataque = this.limitar(efectivos.ataque * coeficiente);
        efectivos.defensa = this.limitar(efectivos.defensa * coeficiente);
        efectivos.velocidad = this.limitar(efectivos.velocidad * coeficiente);
        efectivos.resistencia = this.limitar(efectivos.resistencia * coeficiente);
        efectivos.tactica = this.limitar(efectivos.tactica * coeficiente);
        factor = Number(factor) || 1;
        efectivos.ataque = this.limitar(efectivos.ataque * factor);
        efectivos.defensa = this.limitar(efectivos.defensa * factor);
        efectivos.velocidad = this.limitar(efectivos.velocidad * factor);
        efectivos.resistencia = this.limitar(efectivos.resistencia * factor);
        efectivos.tactica = this.limitar(efectivos.tactica * factor);
        return efectivos;
    },

    crearCombatiente(ficha, reglas) {
        if (!ficha) { return null; }
        const f = Array.isArray(ficha) ? {
            j1: ficha[0], j2: ficha[1], e3: ficha[2], e5: ficha[12], e6: ficha[13], e7: ficha[14], e11: ficha[20]
        } : ficha;

        const indicadores = {
            ataque: this.numero(f.e5 !== undefined ? f.e5 : f[12]),
            defensa: this.numero(f.e6 !== undefined ? f.e6 : f[13]),
            velocidad: this.numero(f.e7 !== undefined ? f.e7 : f[14]),
            resistencia: this.numero(f.e3 !== undefined ? f.e3 : f[2]),
            tactica: this.numero(f.e11 !== undefined ? f.e11 : f[20])
        };
        const dominante = this.obtenerDominante(indicadores);
        const perfil = this.obtenerPerfil(dominante.atributo);
        const factor = this.obtenerFactorImprevisible();
        const coeficiente = this.obtenerCoeficienteCombate(f, reglas);
        const efectivos = this.obtenerEfectivos(indicadores, dominante, factor, coeficiente);
        const hpMax = this.configuracion.hp_base + Math.round(efectivos.resistencia * 1.2);
        return {
            codigo: f.j1 || f.codigo || (Array.isArray(ficha) ? ficha[0] : "") || "",
            nombre: f.j2 || f.nombre || (Array.isArray(ficha) ? ficha[1] : "") || "Desconocido",
            hp: hpMax,
            hp_max: hpMax,
            fatiga: this.configuracion.fatiga_inicial,
            fatiga_max: this.configuracion.fatiga_max,
            stats: f,
            indicadores: indicadores,
            efectivos: efectivos,
            dominante: dominante.atributo,
            perfil: perfil,
            factor_imprevisible: factor,
            coeficiente_combate: coeficiente,
            ataques: [],
            efectos: [],
            defendiendo: false,
            derrotado: false
        };
    },

    crearCombate(ficha1, ficha2, reglas) {
        const combatiente1 = this.crearCombatiente(ficha1, reglas);
        const combatiente2 = this.crearCombatiente(ficha2, reglas);
        if (!combatiente1 || !combatiente2) { return null; }
        this.asignarAtaques(combatiente1);
        this.asignarAtaques(combatiente2);
        const iniciativa1 = (combatiente1.efectivos.velocidad * this.configuracion.iniciativa_velocidad) + (combatiente1.efectivos.tactica * this.configuracion.iniciativa_tactica);
        const iniciativa2 = (combatiente2.efectivos.velocidad * this.configuracion.iniciativa_velocidad) + (combatiente2.efectivos.tactica * this.configuracion.iniciativa_tactica);
        let primero, segundo;
        if (iniciativa1 > iniciativa2) {
            primero = combatiente1; segundo = combatiente2;
        } else if (iniciativa2 > iniciativa1) {
            primero = combatiente2; segundo = combatiente1;
        } else {
            if (Math.random() < 0.5) { primero = combatiente1; segundo = combatiente2; }
            else { primero = combatiente2; segundo = combatiente1; }
        }
        return {
            estado: "activo",
            turno: 1,
            primero: primero.codigo,
            segundo: segundo.codigo,
            combatiente1: combatiente1,
            combatiente2: combatiente2,
            historial: [],
            ganador: null,
            perdedor: null
        };
    },

    obtenerCombatiente(combate, codigo) {
        if (!combate) { return null; }
        if (combate.combatiente1.codigo === codigo) { return combate.combatiente1; }
        if (combate.combatiente2.codigo === codigo) { return combate.combatiente2; }
        return null;
    },

    asignarAtaques(combatiente) {
        combatiente.ataques = ["A001", "A002", "A003", "D001"];
    },

    obtenerFatigaPorcentaje(combatiente) {
        if (!combatiente || !combatiente.fatiga_max) { return 0; }
        return (combatiente.fatiga / combatiente.fatiga_max) * 100;
    },

    aplicarFatiga(combatiente, cantidad) {
        if (!combatiente) { return 0; }
        const anterior = this.numero(combatiente.fatiga);
        combatiente.fatiga = Math.max(0, Math.min(combatiente.fatiga_max, anterior - this.numero(cantidad)));
        return anterior - combatiente.fatiga;
    },

    regenerarFatiga(combatiente) {
        if (!combatiente || combatiente.derrotado) { return 0; }
        const anterior = this.numero(combatiente.fatiga);
        combatiente.fatiga = Math.min(combatiente.fatiga_max, anterior + this.configuracion.fatiga_regeneracion_turno);
        return combatiente.fatiga - anterior;
    },

    obtenerCosteFatiga(codigo, atacante) {
        const costes = {
            A001: this.configuracion.coste_fatiga_A001,
            A002: this.configuracion.coste_fatiga_A002,
            A003: this.configuracion.coste_fatiga_A003,
            D001: this.configuracion.coste_fatiga_D001
        };
        let baseCoste = costes[codigo] || 0;
        if (atacante && atacante.efectivos.velocidad > 75 && codigo !== "D001") {
            baseCoste = Math.round(baseCoste * 1.30);
        }
        return baseCoste;
    },

    aplicarFatigaAccion(atacante, codigo) {
        const coste = this.obtenerCosteFatiga(codigo, atacante);
        const aplicada = this.aplicarFatiga(atacante, coste);
        return {
            coste,
            aplicada,
            fatiga_restante: atacante.fatiga,
            fatiga_porcentaje: this.obtenerFatigaPorcentaje(atacante)
        };
    },
        obtenerEfecto(combatiente, codigo) {
        if (!combatiente || !combatiente.efectos) { return null; }
        return combatiente.efectos.find(function(efecto) { return efecto.codigo === codigo; }) || null;
    },

    obtenerEfectoEstandar(codigo) {
        if (!window.PALARENA_STANDAR_EFECTOS) { return null; }
        return window.PALARENA_STANDAR_EFECTOS.obtener(codigo);
    },

    aplicarEfecto(atacante, objetivo, codigo) {
        if (!objetivo || !codigo) { return null; }
        const base = this.obtenerEfectoEstandar(codigo);
        if (!base) { return null; }
        if (codigo === "E001") {
            const curacion = Math.round(objetivo.hp_max * (base.potencia / 100));
            const hpAnterior = objetivo.hp;
            objetivo.hp = Math.min(objetivo.hp_max, objetivo.hp + curacion);
            return {
                codigo: codigo,
                nombre: base.nombre,
                tipo: "curacion",
                potencia: objetivo.hp - hpAnterior,
                duracion: 0
            };
        }
        const existente = this.obtenerEfecto(objetivo, codigo);
        if (existente) {
            existente.turnos = base.duracion;
            existente.potencia = base.potencia;
            return {
                codigo: codigo,
                nombre: base.nombre,
                tipo: base.tipo,
                potencia: base.potencia,
                duracion: base.duracion,
                renovado: true
            };
        }
        const efecto = {
            codigo: codigo,
            nombre: base.nombre,
            tipo: base.tipo,
            potencia: base.potencia,
            turnos: base.duracion
        };
        objetivo.efectos.push(efecto);
        return {
            codigo: codigo,
            nombre: base.nombre,
            tipo: base.tipo,
            potencia: base.potencia,
            duracion: base.duracion,
            renovado: false
        };
    },

    procesarEfectos(combatiente) {
        if (!combatiente || !combatiente.efectos.length) { return []; }
        const resultados = [];
        combatiente.efectos.forEach(function(efecto) {
            if (efecto.codigo === "E005") {
                const dano = Number(efecto.potencia) || 0;
                combatiente.hp = Math.max(0, combatiente.hp - dano);
                resultados.push({
                    codigo: efecto.codigo,
                    nombre: efecto.nombre,
                    dano: dano,
                    mensaje: combatiente.nombre + " recibe " + dano + " de daño progresivo."
                });
            }
            efecto.turnos--;
        });
        combatiente.efectos = combatiente.efectos.filter(function(efecto) { return efecto.turnos > 0; });
        if (combatiente.hp <= 0) {
            combatiente.hp = 0;
            combatiente.derrotado = true;
        }
        return resultados;
    },

    obtenerDefensa(combatiente) {
        let defensa = combatiente.efectivos.defensa;
        const efecto = this.obtenerEfecto(combatiente, "E003");
        if (efecto) { defensa -= efecto.potencia; }
        return this.limitar(defensa);
    },

    obtenerVelocidad(combatiente) {
        let velocidad = combatiente.efectivos.velocidad;
        const efecto = this.obtenerEfecto(combatiente, "E004");
        if (efecto) { velocidad -= efecto.potencia; }
        return this.limitar(velocidad);
    },

    obtenerTactica(combatiente) {
        return this.limitar(combatiente.efectivos.tactica);
    },

    obtenerInteligencia(combatiente) {
        if (!combatiente) { return 0; }
        return this.limitar(combatiente.stats.e11 !== undefined ? combatiente.stats.e11 : combatiente.stats[20]);
    },

    comprobarEsquiva(objetivo) {
        let probabilidad = this.obtenerVelocidad(objetivo) * 0.12;
        const efecto = this.obtenerEfecto(objetivo, "E002");
        if (efecto) { probabilidad += efecto.potencia; }
        probabilidad = Math.max(2, Math.min(30, probabilidad));
        const dado = this.aleatorio(0, 100);
        return { esquiva: dado < probabilidad, probabilidad: probabilidad, dado: dado };
    },

    comprobarFallo(atacante) {
        const tactica = this.obtenerTactica(atacante);
        let probabilidad = 12 - (tactica * 0.08);
        probabilidad = Math.max(3, Math.min(12, probabilidad));
        const dado = this.aleatorio(0, 100);
        return { fallo: dado < probabilidad, probabilidad: probabilidad, dado: dado };
    },

    comprobarDefensa(defensor) {
        const inteligencia = this.obtenerInteligencia(defensor);
        const tactica = this.obtenerTactica(defensor);
        let probabilidad = 14;
        probabilidad -= inteligencia * 0.05;
        probabilidad -= tactica * 0.05;
        const fatiga = this.obtenerFatigaPorcentaje(defensor);
        if (fatiga < 45) {
            probabilidad += (45 - fatiga) * 0.10;
        }
        probabilidad = Math.max(4, Math.min(22, probabilidad));
        const dado = this.aleatorio(0, 100);
        const error = dado < probabilidad;
        return { error: error, acierto: !error, probabilidad_error: probabilidad, dado: dado };
    },

    comprobarCritico(atacante, ataque) {
        if (!ataque.critico) {
            return { critico: false, probabilidad: 0, dado: 100, bloqueado_por_fatiga: false };
        }
        const fatiga = this.obtenerFatigaPorcentaje(atacante);
        if (fatiga < 40) {
            return { critico: false, probabilidad: 0, dado: 100, bloqueado_por_fatiga: true };
        }
        let probabilidad = 6;
        probabilidad += this.obtenerTactica(atacante) * 0.10;
        const dado = this.aleatorio(0, 100);
        return { critico: dado < probabilidad, probabilidad: probabilidad, dado: dado, bloqueado_por_fatiga: false };
    },

    obtenerMultiplicadorVida(combatiente) {
        const porcentaje = (combatiente.hp / combatiente.hp_max) * 100;
        if (porcentaje <= 10) { return 1.25; }
        if (porcentaje <= 25) { return 1.15; }
        if (porcentaje <= 50) { return 1.08; }
        if (porcentaje <= 75) { return 1.02; }
        return 1.00;
    },

    calcularDano(atacante, objetivo, ataque, defensaActiva, critico) {
        const valorAtaque = this.limitar(atacante.efectivos.ataque);
        const valorDefensa = this.obtenerDefensa(objetivo);
        let dano = 8 + (valorAtaque * 0.12);
        dano *= ataque.potencia;
        const efectoPotenciacion = this.obtenerEfecto(atacante, "E007");
        if (efectoPotenciacion) {
            dano *= 1 + (efectoPotenciacion.potencia / 100);
        }
        const ratioDefensa = valorDefensa / (valorDefensa + valorAtaque + 50);
        let mitigacion = 1 - (ratioDefensa * 0.85);
        dano *= mitigacion;

        if (defensaActiva) {
            dano *= 0.45;
        }
        dano *= this.aleatorio(0.92, 1.08);
        if (critico.critico) {
            dano *= 1.35;
        }
        dano *= this.obtenerMultiplicadorVida(objetivo);
        dano = Math.max(1, Math.round(dano));
        return {
            dano: dano,
            critico: critico.critico,
            probabilidad_critico: critico.probabilidad,
            dado_critico: critico.dado,
            bloqueado_por_fatiga: critico.bloqueado_por_fatiga
        };
    },
        calcularDanoContraataque(atacante, objetivo) {
        const ataque = { codigo: "A001", nombre: "Ataque básico", potencia: 1.00, critico: true, efecto: null };
        const critico = this.comprobarCritico(atacante, ataque);
        return this.calcularDano(atacante, objetivo, ataque, false, critico);
    },

    ejecutarAtaque(atacante, objetivo, codigo) {
        if (!atacante || !objetivo || atacante.derrotado || objetivo.derrotado) {
            return { exito: false, codigo: codigo, mensaje: "Ataque no disponible." };
        }
        if (!window.PALARENA_STANDAR_ATAQUES) {
            return { exito: false, codigo: codigo, mensaje: "Base de ataques no disponible." };
        }
        const ataque = window.PALARENA_STANDAR_ATAQUES.obtener(codigo);
        if (!ataque) {
            return { exito: false, codigo: codigo, mensaje: "Ataque inexistente." };
        }
        if (ataque.codigo === "A002" && this.obtenerFatigaPorcentaje(atacante) < 40) {
            return {
                exito: false,
                bloqueado: true,
                bloqueado_por_fatiga: true,
                codigo: codigo,
                mensaje: "Ataque potente bloqueado: fatiga insuficiente.",
                fatiga: atacante.fatiga,
                fatiga_porcentaje: this.obtenerFatigaPorcentaje(atacante)
            };
        }
        const fatigaAccion = this.aplicarFatigaAccion(atacante, codigo);
        if (ataque.codigo === "D001") {
            atacante.defendiendo = true;
            return {
                exito: true,
                codigo: codigo,
                nombre: ataque.nombre,
                defensa: true,
                dano: 0,
                fatiga: fatigaAccion
            };
        }
        let costeHp = 0;
        if (ataque.codigo === "A002") {
            costeHp = Math.max(1, Math.round(atacante.hp_max * 0.04));
        }
        if (costeHp > 0) {
            atacante.hp = Math.max(1, atacante.hp - costeHp);
        }
        const fallo = this.comprobarFallo(atacante);
        if (fallo.fallo) {
            return {
                exito: false,
                codigo: codigo,
                nombre: ataque.nombre,
                fallo: true,
                esquiva: false,
                dano: 0,
                coste_hp: costeHp,
                fatiga: fatigaAccion,
                mensaje: "El ataque falla."
            };
        }
        if (objetivo.defendiendo) {
            const errorDefensa = this.comprobarDefensa(objetivo);
            if (errorDefensa.error) {
                objetivo.defendiendo = false;
            } else {
                const fatigaDefensa = this.aplicarFatiga(atacante, 10);
                const critico = this.comprobarCritico(atacante, ataque);
                const dano = this.calcularDano(atacante, objetivo, ataque, true, critico);
                objetivo.hp = Math.max(0, objetivo.hp - dano.dano);
                if (objetivo.hp <= 0) { objetivo.derrotado = true; }
                return {
                    exito: true,
                    codigo: codigo,
                    nombre: ataque.nombre,
                    defensa: true,
                    dano: dano.dano,
                    critico: dano.critico,
                    coste_hp: costeHp,
                    fatiga: fatigaAccion,
                    fatiga_defensa_atacante: fatigaDefensa,
                    error_defensa: errorDefensa
                };
            }
        }
        const esquiva = this.comprobarEsquiva(objetivo);
        if (esquiva.esquiva) {
            return {
                exito: false,
                codigo: codigo,
                nombre: ataque.nombre,
                fallo: false,
                esquiva: true,
                dano: 0,
                coste_hp: costeHp,
                fatiga: fatigaAccion,
                mensaje: "El objetivo esquiva el ataque."
            };
        }
        const critico = this.comprobarCritico(atacante, ataque);
        const dano = this.calcularDano(atacante, objetivo, ataque, false, critico);
        objetivo.hp = Math.max(0, objetivo.hp - dano.dano);
        if (objetivo.hp <= 0) { objetivo.derrotado = true; }
        let efectoAplicado = null;
        if (ataque.efecto && !objetivo.derrotado) {
            efectoAplicado = this.aplicarEfecto(atacante, objetivo, ataque.efecto);
        }
        return {
            exito: true,
            codigo: codigo,
            nombre: ataque.nombre,
            fallo: false,
            esquiva: false,
            dano: dano.dano,
            critico: dano.critico,
            probabilidad_critico: dano.probabilidad_critico,
            dado_critico: dano.dado,
            bloqueado_por_fatiga: dano.bloqueado_por_fatiga,
            coste_hp: costeHp,
            fatiga: fatigaAccion,
            efecto: efectoAplicado
        };
    },

    obtenerEfectoPerfil(combatiente) {
        const efectos = {
            agresivo: "E007",
            defensivo: "E003",
            rapido: "E002",
            aguante: "E005",
            tactico: "E006",
            equilibrado: "E006"
        };
        return efectos[combatiente.perfil] || "E006";
    },

    decidirAccion(atacante, objetivo) {
        if (!atacante || !objetivo) { return "A001"; }
        const hpPorcentaje = (atacante.hp / atacante.hp_max) * 100;
        const fatiga = this.obtenerFatigaPorcentaje(atacante);
        const inteligencia = this.obtenerInteligencia(atacante);
        const tactica = this.obtenerTactica(atacante);
        const ataque = this.limitar(atacante.efectivos.ataque);
        const defensa = this.obtenerDefensa(atacante);
        const velocidad = this.obtenerVelocidad(atacante);
        const resistencia = this.limitar(atacante.efectivos.resistencia);
        const hpObjetivo = (objetivo.hp / objetivo.hp_max) * 100;
        const fatigaObjetivo = this.obtenerFatigaPorcentaje(objetivo);
        const puntuaciones = { A001: 50, A002: 30, A003: 25, D001: 20 };
        puntuaciones.A001 += ataque * 0.22;
        puntuaciones.A001 += resistencia * 0.12;
        if (hpObjetivo <= 50) { puntuaciones.A001 += 10; }
        if (fatigaObjetivo <= 30) { puntuaciones.A001 += 6; }
        puntuaciones.A002 += ataque * 0.38;
        puntuaciones.A002 += tactica * 0.18;
        if (hpObjetivo <= 50) { puntuaciones.A002 += 20; }
        if (hpObjetivo <= 25) { puntuaciones.A002 += 15; }
        if (hpPorcentaje <= 50) { puntuaciones.A002 -= 18; }
        if (hpPorcentaje <= 25) { puntuaciones.A002 -= 25; }
        if (fatiga < 45) { puntuaciones.A002 -= 30; }
        puntuaciones.A003 += tactica * 0.32;
        puntuaciones.A003 += inteligencia * 0.18;
        if (fatigaObjetivo < 50) { puntuaciones.A003 += 12; }
        if (hpObjetivo <= 50) { puntuaciones.A003 += 10; }
        puntuaciones.D001 += defensa * 0.28;
        puntuaciones.D001 += resistencia * 0.18;
        if (hpPorcentaje <= 50) { puntuaciones.D001 += 22; }
        if (hpPorcentaje <= 25) { puntuaciones.D001 += 28; }
        if (fatiga < 40) { puntuaciones.D001 += 20; }
        if (inteligencia >= 70) {
            puntuaciones.A002 += 10;
            puntuaciones.A003 += 10;
            puntuaciones.D001 += 8;
        }
        if (inteligencia >= 85) { puntuaciones.A003 += 12; }
        if (fatiga >= 75) { puntuaciones.A002 += 10; }
        if (fatiga <= 25) {
            puntuaciones.A001 += 12;
            puntuaciones.A003 += 10;
            puntuaciones.D001 += 10;
        }
        if (velocidad >= 70) {
            puntuaciones.A001 += 6;
            puntuaciones.A003 += 6;
        }
        if (resistencia >= 70) { puntuaciones.D001 += 6; }
        const efectoPerfil = this.obtenerEfectoPerfil(atacante);
        if (efectoPerfil === "E007") { puntuaciones.A001 += 6; puntuaciones.A002 += 10; }
        if (efectoPerfil === "E003") { puntuaciones.A003 += 6; }
        if (efectoPerfil === "E002") { puntuaciones.A001 += 6; }
        if (efectoPerfil === "E005") { puntuaciones.A001 += 6; puntuaciones.D001 += 6; }
        if (efectoPerfil === "E006") { puntuaciones.A003 += 10; }
        const disponibles = ["A001", "A002", "A003", "D001"];
        const indiceA002 = disponibles.indexOf("A002");
        if (fatiga < 40) {
            if (indiceA002 !== -1) { disponibles.splice(indiceA002, 1); }
        }
        const candidatos = disponibles.map(function(codigo) {
            return { codigo: codigo, puntuacion: puntuaciones[codigo] + (Math.random() * 8) };
        });
        candidatos.sort(function(a, b) { return b.puntuacion - a.puntuacion; });
        let elegido = candidatos[0];
        if (candidatos.length > 1 && inteligencia >= 80 && Math.random() < 0.22) {
            elegido = candidatos[1];
        }
        if (elegido && elegido.codigo === "A002" && fatiga < 40) {
            elegido = candidatos.find(function(item) { return item.codigo !== "A002"; });
        }
        return elegido ? elegido.codigo : "A001";
    },

    ejecutarAccion(atacante, objetivo, accion) {
        atacante.defendiendo = false;
        return this.ejecutarAtaque(atacante, objetivo, accion);
    },

    finalizarCombate(combate) {
        if (!combate) { return null; }
        const combatiente1 = combate.combatiente1;
        const combatiente2 = combate.combatiente2;
        if (combatiente1.derrotado && combatiente2.derrotado) {
            combate.estado = "finalizado";
            combate.ganador = null;
            combate.perdedor = null;
            return combate;
        }
        if (combatiente1.derrotado) {
            combate.estado = "finalizado";
            combate.ganador = combatiente2.codigo;
            combate.perdedor = combatiente1.codigo;
            return combate;
        }
        if (combatiente2.derrotado) {
            combate.estado = "finalizado";
            combate.ganador = combatiente1.codigo;
            combate.perdedor = combatiente2.codigo;
            return combate;
        }
        return combate;
    },

    ejecutarTurno(combate) {
        if (!combate || combate.estado === "finalizado") { return combate; }
        if (combate.turno > this.configuracion.max_turnos) {
            combate.estado = "finalizado";
            return combate;
        }
        const primero = this.obtenerCombatiente(combate, combate.primero);
        const segundo = this.obtenerCombatiente(combate, combate.segundo);
        if (!primero || !segundo) {
            combate.estado = "finalizado";
            return combate;
        }
        const efectosPrimero = this.procesarEfectos(primero);
        const efectosSegundo = this.procesarEfectos(segundo);
        combate.historial.push({ tipo: "efectos", turno: combate.turno, primero: efectosPrimero, segundo: efectosSegundo });
        if (primero.derrotado || segundo.derrotado) { return this.finalizarCombate(combate); }
        const accionPrimero = this.decidirAccion(primero, segundo);
        const resultadoPrimero = this.ejecutarAccion(primero, segundo, accionPrimero);
        combate.historial.push({ tipo: "accion", turno: combate.turno, atacante: primero.codigo, objetivo: segundo.codigo, accion: accionPrimero, resultado: resultadoPrimero });
        if (segundo.derrotado) { return this.finalizarCombate(combate); }
        const accionSegundo = this.decidirAccion(segundo, primero);
        const resultadoSegundo = this.ejecutarAccion(segundo, primero, accionSegundo);
        combate.historial.push({ tipo: "accion", turno: combate.turno, atacante: segundo.codigo, objetivo: primero.codigo, accion: accionSegundo, resultado: resultadoSegundo });
        if (primero.derrotado) { return this.finalizarCombate(combate); }
        const regeneracionPrimero = this.regenerarFatiga(primero);
        const regeneracionSegundo = this.regenerarFatiga(segundo);
        combate.historial.push({ tipo: "regeneracion_fatiga", turno: combate.turno, primero: regeneracionPrimero, segundo: regeneracionSegundo });
        primero.defendiendo = false;
        segundo.defendiendo = false;
        combate.turno++;
        return combate;
    },

    ejecutarCombate(combate) {
        if (!combate) { return null; }
        while (combate.estado !== "finalizado") {
            this.ejecutarTurno(combate);
            if (combate.turno > this.configuracion.max_turnos) {
                combate.estado = "finalizado";
                break;
            }
        }
        return combate;
    },

    obtenerResumen(combate) {
        if (!combate) { return null; }
        function resumen(combatiente) {
            return {
                codigo: combatiente.codigo,
                nombre: combatiente.nombre,
                hp: combatiente.hp,
                hp_max: combatiente.hp_max,
                hp_porcentaje: (combatiente.hp / combatiente.hp_max) * 100,
                fatiga: combatiente.fatiga,
                fatiga_max: combatiente.fatiga_max,
                fatiga_porcentaje: (combatiente.fatiga / combatiente.fatiga_max) * 100,
                dominante: combatiente.dominante,
                perfil: combatiente.perfil,
                derrotado: combatiente.derrotado,
                defendiendo: combatiente.defendiendo,
                efectos: combatiente.efectos
            };
        }
        return {
            estado: combate.estado,
            turno: combate.turno,
            primero: combate.primero,
            segundo: combate.segundo,
            ganador: combate.ganador,
            perdedor: combate.perdedor,
            combatiente1: resumen(combatiente.combatiente1),
            combatiente2: resumen(combatiente.combatiente2),
            historial: combate.historial
        };
    }
};

window.crearCombatienteEstandar = function(ficha, reglas) { return window.PALARENA_STANDAR.crearCombatiente(ficha, reglas); };
window.crearCombateEstandar = function(ficha1, ficha2, reglas) { return window.PALARENA_STANDAR.crearCombate(ficha1, ficha2, reglas); };
window.ejecutarTurnoEstandar = function(combate) { return window.PALARENA_STANDAR.ejecutarTurno(combate); };
window.ejecutarCombateEstandar = function(combate) { return window.PALARENA_STANDAR.ejecutarCombate(combate); };
window.obtenerResumenEstandar = function(combate) { return window.PALARENA_STANDAR.obtenerResumen(combate); };

/* ==================================================
   FIN STANDAR.JS — v1.3.3 REEQUILIBRADO Y BLINDADO
   ================================================== */
        
