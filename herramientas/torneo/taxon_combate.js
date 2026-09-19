 /*
========================================================
PALARENA — TAXÓN COMBATE v4.0 (Estados Secundarios Únicos y Ampliados)
PalEntropía
Asignación de habilidades base y Estados Biológicos Extremos (25%)
Ahora con 3 mecánicas complementarias adicionales por cada clado.
========================================================
*/

window.PALARENA_TAXON_COMBATE = {

    obtenerRasgosTaxonomicos(codigo) {
        if (!window.PALTAXON || !codigo) return null;
        
        const key = String(codigo).trim();
        const tax = window.PALTAXON[key];
        
        if (!tax) return null;

        const textoTaxonomia = ((tax.ta1 || "") + " > " + (tax.ta2 || "")).toLowerCase();

        // 1. PTEROSAURIOS
        if (textoTaxonomia.includes("pterosauria") || textoTaxonomia.includes("pterosaurio")) {
            return {
                tipo: "pterosaurio",
                nombreHabilidad: "Picado Aéreo",
                aplicarEfecto(atacante, objetivo) {
                    let fatigaDrenada = 12;
                    let extraDano = 1.15;
                    objetivo.fatiga = Math.max(0, objetivo.fatiga - fatigaDrenada);
                    let mensaje = ` 🦅 ¡${atacante.nombre} desciende en un vertiginoso Picado Aéreo desde las alturas, desestabilizando y drenando ${fatigaDrenada} de fatiga al rival!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                            extraDano += 0.25;
                            mensaje += ` 🩸 ¡DESGARRO ARTERIAL! (Aparición única) Las garras perforan puntos vitales causando una hemorragia crítica durante 3 turnos.`;
                        } else if (variante < 0.50) {
                            objetivo.estadoGuardia = "rota";
                            objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                            mensaje += ` 💨 ¡RÁFAGA CEGADORA! (Aparición única) El batir de alas levanta una nube de polvo que aturde al rival y rompe su guardia.`;
                        } else if (variante < 0.75) {
                            atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 35);
                            mensaje += ` 🌤️ ¡CORRIENTE TÉRMICA! (Aparición única) Aprovecha las corrientes de aire para elevarse, evadiendo el esfuerzo y recuperando 35 de fatiga.`;
                        } else {
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 25;
                            extraDano += 0.15;
                            mensaje += ` 👁️ ¡ATAQUE A LOS OJOS! (Aparición única) Un picotazo dirigido al rostro hunde la táctica del rival (-25).`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 2. AVES DEL TERROR
        if (textoTaxonomia.includes("aves") || textoTaxonomia.includes("cariamiformes") || textoTaxonomia.includes("fororrácido") || textoTaxonomia.includes("gastornithiformes")) {
            return {
                tipo: "ave_terror",
                nombreHabilidad: "Hachazo Titánico",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.25;
                    objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                    let mensaje = ` 🦅⚔️ ¡${atacante.nombre} embiste con su robusto pico, provocando una hemorragia severa (2 turnos) con letal precisión aviana!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 2);
                            objetivo.estadoGuardia = "rota";
                            extraDano += 0.30;
                            mensaje += ` 💫 ¡PERFORACIÓN CRANEAL! (Aparición única) El pico fractura las defensas del rival, rompiendo su guardia y aturdiéndolo 2 turnos.`;
                        } else if (variante < 0.50) {
                            objetivo.fatiga = Math.max(0, objetivo.fatiga - 25);
                            extraDano += 0.20;
                            mensaje += ` 🐾 ¡PATADA DESGARRADORA! (Aparición única) Sus poderosas garras traseras asestan un golpe secundario que hunde el resuello del enemigo.`;
                        } else if (variante < 0.75) {
                            atacante.efectivos.velocidad += 10;
                            mensaje += ` 🏃 ¡ZANCADA VELOZ! (Aparición única) Su anatomía corredora entra en combustión, aumentando su velocidad base permanentemente en el combate.`;
                        } else {
                            objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 2;
                            mensaje += ` 📢 ¡GRAZNIDO ESTREMECEDOR! (Aparición única) Un sonido agudo y primitivo confunde al rival (caos +2).`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }
        



                // 3. ORNITOMIMOSAURIOS (Ornitomimos)
        if (textoTaxonomia.includes("ornithomimosauria") || textoTaxonomia.includes("ornithomimidae") || textoTaxonomia.includes("ornithomimus") || textoTaxonomia.includes("gallimimus") || textoTaxonomia.includes("struthiomimus") || textoTaxonomia.includes("deinocheirus") || textoTaxonomia.includes("pelecanimimus") || textoTaxonomia.includes("garudimimus") || textoTaxonomia.includes("harpymimus") || textoTaxonomia.includes("ansermimus") || textoTaxonomia.includes("ornitomimo")) {
            return {
                tipo: "ornitomimo",
                nombreHabilidad: "Hostigamiento Veloz",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.10;
                    atacante.efectivos.velocidad += 5;
                    let mensaje = ` 💨 ¡${atacante.nombre} despliega su asombrosa velocidad aviana, hostigando con una rápida ráfaga de patadas y golpes de pico!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            extraDano += 0.35;
                            objetivo.estadoGuardia = "rota";
                            mensaje += ` 🌪️💥 ¡PATADA VOLADORA! (Aparición única) Aprovecha su aceleración máxima y lanza una patada letal que rompe la guardia rival.`;
                        } else if (variante < 0.50) {
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 20;
                            objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 1;
                            mensaje += ` 🧠💨 ¡CARRERA ERRÁTICA! (Aparición única) Corre en círculos mareando a ${objetivo.nombre}, reduciendo su táctica y sumiéndolo en caos.`;
                        } else if (variante < 0.75) {
                            atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 30);
                            mensaje += ` 🪶 ¡EVASIÓN PERFECTA! (Aparición única) Sus formidables reflejos le permiten evadir el esfuerzo físico, recuperando 30 de fatiga.`;
                        } else {
                            objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                            mensaje += ` 🎯 ¡GOLPE DE PICO! (Aparición única) Finta con su largo cuello y asesta un golpe aturdidor en un punto ciego (aturdido 1 turno).`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 4. TERÓPODOS Y SUPERDEPREDADORES
        if (textoTaxonomia.includes("theropoda") || textoTaxonomia.includes("terópodo")) {
            return {
                tipo: "teropodo",
                nombreHabilidad: "Fuerza Depredadora",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.30;
                    objetivo.estadoGuardia = "rota";
                    let mensaje = ` 🦖 ¡${atacante.nombre} asesta una mordedura masiva de superdepredador, fracturando la guardia del rival por completo!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                            objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 2;
                            extraDano += 0.35;
                            mensaje += ` 👁️ ¡TERROR PRIMIGENIO! (Aparición única) Su ferocidad induce un pánico absoluto: el rival queda paralizado por el miedo y entra en estado caótico.`;
                        } else if (variante < 0.50) {
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 4);
                            mensaje += ` 🦷 ¡DESGARRE SERRADO! (Aparición única) Los dientes curvos y aserrados provocan una hemorragia profunda durante 4 turnos.`;
                        } else if (variante < 0.75) {
                            atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.10));
                            mensaje += ` 🩸 ¡FESTÍN CARNÍVORO! (Aparición única) Saborea la sangre del golpe, estimulando su metabolismo para recuperar un 10% de su salud máxima.`;
                        } else {
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 30;
                            extraDano += 0.20;
                            mensaje += ` 🦖💥 ¡CABEZAZO BRUTAL! (Aparición única) Usa su masivo cráneo como ariete, destrozando la táctica del enemigo.`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 5. SAURÓPODOS / CUELLOS LARGOS
        if (textoTaxonomia.includes("sauropoda") || textoTaxonomia.includes("sauropodomorpha") || textoTaxonomia.includes("saurópodo")) {
            return {
                tipo: "sauropodo",
                nombreHabilidad: "Impacto de Coloso",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.20;
                    let fatigaExtra = 20;
                    objetivo.fatiga = Math.max(0, objetivo.fatiga - fatigaExtra);
                    let mensaje = ` 🦕 ¡${atacante.nombre} sacude el suelo con su colosal masa, desestabilizando al rival y drenando ${fatigaExtra} de fatiga!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                            objetivo.fatiga = Math.max(0, objetivo.fatiga - 40);
                            extraDano += 0.30;
                            mensaje += ` 💥 ¡APLASTAMIENTO SÍSMICO! (Aparición única) Toda la masa del coloso colapsa sobre el enemigo, drenando 40 de fatiga extra y paralizándolo bajo su peso.`;
                        } else if (variante < 0.50) {
                            extraDano += 0.45;
                            objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                            mensaje += ` 🦕🌪️ ¡LATIGAZO DE COLA! (Aparición única) La cola rompe la barrera del sonido asestando un golpe devastador que aturde al rival.`;
                        } else if (variante < 0.75) {
                            atacante.efectivos.defensa += 15;
                            mensaje += ` ⛰️ ¡POSTURA INAMOVIBLE! (Aparición única) Se planta firmemente como una montaña, aumentando su defensa permanentemente.`;
                        } else {
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 20;
                            objetivo.fatiga = Math.max(0, objetivo.fatiga - 15);
                            mensaje += ` 🦕🦶 ¡PISOTÓN DEVASTADOR! (Aparición única) Aplasta el terreno adyacente, intimidando al rival y mermando sus reservas.`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

            // 6. TIREÓFOROS
        if (textoTaxonomia.includes("thyreophora") || textoTaxonomia.includes("ankylosauria") || textoTaxonomia.includes("stegosauria") || textoTaxonomia.includes("tireóforo")) {
            return {
                tipo: "tireoforo",
                nombreHabilidad: "Contundencia acorazada",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.10;
                    atacante.efectivos.defensa += 5;
                    let mensaje = ` 🛡️ ¡${atacante.nombre} aprovecha sus placas y osteodermos para devolver el castigo con su pesada armadura natural!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 20;
                            extraDano += 0.25;
                            mensaje += ` 🛡️🩸 ¡LACERACIÓN POR PÚAS! (Aparición única) El impacto desgarra la piel (hemorragia 2 turnos) y arruina la táctica enemiga.`;
                        } else if (variante < 0.50) {
                            extraDano += 0.50;
                            objetivo.estadoGuardia = "rota";
                            mensaje += ` 🔨 ¡MAZO CAUDAL! (Aparición única) Un impacto perfecto con su maza de hueso pulveriza la guardia rival infligiendo un daño masivo.`;
                        } else if (variante < 0.75) {
                            atacante.hp = Math.min(atacante.hp_max, atacante.hp + 50);
                            atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 25);
                            mensaje += ` 🛡️✨ ¡CAPARAZÓN IMPENETRABLE! (Aparición única) Se cierra sobre sí mismo, mitigando fatiga (+25) y recuperando una fracción de salud.`;
                        } else {
                            objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                            mensaje += ` 💥 ¡GOLPE CONTUNDENTE! (Aparición única) Un choque frontal entumece los músculos del enemigo (paralizado 1 turno).`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 7. CERATÓPSIDOS
        if (textoTaxonomia.includes("ceratopsia") || textoTaxonomia.includes("ceratopsidae") || textoTaxonomia.includes("ceratopsio")) {
            return {
                tipo: "ceratopsido",
                nombreHabilidad: "Carga de Cornudos",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.25;
                    objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                    let mensaje = ` 🦏 ¡${atacante.nombre} embiste de frente con su impresionante cornamenta, dejando aturdido al rival por 1 turno!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                            objetivo.estadoGuardia = "rota";
                            extraDano += 0.35;
                            mensaje += ` 🦏🩸 ¡EMPALAMIENTO VITAL! (Aparición única) Los cuernos atraviesan limpiamente la guardia enemiga, provocando un desangrado masivo de 3 turnos.`;
                        } else if (variante < 0.50) {
                            atacante.efectivos.defensa += 10;
                            mensaje += ` 🛡️ ¡GOLA DEFENSIVA! (Aparición única) Interpone su macizo collarín óseo, frustrando represalias y elevando su defensa permanentemente.`;
                        } else if (variante < 0.75) {
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 30;
                            extraDano += 0.15;
                            mensaje += ` 🦏⚠️ ¡TOPETAZO CIEGO! (Aparición única) Un golpe directo al cuerpo que desequilibra y arruina la táctica del atacante.`;
                        } else {
                            atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 40);
                            mensaje += ` 🦏🔥 ¡FURIA DE REBAÑO! (Aparición única) La adrenalina de sentirse amenazado restaura 40 de fatiga al instante.`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }
                
        // 8. MARGINOCEFÁLICOS (Paquicefalosaurios y afines)
        if (textoTaxonomia.includes("pachycephalosauria") || textoTaxonomia.includes("marginocephalia")) {
            return {
                tipo: "marginocefalo",
                nombreHabilidad: "Ariete Biológico",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.05;
                    let mensaje = ` 🐾 ¡${atacante.nombre} despliega la fuerza brutal de su bóveda craneal!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        
                        const variante = Math.floor(Math.random() * 6);
                        
                        if (variante === 0) {
                            objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 2);
                            extraDano += 0.30;
                            mensaje += ` 💥 ¡CRÁNEO DE DOMO! Un testarazo macizo a máxima inercia que ignora el dolor y deja al rival severamente aturdido (2 turnos).`;
                        } else if (variante === 1) {
                            objetivo.estadoGuardia = "rota";
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 20;
                            extraDano += 0.15;
                            mensaje += ` 🛡️🔨 ¡EMBESTIDA ROMPESCUDOS! El impacto pulveriza la guardia rival y fractura su esquema táctico (-20 Táctica).`;
                        } else if (variante === 2) {
                            atacante.efectivos.defensa += 15;
                            atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 20);
                            mensaje += ` 🦴 ¡TESTARUDEZ EVOLUTIVA! Interpone su cráneo ultradenso como escudo. Absorbe la tensión, gana +15 Defensa permanente y recupera 20 de Fatiga.`;
                        } else if (variante === 3) {
                            extraDano += 0.45;
                            atacante.efectivos.tactica = Math.max(1, atacante.efectivos.tactica - 10);
                            mensaje += ` ☄️ ¡CARGA CIEGA! Se lanza como un proyectil vivo y macizo. El daño físico es colosal, pero sufre una ligera desorientación por el choque (-10 Táctica).`;
                        } else if (variante === 4) {
                            objetivo.fatiga = Math.max(0, objetivo.fatiga - 25);
                            atacante.efectivos.ataque += 10;
                            extraDano += 0.15;
                            mensaje += ` 👑 ¡DOMINIO TERRITORIAL! Exhibe su potencia con un empuje intimidatorio. Drena 25 de fatiga al rival y gana +10 de Ataque permanente por pura adrenalina.`;
                        } else {
                            atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.10));
                            objetivo.efectivos.velocidad = Math.max(1, objetivo.efectivos.velocidad - 15);
                            mensaje += ` 💥 ¡ESTRUCTURA AMORTIGUADORA! Su anatomía cervical disipa la tensión del combate. Regenera un 10% de HP mientras el violento choque frena en seco al rival (-15 Vel).`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }
                // 9. ORNITÓPODOS
        if (textoTaxonomia.includes("ornithischia") || textoTaxonomia.includes("hadrosauridae") || textoTaxonomia.includes("ornitópodo")) {
            return {
                tipo: "ornitopodo",
                nombreHabilidad: "Maniobra evasiva",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.10;
                    atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 10);
                    let mensaje = ` 🦌 ¡${atacante.nombre} usa su agilidad de herbívoro gregario para ganar distancia y recuperar 10 de fatiga en plena refriega!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 3;
                            atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 30);
                            extraDano += 0.20;
                            mensaje += ` 🦌💨 ¡ESTAMPIDA CIEGA! (Aparición única) Un estallido de energía confunde totalmente al rival (caos +3) y restaura 30 de fatiga al atacante.`;
                        } else if (variante < 0.50) {
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 25;
                            mensaje += ` 🗣️ ¡VOCALIZACIÓN DE ALARMA! (Aparición única) Un potente sonido de su cresta desorienta severamente la táctica del rival.`;
                        } else if (variante < 0.75) {
                            extraDano += 0.35;
                            objetivo.estadoGuardia = "rota";
                            mensaje += ` 🦌💥 ¡COLETAZO DESESPERADO! (Aparición única) Un golpe brusco y poco elegante que rompe la guardia enemiga por sorpresa.`;
                        } else {
                            atacante.turnosAturdido = 0;
                            atacante.turnosParalizado = 0;
                            atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 20);
                            mensaje += ` 🌿 ¡ALERTA DE PRESA! (Aparición única) Limpia sus propios estados alterados y recupera energía extra impulsado por la supervivencia.`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 10. COCODRILOMORFOS
        if (textoTaxonomia.includes("crocodylomorpha") || textoTaxonomia.includes("cocodrilomorfo")) {
            return {
                tipo: "cocodrilomorfo",
                nombreHabilidad: "Agarre Mortal",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.20;
                    objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                    let mensaje = ` 🐊 ¡${atacante.nombre} muerde y retuerce sus fauces en un Agarre Mortal, inmovilizando al rival por 1 turno!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                            objetivo.fatiga = Math.max(0, objetivo.fatiga - 30);
                            extraDano += 0.40;
                            mensaje += ` 🐊🌀 ¡GIRO DE LA MUERTE! (Aparición única) Retuerce violentamente su presa destrozando tejidos (hemorragia 2 turnos), asfixiándola y causando daño extremo.`;
                        } else if (variante < 0.50) {
                            atacante.efectivos.defensa += 12;
                            mensaje += ` 🐊🛡️ ¡OSTEODERMOS GRUESOS! (Aparición única) Se agazapa endureciendo su cuerpo y elevando su defensa frente a los contraataques.`;
                        } else if (variante < 0.75) {
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 20;
                            extraDano += 0.25;
                            mensaje += ` 🐊🌊 ¡EMBOSCADA REPENTINA! (Aparición única) Un ataque sorpresivo desde un ángulo ciego que arruina la compostura del rival.`;
                        } else {
                            objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 2);
                            mensaje += ` 🐊💥 ¡COLAZO FLUVIAL! (Aparición única) Impacta con la fuerza de un tronco, aturdiendo al enemigo por 2 turnos.`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }









        // 11. SINÁPSIDOS Y MAMÍFEROS (Bloque Completo y Variado)
        if (textoTaxonomia.includes("synapsida") || textoTaxonomia.includes("sinápsido") || textoTaxonomia.includes("mammalia")) {
            
            // 11.1. XENARTROS Y MEGAFAUNA ACORAZADA (Perezosos terrestres, Gliptodontes)
            if (textoTaxonomia.includes("xenarthra") || textoTaxonomia.includes("pilosa") || textoTaxonomia.includes("cingulata") || textoTaxonomia.includes("megatherium") || textoTaxonomia.includes("glyptodon") || textoTaxonomia.includes("doedicurus") || textoTaxonomia.includes("perezoso") || textoTaxonomia.includes("armadillo")) {
                return {
                    tipo: "xenartro",
                    nombreHabilidad: "Poderío Xenartro",
                    aplicarEfecto(atacante, objetivo) {
                        let extraDano = 1.15;
                        atacante.efectivos.defensa += 5;
                        let mensaje = ` 🦥 ¡${atacante.nombre} hace valer su masa colosal y sus formidables defensas naturales para castigar al rival!`;

                        if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                            atacante.taxonUltimoUsado = true;
                            const variante = Math.random();
                            if (variante < 0.25) {
                                objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                                objetivo.estadoGuardia = "rota";
                                extraDano += 0.35;
                                mensaje += ` 🦥🩸 ¡GARRAS DE GUADAÑA! (Aparición única) Un zarpazo masivo que destroza la guardia y causa un desangrado profundo (3 turnos).`;
                            } else if (variante < 0.50) {
                                objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 2);
                                extraDano += 0.25;
                                mensaje += ` 🦥💥 ¡GOLPE DE MASA! (Aparición única) Aplasta al enemigo dejándolo severamente aturdido por 2 turnos.`;
                            } else if (variante < 0.75) {
                                atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.15));
                                atacante.efectivos.resistencia += 20;
                                mensaje += ` 🛡️🦴 ¡CORAZA DÉRMICA! (Aparición única) Su piel reforzada absorbe el castigo, curando un 15% de vida y subiendo su resistencia.`;
                            } else {
                                atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 50);
                                objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 15;
                                mensaje += ` 🦥💤 ¡METABOLISMO DE AHORRO! (Aparición única) Recupera 50 de fatiga de golpe, frustrando los intentos de agotarle.`;
                            }
                        }
                        return { extraDano, mensajeTexto: mensaje };
                    }
                };
            }

            // 11.2. GIGANTES SUPERPESADOS (Indricotherium / Paraceratherium / Titanotheres)
            if (textoTaxonomia.includes("indricotherium") || textoTaxonomia.includes("paraceratherium") || textoTaxonomia.includes("brontotheriidae") || textoTaxonomia.includes("embolotherium")) {
                return {
                    tipo: "gigante_superpesado",
                    nombreHabilidad: "Tonelería Titánica",
                    aplicarEfecto(atacante, objetivo) {
                        let extraDano = 1.35;
                        objetivo.estadoGuardia = "rota";
                        let mensaje = ` 🦣🏔️ ¡${atacante.nombre} despliega una mole colosal de toneladas, aplastando cualquier intento de resistencia con su pura inercia!`;

                        if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                            atacante.taxonUltimoUsado = true;
                            const variante = Math.random();
                            if (variante < 0.25) {
                                objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 2);
                                extraDano += 0.40;
                                mensaje += ` ⛰️💥 ¡PISOTÓN SÍSMICO SUPREMO! (Aparición única) El suelo tiembla bajo su peso, rompiendo la guardia y aturdiendo al rival 2 turnos.`;
                            } else if (variante < 0.50) {
                                atacante.efectivos.defensa += 15;
                                extraDano += 0.25;
                                mensaje += ` 🛡️🐘 ¡MASA IMPENETRABLE! (Aparición única) Su inmensa altura y volumen anulan los ataques frontales, elevando su defensa de forma permanente.`;
                            } else if (variante < 0.75) {
                                objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 35;
                                mensaje += ` 🌳👁️ ¡BARRIDO DE COPA! (Aparición única) Un impacto devastador a altura descomunal que arruina la táctica del rival (-35).`;
                            } else {
                                atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.15));
                                mensaje += ` 🍃💪 ¡VIGOR VEGETARIANO! (Aparición única) Su descomunal reserva vital le regenera un 15% de salud al canalizar su energía.`;
                            }
                        }
                        return { extraDano, mensajeTexto: mensaje };
                    }
                };
            }

            // 11.3. DIENTES DE SABLE Y GORGONÓPSIDOS (Depredadores de colmillo letal)
            if (textoTaxonomia.includes("smilodon") || textoTaxonomia.includes("machairodontinae") || textoTaxonomia.includes("gorgonopsia") || textoTaxonomia.includes("thylacosmilus")) {
                return {
                    tipo: "sable",
                    nombreHabilidad: "Colmillos Perforantes",
                    aplicarEfecto(atacante, objetivo) {
                        let extraDano = 1.25;
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                        let mensaje = ` 🐅 ¡${atacante.nombre} clava sus imponentes colmillos curvos, provocando hemorragia profunda (2 turnos)!`;
                        
                        if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                            atacante.taxonUltimoUsado = true;
                            const variante = Math.random();
                            if (variante < 0.25) {
                                objetivo.fatiga = 0;
                                objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                                extraDano += 0.35;
                                mensaje += ` 🐅🩸 ¡ASFIXIA TRAQUEAL! (Aparición única) La mordida bloquea el flujo de oxígeno: la fatiga del rival cae a 0 instantáneamente y queda paralizado.`;
                            } else if (variante < 0.50) {
                                extraDano += 0.30;
                                objetivo.estadoGuardia = "rota";
                                mensaje += ` 🐅🐾 ¡ZARPAZO DERRIBADOR! (Aparición única) Un golpe lateral de sus pesadas patas rompe la guardia enemiga.`;
                            } else if (variante < 0.75) {
                                atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 30);
                                objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 15;
                                mensaje += ` 🐅👁️ ¡MIRADA FELINA! (Aparición única) Toma distancia midiendo a su presa, recuperando resuello y alterando la táctica enemiga.`;
                            } else {
                                objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 4);
                                mensaje += ` 🐅🔪 ¡CORTES REPETIDOS! (Aparición única) Desgarra múltiples veces en un solo movimiento (hemorragia 4 turnos).`;
                            }
                        }
                        return { extraDano, mensajeTexto: mensaje };
                    }
                };
            }
            
            // 11.4. PROBOSCÍDEOS Y RINOCERONTES LANUDOS (Gigantes de la tundra / Tonelaje pesado)
            if (textoTaxonomia.includes("proboscidea") || textoTaxonomia.includes("mammuthus") || textoTaxonomia.includes("rhinoceros") || textoTaxonomia.includes("coelodonta") || textoTaxonomia.includes("elasmotherium") || textoTaxonomia.includes("dinocerata") || textoTaxonomia.includes("pantodonta")) {
                return {
                    tipo: "proboscideo_rinoceronte",
                    nombreHabilidad: "Carga Acorazada",
                    aplicarEfecto(atacante, objetivo) {
                        let extraDano = 1.25;
                        objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                        let mensaje = ` 🦣🦏 ¡${atacante.nombre} embiste con todo su peso e impulso frontal, sacudiendo los cimientos del combate!`;

                        if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                            atacante.taxonUltimoUsado = true;
                            const variante = Math.random();
                            if (variante < 0.25) {
                                objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 2);
                                objetivo.estadoGuardia = "rota";
                                extraDano += 0.35;
                                mensaje += ` 🦣💥 ¡IMPACTO DE TUNDRA! (Aparición única) Una carga imparable que destroza la defensa y aturde al rival 2 turnos.`;
                            } else if (variante < 0.50) {
                                objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                                extraDano += 0.20;
                                mensaje += ` 🦏🩸 ¡CORNAZO FRONTAL! (Aparición única) Perfora con cuernos o defensas de marfil, causando hemorragia severa (3 turnos).`;
                            } else if (variante < 0.75) {
                                atacante.efectivos.resistencia += 15;
                                atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.10));
                                mensaje += ` 🦣🛡️ ¡CAPA DE GRASA Y PELAJE! (Aparición única) Soporta el castigo como un tanque natural, ganando resistencia y curando un 10% de salud.`;
                            } else {
                                objetivo.fatiga = Math.max(0, objetivo.fatiga - 30);
                                objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 1;
                                mensaje += ` 🦏📢 ¡BRAMIDO SÍSMICO! (Aparición única) Un sonido atronador drena 30 de fatiga al rival y siembra el caos.`;
                            }
                        }
                        return { extraDano, mensajeTexto: mensaje };
                    }
                };
            }

            // 11.5. CARNÍVOROS ROBUSTOS (Osos caverneros, Hienas gigantes / Borophagus)
            if (textoTaxonomia.includes("ursidae") || textoTaxonomia.includes("hyaenodon") || textoTaxonomia.includes("amphicyon") || textoTaxonomia.includes("hyaenidae") || textoTaxonomia.includes("speloeus")) {
                return {
                    tipo: "carnivoro_robusto",
                    nombreHabilidad: "Ferocidad Brutal",
                    aplicarEfecto(atacante, objetivo) {
                        let extraDano = 1.20;
                        atacante.efectivos.ataque += 5;
                        let mensaje = ` 🐻 ¡${atacante.nombre} desata una furia implacable, golpeando con fuerza desmedida y saña depredadora!`;

                        if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                            atacante.taxonUltimoUsado = true;
                            const variante = Math.random();
                            if (variante < 0.25) {
                                objetivo.estadoGuardia = "rota";
                                extraDano += 0.40;
                                mensaje += ` 🐻🔨 ¡ZARPAZO DE OSO! (Aparición única) Un golpe devastador que pulveriza la guardia enemiga.`;
                            } else if (variante < 0.50) {
                                objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                                extraDano += 0.25;
                                mensaje += ` 🐺🦷 ¡MANDÍBULA TRITURADORA! (Aparición única) Diseñada para romper huesos, provoca hemorragia interna de 3 turnos.`;
                            } else if (variante < 0.75) {
                                atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.12));
                                mensaje += ` 🍖🩸 ¡ADRENALINA DE CAZA! (Aparición única) El frenesí del combate estimula su recuperación, sanando un 12% de HP.`;
                            } else {
                                objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 25;
                                mensaje += ` 🐻👁️ ¡INTIMIDACIÓN FEROZ! (Aparición única) Su imponente planta desconcierta al rival y hunde su táctica temporal.`;
                            }
                        }
                        return { extraDano, mensajeTexto: mensaje };
                    }
                };
            }

            // 11.6. ROEDORES GIGANTES Y MAMÍFEROS PEQUEÑOS / BASALES (Castoroides, Priacodon, Multituberculados)
            if (textoTaxonomia.includes("castoroides") || textoTaxonomia.includes("rodentia") || textoTaxonomia.includes("multituberculata") || textoTaxonomia.includes("triconodonta") || textoTaxonomia.includes("priacodon") || textoTaxonomia.includes("roedor")) {
                return {
                    tipo: "roedor_pequeno",
                    nombreHabilidad: "Incisivos Letales y Agilidad",
                    aplicarEfecto(atacante, objetivo) {
                        let extraDano = 1.08;
                        atacante.efectivos.velocidad += 8;
                        let mensaje = ` 🦫🐀 ¡${atacante.nombre} aprovecha su tamaño compacto o sus formidables incisivos para esquivar y morder con precisión quirúrgica!`;

                        if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                            atacante.taxonUltimoUsado = true;
                            const variante = Math.random();
                            if (variante < 0.25) {
                                objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                                extraDano += 0.30;
                                mensaje += ` 🦫🦷 ¡MORDISCO DE CINCEL! (Aparición única) Sus potentes incisivos abiertos se hunden en puntos vitales causando hemorragia (2 turnos).`;
                            } else if (variante < 0.50) {
                                objetivo.fatiga = Math.max(0, objetivo.fatiga - 30);
                                mensaje += ` 🐀💨 ¡CORRETEO RÁPIDO! (Aparición única) Se desliza entre las patas del rival, esquivando el castigo y drenando 30 de fatiga al oponente.`;
                            } else if (variante < 0.75) {
                                atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 30);
                                mensaje += ` 🌿✨ ¡INSTINTO DE MADRIGUERA! (Aparición única) Encuentra un respiro inmediato, recuperando 30 de fatiga.`;
                            } else {
                                objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 2;
                                extraDano += 0.20;
                                mensaje += ` 🌰💥 ¡ATAQUE FURIOSO SORPRESA! (Aparición única) Salta por sorpresa descolocando al rival y sumiéndole en estado caótico (+2).`;
                            }
                        }
                        return { extraDano, mensajeTexto: mensaje };
                    }
                };
            }

            // 11.7. ERINACEOMORFOS Y GIGANTES INSECTÍVOROS / CARNÍVOROS (Deinogalerix)
            if (textoTaxonomia.includes("deinogalerix") || textoTaxonomia.includes("erinaceidae") || textoTaxonomia.includes("galericinae")) {
                return {
                    tipo: "deinogalerix",
                    nombreHabilidad: "Mordisco de Rata Gigante",
                    aplicarEfecto(atacante, objetivo) {
                        let extraDano = 1.20;
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                        let mensaje = ` 🦔💀 ¡${atacante.nombre} propina un mordisco seco y profundo con sus afilados colmillos adaptados, provocando hemorragia (2 turnos)!`;

                        if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                            atacante.taxonUltimoUsado = true;
                            const variante = Math.random();
                            if (variante < 0.25) {
                                objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                                extraDano += 0.30;
                                mensaje += ` 🦷💥 ¡ESTOCADA DE HOCICO! (Aparición única) Lanza su largo cráneo hacia delante como una lanza, aturdiendo al rival.`;
                            } else if (variante < 0.50) {
                                atacante.efectivos.velocidad += 10;
                                mensaje += ` 🏃💨 ¡AGILIDAD INSULAR! (Aparición única) Se desplaza con rapidez oportunista, subiendo su velocidad permanente.`;
                            } else if (variante < 0.75) {
                                atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.12));
                                mensaje += ` 🍖🩸 ¡FRENESÍ OPORTUNISTA! (Aparición única) Devora jirones de energía recuperando un 12% de salud.`;
                            } else {
                                objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 20;
                                mensaje += ` 👁️⚠️ ¡ACECHO SILENCIOSO! (Aparición única) Descoloca la estrategia del rival hundiendo su táctica.`;
                            }
                        }
                        return { extraDano, mensajeTexto: mensaje };
                    }
                };
            }

            
                       
           // 11.8. MARSUPIALES GIGANTES Y UNGULADOS ÁGILES (Tylopoda, Equidae primitivos, Diprotodon)
            if (textoTaxonomia.includes("marsupialia") || textoTaxonomia.includes("diprotodontidae") || textoTaxonomia.includes("macropodidae") || textoTaxonomia.includes("camelidae") || textoTaxonomia.includes("equidae") || textoTaxonomia.includes("ungulate")) {
                return {
                    tipo: "ungulado_marsupial",
                    nombreHabilidad: "Zancada y Resistencia",
                    aplicarEfecto(atacante, objetivo) {
                        let extraDano = 1.12;
                        atacante.efectivos.velocidad += 5;
                        let mensaje = ` 🦘🐎 ¡${atacante.nombre} emplea una movilidad dinámica y golpes de agilidad defensiva!`;

                        if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                            atacante.taxonUltimoUsado = true;
                            const variante = Math.random();
                            if (variante < 0.25) {
                                extraDano += 0.30;
                                objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                                mensaje += ` 🦘💥 ¡PATADA TRASERA! (Aparición única) Suelta un arisco reverso con sus extremidades posteriores, aturdiendo al rival.`;
                            } else if (variante < 0.50) {
                                atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 35);
                                mensaje += ` 🐎💨 ¡ESCAPADA VELOZ! (Aparición única) Gana distancia de forma magistral y recupera 35 de fatiga.`;
                            } else if (variante < 0.75) {
                                objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 20;
                                objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 1;
                                mensaje += ` 🦌🌀 ¡CURVA ELUSIVA! (Aparición única) Descoloca por completo la estrategia del oponente.`;
                            } else {
                                atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.10));
                                mensaje += ` 🌿✨ ¡RESILIENCIA DE ESTEPA! (Aparición única) Su instinto de herbívoro curtido en la intemperie le cura un 10% de salud.`;
                            }
                        }
                        return { extraDano, mensajeTexto: mensaje };
                    }
                };
            }
            
            // 11.9. SINÁPSIDOS GENERALES (Comodín genérico para mamíferos/sinápsidos restantes)
            return {
                tipo: "sinapsido_general",
                nombreHabilidad: "Astucia de Sinápsido",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.12;
                    objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 10;
                    let mensaje = ` 🧠 ¡${atacante.nombre} aplica su avanzado intelecto evolutivo, confundiendo y desestabilizando la táctica temporal del rival!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 2;
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 25;
                            extraDano += 0.25;
                            mensaje += ` 🧠🐺 ¡ESTRATEGIA DE JAURÍA! (Aparición única) Una maniobra biológica sume al rival en estado caótico y hunde su táctica en la miseria.`;
                        } else if (variante < 0.50) {
                            atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 25);
                            atacante.efectivos.tactica += 5;
                            mensaje += ` 🧠⚡ ¡METABOLISMO CÁLIDO! (Aparición única) Una ráfaga de endotermia regenera su fatiga y agudiza su ingenio.`;
                        } else if (variante < 0.75) {
                            extraDano += 0.30;
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                            mensaje += ` 🧠🦷 ¡DENTICIÓN HETERODONTA! (Aparición única) Maximiza el daño gracias a sus dientes especializados, provocando hemorragias.`;
                        } else {
                            objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                            mensaje += ` 🧠🎯 ¡ATAQUE A NERVIOS! (Aparición única) Un mordisco calculado en los tendones paraliza al enemigo 1 turno.`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }
     

     








     
        // 12. REPTILES MARINOS
        if (textoTaxonomia.includes("ichthyosauria") || textoTaxonomia.includes("sauropterygia") || textoTaxonomia.includes("mosasauroidea")) {
            return {
                tipo: "marino",
                nombreHabilidad: "Hidrodinamia Letal",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.18;
                    let fatigaDrenada = 15;
                    objetivo.fatiga = Math.max(0, objetivo.fatiga - fatigaDrenada);
                    let mensaje = ` 🌊 ¡${atacante.nombre} efectúa un devastador rebufo hidrodinámico, restando ${fatigaDrenada} de fatiga al rival!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 2);
                            objetivo.fatiga = Math.max(0, objetivo.fatiga - 20);
                            extraDano += 0.30;
                            mensaje += ` 🌊☠️ ¡AHOGAMIENTO ABISAL! (Aparición única) Arrastra al rival a las profundidades, privándole de movilidad (paralizado 2 turnos) y ahogando su fatiga.`;
                        } else if (variante < 0.50) {
                            extraDano += 0.40;
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                            mensaje += ` 🌊🦷 ¡FAUCES TRAMPA! (Aparición única) Sus hileras de dientes cónicos desgarran al tirar hacia atrás (hemorragia 3 turnos).`;
                        } else if (variante < 0.75) {
                            atacante.efectivos.velocidad += 15;
                            mensaje += ` 🌊🚀 ¡IMPULSO CAUDAL! (Aparición única) Un aletazo brutal lo reposiciona, incrementando permanentemente su velocidad.`;
                        } else {
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 20;
                            objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 1;
                            mensaje += ` 🌊🌀 ¡TORBELLINO! (Aparición única) Nada en círculos desorientando al rival antes de atacar (táctica baja, caos).`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 13. TEMNOSPÓNDILOS Y ANFIBIOS
        if (textoTaxonomia.includes("temnospondyli") || textoTaxonomia.includes("lissamphibia") || textoTaxonomia.includes("nectridea") || textoTaxonomia.includes("anfibio")) {
            return {
                tipo: "temnospondyli",
                nombreHabilidad: "Trampa de Pantano",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.10;
                    objetivo.fatiga = Math.max(0, objetivo.fatiga - 15);
                    let mensaje = ` 🐸 ¡${atacante.nombre} arrastra al rival hacia el sustrato cenagoso, succionando un 15% de su resuello vital!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                            objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                            extraDano += 0.20;
                            mensaje += ` 🐸☣️ ¡SECRECIÓN TÓXICA! (Aparición única) Libera una potente neurotoxina anfibia que paraliza 1 turno y envenena gravemente (daño continuo 3 turnos).`;
                        } else if (variante < 0.50) {
                            atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.15));
                            mensaje += ` 🐸💧 ¡REGENERACIÓN TISULAR! (Aparición única) La humedad de su piel cataliza una regeneración que le restaura un 15% de salud.`;
                        } else if (variante < 0.75) {
                            extraDano += 0.35;
                            objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                            mensaje += ` 🐸💥 ¡MANDÍBULA DE HIERRO! (Aparición única) Su macizo cráneo plano se cierra como una trampa para osos, aturdiendo al rival.`;
                        } else {
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 25;
                            atacante.efectivos.defensa += 5;
                            mensaje += ` 🐸🌿 ¡CAMUFLAJE LODO! (Aparición única) Se funde con el cieno, anulando la táctica del enemigo y blindando su defensa.`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 14. PLACODERMOS Y CONDRICTIOS
        if (textoTaxonomia.includes("placodermi") || textoTaxonomia.includes("chondrichthyes") || textoTaxonomia.includes("actinopterygii")) {
            return {
                tipo: "pez_armado",
                nombreHabilidad: "Mordida Abisal / Cizalla",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.25;
                    objetivo.estadoGuardia = "rota";
                    let mensaje = ` 🦈 ¡${atacante.nombre} cierra de golpe sus terroríficas mandíbulas marinas, seccionando la defensa del rival!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 4);
                            extraDano += 0.45;
                            mensaje += ` 🦈🩸 ¡DESMEMBRAMIENTO! (Aparición única) La presión mandibular arranca un trozo de carne, causando daño extremo y una hemorragia letal de 4 turnos.`;
                        } else if (variante < 0.50) {
                            atacante.efectivos.defensa += 15;
                            mensaje += ` 🦈🛡️ ¡PLACA ACORAZADA! (Aparición única) El ataque rebota en sus gruesas placas óseas cefálicas, fortaleciendo su defensa permanente.`;
                        } else if (variante < 0.75) {
                            objetivo.fatiga = Math.max(0, objetivo.fatiga - 35);
                            mensaje += ` 🦈💨 ¡ENVITE HIDRODINÁMICO! (Aparición única) Usa la resistencia del agua para agotar los músculos de su presa (-35 fatiga).`;
                        } else {
                            extraDano += 0.30;
                            objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                            mensaje += ` 🦈⚡ ¡LÍNEA LATERAL! (Aparición única) Detecta el movimiento exacto del enemigo, anticipándose para paralizarlo con un golpe certero.`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 15. ARTRÓPODOS
        if (textoTaxonomia.includes("arthropoda") || textoTaxonomia.includes("trilobita") || textoTaxonomia.includes("radiodonta") || textoTaxonomia.includes("lobopodia")) {
            return {
                tipo: "artropodo",
                nombreHabilidad: "Presa Invertebrada",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.15;
                    objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                    let mensaje = ` 🦂 ¡${atacante.nombre} atrapa puntos vulnerables con sus apéndices quitinosos, paralizando al rival por 1 turno!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 2);
                            objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 2;
                            extraDano += 0.25;
                            mensaje += ` 🦂☠️ ¡INYECCIÓN NEUROTÓXICA! (Aparición única) Un aguijonazo o corte inyecta enzimas que colapsan el sistema nervioso: paralizado 2 turnos y caos mental.`;
                        } else if (variante < 0.50) {
                            atacante.efectivos.defensa += 20;
                            mensaje += ` 🦂🛡️ ¡EXOESQUELETO DENSO! (Aparición única) La quitina absorbe el castigo endureciéndose ante el estrés (defensa muy aumentada).`;
                        } else if (variante < 0.75) {
                            extraDano += 0.35;
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                            mensaje += ` 🦂✂️ ¡PINZAS TRITURADORAS! (Aparición única) Corta nervios y tejido cartilaginoso en una sucesión rápida (hemorragia 2 turnos).`;
                        } else {
                            atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 40);
                            mensaje += ` 🦂🔄 ¡METABOLISMO INSECTOIDE! (Aparición única) Su fisiología exótica ignora el ácido láctico, recuperando 40 de fatiga de inmediato.`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 16. MOLUSCOS Y CEFALÓPODOS
        if (textoTaxonomia.includes("mollusca") || textoTaxonomia.includes("cephalopoda") || textoTaxonomia.includes("nectocaridida")) {
            return {
                tipo: "cefalopodo",
                nombreHabilidad: "Chorro Evasivo",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.08;
                    atacante.efectivos.velocidad += 5;
                    let mensaje = ` 🦑 ¡${atacante.nombre} expulsa un repentino chorro evasivo, desorientando el contraataque enemigo!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 30;
                            objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 3;
                            atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 20);
                            extraDano += 0.15;
                            mensaje += ` 🦑⬛ ¡NUBE DE TINTA DENSA! (Aparición única) Cubre el campo visual, anulando la táctica oponente (-30), causándole caos total y permitiendo recuperar resuello.`;
                        } else if (variante < 0.50) {
                            extraDano += 0.40;
                            objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                            mensaje += ` 🦑💥 ¡GOLPE DE TENTÁCULOS! (Aparición única) Restalla sus extremidades como látigos carnudos, inmovilizando al rival con daño crítico.`;
                        } else if (variante < 0.75) {
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                            mensaje += ` 🦑🦜 ¡PICO DE LORO! (Aparición única) Muerde brutalmente el punto más blando del enemigo (hemorragia grave 3 turnos).`;
                        } else {
                            atacante.efectivos.tactica += 15;
                            mensaje += ` 🦑🧠 ¡MENTE ALIENÍGENA! (Aparición única) Procesa el entorno de manera hiperacelerada, potenciando permanentemente su táctica en el combate.`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }




               // 17. XENARTROS Y MEGAFAUNA ACORAZADA (Perezosos terrestres, Gliptodontes)
        if (textoTaxonomia.includes("xenarthra") || textoTaxonomia.includes("pilosa") || textoTaxonomia.includes("cingulata") || textoTaxonomia.includes("megatherium") || textoTaxonomia.includes("glyptodon") || textoTaxonomia.includes("doedicurus") || textoTaxonomia.includes("perezoso") || textoTaxonomia.includes("armadillo")) {
            return {
                tipo: "xenartro",
                nombreHabilidad: "Poderío Xenartro",
                aplicarEfecto(atacante, objetivo) {
                    let extraDano = 1.15;
                    atacante.efectivos.defensa += 5;
                    let mensaje = ` 🦥 ¡${atacante.nombre} hace valer su masa colosal y sus formidables defensas naturales para castigar al rival!`;

                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        const variante = Math.random();
                        if (variante < 0.25) {
                            objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                            objetivo.estadoGuardia = "rota";
                            extraDano += 0.35;
                            mensaje += ` 🦥🩸 ¡GARRAS DE GUADAÑA! (Aparición única) Un zarpazo masivo con sus enormes garras excavadoras destroza la guardia y causa un desangrado profundo (3 turnos).`;
                        } else if (variante < 0.50) {
                            objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 2);
                            extraDano += 0.25;
                            mensaje += ` 🦥💥 ¡GOLPE DE MASA! (Aparición única) Ya sea con una maza caudal o dejándose caer con todo su peso, aplasta al enemigo dejándolo severamente aturdido por 2 turnos.`;
                        } else if (variante < 0.75) {
                            atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.15));
                            atacante.efectivos.resistencia += 20;
                            mensaje += ` 🛡️🦴 ¡CORAZA DÉRMICA! (Aparición única) Su piel reforzada con osteodermos o caparazón absorbe el castigo, curando un 15% de vida y subiendo su resistencia.`;
                        } else {
                            atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 50);
                            objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 15;
                            mensaje += ` 🦥💤 ¡METABOLISMO DE AHORRO! (Aparición única) Su lenta biología basal le permite recuperar 50 de fatiga de golpe, frustrando los intentos del rival por agotarlo.`;
                        }
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }
     

     
     
     
     
        // 18. INCLASIFICABLES Y BASALES (Animales Enigmáticos)
        return {
            tipo: "general",
            nombreHabilidad: "Instinto Ancestral",
            aplicarEfecto(atacante, objetivo) {
                let extraDano = 1.05;
                let mensaje = ` 🐾 ¡${atacante.nombre} desata la inusual furia evolutiva de su linaje primitivo!`;

                if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                    atacante.taxonUltimoUsado = true;
                    
                    // Ruleta rusa evolutiva de 14 opciones para los basales
                    const variante = Math.floor(Math.random() * 14);
                    
                    if (variante === 0) {
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                        objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                        extraDano += 0.25;
                        mensaje += ` 🐾🔥 ¡MUTACIÓN LATENTE - FURIA! (Aparición única) Un estallido inesperado de agresividad evolutiva aturde al rival y provoca desgarros severos.`;
                    } else if (variante === 1) {
                        atacante.efectivos.resistencia += 15;
                        atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.10));
                        mensaje += ` 🐾🧬 ¡MUTACIÓN LATENTE - RESILIENCIA! (Aparición única) Su biología se adapta al daño, subiendo su resistencia y curando un 10% de su salud.`;
                    } else if (variante === 2) {
                        objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 25;
                        objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 1;
                        extraDano += 0.15;
                        mensaje += ` 🐾👀 ¡MUTACIÓN LATENTE - ILUSIÓN! (Aparición única) Un patrón en su piel confunde totalmente al enemigo, rompiendo su esquema táctico.`;
                    } else if (variante === 3) {
                        atacante.fatiga = atacante.fatiga_max;
                        atacante.efectivos.velocidad += 10;
                        mensaje += ` 🐾⚡ ¡METABOLISMO RÁPIDO! (Aparición única) Recupera el 100% de su fatiga y experimenta un subidón de velocidad.`;
                    } else if (variante === 4) {
                        extraDano += 0.40;
                        objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                        mensaje += ` 🐾🌀 ¡ANATOMÍA ENIGMÁTICA! (Aparición única) Un golpe asestado desde un ángulo biológicamente imposible paraliza al enemigo con daño crítico.`;
                    } else if (variante === 5) {
                        objetivo.fatiga = Math.max(0, objetivo.fatiga - 35);
                        atacante.efectivos.tactica += 15;
                        mensaje += ` 🐾🦎 ¡SEÑUELO EVOLUTIVO! (Aparición única) Finta con una parte de su cuerpo, agotando el resuello del rival (-35 de fatiga) y ganando gran ventaja táctica.`;
                    } else if (variante === 6) {
                        atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.20));
                        atacante.turnosAturdido = 0;
                        atacante.turnosParalizado = 0;
                        atacante.turnosDesangrado = 0;
                        mensaje += ` 🐾🩸 ¡VIGOR BASAL! (Aparición única) Su primitivo sistema inmunológico purga todos los estados alterados y regenera un 20% de salud de golpe.`;
                    } else if (variante === 7) {
                        objetivo.estadoGuardia = "rota";
                        objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 3;
                        extraDano += 0.30;
                        mensaje += ` 🐾💥 ¡GOLPE INCLASIFICABLE! (Aparición única) Un comportamiento errático y salvaje que pulveriza la guardia rival sumiéndolo en caos absoluto.`;
                    } else if (variante === 8) {
                        objetivo.fatiga = Math.max(0, objetivo.fatiga - 50);
                        objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 15;
                        mensaje += ` 🐾🤢 ¡SECRECIÓN REPULSIVA! (Aparición única) Libera compuestos químicos fétidos que hunden 50 puntos de fatiga del rival de golpe y nublan su mente.`;
                    } else if (variante === 9) {
                        extraDano += 0.45;
                        atacante.efectivos.defensa = Math.max(1, atacante.efectivos.defensa - 10);
                        mensaje += ` 🐾🌪️ ¡FEROCIDAD CIEGA! (Aparición única) Se lanza al ataque sin importarle su propia vida. El daño es colosal, pero su defensa base se reduce permanentemente.`;
                    } else if (variante === 10) {
                        extraDano += 0.20;
                        atacante.efectivos.defensa += 10;
                        atacante.efectivos.velocidad += 10;
                        mensaje += ` 🐾🐍 ¡FLEXIBILIDAD EXTREMA! (Aparición única) Retuerce su cuerpo absorbiendo el impacto. Obtiene un bono permanente de +10 a Defensa y +10 a Velocidad.`;
                    } else if (variante === 11) {
                        atacante.fatiga = atacante.fatiga_max;
                        atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.15));
                        objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                        mensaje += ` 🐾💤 ¡LETARGO ENGAÑOSO! (Aparición única) Simula colapsar, aturdiendo al rival por la sorpresa mientras recupera toda su fatiga y un 15% de vida.`;
                    } else if (variante === 12) {
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 4);
                        extraDano += 0.35;
                        mensaje += ` 🐾🦷 ¡FAUCES DE LA ANTIGÜEDAD! (Aparición única) Una mordedura de un linaje extinto causa un desangrado masivo incontrolable (4 turnos).`;
                    } else if (variante === 13) {
                        objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 4;
                        objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 40;
                        mensaje += ` 🐾🔊 ¡SOBRECARGA SENSORIAL! (Aparición única) Realiza un despliegue visual y sonoro incomprensible que sume al rival en caos total (+4) y arruina su táctica (-40).`;
                    }
                }
                return { extraDano, mensajeTexto: mensaje };
            }
        };
    }
};
