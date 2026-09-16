/*
========================================================
PALARENA — TAXÓN COMBATE v4.0 (Estados Secundarios Únicos)
PalEntropía
Asignación de habilidades base y Estados Biológicos Extremos (25%)
========================================================
*/

window.PALARENA_TAXON_COMBATE = {

    obtenerRasgosTaxonomicos(codigo) {
        if (!window.PALTAXON || !codigo) return null;
        
        const key = String(codigo).trim();
        const tax = window.PALTAXON[key];
        
        if (!tax) return null;

        const textoTaxonomia = ((tax.ta1 || "") + " > " + (tax.ta2 || "")).toLowerCase();

        // 1. PTEROSAURIOS (Ataque en picado / Desgarro Arterial)
        if (textoTaxonomia.includes("pterosauria") || textoTaxonomia.includes("pterosaurio")) {
            return {
                tipo: "pterosaurio",
                nombreHabilidad: "Picado Aéreo",
                aplicarEfecto(atacante, objetivo) {
                    let fatigaDrenada = 12;
                    let extraDano = 1.15;
                    objetivo.fatiga = Math.max(0, objetivo.fatiga - fatigaDrenada);
                    let mensaje = ` 🦅 ¡${atacante.nombre} desciende en un vertiginoso Picado Aéreo desde las alturas, desestabilizando y drenando ${fatigaDrenada} de fatiga al rival!`;

                    // ESTADO SECUNDARIO ÚNICO (25%)
                    if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                        atacante.taxonUltimoUsado = true;
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                        extraDano += 0.25;
                        mensaje += ` 🩸 ¡DESGARRO ARTERIAL! (Aparición única) Las garras perforan puntos vitales causando una hemorragia crítica durante 3 turnos.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 2. AVES DEL TERROR (Hachazo / Perforación Craneal)
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
                        objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 2);
                        objetivo.estadoGuardia = "rota";
                        extraDano += 0.30;
                        mensaje += ` 💫 ¡PERFORACIÓN CRANEAL! (Aparición única) El pico fractura las defensas del rival, rompiendo su guardia y aturdiéndolo 2 turnos.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 3. TERÓPODOS Y SUPERDEPREDADORES (Fuerza / Terror Primigenio)
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
                        objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                        objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 2;
                        extraDano += 0.35;
                        mensaje += ` 👁️ ¡TERROR PRIMIGENIO! (Aparición única) Su ferocidad induce un pánico absoluto: el rival queda paralizado por el miedo y entra en estado caótico.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }
                // 4. SAURÓPODOS / CUELLOS LARGOS (Impacto / Aplastamiento Sísmico)
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
                        objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                        objetivo.fatiga = Math.max(0, objetivo.fatiga - 40);
                        extraDano += 0.30;
                        mensaje += ` 💥 ¡APLASTAMIENTO SÍSMICO! (Aparición única) Toda la masa del coloso colapsa sobre el enemigo, drenando 40 de fatiga extra y paralizándolo bajo su peso.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 5. TIREÓFOROS (Armadura / Laceración por Púas)
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
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                        objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 20;
                        extraDano += 0.25;
                        mensaje += ` 🛡️🩸 ¡LACERACIÓN POR PÚAS! (Aparición única) El impacto desgarra la piel (hemorragia 2 turnos) y arruina la táctica enemiga.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 6. CERATÓPSIDOS (Carga / Empalamiento Vital)
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
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                        objetivo.estadoGuardia = "rota";
                        extraDano += 0.35;
                        mensaje += ` 🦏🩸 ¡EMPALAMIENTO VITAL! (Aparición única) Los cuernos atraviesan limpiamente la guardia enemiga, provocando un desangrado masivo de 3 turnos.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }
                // 7. ORNITÓPODOS (Evasión / Estampida Ciega)
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
                        objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 3;
                        atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 30);
                        extraDano += 0.20;
                        mensaje += ` 🦌💨 ¡ESTAMPIDA CIEGA! (Aparición única) Un estallido de energía confunde totalmente al rival (caos +3) y restaura 30 de fatiga al atacante.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 8. COCODRILOMORFOS (Agarre / Giro de la Muerte)
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
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                        objetivo.fatiga = Math.max(0, objetivo.fatiga - 30);
                        extraDano += 0.40;
                        mensaje += ` 🐊🌀 ¡GIRO DE LA MUERTE! (Aparición única) Retuerce violentamente su presa destrozando tejidos (hemorragia 2 turnos), asfixiándola y causando daño extremo.`;
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
                            objetivo.fatiga = 0;
                            objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                            extraDano += 0.35;
                            mensaje += ` 🐅🩸 ¡ASFIXIA TRAQUEAL! (Aparición única) La mordida bloquea el flujo de oxígeno: la fatiga del rival cae a 0 instantáneamente y queda paralizado.`;
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
                            objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 2);
                            objetivo.estadoGuardia = "rota";
                            extraDano += 0.35;
                            mensaje += ` 🐘💥 ¡EMBESTIDA COLOSAL! (Aparición única) Una carga imparable que hace volar por los aires la defensa enemiga, dejándolo aturdido 2 turnos.`;
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
                        objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 2;
                        objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 25;
                        extraDano += 0.25;
                        mensaje += ` 🧠🐺 ¡ESTRATEGIA DE JAURÍA! (Aparición única) Una maniobra biológica sume al rival en estado caótico y hunde su táctica en la miseria.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }
                // 10. REPTILES MARINOS (Ahogamiento Abisal)
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
                        objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 2);
                        objetivo.fatiga = Math.max(0, objetivo.fatiga - 20);
                        extraDano += 0.30;
                        mensaje += ` 🌊☠️ ¡AHOGAMIENTO ABISAL! (Aparición única) Arrastra al rival a las profundidades, privándole de movilidad (paralizado 2 turnos) y ahogando su fatiga.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 11. TEMNOSPÓNDILOS Y ANFIBIOS (Toxina Cutánea)
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
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 3);
                        objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                        extraDano += 0.20;
                        mensaje += ` 🐸☣️ ¡SECRECIÓN TÓXICA! (Aparición única) Libera una potente neurotoxina anfibia que paraliza 1 turno y envenena gravemente (daño continuo 3 turnos).`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 12. PLACODERMOS, CONDRICTIOS (Desmembramiento)
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
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 4);
                        extraDano += 0.45;
                        mensaje += ` 🦈🩸 ¡DESMEMBRAMIENTO! (Aparición única) La presión mandibular arranca un trozo de carne, causando daño extremo y una hemorragia letal de 4 turnos.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 13. ARTRÓPODOS (Neurotoxina)
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
                        objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 2);
                        objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 2;
                        extraDano += 0.25;
                        mensaje += ` 🦂☠️ ¡INYECCIÓN NEUROTÓXICA! (Aparición única) Un aguijonazo o corte inyecta enzimas que colapsan el sistema nervioso: paralizado 2 turnos y caos mental.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 14. MOLUSCOS Y CEFALÓPODOS (Tinta Densa)
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
                        objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 30;
                        objetivo.estadoCaotico = (objetivo.estadoCaotico || 0) + 3;
                        atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 20);
                        extraDano += 0.15;
                        mensaje += ` 🦑⬛ ¡NUBE DE TINTA DENSA! (Aparición única) Cubre el campo visual, anulando la táctica oponente (-30), causándole caos total y permitiendo recuperar resuello.`;
                    }
                    return { extraDano, mensajeTexto: mensaje };
                }
            };
        }

        // 15. Genérico (Mutación Latente)
        return {
            tipo: "general",
            nombreHabilidad: "Instinto Ancestral",
            aplicarEfecto(atacante, objetivo) {
                let extraDano = 1.05;
                let mensaje = ` 🐾 ¡${atacante.nombre} desata la inusual furia evolutiva de su linaje primitivo!`;

                if (!atacante.taxonUltimoUsado && Math.random() < 0.25) {
                    atacante.taxonUltimoUsado = true;
                    objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                    objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                    extraDano += 0.25;
                    mensaje += ` 🐾🔥 ¡MUTACIÓN LATENTE! (Aparición única) Un estallido inesperado de furia evolutiva aturde al rival y provoca desgarros severos.`;
                }
                return { extraDano, mensajeTexto: mensaje };
            }
        };
    }
};

