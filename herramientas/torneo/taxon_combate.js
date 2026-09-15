/*
========================================================
PALARENA — TAXÓN COMBATE v3.0 (Completo Definitivo)
PalEntropía
Asignación de habilidades y atributos según clados y linajes
========================================================
*/

window.PALARENA_TAXON_COMBATE = {

    obtenerRasgosTaxonomicos(codigo) {
        if (!window.PALTAXON || !codigo) return null;
        
        const key = String(codigo).trim();
        const tax = window.PALTAXON[key];
        
        if (!tax) return null;

        const textoTaxonomia = ((tax.ta1 || "") + " > " + (tax.ta2 || "")).toLowerCase();

        // 1. PTEROSAURIOS (Ataque en picado / Picotazo aéreo)
        if (textoTaxonomia.includes("pterosauria") || textoTaxonomia.includes("pterosaurio")) {
            return {
                tipo: "pterosaurio",
                nombreHabilidad: "Picado Aéreo",
                aplicarEfecto(atacante, objetivo) {
                    let fatigaDrenada = 12;
                    objetivo.fatiga = Math.max(0, objetivo.fatiga - fatigaDrenada);
                    return {
                        extraDano: 1.15,
                        mensajeTexto: ` 🦅 ¡${atacante.nombre} desciende en un vertiginoso Picado Aéreo desde las alturas, desestabilizando y drenando ${fatigaDrenada} de fatiga al rival!`
                    };
                }
            };
        }

        // 2. AVES DEL TERROR / AVES PRIMITIVAS (Picotazo letal / Perforación)
        if (textoTaxonomia.includes("aves") || textoTaxonomia.includes("cariamiformes") || textoTaxonomia.includes("fororrácido") || textoTaxonomia.includes("gastornithiformes")) {
            return {
                tipo: "ave_terror",
                nombreHabilidad: "Hachazo Titánico",
                aplicarEfecto(atacante, objetivo) {
                    objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                    return {
                        extraDano: 1.25,
                        mensajeTexto: ` 🦅⚔️ ¡${atacante.nombre} embiste con su robusto pico, provocando una hemorragia severa (2 turnos) con letal precisión aviana!`
                    };
                }
            };
        }

        // 3. TERÓPODOS Y SUPERDEPREDADORES (Tiranosáuridos, Alosáuridos, Espinosáuridos...)
        if (textoTaxonomia.includes("theropoda") || textoTaxonomia.includes("terópodo")) {
            return {
                tipo: "teropodo",
                nombreHabilidad: "Fuerza Depredadora",
                aplicarEfecto(atacante, objetivo) {
                    objetivo.estadoGuardia = "rota";
                    return {
                        extraDano: 1.30,
                        mensajeTexto: ` 🦖 ¡${atacante.nombre} asesta una mordedura o zarpazo masivo de superdepredador, fracturando la guardia del rival por completo!`
                    };
                }
            };
        }
      
        // 4. SAURÓPODOS / CUELLOS LARGOS (Impacto sísmico / Coletazo colosal)
        if (textoTaxonomia.includes("sauropoda") || textoTaxonomia.includes("sauropodomorpha") || textoTaxonomia.includes("saurópodo")) {
            return {
                tipo: "sauropodo",
                nombreHabilidad: "Impacto de Coloso",
                aplicarEfecto(atacante, objetivo) {
                    let fatigaExtra = 20;
                    objetivo.fatiga = Math.max(0, objetivo.fatiga - fatigaExtra);
                    return {
                        extraDano: 1.20,
                        mensajeTexto: ` 🦕 ¡${atacante.nombre} sacude el suelo con su colosal masa, desestabilizando al rival y drenando ${fatigaExtra} de fatiga!`
                    };
                }
            };
        }

        // 5. TIREÓFOROS (Anquilosaurios, Estegosaurios - Armadura natural / Rebote defensivo)
        if (textoTaxonomia.includes("thyreophora") || textoTaxonomia.includes("ankylosauria") || textoTaxonomia.includes("stegosauria") || textoTaxonomia.includes("tireóforo")) {
            return {
                tipo: "tireoforo",
                nombreHabilidad: "Contundencia acorazada",
                aplicarEfecto(atacante, objetivo) {
                    atacante.efectivos.defensa += 5; // Buff temporal defensivo
                    return {
                        extraDano: 1.10,
                        mensajeTexto: ` 🛡️ ¡${atacante.nombre} aprovecha sus placas y osteodermos para devolver el castigo con su pesada armadura natural!`
                    };
                }
            };
        }

        // 6. CERATÓPSIDOS (Carga frontal con cuernos)
        if (textoTaxonomia.includes("ceratopsia") || textoTaxonomia.includes("ceratopsidae") || textoTaxonomia.includes("ceratopsio")) {
            return {
                tipo: "ceratopsido",
                nombreHabilidad: "Carga de Cornudos",
                aplicarEfecto(atacante, objetivo) {
                    objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                    return {
                        extraDano: 1.25,
                        mensajeTexto: ` 🦏 ¡${atacante.nombre} embiste de frente con su impresionante cornamenta, dejando aturdido al rival por 1 turno!`
                    };
                }
            };
        }

        // 7. ORNITÓPODOS / HADROSÁURIDOS (Presión de manada / Agilidad táctica)
        if (textoTaxonomia.includes("ornithischia") || textoTaxonomia.includes("hadrosauridae") || textoTaxonomia.includes("ornitópodo")) {
            return {
                tipo: "ornitopodo",
                nombreHabilidad: "Maniobra evasiva",
                aplicarEfecto(atacante, objetivo) {
                    atacante.fatiga = Math.min(atacante.fatiga_max, atacante.fatiga + 10);
                    return {
                        extraDano: 1.10,
                        mensajeTexto: ` 🦌 ¡${atacante.nombre} usa su agilidad de herbívoro gregario para ganar distancia y recuperar 10 de fatiga en plena refriega!`
                    };
                }
            };
        }

        // 8. COCODRILOMORFOS (Iberosuchus, Sebecia - Agarre / Presión mandibular)
        if (textoTaxonomia.includes("crocodylomorpha") || textoTaxonomia.includes("cocodrilomorfo")) {
            return {
                tipo: "cocodrilomorfo",
                nombreHabilidad: "Agarre Mortal",
                aplicarEfecto(atacante, objetivo) {
                    objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                    return {
                        extraDano: 1.20,
                        mensajeTexto: ` 🐊 ¡${atacante.nombre} muerde y retuerce sus fauces en un Agarre Mortal, inmovilizando al rival por 1 turno!`
                    };
                }
            };
        }


          // 9. SINÁPSIDOS Y MAMÍFEROS (Separado en subgrupos por morfología)
        if (textoTaxonomia.includes("synapsida") || textoTaxonomia.includes("sinápsido") || textoTaxonomia.includes("mammalia")) {
            
            // Dientes de sable (Smilodon, Gorgonópsidos, Machairodontinae)
            if (textoTaxonomia.includes("smilodon") || textoTaxonomia.includes("machairodontinae") || textoTaxonomia.includes("gorgonopsia")) {
                return {
                    tipo: "sable",
                    nombreHabilidad: "Colmillos Perforantes",
                    aplicarEfecto(atacante, objetivo) {
                        objetivo.turnosDesangrado = Math.max(objetivo.turnosDesangrado || 0, 2);
                        return {
                            extraDano: 1.25,
                            mensajeTexto: ` 🐅 ¡${atacante.nombre} clava sus imponentes colmillos curvos directo a los vasos sanguíneos, provocando hemorragia profunda (2 turnos)!`
                        };
                    }
                };
            }
            // Gigantes herbívoros (Mamuts, Dinocerata, Pantodonta, Proboscídeos)
            if (textoTaxonomia.includes("proboscidea") || textoTaxonomia.includes("mammuthus") || textoTaxonomia.includes("dinocerata") || textoTaxonomia.includes("pantodonta")) {
                return {
                    tipo: "proboscideo",
                    nombreHabilidad: "Carga de Gigante",
                    aplicarEfecto(atacante, objetivo) {
                        objetivo.turnosAturdido = Math.max(objetivo.turnosAturdido || 0, 1);
                        return {
                            extraDano: 1.25,
                            mensajeTexto: ` 🐘 ¡${atacante.nombre} embiste con todo su tonelaje mamaliano, aplastando y aturdiendo al oponente!`
                        };
                    }
                };
            }
            // Sinápsidos y Mamíferos generales (Inteligencia / Táctica)
            return {
                tipo: "sinapsido_general",
                nombreHabilidad: "Astucia de Sinápsido",
                aplicarEfecto(atacante, objetivo) {
                    objetivo.tacticaTemporal = (objetivo.tacticaTemporal || 0) - 10;
                    return {
                        extraDano: 1.12,
                        mensajeTexto: ` 🧠 ¡${atacante.nombre} aplica su avanzado intelecto evolutivo, confundiendo y desestabilizando la táctica temporal del rival!`
                    };
                }
            };
        }

        // 10. REPTILES MARINOS (Ictiosaurios, Plesiosaurios, Mosasaurios)
        if (textoTaxonomia.includes("ichthyosauria") || textoTaxonomia.includes("sauropterygia") || textoTaxonomia.includes("mosasauroidea")) {
            return {
                tipo: "marino",
                nombreHabilidad: "Hidrodinamia Letal",
                aplicarEfecto(atacante, objetivo) {
                    let fatigaDrenada = 15;
                    objetivo.fatiga = Math.max(0, objetivo.fatiga - fatigaDrenada);
                    return {
                        extraDano: 1.18,
                        mensajeTexto: ` 🌊 ¡${atacante.nombre} efectúa un devastador rebufo con velocidad hidrodinámica, restando ${fatigaDrenada} de fatiga al rival!`
                    };
                }
            };
        }

          // 11. TEMNOSPÓNDILOS Y ANFIBIOS PRIMIGENIOS
        if (textoTaxonomia.includes("temnospondyli") || textoTaxonomia.includes("lissamphibia") || textoTaxonomia.includes("nectridea") || textoTaxonomia.includes("anfibio")) {
            return {
                tipo: "temnospondyli",
                nombreHabilidad: "Trampa de Pantano",
                aplicarEfecto(atacante, objetivo) {
                    objetivo.fatiga = Math.max(0, objetivo.fatiga - 15);
                    return {
                        extraDano: 1.10,
                        mensajeTexto: ` 🐸 ¡${atacante.nombre} arrastra al rival hacia el sustrato cenagoso, succionando un 15% de su resuello vital!`
                    };
                }
            };
        }

        // 12. PLACODERMOS, CONDRICTIOS Y PECES ACORAZADOS / CARTILAGINOSOS
        if (textoTaxonomia.includes("placodermi") || textoTaxonomia.includes("chondrichthyes") || textoTaxonomia.includes("actinopterygii")) {
            return {
                tipo: "pez_armado",
                nombreHabilidad: "Mordida Abisal / Cizalla",
                aplicarEfecto(atacante, objetivo) {
                    objetivo.estadoGuardia = "rota";
                    return {
                        extraDano: 1.25,
                        mensajeTexto: ` 🦈 ¡${atacante.nombre} cierra de golpe sus terroríficas mandíbulas marinas, seccionando la defensa del rival!`
                    };
                }
            };
        }

        // 13. ARTRÓPODOS Y PANARTRÓPODOS (Trilobites, Radiodontos, Megáqueiros, etc.)
        if (textoTaxonomia.includes("arthropoda") || textoTaxonomia.includes("trilobita") || textoTaxonomia.includes("radiodonta") || textoTaxonomia.includes("lobopodia")) {
            return {
                tipo: "artropodo",
                nombreHabilidad: "Presa Invertebrada",
                aplicarEfecto(atacante, objetivo) {
                    objetivo.turnosParalizado = Math.max(objetivo.turnosParalizado || 0, 1);
                    return {
                        extraDano: 1.15,
                        mensajeTexto: ` 🦂 ¡${atacante.nombre} atrapa puntos vulnerables con sus apéndices quitinosos, paralizando al rival por 1 turno!`
                    };
                }
            };
        }

        // 14. MOLUSCOS Y CEFALÓPODOS (Ammonoideos, etc.)
        if (textoTaxonomia.includes("mollusca") || textoTaxonomia.includes("cephalopoda") || textoTaxonomia.includes("nectocaridida")) {
            return {
                tipo: "cefalopodo",
                nombreHabilidad: "Chorro Evasivo",
                aplicarEfecto(atacante, objetivo) {
                    atacante.efectivos.velocidad += 5;
                    return {
                        extraDano: 1.08,
                        mensajeTexto: ` 🦑 ¡${atacante.nombre} expulsa un repentino chorro de propulsión evasivo, desorientando el contraataque enemigo!`
                    };
                }
            };
        }

        // 15. Genérico por defecto para otros grupos no tipificados (Tullimóstridos, Conodontos, etc.)
        return {
            tipo: "general",
            nombreHabilidad: "Instinto Ancestral",
            aplicarEfecto(atacante, objetivo) {
                return {
                    extraDano: 1.05,
                    mensajeTexto: ` 🐾 ¡${atacante.nombre} desata la inusual furia evolutiva de su linaje primitivo!`
                };
            }
        };
    }
};
