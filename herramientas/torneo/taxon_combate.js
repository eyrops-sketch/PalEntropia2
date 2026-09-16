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

        // 3. TERÓPODOS Y SUPERDEPREDADORES
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
                // 4. SAURÓPODOS / CUELLOS LARGOS
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

        // 5. TIREÓFOROS
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

        // 6. CERATÓPSIDOS
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
                // 7. ORNITÓPODOS
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

        // 8. COCODRILOMORFOS
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

        // 9. SINÁPSIDOS Y MAMÍFEROS
        if (textoTaxonomia.includes("synapsida") || textoTaxonomia.includes("sinápsido") || textoTaxonomia.includes("mammalia")) {
            
            // Dientes de sable / Gorgonópsidos
            if (textoTaxonomia.includes("smilodon") || textoTaxonomia.includes("machairodontinae") || textoTaxonomia.includes("gorgonopsia")) {
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
            // Gigantes herbívoros (Mamuts, Dinocerata)
            if (textoTaxonomia.includes("proboscidea") || textoTaxonomia.includes("mammuthus") || textoTaxonomia.includes("dinocerata") || textoTaxonomia.includes("pantodonta")) {
                return {
                    tipo: "proboscideo",
                    nombreHabilidad: "Carga de Gigante",
                    aplicarEfecto(atacante, objetivo) {
                        let extraDano = 1.25;
                        objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                        let mensaje = ` 🐘 ¡${atacante.nombre} embiste con todo su tonelaje mamaliano, aplastando y aturdiendo al oponente!`;

                        if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                            atacante.taxonUltimoUsado = true;
                            const variante = Math.random();
                            if (variante < 0.25) {
                                objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 2);
                                objetivo.estadoGuardia = "rota";
                                extraDano += 0.35;
                                mensaje += ` 🐘💥 ¡EMBESTIDA COLOSAL! (Aparición única) Una carga imparable que hace volar por los aires la defensa enemiga, dejándolo aturdido 2 turnos.`;
                            } else if (variante < 0.50) {
                                objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                                extraDano += 0.20;
                                mensaje += ` 🐘🩸 ¡CORNADA PERFORANTE! (Aparición única) Usa sus impresionantes defensas de marfil para ensartar al enemigo (hemorragia 3 turnos).`;
                            } else if (variante < 0.75) {
                                atacante.efectivos.resistencia += 15;
                                mensaje += ` 🐘💪 ¡PIEL GRUESA! (Aparición única) Soporta el castigo como un muro de carne, aumentando su resistencia base.`;
                            } else {
                                objetivo.fatiga = Math.max(0, objetivo.fatiga - 25);
                                objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 1;
                                mensaje += ` 🐘📢 ¡BRAMIDO ENSORDECEDOR! (Aparición única) Un sonido abrumador drena la voluntad del rival y lo sume en caos.`;
                            }
                        }
                        return { extraDano, mensajeTexto: mensaje };
                    }
                };
            }
            // Sinápsidos generales
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
                // 10. REPTILES MARINOS
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

        // 11. TEMNOSPÓNDILOS Y ANFIBIOS
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

        // 12. PLACODERMOS Y CONDRICTIOS
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

        // 13. ARTRÓPODOS
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

        // 14. MOLUSCOS Y CEFALÓPODOS
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

        // 15. Genérico (Mutación Latente - Ahora con variantes)
        return {
            tipo: "general",
            nombreHabilidad: "Instinto Ancestral",
            aplicarEfecto(atacante, objetivo) {
                let extraDano = 1.05;
                let mensaje = ` 🐾 ¡${atacante.nombre} desata la inusual furia evolutiva de su linaje primitivo!`;

                if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                    atacante.taxonUltimoUsado = true;
                    const variante = Math.random();
                    if (variante < 0.25) {
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                        objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                        extraDano += 0.25;
                        mensaje += ` 🐾🔥 ¡MUTACIÓN LATENTE - FURIA! (Aparición única) Un estallido inesperado de agresividad evolutiva aturde al rival y provoca desgarros severos.`;
                    } else if (variante < 0.50) {
                        atacante.efectivos.resistencia += 15;
                        atacante.hp = Math.min(atacante.hp_max, atacante.hp + Math.round(atacante.hp_max * 0.10));
                        mensaje += ` 🐾🧬 ¡MUTACIÓN LATENTE - RESILIENCIA! (Aparición única) Su biología se adapta al daño, subiendo su resistencia y curando un 10% de su salud.`;
                    } else if (variante < 0.75) {
                        objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 25;
                        objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 1;
                        extraDano += 0.15;
                        mensaje += ` 🐾👀 ¡MUTACIÓN LATENTE - ILUSIÓN! (Aparición única) Un patrón en su piel confunde totalmente al enemigo, rompiendo su esquema táctico.`;
                    } else {
                        atacante.fatiga = atacante.fatiga_max;
                        atacante.efectivos.velocidad += 10;
                        mensaje += ` 🐾⚡ ¡MUTACIÓN LATENTE - METABOLISMO RÁPIDO! (Aparición única) Recupera el 100% de su fatiga y experimenta un subidón de velocidad.`;
                    }
                }
                return { extraDano, mensajeTexto: mensaje };
            }
        };
    }
};
