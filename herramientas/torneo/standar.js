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
        dano_vida_critico: 1.35,
        max_turnos: 100,
        general: 1,
        escenariojug1: 1,
        escenariojug2: 1,
        ia_peso_aleatorio: 0.40
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
        const coefGeneral = Number(config.general) !== undefined && !isNaN(Number(config.general)) ? Number(config.general) : 1;

        if (window.PALARENA_STATS && typeof window.PALARENA_STATS.calcularFicha === "function") {
            const statsCalculados = window.PALARENA_STATS.calcularFicha(ficha);
            return {
                ataque: statsCalculados.ataque * coefGeneral,
                defensa: statsCalculados.defensa * coefGeneral,
                velocidad: statsCalculados.velocidad * coefGeneral,
                resistencia: statsCalculados.resistencia * coefGeneral,
                tactica: statsCalculados.tactica * coefGeneral
            };
        }

        const baseAtq = Number(ficha.e1) || 50;
        const baseDef = Number(ficha.e2) || 50;
        const baseVel = Number(ficha.e3) || 50;
        const baseRes = Number(ficha.e4) || 50;
        const baseTac = Number(ficha.e5) || 50;

        return {
            ataque: baseAtq * coefGeneral,
            defensa: baseDef * coefGeneral,
            velocidad: baseVel * coefGeneral,
            resistencia: baseRes * coefGeneral,
            tactica: baseTac * coefGeneral
        };
    }

    function crearCombatiente(ficha, configPersonalizada = null) {
        const config = configPersonalizada || configuracionGlobal;
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
            usosDefensaConsecutivos: 0,
            rachaBasicos: 0,
            tacticaTemporal: 0,
            estadoCaotico: 0,
            posturaDefensiva: null,
            efectos: []
        };
    }

    function crearCombateEstandar(ficha1, ficha2, configPersonalizada = null) {
        sincronizarConfiguracionDesdeStorage();
        if (configPersonalizada && typeof configPersonalizada === "object") {
            configuracionGlobal = { ...configuracionGlobal, ...configPersonalizada };
        }
        const config = configuracionGlobal;
        const c1 = crearCombatiente(ficha1, config);
        const c2 = crearCombatiente(ficha2, config);

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
        const config = configuracionGlobal;
        combatiente.fatiga = Math.min(
            config.fatiga_max,
            combatiente.fatiga + config.fatiga_regeneracion_turno
        );
    }
        function ejecutarAccion(atacante, objetivo, codigoAccion) {
        const config = configuracionGlobal;
        let costeFatiga = 0;

        if (codigoAccion !== "A001") {
            atacante.rachaBasicos = 0;
        }

        const fatigaCritica = (atacante.fatiga / (config.fatiga_max || 100)) * 100 < 15;
        if (fatigaCritica && codigoAccion === "A002") {
            atacante.fatiga = Math.max(0, atacante.fatiga - 15);
            return {
                mensaje: `⚠️ ${atacante.nombre} está demasiado exhausto; el intento de ataque potente se desmorona por fatiga crítica.`,
                dano: 0,
                critico: false
            };
        }

        if (codigoAccion === "A001") {
            // El coste base se calcula dinámicamente abajo con el freno por racha
        } else if (codigoAccion === "A002") {
            costeFatiga = config.coste_fatiga_A002;
        } else if (codigoAccion === "A003") {
            costeFatiga = config.coste_fatiga_A003;
        } else if (codigoAccion === "D001") {
            if (atacante.usosDefensaConsecutivos === undefined) atacante.usosDefensaConsecutivos = 0;
            atacante.usosDefensaConsecutivos++;

            if (atacante.usosDefensaConsecutivos >= 3) {
                costeFatiga = config.coste_fatiga_D001 || 20;
                const fatigaActualAtacante = Number(atacante.fatiga) || 0;
                const reduccionPropia = Math.round(fatigaActualAtacante * 0.40);
                atacante.fatiga = Math.max(0, fatigaActualAtacante - reduccionPropia);

                const fatigaActualRival = Number(objetivo.fatiga) || 0;
                const reposicionRival = Math.round((config.fatiga_max || 100) * 0.40);
                objetivo.fatiga = Math.min(config.fatiga_max || 100, fatigaActualRival + reposicionRival);

                atacante.defendiendo = true;
                atacante.usosDefensaConsecutivos = 0;

                return {
                    mensaje: `🛡️⚡ ¡${atacante.nombre} ejecuta una defensa maestra absoluta! Reduce su propia fatiga un 40% y devuelve un 40% de resuello a ${objetivo.nombre}.`,
                    defensa: "maestra"
                };
            } else if (atacante.usosDefensaConsecutivos === 2) {
                costeFatiga = 10;
            } else {
                costeFatiga = 5;
            }
        }

        if (codigoAccion !== "D001") {
            atacante.usosDefensaConsecutivos = 0;
        }

        if (codigoAccion !== "A001") {
            atacante.fatiga = Math.min(config.fatiga_max, Math.max(0, atacante.fatiga - costeFatiga));
        }

        if (codigoAccion === "D001") {
            if (objetivo.defendiendo) {
                atacante.defendiendo = true;
                const tacticaAtacante = (atacante.efectivos.tactica + (atacante.tacticaTemporal || 0));
                const tacticaObjetivo = (objetivo.efectivos.tactica + (objetivo.tacticaTemporal || 0));
                const velocidadAtacante = atacante.efectivos.velocidad || 50;
                const velocidadObjetivo = objetivo.efectivos.velocidad || 50;
                const puntuacionAtacante = tacticaAtacante * 0.7 + velocidadAtacante * 0.3;
                const puntuacionObjetivo = tacticaObjetivo * 0.7 + velocidadObjetivo * 0.3;
                let mensajeContradefensa = `🛡️🔄 ${atacante.nombre} y ${objetivo.nombre} se cruzan en una tensa contradefensa, tanteándose sin arriesgar.`;

                if (puntuacionAtacante > puntuacionObjetivo) {
                    const penalizacion = Math.round((Number(objetivo.fatiga) || 0) * 0.15);
                    objetivo.fatiga = Math.max(0, (Number(objetivo.fatiga) || 0) - penalizacion);
                    mensajeContradefensa += ` ¡${atacante.nombre} impone su agilidad y lectura táctica, desgastando el resuello del rival!`;
                } else if (puntuacionObjetivo > puntuacionAtacante) {
                    const penalizacionPropia = Math.round((Number(atacante.fatiga) || 0) * 0.15);
                    atacante.fatiga = Math.max(0, (Number(atacante.fatiga) || 0) - penalizacionPropia);
                    mensajeContradefensa += ` ¡${objetivo.nombre} gana la iniciativa en el bloqueo mutuo!`;
                }
                return {
                    mensaje: mensajeContradefensa,
                    defensa: "contradefensa"
                };
            }

            if (Math.random() < 0.35) {
                atacante.posturaDefensiva = "contraTactico";
            } else {
                atacante.posturaDefensiva = null;
            }

            const umbralError = Math.max(
                Number(config.error_defensa_min) || 15,
                (Number(config.error_defensa_base) || 45) - (atacante.efectivos.tactica * (Number(config.error_defensa_reduccion_tactica) || 0.02))
            );

            const tirada = Math.random() * 100;
            const defensaExitosa = tirada > umbralError;

            if (defensaExitosa) {
                atacante.defendiendo = true;
                const fatigaActualRival = Number(objetivo.fatiga) || 0;
                const penalizacionRival = Math.round(fatigaActualRival * 0.40);
                objetivo.fatiga = Math.max(0, fatigaActualRival - penalizacionRival);
                return {
                    mensaje: `🛡️✨ ${atacante.nombre} planta una defensa impenetrable, bloqueando las líneas y drenando un 40% de fatiga a ${objetivo.nombre}.`,
                    defensa: "acierto"
                };
            } else {
                atacante.defendiendo = false;
                return {
                    mensaje: `❌ ${atacante.nombre} intenta adoptar una postura defensiva, pero calcula mal los tiempos y pierde el equilibrio.`,
                    defensa: "fallo"
                };
            }
        }

        let danoBase = Number(config.dano_base) + (atacante.efectivos.ataque * Number(config.dano_por_ataque));
        let critico = false;
        let mensajeExtra = "";
        let bonusAccion = 1.0;

        if (codigoAccion === "A001") {
            atacante.rachaBasicos = (atacante.rachaBasicos || 0) + 1;
            
            let bonusCadena = 1.0 + (Math.min(atacante.rachaBasicos, 4) - 1) * 0.12;
            bonusAccion *= bonusCadena;

            let costeExtraBasico = (atacante.rachaBasicos - 1) * 3;
            costeFatiga = (config.coste_fatiga_A001 || 8) + costeExtraBasico;
            atacante.fatiga = Math.min(config.fatiga_max, Math.max(0, atacante.fatiga - costeFatiga));

            if (atacante.rachaBasicos > 1) {
                mensajeExtra = ` (Cadena de básicos x${atacante.rachaBasicos}, presión ofensiva)`;
            }

            if ((objetivo.fatiga / (config.fatiga_max || 100)) * 100 < 15) {
                bonusAccion *= 1.25;
                mensajeExtra += ", castigando con dureza su fatiga crítica";
            } else if (objetivo.estadoGuardia === "rota") {
                bonusAccion *= 1.15;
                mensajeExtra += " con precisión milimétrica sobre la guardia rota";
            }
        } else if (codigoAccion === "A002") {
            const multiCrit = Number(config.multiplicador_critico) || 1.0;
            const tacticaTotal = atacante.efectivos.tactica + (atacante.tacticaTemporal || 0);
            const fatigaMinCrit = Number(config.fatiga_minima_critico) || 20;
            
            const probabilidadCritica = (Number(config.critico_base) || 10) + (tacticaTotal * (Number(config.critico_tactica) || 0.15));
            const tieneEnergiaParaCritico = atacante.fatiga >= fatigaMinCrit;

            if (multiCrit > 1.0 && tieneEnergiaParaCritico && Math.random() * 100 < probabilidadCritica) {
                bonusAccion *= multiCrit;
                critico = true;
                mensajeExtra = " ¡Golpe crítico certero!";
            } else {
                bonusAccion *= 1.25;
                mensajeExtra = " (Ataque potente pesado)";
            }
        } else if (codigoAccion === "A003") {
            const tacticaAtacante = atacante.efectivos.tactica + (atacante.tacticaTemporal || 0);
            const tacticaObjetivo = objetivo.efectivos.tactica + (objetivo.tacticaTemporal || 0);

            if (objetivo.posturaDefensiva === "contraTactico" || tacticaObjetivo >= tacticaAtacante) {
                mensajeExtra = `, pero ${objetivo.nombre} anticipa la maniobra y neutraliza el flanco intelectual`;
                bonusAccion *= 0.70;
            } else {
                let reduccionTactica = 10;
                objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - reduccionTactica;
                objetivo.estadoCaotico = 1;
                mensajeExtra = `, perforando las líneas, arrebatándole ${reduccionTactica} puntos de táctica temporal y desestabilizando su juicio mental`;
            }
        }
                    danoBase *= bonusAccion;

        let defensaObjetivo = 0;
        let mensajeRuptura = "";

        if (objetivo.defendiendo) {
            if (codigoAccion === "A002") {
                const chanceContra = Math.random();
                if (chanceContra < 0.45) {
                    const fatigaAtacanteActual = Number(atacante.fatiga) || 0;
                    atacante.fatiga = Math.max(0, fatigaAtacanteActual - 20);
                    return {
                        mensaje: `💥⚠️ ¡${objetivo.nombre} anticipa el violento ataque potente de ${atacante.nombre}, esquivándolo con destreza y castigando su fatiga por la lentitud del fallo!`,
                        dano: 0,
                        critico: false
                    };
                } else {
                    objetivo.defendiendo = false;
                    mensajeRuptura = ` 💥🔨 ¡El devastador ataque potente de ${atacante.nombre} pulveriza por completo la guardia de ${objetivo.nombre}!`;
                }
            } else {
                defensaObjetivo = Number(objetivo.efectivos.defensa) * (1 + Number(config.reduccion_defensa));
            }
        } else {
            defensaObjetivo = Number(objetivo.efectivos.defensa) || 0;
        }

        const divisorDefensa = Math.max(1, Number(config.defensa_divisor) || 200);
        const porcentajeDefensa = Math.max(
            0,
            Math.min(0.85, defensaObjetivo / (defensaObjetivo + divisorDefensa))
        );

        let danoReducido = danoBase * (1 - porcentajeDefensa);
        danoReducido = Math.max(1, danoReducido);

        const variacion = Number(config.variacion_dano) || 0.25;
        const factorAleatorio = 1 + (Math.random() * (variacion * 2) - variacion);

        let danoFinal = Math.max(1, Math.round(danoReducido * factorAleatorio));

        objetivo.hp = Math.max(0, objetivo.hp - danoFinal);

        if (objetivo.hp <= 0) {
            objetivo.derrotado = true;
        }

        const iconoAccion = codigoAccion === "A002" ? "⚡" : (codigoAccion === "A003" ? "🎯" : "⚔️");

        return {
            mensaje: `${iconoAccion} ${atacante.nombre} ejecuta ${codigoAccion} contra ${objetivo.nombre}${mensajeExtra}.${mensajeRuptura} Daño: ${danoFinal}`,
            dano: danoFinal,
            critico: critico
        };
    }

    function decidirAccion(atacante, objetivo) {
        const config = configuracionGlobal;

        if (atacante.estadoCaotico && atacante.estadoCaotico > 0) {
            atacante.estadoCaotico--;
            if (Math.random() < 0.80) {
                const accionesDisponibles = ["A001", "A002", "A003", "D001"];
                const accionAleatoria = accionesDisponibles[Math.floor(Math.random() * accionesDisponibles.length)];
                
                if (accionAleatoria !== "A001") atacante.rachaBasicos = 0;
                return accionAleatoria;
            }
        }

        const fatigaActual = Number(atacante.fatiga) || 0;
        const hpPorcentaje = (atacante.hp / atacante.hp_max) * 100;
        const objetivoHpPorcentaje = (objetivo.hp / objetivo.hp_max) * 100;
        const pesoAleatorio = Number(config.ia_peso_aleatorio) !== undefined && !isNaN(Number(config.ia_peso_aleatorio)) ? Number(config.ia_peso_aleatorio) : 0.40;

        if (Math.random() < pesoAleatorio) {
            const accionesDisponibles = ["A001", "A003"];
            const costePotente = Number(config.coste_fatiga_A002) || 38;
            const fatigaMinPotente = Number(config.fatiga_minima_ataque_potente) || 65;
            const multiCrit = Number(config.multiplicador_critico) || 1.0;

            if (multiCrit > 1.0 && fatigaActual >= fatigaMinPotente && fatigaActual >= costePotente) {
                accionesDisponibles.push("A002");
            }

            const costeDefensa = Number(config.coste_fatiga_D001) || 20;
            if (fatigaActual >= costeDefensa) {
                accionesDisponibles.push("D001");
            }

            return accionesDisponibles[Math.floor(Math.random() * accionesDisponibles.length)];
        }

        const costePotente = Number(config.coste_fatiga_A002) || 38;
        const fatigaMinPotente = Number(config.fatiga_minima_ataque_potente) || 65;
        const multiCrit = Number(config.multiplicador_critico) || 1.0;

        if (multiCrit > 1.0 && fatigaActual >= fatigaMinPotente && fatigaActual >= costePotente) {
            if (objetivoHpPorcentaje < 35 || hpPorcentaje > 60) {
                return "A002";
            }
        }

        const costeDefensa = Number(config.coste_fatiga_D001) || 20;
        if (hpPorcentaje < 30 && fatigaActual > costeDefensa && !atacante.defendiendo) {
            return "D001";
        }

        const costeTactico = Number(config.coste_fatiga_A003) || 10;
        if (fatigaActual >= costeTactico && ((atacante.efectivos.tactica + (atacante.tacticaTemporal || 0)) > 40 || Math.random() < 0.50)) {
            return "A003";
        }

        return "A001";
    }
        function obtenerCombatiente(combate, codigo) {
        if (combate.combatiente1.codigo === codigo) return combate.combatiente1;
        if (combate.combatiente2.codigo === codigo) return combate.combatiente2;
        return null;
    }

    function reiniciarSerieCombatientes(combate) {
        if (!combate) return;
        combate.turno = 1;
        combate.estado = "en_curso";
        combate.historial = [];
        combate.ganador = null;

        if (combate.combatiente1) {
            combate.combatiente1.hp = combate.combatiente1.hp_max;
            combate.combatiente1.fatiga = configuracionGlobal.fatiga_inicial;
            combate.combatiente1.derrotado = false;
            combate.combatiente1.defendiendo = false;
            combate.combatiente1.usosDefensaConsecutivos = 0;
            combate.combatiente1.rachaBasicos = 0;
            combate.combatiente1.tacticaTemporal = 0;
            combate.combatiente1.estadoCaotico = 0;
            combate.combatiente1.posturaDefensiva = null;
        }

        if (combate.combatiente2) {
            combate.combatiente2.hp = combate.combatiente2.hp_max;
            combate.combatiente2.fatiga = configuracionGlobal.fatiga_inicial;
            combate.combatiente2.derrotado = false;
            combate.combatiente2.defendiendo = false;
            combate.combatiente2.usosDefensaConsecutivos = 0;
            combate.combatiente2.rachaBasicos = 0;
            combate.combatiente2.tacticaTemporal = 0;
            combate.combatiente2.estadoCaotico = 0;
            combate.combatiente2.posturaDefensiva = null;
        }
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
        obtenerCombatiente,
        reiniciarSerieCombatientes
    };

})();

window.crearCombateEstandar = window.PALARENA_STANDAR.crearCombateEstandar;
window.reiniciarSerieCombatientes = window.PALARENA_STANDAR.reiniciarSerieCombatientes;

window.ejecutarTurnoEstandar = function(combate) {
    if (!combate || combate.estado === "finalizado") return;
    const c1 = combate.combatiente1;
    const c2 = combate.combatiente2;

    const accion1 = window.PALARENA_STANDAR.decidirAccion(c1, c2);
    const res1 = window.PALARENA_STANDAR.ejecutarAccion(c1, c2, accion1);
    combate.historial.push({ tipo: "accion", atacante: c1.codigo, objetivo: c2.codigo, resultado: res1 });

    if (c2.derrotado) {
        combate.estado = "finalizado";
        combate.ganador = c1.codigo;
        return;
    }

    const accion2 = window.PALARENA_STANDAR.decidirAccion(c2, c1);
    const res2 = window.PALARENA_STANDAR.ejecutarAccion(c2, c1, accion2);
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
    c1.posturaDefensiva = null;
    c2.posturaDefensiva = null;

    if (c1.tacticaTemporal !== 0) c1.tacticaTemporal = Math.sign(c1.tacticaTemporal) * Math.max(0, Math.abs(c1.tacticaTemporal) - 2);
    if (c2.tacticaTemporal !== 0) c2.tacticaTemporal = Math.sign(c2.tacticaTemporal) * Math.max(0, Math.abs(c2.tacticaTemporal) - 2);

    combate.turno++;

    if (combate.turno > window.PALARENA_STANDAR.configuracion.max_turnos) {
        combate.estado = "finalizado";
        combate.ganador = c1.hp >= c2.hp ? c1.codigo : c2.codigo;
    }
};
