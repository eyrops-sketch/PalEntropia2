window.PALARENA_STANDAR = (function() {
    let configuracionGlobal = {
        hp_base: 1000,
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
        reduccion_defensa: 0.55,
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
        max_turnos: 150,
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
                const coefs = reglas.coeficientes || {};
                const parametrosReglas = {};
                if (reglas.factorImprevisible !== undefined) {
                    parametrosReglas.factorImprevisible = Number(reglas.factorImprevisible);
                }
                if (reglas.iaAleatoria !== undefined) {
                    parametrosReglas.iaAleatoria = Boolean(reglas.iaAleatoria);
                }
                configuracionGlobal = {
                    ...configuracionGlobal,
                    ...coefs,
                    ...parametrosReglas
                };
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
        const multCompartido = Number((Math.random() * 9 + 1).toFixed(2));
        const efectivos = calcularStatsEfectivos(ficha, config);
        let hpMax = (config.hp_base || 1000) * multCompartido * (efectivos.resistencia / 50);
        
        if (hpMax < 200 && multCompartido < 2.0) {
            hpMax *= 2;
        }

        return {
            codigo: ficha.j1 || ficha.codigo || "Desconocido",
            nombre: ficha.j2 || ficha.nombre || "Sin nombre",
            perfil: ficha.perfil || "standard",
            hp_max: Math.round(hpMax),
            hp: Math.round(hpMax),
            fatiga_max: config.fatiga_max,
            fatiga: config.fatiga_inicial,
            efectivos: efectivos,
            tamano: Number(ficha.e9) || 50,     // Tamaño para el contraataque
            rangoTemporal: ficha.j3 || "",      // Rango de tiempo para rivalidad
            defendiendo: false,
            derrotado: false,
            usosDefensaConsecutivos: 0,
            rachaBasicos: 0,
            tacticaTemporal: 0,
            estadoCaotico: 0,
            posturaDefensiva: null,
            turnosAturdido: 0,
            turnosParalizado: 0,
            turnosDesangrado: 0,
            efectos: [],
            frenesiAnunciado: false
        };
    }

    function crearCombateEstandar(ficha1, ficha2, configPersonalizada = null) {
        sincronizarConfiguracionDesdeStorage();
        if (configPersonalizada && typeof configPersonalizada === "object") {
            configuracionGlobal = { ...configuracionGlobal, ...configPersonalizada };
        }
        const config = configuracionGlobal;
        
        let c1 = crearCombatiente(ficha1, config);
        let c2 = crearCombatiente(ficha2, config);
        
        const diferencia = Math.abs(c1.hp_max - c2.hp_max);
        
        if (diferencia >= 100) {
            if (c1.hp_max < c2.hp_max) {
                c1.hp_max = c2.hp_max - 50;
                c1.hp = c1.hp_max;
            } else {
                c2.hp_max = c1.hp_max - 50;
                c2.hp = c2.hp_max;
            }
        }

        // --- SISTEMA DE RIVALIDAD EVOLUTIVA ---
        function comprobarRivalidad(rango1, rango2) {
            if (!rango1 || !rango2) return false;
            const parseRango = (str) => {
                const parts = str.split('-');
                if (parts.length !== 2) return null;
                return { max: parseFloat(parts[0]), min: parseFloat(parts[1]) };
            };
            const r1 = parseRango(rango1);
            const r2 = parseRango(rango2);
            if (!r1 || !r2) return false;
            return (r1.max >= r2.min && r1.min <= r2.max);
        }

        const hayRivalidad = comprobarRivalidad(c1.rangoTemporal, c2.rangoTemporal);
        c1.rivalidadVigente = hayRivalidad;
        c2.rivalidadVigente = hayRivalidad;
        // ---------------------------------------
        
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

        if (atacante.turnosParalizado > 0) {
            atacante.turnosParalizado--;
            const mensajeEstado = `⚡ ¡${atacante.nombre} está completamente paralizado y no puede mover un músculo este turno! (Quedan ${atacante.turnosParalizado} turnos)`;
            return {
                mensaje: mensajeEstado,
                dano: 0,
                critico: false
            };
        }

        if (atacante.turnosAturdido > 0) {
            atacante.turnosAturdido--;
            const mensajeEstado = `💫 ¡${atacante.nombre} está aturdido y recupera el sentido con torpeza, perdiendo la iniciativa!`;
            return {
                mensaje: mensajeEstado,
                dano: 0,
                critico: false
            };
        }

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
            // Se calcula más abajo
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
                const reduccionPropia = Math.round(fatigaActualAtacante * 0.50);
                atacante.fatiga = Math.max(0, fatigaActualAtacante - reduccionPropia);
                
                const fatigaActualRival = Number(objetivo.fatiga) || 0;
                const reposicionRival = Math.round((config.fatiga_max || 100) * 0.60);
                objetivo.fatiga = Math.min(config.fatiga_max || 100, fatigaActualRival + reposicionRival);
                atacante.defendiendo = true;
                atacante.usosDefensaConsecutivos = 0;
                
                let mensajeMaestra = `🛡️⚡ ¡${atacante.nombre} ejecuta una defensa maestra absoluta! Reduce su propia fatiga un 50% y drena un 60% de resuello a ${objetivo.nombre}.`;
                
                // --- CONTRAATAQUE POTENCIADO TAMAÑO PEQUEÑO (DEFENSA MAESTRA) [50% éxito, 80% fatiga, 40% HP actual, 1 turno parálisis] ---
                if (atacante.tamano <= 30 && Math.random() < 0.50) {
                    const fatigaRivalPost = Number(objetivo.fatiga) || 0;
                    const reduccionFatigaExtra = Math.round(fatigaRivalPost * 0.80);
                    objetivo.fatiga = Math.max(0, fatigaRivalPost - reduccionFatigaExtra);
                    
                    const hpActualRival = Number(objetivo.hp) || 0;
                    const danoHpProporcional = Math.max(1, Math.round(hpActualRival * 0.40));
                    objetivo.hp = Math.max(0, hpActualRival - danoHpProporcional);
                    
                    objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado, 1);

                    mensajeMaestra += ` 🦎 ¡Contraataque escurridizo devastador (Tamaño <= 30)! Drena un 80% de la fatiga del rival, le arranca ${danoHpProporcional} de HP (40% de su salud actual) y lo deja paralizado 1 turno.`;
                    if (objetivo.hp <= 0) {
                        objetivo.derrotado = true;
                        mensajeMaestra += ` ☠️ ¡El contraataque ha sido letal!`;
                    }
                }

                return {
                    mensaje: mensajeMaestra,
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
                    const penalizacion = Math.round((Number(objetivo.fatiga) || 0) * 0.25);
                    objetivo.fatiga = Math.max(0, (Number(objetivo.fatiga) || 0) - penalizacion);
                    mensajeContradefensa += ` ¡${atacante.nombre} impone su agilidad y lectura táctica, castigando con fuerza el resuello del rival!`;
                } else if (puntuacionObjetivo > puntuacionAtacante) {
                    const penalizacionPropia = Math.round((Number(atacante.fatiga) || 0) * 0.25);
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
                const penalizacionRival = Math.round(fatigaActualRival * 0.60);
                objetivo.fatiga = Math.max(0, fatigaActualRival - penalizacionRival);
                
                let mensajeDefensa = `🛡️✨ ${atacante.nombre} planta un muro defensivo impenetrable, bloqueando los ataques y drenando un 60% de fatiga a ${objetivo.nombre}.`;

                // --- CONTRAATAQUE POTENCIADO TAMAÑO PEQUEÑO (DEFENSA NORMAL) [50% éxito, 80% fatiga, 40% HP actual, 1 turno parálisis] ---
                if (atacante.tamano <= 30 && Math.random() < 0.50) {
                    const fatigaRivalPost = Number(objetivo.fatiga) || 0;
                    const reduccionFatigaExtra = Math.round(fatigaRivalPost * 0.80);
                    objetivo.fatiga = Math.max(0, fatigaRivalPost - reduccionFatigaExtra);
                    
                    const hpActualRival = Number(objetivo.hp) || 0;
                    const danoHpProporcional = Math.max(1, Math.round(hpActualRival * 0.40));
                    objetivo.hp = Math.max(0, hpActualRival - danoHpProporcional);
                    
                    objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado, 1);

                    mensajeDefensa += ` 🦎 ¡Contraataque escurridizo certero (Tamaño <= 30)! Pasa entre las piernas del coloso, drenando un 80% de su fatiga, arrebatándole ${danoHpProporcional} de HP (40% de su salud actual) y paralizándolo 1 turno.`;
                    
                    if (objetivo.hp <= 0) {
                        objetivo.derrotado = true;
                        mensajeDefensa += ` ☠️ ¡El contraataque ha sido letal!`;
                    }
                }

                return {
                    mensaje: mensajeDefensa,
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
            let probabilidadCritica = (Number(config.critico_base) || 10) + (tacticaTotal * (Number(config.critico_tactica) || 0.15));
            
            // --- APLICACIÓN RIVALIDAD EVOLUTIVA (CRÍTICO) ---
            if (atacante.rivalidadVigente) {
                probabilidadCritica += 5; // +5% prob crítico si vivieron en la misma era
            }

            const tieneEnergiaParaCritico = atacante.fatiga >= fatigaMinCrit;
            if (multiCrit > 1.0 && tieneEnergiaParaCritico && Math.random() * 100 < probabilidadCritica) {
                bonusAccion *= multiCrit;
                critico = true;
                mensajeExtra = " ¡Golpe crítico certero!";
                if (Math.random() < 0.35) {
                    objetivo.turnosAturdido = 1;
                    mensajeExtra += " 💫 ¡El brutal impacto deja al rival aturdido por 1 turno!";
                } else if (Math.random() < 0.20) {
                    objetivo.turnosDesangrado = 3;
                    mensajeExtra += " 🩸 ¡Desgarra la carne provocando una hemorragia severa (3 turnos)!";
                }
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
                let extraRivalidad = "";
                
                // --- APLICACIÓN RIVALIDAD EVOLUTIVA (TÁCTICA) ---
                if (atacante.rivalidadVigente) {
                    reduccionTactica += 5;
                    bonusAccion *= 1.15; // 15% más de daño base táctico
                    extraRivalidad = " 👁️ (Instinto ancestral activado)";
                }

                objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - reduccionTactica;
                objetivo.estadoCaotico = 1;
                mensajeExtra = `, perforando las líneas${extraRivalidad}, arrebatándole ${reduccionTactica} puntos de táctica temporal y desestabilizando su juicio mental`;
                if (Math.random() < 0.25) {
                    objetivo.turnosParalizado = 2;
                    mensajeExtra += " ⚡ ¡Bloquea los nervios del rival paralizándolo por 2 turnos!";
                }
            }
        }

        // --- INYECCIÓN DE HABILIDAD TAXONÓMICA ---
        if (window.PALARENA_TAXON_COMBATE && (codigoAccion === "A001" || codigoAccion === "A002")) {
            const rasgos = window.PALARENA_TAXON_COMBATE.obtenerRasgosTaxonomicos(atacante.codigo);
            if (rasgos && typeof rasgos.aplicarEfecto === "function") {
                if (Math.random() < 0.30) { // 30% de probabilidad por ataque
                    const resultadoTaxon = rasgos.aplicarEfecto(atacante, objetivo);
                    if (resultadoTaxon) {
                        bonusAccion *= resultadoTaxon.extraDano;
                        mensajeExtra += resultadoTaxon.mensajeTexto;
                    }
                }
            }
        }
                    // --- MODO FRENESÍ (ÚLTIMO ALIENTO) ---
        if (atacante.hp < atacante.hp_max * 0.20 && codigoAccion !== "D001") {
            bonusAccion *= 1.35; // 35% de daño extra
            atacante.efectivos.defensa *= 0.60; // Penalización a su defensa
            if (!atacante.frenesiAnunciado) {
                mensajeExtra += " 🔥 ¡FRENESÍ DE SUPERVIVENCIA! Desata un poder salvaje ignorando por completo su propia guardia.";
                atacante.frenesiAnunciado = true;
            } else {
                mensajeExtra += " (Furia activa)";
            }
        }

        let baseAtq = atacante.efectivos.ataque;
        let baseDef = objetivo.efectivos.defensa;
        let factorImp = Number(config.factorImprevisible) || 1.0;

        let tiradaErrorAtaque = Math.random() * 100;
        let umbralErrorAtaque = (atacante.fatiga * 0.2) + (factorImp * 2);
        if (tiradaErrorAtaque < umbralErrorAtaque) {
            baseAtq *= 0.7;
            mensajeExtra += ` ❌ ¡${atacante.nombre} calcula mal la distancia y su ataque pierde fuerza!`;
        }

        let tiradaErrorDefensa = Math.random() * 100;
        let umbralErrorDefensa = (objetivo.fatiga * 0.2) + (factorImp * 2);
        if (tiradaErrorDefensa < umbralErrorDefensa) {
            baseDef *= 0.7;
            mensajeExtra += ` ❌ ¡${objetivo.nombre} tropieza en su postura y su defensa flaquea!`;
        }

        danoBase *= bonusAccion;
        let defensaObjetivo = 0;
        let mensajeRuptura = "";

        if (objetivo.defendiendo) {
            if (codigoAccion === "A002") {
                const chanceContra = Math.random();
                if (chanceContra < 0.45) {
                    const fatigaAtacanteActual = Number(atacante.fatiga) || 0;
                    atacante.fatiga = Math.max(0, fatigaAtacanteActual - 25);
                    return {
                        mensaje: `💥⚠️ ¡${objetivo.nombre} anticipa con maestría el violento ataque potente de ${atacante.nombre}, esquivándolo con destreza y castigando duramente su fatiga!`,
                        dano: 0,
                        critico: false
                    };
                } else {
                    objetivo.defendiendo = false;
                    mensajeRuptura = ` 💥🔨 ¡El devastador ataque potente de ${atacante.nombre} pulveriza por completo la guardia de ${objetivo.nombre}!`;
                }
            } else {
                defensaObjetivo = Number(baseDef) * (1 + Number(config.reduccion_defensa));
            }
        } else {
            defensaObjetivo = Number(baseDef) || 0;
        }

        const divisorDefensa = Math.max(1, Number(config.defensa_divisor) || 200);
        const porcentajeDefensa = Math.max(
            0,
            Math.min(0.85, defensaObjetivo / (defensaObjetivo + divisorDefensa))
        );
        let danoReducido = (danoBase + (baseAtq * (1 - porcentajeDefensa)));

        const fatigaRivalPorcentaje = (objetivo.fatiga / (config.fatiga_max || 100)) * 100;
        if (fatigaRivalPorcentaje < 25) {
            danoReducido *= 3.0;
            mensajeExtra += " ⚡ ¡Fatiga crítica severa del rival! El daño se TRIPLICA";
        } else if (fatigaRivalPorcentaje < 50) {
            danoReducido *= 2.0;
            mensajeExtra += " ⚠️ ¡Agotamiento profundo del rival! El daño se DUPLICA";
        }

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
        const factorImprevisible = Number(config.factorImprevisible) !== undefined && !isNaN(Number(config.factorImprevisible)) ? Number(config.factorImprevisible) : 1.0;
        const iaAleatoria = Boolean(config.iaAleatoria);

        if (iaAleatoria) {
            const accionesDisponibles = ["A001", "A001", "A002", "A003", "D001"];
            const accionElegida = accionesDisponibles[Math.floor(Math.random() * accionesDisponibles.length)];
            if (accionElegida !== "A001") atacante.rachaBasicos = 0;
            return accionElegida;
        }

        if (atacante.estadoCaotico && atacante.estadoCaotico > 0) {
            atacante.estadoCaotico--;
            if (Math.random() < (0.80 * factorImprevisible)) {
                const accionesDisponibles = ["A001", "A002", "A003", "D001"];
                const accionAleatoria = accionesDisponibles[Math.floor(Math.random() * accionesDisponibles.length)];
                if (accionAleatoria !== "A001") atacante.rachaBasicos = 0;
                return accionAleatoria;
            }
        }

        const fatigaActual = Number(atacante.fatiga) || 0;
        const hpPorcentaje = (atacante.hp / atacante.hp_max) * 100;
        const objetivoHpPorcentaje = (objetivo.hp / objetivo.hp_max) * 100;
        let pesoAleatorioBase = Number(config.ia_peso_aleatorio) !== undefined && !isNaN(Number(config.ia_peso_aleatorio)) ? Number(config.ia_peso_aleatorio) : 0.40;
        const pesoAleatorio = Math.min(1.0, Math.max(0.0, pesoAleatorioBase * factorImprevisible));

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
        if (hpPorcentaje < 40 && fatigaActual > costeDefensa && !atacante.defendiendo) {
            return "D001";
        }

        const costeTactico = Number(config.coste_fatiga_A003) || 10;
        if (fatigaActual >= costeTactico && ((atacante.efectivos.tactica + (atacante.tacticaTemporal || 0)) > 40 || Math.random() < (0.50 * factorImprevisible))) {
            return "A003";
        }

        return "A001";
    }

    function obtenerCombatiente(combate, codigo) {
        if (combate.combatiente1.codigo === codigo) return combate.combatiente1;
        if (combate.combatiente2.codigo === combate.combatiente2.codigo) return combate.combatiente2;
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
            combate.combatiente1.turnosAturdido = 0;
            combate.combatiente1.turnosParalizado = 0;
            combate.combatiente1.turnosDesangrado = 0;
            combate.combatiente1.frenesiAnunciado = false;
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
            combate.combatiente2.turnosAturdido = 0;
            combate.combatiente2.turnosParalizado = 0;
            combate.combatiente2.turnosDesangrado = 0;
            combate.combatiente2.frenesiAnunciado = false;
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

    [c1, c2].forEach(combatiente => {
        if (combatiente.turnosDesangrado > 0 && !combatiente.derrotado) {
            const perdidaHp = 25;
            const perdidaFatiga = 4;
            combatiente.hp = Math.max(0, combatiente.hp - perdidaHp);
            combatiente.fatiga = Math.max(0, combatiente.fatiga - perdidaFatiga);
            combatiente.turnosDesangrado--;
            combate.historial.push({
                tipo: "accion",
                atacante: combatiente.codigo,
                objetivo: combatiente.codigo,
                resultado: {
                    mensaje: `🩸 ¡${combatiente.nombre} sufre una hemorragia severa! Pierde ${perdidaHp} de HP y ${perdidaFatiga} de fatiga. (Quedan ${combatiente.turnosDesangrado} turnos).`,
                    dano: perdidaHp,
                    critico: false
                }
            });
            if (combatiente.hp <= 0) {
                combatiente.derrotado = true;
                combate.estado = "finalizado";
                combate.ganador = (combatiente === c1) ? c2.codigo : c1.codigo;
            }
        }
    });

    if (combate.estado === "finalizado") return;

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
        
