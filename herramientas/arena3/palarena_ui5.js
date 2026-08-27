/*
========================================================
PALARENA
palarena_ui5.js v1.0
PalEntropía

INTERFAZ REFINADA DE ARENA

- Mantiene el motor existente.
- No modifica palarena.js.
- No modifica palarenabonificaciones.js.
- No recalcula bonificaciones.
- Muestra los efectos reales de las bonificaciones.
- Muestra HP inicial y HP final.
- Muestra escenario con nombres descriptivos.
========================================================
*/

window.PALARENA_UI5 = {

    /* ==================================================
       ICONOS DE ATRIBUTOS
       ================================================== */

    iconos: {
        ataque: "⚔️",
        defensa: "🛡️",
        velocidad: "⚡",
        resistencia: "❤️",
        tactica: "🧠"
    },


    /* ==================================================
       NOMBRES DE ATRIBUTOS
       ================================================== */

    nombres: {
        ataque: "Ataque",
        defensa: "Defensa",
        velocidad: "Velocidad",
        resistencia: "Resistencia",
        tactica: "Táctica"
    },


    /* ==================================================
       ESCAPAR TEXTO
       ================================================== */

    escapar(valor) {

        if (
            typeof escaparHTML === "function"
        ) {
            return escaparHTML(
                valor === undefined ||
                valor === null
                    ? ""
                    : String(valor)
            );
        }

        return String(
            valor === undefined ||
            valor === null
                ? ""
                : valor
        )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },


    /* ==================================================
       NÚMERO
       ================================================== */

    numero(valor) {

        if (
            typeof numeroArena === "function"
        ) {
            return numeroArena(valor);
        }

        return Number(valor) || 0;
    },


    /* ==================================================
       NOMBRE DE HÁBITAT
       ================================================== */

    nombreHabitat(codigo) {

        const datos =
            window.PALARENA_DATOS
                ?.obtenerHabitat(codigo);

        return datos && datos.nombre
            ? datos.nombre
            : codigo;
    },


    /* ==================================================
       NOMBRE DE MODO
       ================================================== */

    nombreModo(codigo) {

        const datos =
            window.PALARENA_DATOS
                ?.obtenerModo(codigo);

        return datos && datos.nombre
            ? datos.nombre
            : codigo;
    },


    /* ==================================================
       NOMBRE DE MEDIO
       ================================================== */

    nombreMedio(codigo) {

        const datos =
            window.PALARENA_DATOS
                ?.obtenerMedio(codigo);

        return datos && datos.nombre
            ? datos.nombre
            : codigo;
    },


    /* ==================================================
       MOSTRAR HÁBITATS
       ================================================== */

    habitats(escenario) {

        if (
            !escenario ||
            !Array.isArray(
                escenario.habitats
            )
        ) {
            return "—";
        }

        return escenario.habitats
            .map(
                codigo => {

                    const nombre =
                        this.nombreHabitat(
                            codigo
                        );

                    return `
                        <div class="arenaDatoEscenario">
                            <strong>
                                ${this.escapar(nombre)}
                            </strong>
                        </div>
                    `;
                }
            )
            .join("");
    },


    /* ==================================================
       MOSTRAR MODO
       ================================================== */

    modo(escenario) {

        if (
            !escenario ||
            !escenario.modo
        ) {
            return "—";
        }

        return this.escapar(
            this.nombreModo(
                escenario.modo
            )
        );
    },


    /* ==================================================
       MOSTRAR MEDIOS
       ================================================== */

    medios(escenario) {

        if (
            !escenario ||
            !Array.isArray(
                escenario.medios
            )
        ) {
            return "—";
        }

        return escenario.medios
            .map(
                medio => {

                    if (
                        !medio
                    ) {
                        return "";
                    }

                    /*
                    --------------------------------------
                    EL ESCENARIO PUEDE CONTENER EL CÓDIGO
                    COMPUESTO O SUS COMPONENTES.
                    --------------------------------------
                    */

                    const elementos = [];

                    if (
                        medio.SM
                    ) {
                        elementos.push(
                            this.nombreMedio(
                                medio.SM
                            )
                        );
                    }

                    if (
                        medio.L
                    ) {
                        elementos.push(
                            this.nombreMedio(
                                medio.L
                            )
                        );
                    }

                    if (
                        medio.ES
                    ) {
                        elementos.push(
                            this.nombreMedio(
                                medio.ES
                            )
                        );
                    }

                    if (
                        medio.C
                    ) {
                        elementos.push(
                            this.nombreMedio(
                                medio.C
                            )
                        );
                    }

                    /*
                    --------------------------------------
                    SI NO HAY COMPONENTES, USAR NOMBRE
                    --------------------------------------
                    */

                    if (
                        elementos.length === 0 &&
                        medio.nombre
                    ) {
                        elementos.push(
                            medio.nombre
                        );
                    }

                    return elementos
                        .filter(Boolean)
                        .map(
                            nombre => `
                                <div class="arenaMedio">
                                    ${this.escapar(
                                        nombre
                                    )}
                                </div>
                            `
                        )
                        .join("");

                }
            )
            .filter(Boolean)
            .join("");
    },


    /* ==================================================
       ESCENARIO
       ================================================== */

    mostrarEscenario(escenario) {

        const panel =
            document.getElementById(
                "escenarioCombate"
            );

        if (
            !panel ||
            !escenario
        ) {
            return;
        }

        panel.innerHTML = `
            <h3>
                🎲 Escenario
            </h3>

            <div class="arenaEscenarioBloque">

                <div class="arenaEscenarioTitulo">
                    🏠 Hábitats
                </div>

                <div class="arenaEscenarioContenido">
                    ${this.habitats(
                        escenario
                    )}
                </div>

            </div>

            <div class="arenaEscenarioBloque">

                <div class="arenaEscenarioTitulo">
                    🧬 Modo de vida
                </div>

                <div class="arenaEscenarioContenido">
                    ${this.modo(
                        escenario
                    )}
                </div>

            </div>

            <div class="arenaEscenarioBloque">

                <div class="arenaEscenarioTitulo">
                    🌎 Medios ecológicos
                </div>

                <div class="arenaEscenarioContenido">
                    ${this.medios(
                        escenario
                    )}
                </div>

            </div>
        `;
    },


    /* ==================================================
       EFECTOS DE BONIFICACIÓN
       ================================================== */

    efectos(detalles) {

        if (
            !Array.isArray(
                detalles
            )
        ) {
            return "";
        }

        let html = "";

        detalles.forEach(
            detalle => {

                if (
                    !detalle ||
                    !Array.isArray(
                        detalle.efectos
                    )
                ) {
                    return;
                }

                detalle.efectos.forEach(
                    efecto => {

                        if (
                            !efecto ||
                            !efecto.indicador
                        ) {
                            return;
                        }

                        const nombre =
                            String(
                                efecto.indicador
                            );

                        const clave =
                            Object.keys(
                                this.nombres
                            ).find(
                                key =>
                                    this.nombres[
                                        key
                                    ] === nombre
                            );

                        const icono =
                            clave
                                ? this.iconos[
                                    clave
                                ]
                                : "⬆️";

                        const valor =
                            this.numero(
                                efecto.valor
                            );

                        if (
                            valor <= 0
                        ) {
                            return;
                        }

                        html += `
                            <div class="arenaMejora">

                                <span class="arenaMejoraNombre">
                                    ${icono}
                                    ${this.escapar(
                                        nombre
                                    )}
                                </span>

                                <strong class="arenaMejoraValor">
                                    +${valor}
                                </strong>

                            </div>
                        `;
                    }
                );
            }
        );

        return html;
    },


    /* ==================================================
       BONIFICACIONES
       ================================================== */

    bonificaciones(
        bonificacion
    ) {

        if (
            !bonificacion
        ) {
            return `
                <div class="arenaSinBonificacion">
                    Sin bonificaciones
                </div>
            `;
        }

        let html = "";

        const detalles =
            Array.isArray(
                bonificacion.detalles
            )
                ? bonificacion.detalles
                : [];


        /*
        ==================================================
        HÁBITATS
        ==================================================
        */

        const habitats =
            this.numero(
                bonificacion.habitats
            );

        if (
            habitats > 0
        ) {

            const mejora =
                this.efectos(
                    detalles.filter(
                        detalle =>
                            detalle &&
                            detalle.tipo ===
                            "hábitats"
                    )
                );

            html += `
                <div class="arenaBonus">

                    <div class="arenaBonusTitulo">
                        🏠 Hábitats
                        <span>
                            ✓ ${habitats}
                            coincidencia${habitats !== 1 ? "s" : ""}
                        </span>
                    </div>

                    ${
                        mejora
                            ? `
                                <div class="arenaMejoras">
                                    ${mejora}
                                </div>
                            `
                            : ""
                    }

                </div>
            `;
        }


        /*
        ==================================================
        MODO
        ==================================================
        */

        if (
            bonificacion.modo === true
        ) {

            const mejora =
                this.efectos(
                    detalles.filter(
                        detalle =>
                            detalle &&
                            detalle.tipo ===
                            "modo"
                    )
                );

            html += `
                <div class="arenaBonus">

                    <div class="arenaBonusTitulo">
                        🧬 Modo de vida
                        <span>
                            ✓ COINCIDE
                        </span>
                    </div>

                    ${
                        mejora
                            ? `
                                <div class="arenaMejoras">
                                    ${mejora}
                                </div>
                            `
                            : ""
                    }

                </div>
            `;
        }


        /*
        ==================================================
        MEDIOS
        ==================================================
        */

        const medios =
            bonificacion.medios;

        const coincidencias =
            this.numero(
                medios &&
                medios.coincidencias
            );

        if (
            coincidencias > 0
        ) {

            const mejora =
                this.efectos(
                    detalles.filter(
                        detalle =>
                            detalle &&
                            detalle.tipo ===
                            "medio"
                    )
                );

            html += `
                <div class="arenaBonus">

                    <div class="arenaBonusTitulo">
                        🌎 Medios ecológicos
                        <span>
                            ✓ ${coincidencias}
                            coincidencia${coincidencias !== 1 ? "s" : ""}
                        </span>
                    </div>

                    ${
                        mejora
                            ? `
                                <div class="arenaMejoras">
                                    ${mejora}
                                </div>
                            `
                            : ""
                    }

                </div>
            `;
        }


        /*
        ==================================================
        SIN RESULTADO
        ==================================================
        */

        if (
            !html
        ) {
            html = `
                <div class="arenaSinBonificacion">
                    Sin bonificaciones
                </div>
            `;
        }

        return html;
    },


    /* ==================================================
       COMBATIENTES PREPARADOS
       ================================================== */

    mostrarPreparados(
        c1,
        c2,
        b1,
        b2,
        escenario
    ) {

        const panel =
            document.getElementById(
                "panelCombate"
            );

        const preparados =
            document.getElementById(
                "combatientesPreparados"
            );

        if (
            panel
        ) {
            panel.style.display =
                "block";
        }

        const resultado =
            document.getElementById(
                "panelResultadoCombate"
            );

        if (
            resultado
        ) {
            resultado.style.display =
                "none";
        }

        if (
            preparados
        ) {

            preparados.innerHTML = `

                <div class="arenaPreparado">

                    <div class="arenaPreparadoNombre">
                        ${this.escapar(
                            c1.nombre
                        )}
                    </div>

                    <div class="arenaPreparadoDato">
                        ❤️ HP inicial:
                        <strong>
                            ${this.numero(
                                c1.hp_max
                            )}
                        </strong>
                    </div>

                    <div class="arenaPreparadoDato">
                        ⚡ Iniciativa:
                        <strong>
                            ${this.numero(
                                c1.iniciativa
                            )}
                        </strong>
                    </div>

                    <div class="arenaBonificaciones">

                        <div class="arenaBonificacionesTitulo">
                            ✨ Bonificaciones de escenario
                        </div>

                        ${this.bonificaciones(
                            b1
                        )}

                    </div>

                </div>


                <hr>


                <div class="arenaPreparado">

                    <div class="arenaPreparadoNombre">
                        ${this.escapar(
                            c2.nombre
                        )}
                    </div>

                    <div class="arenaPreparadoDato">
                        ❤️ HP inicial:
                        <strong>
                            ${this.numero(
                                c2.hp_max
                            )}
                        </strong>
                    </div>

                    <div class="arenaPreparadoDato">
                        ⚡ Iniciativa:
                        <strong>
                            ${this.numero(
                                c2.iniciativa
                            )}
                        </strong>
                    </div>

                    <div class="arenaBonificaciones">

                        <div class="arenaBonificacionesTitulo">
                            ✨ Bonificaciones de escenario
                        </div>

                        ${this.bonificaciones(
                            b2
                        )}

      
