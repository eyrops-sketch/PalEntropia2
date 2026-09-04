    obtenerCosteFatiga(codigo, atacante) {
        const costes = {
            A001: 7,
            A002: 18,
            A003: 10,
            D001: 4
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
        // Mitigación por ratio de defensa para que los tanques resistan de verdad
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
            combatiente1: resumen(combate.combatiente1),
            combatiente2: resumen(combate.combatiente2),
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
   FIN STANDAR.JS — REEQUILIBRADO TÁCTICO v1.3
   ================================================== */
