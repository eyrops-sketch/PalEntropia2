/* ========================================================
   PALARENA standar.js v1.2
   PalEntropía
   MOTOR DE COMBATE ESTÁNDAR
======================================================== */

window.PALARENA_STANDAR = {

    version: "1.2",

    configuracion: {

        hp_base: 100,

        bonificacion_dominante: 0.15,

        /* ==============================================
           FACTOR IMPREVISIBLE
        ============================================== */

        factor_imprevisible_min: 0.92,
        factor_imprevisible_max: 1.08,

        /* ==============================================
           COEFICIENTE DE COMBATE
           1.00 = sin modificación
        ============================================== */

        coeficiente_combate: 1.00,
        coeficiente_combate_min: 0.50,
        coeficiente_combate_max: 1.50,

        /* ==============================================
           INICIATIVA
        ============================================== */

        iniciativa_velocidad: 0.70,
        iniciativa_tactica: 0.30,

        /* ==============================================
           DAÑO
        ============================================== */

        dano_base: 10,
        dano_por_ataque: 0.20,
        defensa_divisor: 200,
        variacion_dano: 0.10,
        multiplicador_critico: 1.50,

        /* ==============================================
           CRÍTICO
        ============================================== */

        critico_base: 5,
        critico_tactica: 0.10,
        fatiga_minima_critico: 40,

        /* ==============================================
           ESQUIVA
        ============================================== */

        esquiva_velocidad: 0.10,

        /* ==============================================
           FALLO DE ATAQUE
        ============================================== */

        fallo_base: 8,
        fallo_reduccion_tactica: 0.04,

        /* ==============================================
           ATAQUE POTENTE
        ============================================== */

        coste_ataque_potente_hp: 0.05,

        /* ==============================================
           FATIGA
        ============================================== */

        fatiga_max: 100,
        fatiga_inicial: 100,
        fatiga_regeneracion_turno: 6,

        coste_fatiga_A001: 8,
        coste_fatiga_A002: 18,
        coste_fatiga_A003: 10,
        coste_fatiga_D001: 5,

        /* Fatiga adicional que recibe el atacante
           cuando golpea contra una defensa activa. */

        fatiga_defensa_atacante: 12,

        /* ==============================================
           DEFENSA
        ============================================== */

        /* Porcentaje de daño que permanece cuando
           la defensa tiene éxito.
           0.30 = 70 % de reducción. */

        reduccion_defensa: 0.30,

        /* Error de defensa */

        error_defensa_base: 15,
        error_defensa_reduccion_inteligencia: 0.05,
        error_defensa_reduccion_tactica: 0.04,

        error_defensa_fatiga_umbral: 40,
        error_defensa_fatiga_incremento: 0.10,

        error_defensa_min: 5,
        error_defensa_max: 25,

        /* ==============================================
           GOLPE MORTAL
        ============================================== */

        golpe_mortal: true,

        /* ==============================================
           DAÑO SEGÚN VIDA RESTANTE
        ============================================== */

        dano_vida_75: 1.00,
        dano_vida_50: 1.05,
        dano_vida_25: 1.15,
        dano_vida_10: 1.25,
        dano_vida_critica: 1.35,

        /* ==============================================
           LÍMITE
        ============================================== */

        max_turnos: 100
    },

    /* ==================================================
       UTILIDADES
    ================================================== */

    numero(valor) {

        const numero = Number(valor);

        return Number.isFinite(numero)
            ? numero
            : 0;
    },

    limitar(valor) {

        return Math.max(
            0,
            Math.min(
                100,
                Math.round(valor)
            )
        );
    },

    limitarCoeficiente(valor) {

        const minimo =
            this.configuracion
                .coeficiente_combate_min;

        const maximo =
            this.configuracion
                .coeficiente_combate_max;

        return Math.max(
            minimo,
            Math.min(
                maximo,
                this.numero(valor)
            )
        );
    },

    aleatorio(min, max) {

        return Math.random() *
            (max - min) +
            min;
    },

    enteroAleatorio(min, max) {

        return Math.floor(
            Math.random() *
            (max - min + 1)
        ) + min;
    },

    /* ==================================================
       COEFICIENTE DE COMBATE
    ================================================== */

    obtenerCoeficienteCombate(
        ficha,
        reglas
    ) {

        let coeficiente =
            this.configuracion
                .coeficiente_combate;

        /*
           Permite definir un coeficiente específico
           directamente en la ficha.
        */

        if (
            ficha &&
            Number.isFinite(
                Number(
                    ficha.coeficiente_combate
                )
            )
        ) {

            coeficiente =
                Number(
                    ficha.coeficiente_combate
                );
        }

        /*
           Permite definir coeficientes externos
           por código de participante.
        */

        if (
            reglas &&
            reglas.coeficientes_combate &&
            ficha
        ) {

            const codigo =
                ficha.j1 ||
                ficha.codigo ||
                "";

            if (
                Number.isFinite(
                    Number(
                        reglas.coeficientes_combate[
                            codigo
                        ]
                    )
                )
            ) {

                coeficiente =
                    Number(
                        reglas.coeficientes_combate[
                            codigo
                        ]
                    );
            }
        }

        /*
           También permite un coeficiente general
           para una variante de combate.
        */

        if (
            reglas &&
            Number.isFinite(
                Number(
                    reglas.coeficiente_combate
                )
            )
        ) {

            coeficiente =
                Number(
                    reglas.coeficiente_combate
                );
        }

        return this.limitarCoeficiente(
            coeficiente
        );
    },

    /* ==================================================
       FACTOR IMPREVISIBLE
    ================================================== */

    obtenerFactorImprevisible() {

        return this.aleatorio(
            this.configuracion
                .factor_imprevisible_min,

            this.configuracion
                .factor_imprevisible_max
        );
    },

    /* ==================================================
       ATRIBUTO DOMINANTE
    ================================================== */

    obtenerDominante(indicadores) {

        const atributos = [

            {
                atributo: "ataque",
                valor: indicadores.ataque
            },

            {
                atributo: "defensa",
                valor: indicadores.defensa
            },

            {
                atributo: "velocidad",
                valor: indicadores.velocidad
            },

            {
                atributo: "resistencia",
                valor: indicadores.resistencia
            },

            {
                atributo: "tactica",
                valor: indicadores.tactica
            }
        ];

        const maximo =
            Math.max(
                ...atributos.map(
                    function(item) {
                        return item.valor;
                    }
                )
            );

        let candidatos =
            atributos.filter(
                function(item) {

                    return item.valor ===
                        maximo;
                }
            );

        if (
            candidatos.length > 1
        ) {

            const tactica =
                candidatos.find(
                    function(item) {

                        return item.atributo ===
                            "tactica";
                    }
                );

            if (tactica) {

                candidatos = [
                    tactica
                ];
            }
        }

        const elegido =
            candidatos[
                this.enteroAleatorio(
                    0,
                    candidatos.length - 1
                )
            ];

        return {

            atributo:
                elegido.atributo,

            valor:
                elegido.valor,

            bonificacion:
                this.configuracion
                    .bonificacion_dominante
        };
    },

    /* ==================================================
       PERFIL
    ================================================== */

    obtenerPerfil(atributo) {

        const perfiles = {

            ataque:
                "agresivo",

            defensa:
                "defensivo",

            velocidad:
                "rapido",

            resistencia:
                "aguante",

            tactica:
                "tactico"
        };

        return perfiles[atributo] ||
            "equilibrado";
    },

    /* ==================================================
       VALORES EFECTIVOS
    ================================================== */

    obtenerEfectivos(
        indicadores,
        dominante,
        factor,
        coeficiente
    ) {

        const efectivos = {

            ataque:
                this.limitar(
                    indicadores.ataque
                ),

            defensa:
                this.limitar(
                    indicadores.defensa
                ),

            velocidad:
                this.limitar(
                    indicadores.velocidad
                ),

            resistencia:
                this.limitar(
                    indicadores.resistencia
                ),

            tactica:
                this.limitar(
                    indicadores.tactica
                )
        };

        /*
           Primero se aplica la bonificación
           del atributo dominante.
        */

        efectivos[
            dominante.atributo
        ] =
            this.limitar(
                efectivos[
                    dominante.atributo
                ] *
                (
                    1 +
                    dominante.bonificacion
                )
            );

        /*
           Después se aplica el coeficiente
           de combate.
           1.00 no modifica nada.
        */

        coeficiente =
            this.limitarCoeficiente(
                coeficiente
            );

        efectivos.ataque =
            this.limitar(
                efectivos.ataque *
                coeficiente
            );

        efectivos.defensa =
            this.limitar(
                efectivos.defensa *
                coeficiente
            );

        efectivos.velocidad =
            this.limitar(
                efectivos.velocidad *
                coeficiente
            );

        efectivos.resistencia =
            this.limitar(
                efectivos.resistencia *
                coeficiente
            );

        efectivos.tactica =
            this.limitar(
                efectivos.tactica *
                coeficiente
            );

        /*
           Finalmente se aplica el factor
           imprevisible propio del combate.
        */

        efectivos.ataque =
            this.limitar(
                efectivos.ataque *
                factor
            );

        efectivos.defensa =
            this.limitar(
                efectivos.defensa *
                factor
            );

        efectivos.velocidad =
            this.limitar(
                efectivos.velocidad *
                factor
            );

        efectivos.resistencia =
            this.limitar(
                efectivos.resistencia *
                factor
            );

        efectivos.tactica =
            this.limitar(
                efectivos.tactica *
                factor
            );

        return efectivos;
    },

    /* ==================================================
       INICIATIVA
    ================================================== */

    calcularIniciativa(efectivos) {

        return Math.round(

            (
                efectivos.velocidad *
                this.configuracion
                    .iniciativa_velocidad
            )

            +

            (
                efectivos.tactica *
                this.configuracion
                    .iniciativa_tactica
            )
        );
    },
       /* ==================================================
       CREAR COMBATIENTE
    ================================================== */

    crearCombatiente(
        ficha,
        reglas
    ) {

        if (!ficha) {

            console.error(
                "PALARENA_STANDAR: ficha no válida."
            );

            return null;
        }

        if (!window.PALARENA_STATS) {

            console.error(
                "PALARENA_STANDAR: falta palarenastats.js."
            );

            return null;
        }

        const stats =
            window.PALARENA_STATS
                .obtenerStats(ficha);

        if (!stats) {
            return null;
        }

        const indicadores =
            window.PALARENA_STATS
                .calcular(stats);

        if (!indicadores) {
            return null;
        }

        const dominante =
            this.obtenerDominante(
                indicadores
            );

        const perfil =
            this.obtenerPerfil(
                dominante.atributo
            );

        /*
           Cada combatiente obtiene su propio
           factor imprevisible.
        */

        const factor =
            this.obtenerFactorImprevisible();

        /*
           Coeficiente configurable.
           1.00 = combate estándar puro.
        */

        const coeficiente =
            this.obtenerCoeficienteCombate(
                ficha,
                reglas
            );

        const efectivos =
            this.obtenerEfectivos(
                indicadores,
                dominante,
                factor,
                coeficiente
            );

        const hpMax =
            this.configuracion.hp_base +
            efectivos.resistencia;

        const iniciativa =
            this.calcularIniciativa(
                efectivos
            );

        return {

            codigo:
                ficha.j1 ||
                ficha.codigo ||
                "",

            nombre:
                ficha.j2 ||
                ficha.nombre ||
                "",

            stats: {

                e1: stats.e1,
                e2: stats.e2,
                e3: stats.e3,
                e4: stats.e4,
                e5: stats.e5,
                e6: stats.e6,
                e7: stats.e7,
                e8: stats.e8,
                e9: stats.e9,
                e10: stats.e10,
                e11: stats.e11
            },

            indicadores: {

                ataque:
                    indicadores.ataque,

                defensa:
                    indicadores.defensa,

                velocidad:
                    indicadores.velocidad,

                resistencia:
                    indicadores.resistencia,

                tactica:
                    indicadores.tactica
            },

            efectivos: {

                ataque:
                    efectivos.ataque,

                defensa:
                    efectivos.defensa,

                velocidad:
                    efectivos.velocidad,

                resistencia:
                    efectivos.resistencia,

                tactica:
                    efectivos.tactica
            },

            dominante: {

                atributo:
                    dominante.atributo,

                valor:
                    dominante.valor,

                bonificacion:
                    dominante.bonificacion
            },

            perfil:
                perfil,

            factor_imprevisible:
                factor,

            coeficiente_combate:
                coeficiente,

            hp:
                hpMax,

            hp_max:
                hpMax,

            /*
               La fatiga comienza siempre al 100 %.
            */

            fatiga:
                this.configuracion
                    .fatiga_inicial,

            fatiga_max:
                this.configuracion
                    .fatiga_max,

            iniciativa:
                iniciativa,

            ataques: [],

            efectos: [],

            defendiendo:
                false,

            derrotado:
                false
        };
    },

    /* ==================================================
       ASIGNAR ATAQUES
    ================================================== */

    asignarAtaques(combatiente) {

        if (!combatiente) {
            return;
        }

        combatiente.ataques = [

            "A001",
            "A002",
            "A003",
            "D001"
        ];
    },

    /* ==================================================
       CREAR COMBATE
    ================================================== */

    crearCombate(
        ficha1,
        ficha2,
        reglas
    ) {

        const combatiente1 =
            this.crearCombatiente(
                ficha1,
                reglas
            );

        const combatiente2 =
            this.crearCombatiente(
                ficha2,
                reglas
            );

        if (
            !combatiente1 ||
            !combatiente2
        ) {

            return null;
        }

        this.asignarAtaques(
            combatiente1
        );

        this.asignarAtaques(
            combatiente2
        );

        let primero;
        let segundo;

        if (
            combatiente1.iniciativa >
            combatiente2.iniciativa
        ) {

            primero =
                combatiente1;

            segundo =
                combatiente2;
        }

        else if (
            combatiente2.iniciativa >
            combatiente1.iniciativa
        ) {

            primero =
                combatiente2;

            segundo =
                combatiente1;
        }

        else {

            if (
                Math.random() < 0.5
            ) {

                primero =
                    combatiente1;

                segundo =
                    combatiente2;
            }

            else {

                primero =
                    combatiente2;

                segundo =
                    combatiente1;
            }
        }

        return {

            estado:
                "combate",

            turno:
                1,

            primero:
                primero.codigo,

            segundo:
                segundo.codigo,

            combatiente1:
                combatiente1,

            combatiente2:
                combatiente2,

            historial: [],

            ganador:
                null,

            perdedor:
                null,

            reglas:
                reglas || null
        };
    },

    /* ==================================================
       BUSCAR COMBATIENTE
    ================================================== */

    obtenerCombatiente(
        combate,
        codigo
    ) {

        if (
            combate.combatiente1.codigo ===
            codigo
        ) {

            return combate.combatiente1;
        }

        if (
            combate.combatiente2.codigo ===
            codigo
        ) {

            return combate.combatiente2;
        }

        return null;
    },

    /* ==================================================
       BUSCAR EFECTO ACTIVO
    ================================================== */

    obtenerEfecto(
        combatiente,
        codigo
    ) {

        if (
            !combatiente ||
            !Array.isArray(
                combatiente.efectos
            )
        ) {

            return null;
        }

        return combatiente.efectos.find(
            function(efecto) {

                return efecto.codigo ===
                    codigo;
            }
        ) || null;
    },

    /* ==================================================
       FATIGA
    ================================================== */

    obtenerFatigaPorcentaje(
        combatiente
    ) {

        if (
            !combatiente ||
            !combatiente.fatiga_max
        ) {

            return 0;
        }

        return (
            combatiente.fatiga /
            combatiente.fatiga_max
        ) * 100;
    },

    aplicarFatiga(
        combatiente,
        cantidad
    ) {

        if (!combatiente) {
            return 0;
        }

        const anterior =
            this.numero(
                combatiente.fatiga
            );

        combatiente.fatiga =
            Math.max(
                0,
                Math.min(
                    combatiente.fatiga_max,
                    anterior -
                    this.numero(cantidad)
                )
            );

        return anterior -
            combatiente.fatiga;
    },

    regenerarFatiga(
        combatiente
    ) {

        if (
            !combatiente ||
            combatiente.derrotado
        ) {

            return 0;
        }

        const anterior =
            this.numero(
                combatiente.fatiga
            );

        combatiente.fatiga =
            Math.min(
                combatiente.fatiga_max,
                anterior +
                this.configuracion
                    .fatiga_regeneracion_turno
            );

        return combatiente.fatiga -
            anterior;
    },

    obtenerCosteFatiga(
        codigo
    ) {

        const costes = {

            A001:
                this.configuracion
                    .coste_fatiga_A001,

            A002:
                this.configuracion
                    .coste_fatiga_A002,

            A003:
                this.configuracion
                    .coste_fatiga_A003,

            D001:
                this.configuracion
                    .coste_fatiga_D001
        };

        return costes[codigo] || 0;
    },

    aplicarFatigaAccion(
        atacante,
        codigo
    ) {

        const coste =
            this.obtenerCosteFatiga(
                codigo
            );

        const aplicada =
            this.aplicarFatiga(
                atacante,
                coste
            );

        return {

            coste:
                coste,

            aplicada:
                aplicada,

            fatiga_restante:
                atacante.fatiga,

            fatiga_porcentaje:
                this.obtenerFatigaPorcentaje(
                    atacante
                )
        };
    },

    /* ==================================================
       APLICAR EFECTO
    ================================================== */

    aplicarEfecto(
        atacante,
        objetivo,
        codigo
    ) {

        if (
            !codigo ||
            !window.PALARENA_STANDAR_EFECTOS
        ) {

            return null;
        }

        const base =
            window.PALARENA_STANDAR_EFECTOS
                .obtener(codigo);

        if (!base) {
            return null;
        }

        if (
            codigo === "E001"
        ) {

            const curacion =
                Math.round(
                    objetivo.hp_max *
                    (
                        base.potencia /
                        100
                    )
                );

            const hpAnterior =
                objetivo.hp;

            objetivo.hp =
                Math.min(
                    objetivo.hp_max,
                    objetivo.hp +
                    curacion
                );

            return {

                codigo:
                    codigo,

                nombre:
                    base.nombre,

                tipo:
                    "curacion",

                potencia:
                    objetivo.hp -
                    hpAnterior,

                duracion:
                    0
            };
        }

        const existente =
            this.obtenerEfecto(
                objetivo,
                codigo
            );

        if (existente) {

            existente.turnos =
                base.duracion;

            existente.potencia =
                base.potencia;

            return {

                codigo:
                    codigo,

                nombre:
                    base.nombre,

                tipo:
                    base.tipo,

                potencia:
                    base.potencia,

                duracion:
                    base.duracion,

                renovado:
                    true
            };
        }

        const efecto = {

            codigo:
                codigo,

            nombre:
                base.nombre,

            tipo:
                base.tipo,

            potencia:
                base.potencia,

            turnos:
                base.duracion
        };

        objetivo.efectos.push(
            efecto
        );

        return {

            codigo:
                codigo,

            nombre:
                base.nombre,

            tipo:
                base.tipo,

            potencia:
                base.potencia,

            duracion:
                base.duracion,

            renovado:
                false
        };
    },
       /* ==================================================
       PROCESAR EFECTOS
    ================================================== */

    procesarEfectos(
        combatiente
    ) {

        if (
            !combatiente ||
            !combatiente.efectos.length
        ) {

            return [];
        }

        const resultados = [];

        combatiente.efectos.forEach(
            function(efecto) {

                if (
                    efecto.codigo === "E005"
                ) {

                    const dano =
                        Number(
                            efecto.potencia
                        ) || 0;

                    combatiente.hp =
                        Math.max(
                            0,
                            combatiente.hp -
                            dano
                        );

                    resultados.push({

                        codigo:
                            efecto.codigo,

                        nombre:
                            efecto.nombre,

                        dano:
                            dano,

                        mensaje:
                            combatiente.nombre +
                            " recibe " +
                            dano +
                            " de daño progresivo."
                    });
                }

                efecto.turnos--;
            }
        );

        combatiente.efectos =
            combatiente.efectos.filter(
                function(efecto) {

                    return efecto.turnos > 0;
                }
            );

        if (
            combatiente.hp <= 0
        ) {

            combatiente.hp = 0;

            combatiente.derrotado =
                true;
        }

        return resultados;
    },

    /* ==================================================
       DEFENSA EFECTIVA
    ================================================== */

    obtenerDefensa(
        combatiente
    ) {

        let defensa =
            combatiente.efectivos.defensa;

        const efecto =
            this.obtenerEfecto(
                combatiente,
                "E003"
            );

        if (efecto) {

            defensa -=
                efecto.potencia;
        }

        return this.limitar(
            defensa
        );
    },

    /* ==================================================
       VELOCIDAD EFECTIVA
    ================================================== */

    obtenerVelocidad(
        combatiente
    ) {

        let velocidad =
            combatiente.efectivos.velocidad;

        const efecto =
            this.obtenerEfecto(
                combatiente,
                "E004"
            );

        if (efecto) {

            velocidad -=
                efecto.potencia;
        }

        return this.limitar(
            velocidad
        );
    },

    /* ==================================================
       TÁCTICA EFECTIVA
    ================================================== */

    obtenerTactica(
        combatiente
    ) {

        return this.limitar(
            combatiente.efectivos.tactica
        );
    },

    /* ==================================================
       INTELIGENCIA
       e11 = inteligencia
    ================================================== */

    obtenerInteligencia(
        combatiente
    ) {

        if (
            !combatiente
        ) {

            return 0;
        }

        return this.limitar(
            combatiente.stats.e11
        );
    },

    /* ==================================================
       ESQUIVA
    ================================================== */

    comprobarEsquiva(
        objetivo
    ) {

        let probabilidad =
            this.obtenerVelocidad(
                objetivo
            ) *
            this.configuracion
                .esquiva_velocidad;

        const efecto =
            this.obtenerEfecto(
                objetivo,
                "E002"
            );

        if (efecto) {

            probabilidad +=
                efecto.potencia;
        }

        probabilidad =
            Math.max(
                0,
                Math.min(
                    100,
                    probabilidad
                )
            );

        const dado =
            this.aleatorio(
                0,
                100
            );

        return {

            esquiva:
                dado < probabilidad,

            probabilidad:
                probabilidad,

            dado:
                dado
        };
    },

    /* ==================================================
       FALLO DE ATAQUE
    ================================================== */

    comprobarFallo(
        atacante
    ) {

        const tactica =
            this.obtenerTactica(
                atacante
            );

        let probabilidad =
            this.configuracion
                .fallo_base

            -

            (
                tactica *
                this.configuracion
                    .fallo_reduccion_tactica
            );

        probabilidad =
            Math.max(
                4,
                Math.min(
                    8,
                    probabilidad
                )
            );

        const dado =
            this.aleatorio(
                0,
                100
            );

        return {

            fallo:
                dado < probabilidad,

            probabilidad:
                probabilidad,

            dado:
                dado
        };
    },

    /* ==================================================
       ERROR DE DEFENSA
    ================================================== */

    comprobarDefensa(
        defensor
    ) {

        const inteligencia =
            this.obtenerInteligencia(
                defensor
            );

        const tactica =
            this.obtenerTactica(
                defensor
            );

        let probabilidad =
            this.configuracion
                .error_defensa_base;

        /*
           Inteligencia y táctica reducen
           la posibilidad de equivocarse.
        */

        probabilidad -=
            inteligencia *
            this.configuracion
                .error_defensa_reduccion_inteligencia;

        probabilidad -=
            tactica *
            this.configuracion
                .error_defensa_reduccion_tactica;

        /*
           El cansancio aumenta los errores.
        */

        const fatiga =
            this.obtenerFatigaPorcentaje(
                defensor
            );

        if (
            fatiga <
            this.configuracion
                .error_defensa_fatiga_umbral
        ) {

            probabilidad +=
                (
                    this.configuracion
                        .error_defensa_fatiga_umbral
                    -
                    fatiga
                ) *
                this.configuracion
                    .error_defensa_fatiga_incremento;
        }

        probabilidad =
            Math.max(
                this.configuracion
                    .error_defensa_min,

                Math.min(
                    this.configuracion
                        .error_defensa_max,

                    probabilidad
                )
            );

        const dado =
            this.aleatorio(
                0,
                100
            );

        const error =
            dado < probabilidad;

        return {

            error:
                error,

            acierto:
                !error,

            probabilidad_error:
                probabilidad,

            dado:
                dado
        };
    },

    /* ==================================================
       CRÍTICO
    ================================================== */

    comprobarCritico(
        atacante,
        ataque
    ) {

        if (
            !ataque.critico
        ) {

            return {

                critico:
                    false,

                probabilidad:
                    0,

                dado:
                    100,

                bloqueado_por_fatiga:
                    false
            };
        }

        const fatiga =
            this.obtenerFatigaPorcentaje(
                atacante
            );

        /*
           Por debajo del 40 % de fatiga
           no existen golpes críticos.
        */

        if (
            fatiga <
            this.configuracion
                .fatiga_minima_critico
        ) {

            return {

                critico:
                    false,

                probabilidad:
                    0,

                dado:
                    100,

                bloqueado_por_fatiga:
                    true
            };
        }

        let probabilidad =
            this.configuracion
                .critico_base;

        probabilidad +=
            this.obtenerTactica(
                atacante
            ) *
            this.configuracion
                .critico_tactica;

        const dado =
            this.aleatorio(
                0,
                100
            );

        return {

            critico:
                dado < probabilidad,

            probabilidad:
                probabilidad,

            dado:
                dado,

            bloqueado_por_fatiga:
                false
        };
    },

    /* ==================================================
       MULTIPLICADOR DE DAÑO SEGÚN VIDA
    ================================================== */

    obtenerMultiplicadorVida(
        objetivo
    ) {

        if (
            !objetivo ||
            objetivo.hp_max <= 0
        ) {

            return 1;
        }

        const porcentaje =
            (
                objetivo.hp /
                objetivo.hp_max
            ) * 100;

        if (
            porcentaje <= 10
        ) {

            return this.configuracion
                .dano_vida_critica;
        }

        if (
            porcentaje <= 25
        ) {

            return this.configuracion
                .dano_vida_10;
        }

        if (
            porcentaje <= 50
        ) {

            return this.configuracion
                .dano_vida_25;
        }

        if (
            porcentaje <= 75
        ) {

            return this.configuracion
                .dano_vida_50;
        }

        return this.configuracion
            .dano_vida_75;
    },

    /* ==================================================
       CALCULAR DAÑO
    ================================================== */

    calcularDano(
        atacante,
        objetivo,
        ataque
    ) {

        let dano =
            this.configuracion
                .dano_base

            +

            (
                atacante.efectivos.ataque *
                this.configuracion
                    .dano_por_ataque
            );

        dano *=
            ataque.potencia;

        const aumento =
            this.obtenerEfecto(
                atacante,
                "E007"
            );

        if (aumento) {

            dano *=
                1 +
                (
                    aumento.potencia /
                    100
                );
        }

        const defensa =
            this.obtenerDefensa(
                objetivo
            );

        dano *=
            1 -
            (
                defensa /
                this.configuracion
                    .defensa_divisor
            );

        const variacion =
            this.aleatorio(

                1 -
                this.configuracion
                    .variacion_dano,

                1 +
                this.configuracion
                    .variacion_dano
            );

        dano *=
            variacion;

        const critico =
            this.comprobarCritico(
                atacante,
                ataque
            );

        if (
            critico.critico
        ) {

            dano *=
                this.configuracion
                    .multiplicador_critico;
        }

        /*
           El daño aumenta progresivamente
           cuando la víctima está herida.
        */

        const multiplicadorVida =
            this.obtenerMultiplicadorVida(
                objetivo
            );

        dano *=
            multiplicadorVida;

        dano =
            Math.max(
                1,
                Math.round(dano)
            );

        return {

            dano:
                dano,

            critico:
                critico.critico,

            probabilidad_critico:
                critico.probabilidad,

            dado_critico:
                critico.dado,

            bloqueado_por_fatiga:
                critico.bloqueado_por_fatiga,

            defensa:
                defensa,

            multiplicador_vida:
                multiplicadorVida
        };
    },
       /* ==================================================
       DAÑO DE CONTRAATAQUE
       Se utiliza para la inversión de papeles.
       No genera una segunda defensa ni recursión.
    ================================================== */

    calcularDanoContraataque(
        atacante,
        objetivo
    ) {

        const ataque = {

            codigo:
                "A001",

            nombre:
                "Contraataque",

            tipo:
                "ataque",

            potencia:
                1.00,

            critico:
                true,

            efecto:
                null
        };

        let dano =
            this.configuracion
                .dano_base

            +

            (
                atacante.efectivos.ataque *
                this.configuracion
                    .dano_por_ataque
            );

        const variacion =
            this.aleatorio(

                1 -
                this.configuracion
                    .variacion_dano,

                1 +
                this.configuracion
                    .variacion_dano
            );

        dano *=
            variacion;

        const critico =
            this.comprobarCritico(
                atacante,
                ataque
            );

        if (
            critico.critico
        ) {

            dano *=
                this.configuracion
                    .multiplicador_critico;
        }

        const multiplicadorVida =
            this.obtenerMultiplicadorVida(
                objetivo
            );

        dano *=
            multiplicadorVida;

        dano =
            Math.max(
                1,
                Math.round(dano)
            );

        return {

            dano:
                dano,

            critico:
                critico.critico,

            probabilidad_critico:
                critico.probabilidad,

            dado_critico:
                critico.dado,

            multiplicador_vida:
                multiplicadorVida
        };
    },

    /* ==================================================
       EJECUTAR ATAQUE
    ================================================== */

    ejecutarAtaque(
        atacante,
        objetivo,
        codigo
    ) {

        if (
            !window.PALARENA_STANDAR_ATAQUES
        ) {

            return {

                tipo:
                    "error",

                mensaje:
                    "Falta standar-ataques.js."
            };
        }

        const ataque =
            window.PALARENA_STANDAR_ATAQUES
                .obtener(codigo);

        if (!ataque) {

            return {

                tipo:
                    "error",

                mensaje:
                    "Ataque no encontrado: " +
                    codigo
            };
        }

        /* ==============================================
           FATIGA DE LA ACCIÓN
        ============================================== */

        const fatigaAccion =
            this.aplicarFatigaAccion(
                atacante,
                codigo
            );

        /* ==============================================
           DEFENDER
        ============================================== */

        if (
            ataque.tipo === "defensa"
        ) {

            atacante.defendiendo =
                true;

            return {

                tipo:
                    "defensa",

                codigo:
                    ataque.codigo,

                nombre:
                    ataque.nombre,

                dano:
                    0,

                fatiga:
                    fatigaAccion,

                mensaje:
                    atacante.nombre +
                    " adopta una posición defensiva."
            };
        }

        /* ==============================================
           COSTE DEL ATAQUE POTENTE
        ============================================== */

        let costeHp = 0;

        if (
            ataque.codigo === "A002"
        ) {

            costeHp =
                Math.max(

                    1,

                    Math.round(

                        atacante.hp_max *
                        this.configuracion
                            .coste_ataque_potente_hp
                    )
                );
        }

        /*
           El coste del ataque potente se paga
           incluso si falla o es esquivado.
        */

        if (
            costeHp > 0
        ) {

            atacante.hp =
                Math.max(

                    1,

                    atacante.hp -
                    costeHp
                );

            if (
                atacante.hp <= 0
            ) {

                atacante.hp = 1;
            }
        }

        /* ==============================================
           FALLO DE ATAQUE
        ============================================== */

        const fallo =
            this.comprobarFallo(
                atacante
            );

        /*
           Si el objetivo estaba defendiendo,
           la defensa provoca cansancio al atacante
           aunque el ataque termine fallando.
        */

        let fatigaDefensa =
            null;

        if (
            objetivo.defendiendo
        ) {

            fatigaDefensa = {

                coste:
                    this.configuracion
                        .fatiga_defensa_atacante,

                aplicada:
                    this.aplicarFatiga(
                        atacante,
                        this.configuracion
                            .fatiga_defensa_atacante
                    ),

                fatiga_restante:
                    atacante.fatiga
            };
        }

        if (
            fallo.fallo
        ) {

            /*
               Si el ataque falla contra una defensa activa,
               se comprueba la defensa.

               Defensa acertada + fallo de ataque =
               inversión de papeles y contraataque.
            */

            if (
                objetivo.defendiendo
            ) {

                const defensa =
                    this.comprobarDefensa(
                        objetivo
                    );

                if (
                    defensa.acierto
                ) {

                    const contraataque =
                        this.calcularDanoContraataque(
                            objetivo,
                            atacante
                        );

                    const danoContra =
                        contraataque.dano;

                    atacante.hp =
                        Math.max(
                            0,
                            atacante.hp -
                            danoContra
                        );

                    if (
                        atacante.hp <= 0
                    ) {

                        atacante.hp = 0;

                        atacante.derrotado =
                            true;
                    }

                    return {

                        tipo:
                            "ataque",

                        codigo:
                            ataque.codigo,

                        nombre:
                            ataque.nombre,

                        dano:
                            0,

                        fallo:
                            true,

                        esquiva:
                            false,

                        critico:
                            false,

                        coste_hp:
                            costeHp,

                        fatiga:
                            fatigaAccion,

                        fatiga_defensa:
                            fatigaDefensa,

                        probabilidad_fallo:
                            fallo.probabilidad,

                        dado_fallo:
                            fallo.dado,

                        defensa_acierto:
                            true,

                        fallo_defensa:
                            false,

                        probabilidad_error_defensa:
                            defensa.probabilidad_error,

                        dado_defensa:
                            defensa.dado,

                        inversion:
                            true,

                        contraataque:
                            true,

                        dano_contraataque:
                            danoContra,

                        critico_contraataque:
                            contraataque.critico,

                        hp_restante:
                            objetivo.hp,

                        hp_restante_atacante:
                            atacante.hp,

                        mensaje:
                            objetivo.nombre +
                            " bloquea el ataque y contraataca."
                    };
                }

                /*
                   Si también falla la defensa,
                   el ataque simplemente ha fallado.
                */

                return {

                    tipo:
                        "ataque",

                    codigo:
                        ataque.codigo,

                    nombre:
                        ataque.nombre,

                    dano:
                        0,

                    fallo:
                        true,

                    esquiva:
                        false,

                    critico:
                        false,

                    coste_hp:
                        costeHp,

                    fatiga:
                        fatigaAccion,

                    fatiga_defensa:
                        fatigaDefensa,

                    probabilidad_fallo:
                        fallo.probabilidad,

                    dado_fallo:
                        fallo.dado,

                    defensa_acierto:
                        false,

                    fallo_defensa:
                        true,

                    mensaje:
                        atacante.nombre +
                        " falla el ataque y " +
                        objetivo.nombre +
                        " comete un error defensivo."
                };
            }

            return {

                tipo:
                    "ataque",

                codigo:
                    ataque.codigo,

                nombre:
                    ataque.nombre,

                dano:
                    0,

                fallo:
                    true,

                esquiva:
                    false,

                critico:
                    false,

                coste_hp:
                    costeHp,

                fatiga:
                    fatigaAccion,

                probabilidad_fallo:
                    fallo.probabilidad,

                dado_fallo:
                    fallo.dado,

                mensaje:
                    atacante.nombre +
                    " falla el ataque."
            };
        }

        /* ==============================================
           ESQUIVA
        ============================================== */

        const esquiva =
            this.comprobarEsquiva(
                objetivo
            );

        if (
            esquiva.esquiva
        ) {

            return {

                tipo:
                    "ataque",

                codigo:
                    ataque.codigo,

                nombre:
                    ataque.nombre,

                dano:
                    0,

                fallo:
                    false,

                esquiva:
                    true,

                critico:
                    false,

                coste_hp:
                    costeHp,

                fatiga:
                    fatigaAccion,

                fatiga_defensa:
                    fatigaDefensa,

                probabilidad_esquiva:
                    esquiva.probabilidad,

                dado_esquiva:
                    esquiva.dado,

                mensaje:
                    objetivo.nombre +
                    " esquiva el ataque."
            };
        }

        /* ==============================================
           CALCULAR DAÑO
        ============================================== */

        const resultado =
            this.calcularDano(
                atacante,
                objetivo,
                ataque
            );

        let dano =
            resultado.dano;

        /* ==============================================
           DEFENSA ACTIVA
        ============================================== */

        let defensaResultado =
            null;

        if (
            objetivo.defendiendo
        ) {

            defensaResultado =
                this.comprobarDefensa(
                    objetivo
                );

            /*
               ERROR DE DEFENSA + CRÍTICO =
               GOLPE MORTAL.
            */

            if (
                defensaResultado.error &&
                resultado.critico &&
                this.configuracion
                    .golpe_mortal
            ) {

                const hpAnterior =
                    objetivo.hp;

                objetivo.hp = 0;

                objetivo.derrotado =
                    true;

                return {

                    tipo:
                        "ataque",

                    codigo:
                        ataque.codigo,

                    nombre:
                        ataque.nombre,

                    dano:
                        hpAnterior,

                    dano_base:
                        resultado.dano,

                    fallo:
                        false,

                    esquiva:
                        false,

                    critico:
                        true,

                    golpe_mortal:
                        true,

                    coste_hp:
                        costeHp,

                    fatiga:
                        fatigaAccion,

                    fatiga_defensa:
                        fatigaDefensa,

                    defensa_acierto:
                        false,

                    fallo_defensa:
                        true,

                    probabilidad_error_defensa:
                        defensaResultado
                            .probabilidad_error,

                    dado_defensa:
                        defensaResultado.dado,

                    multiplicador_vida:
                        resultado
                            .multiplicador_vida,

                    hp_restante:
                        0,

                    mensaje:
                        atacante.nombre +
                        " consigue un GOLPE MORTAL."
                };
            }

            /*
               Defensa acertada:
               reducción fuerte del daño.
            */

            if (
                defensaResultado.acierto
            ) {

                dano =
                    Math.max(

                        1,

                        Math.round(

                            dano *
                            this.configuracion
                                .reduccion_defensa
                        )
                    );
            }
        }

        /* ==============================================
           APLICAR DAÑO
        ============================================== */

        objetivo.hp =
            Math.max(

                0,

                objetivo.hp -
                dano
            );

        if (
            objetivo.hp <= 0
        ) {

            objetivo.hp = 0;

            objetivo.derrotado =
                true;
        }

        /* ==============================================
           EFECTO
        ============================================== */

        let efecto = null;

        if (
            ataque.efecto &&
            !objetivo.derrotado
        ) {

            let codigoEfecto =
                ataque.efecto;

            if (
                codigoEfecto ===
                "E00X"
            ) {

                codigoEfecto =
                    this.obtenerEfectoPerfil(
                        atacante
                    );
            }

            if (codigoEfecto) {

                efecto =
                    this.aplicarEfecto(
                        atacante,
                        objetivo,
                        codigoEfecto
                    );
            }
        }

        return {

            tipo:
                "ataque",

            codigo:
                ataque.codigo,

            nombre:
                ataque.nombre,

            dano:
                dano,

            dano_base:
                resultado.dano,

            fallo:
                false,

            critico:
                resultado.critico,

            esquiva:
                false,

            defensa:
                resultado.defensa,

            defensa_acierto:
                defensaResultado
                    ? defensaResultado.acierto
                    : false,

            fallo_defensa:
                defensaResultado
                    ? defensaResultado.error
                    : false,

            probabilidad_error_defensa:
                defensaResultado
                    ? defensaResultado
                        .probabilidad_error
                    : 0,

            dado_defensa:
                defensaResultado
                    ? defensaResultado.dado
                    : 100,

            golpe_mortal:
                false,

            inversion:
                false,

            contraataque:
                false,

            efecto:
                efecto,

            coste_hp:
                costeHp,

            fatiga:
                fatigaAccion,

            fatiga_defensa:
                fatigaDefensa,

            multiplicador_vida:
                resultado
                    .multiplicador_vida,

            hp_restante:
                objetivo.hp
        };
    },
       /* ==================================================
       EFECTO SEGÚN PERFIL
    ================================================== */

    obtenerEfectoPerfil(
        combatiente
    ) {

        const efectos = {

            agresivo:
                "E007",

            defensivo:
                "E003",

            rapido:
                "E002",

            aguante:
                "E005",

            tactico:
                "E006",

            equilibrado:
                "E006"
        };

        return efectos[
            combatiente.perfil
        ] || "E006";
    },

    /* ==================================================
       IA
       Inteligencia = variedad y adaptación.
       Táctica = calidad de la decisión.
    ================================================== */

    decidirAccion(
        combatiente,
        objetivo
    ) {

        const hpPorcentaje =
            (
                combatiente.hp /
                combatiente.hp_max
            ) * 100;

        const fatiga =
            this.obtenerFatigaPorcentaje(
                combatiente
            );

        const inteligencia =
            this.obtenerInteligencia(
                combatiente
            );

        const tactica =
            this.obtenerTactica(
                combatiente
            );

        const ataque =
            this.limitar(
                combatiente.efectivos.ataque
            );

        const defensa =
            this.limitar(
                combatiente.efectivos.defensa
            );

        const velocidad =
            this.limitar(
                combatiente.efectivos.velocidad
            );

        const resistencia =
            this.limitar(
                combatiente.efectivos.resistencia
            );

        let hpObjetivo =
            100;

        let fatigaObjetivo =
            100;

        if (objetivo) {

            hpObjetivo =
                (
                    objetivo.hp /
                    objetivo.hp_max
                ) * 100;

            fatigaObjetivo =
                this.obtenerFatigaPorcentaje(
                    objetivo
                );
        }

        /*
           Puntuaciones base.
           La IA no elige únicamente por azar.
        */

        const puntuaciones = {

            A001:
                50,

            A002:
                30,

            A003:
                25,

            D001:
                20
        };

        /* ==============================================
           A001 — ATAQUE BÁSICO
        ============================================== */

        puntuaciones.A001 +=
            ataque * 0.25;

        puntuaciones.A001 +=
            velocidad * 0.10;

        /*
           Es una opción estable cuando hay
           poca inteligencia o pocos recursos.
        */

        if (
            inteligencia < 40
        ) {

            puntuaciones.A001 +=
                18;
        }

        /* ==============================================
           A002 — ATAQUE POTENTE
        ============================================== */

        puntuaciones.A002 +=
            ataque * 0.35;

        puntuaciones.A002 +=
            tactica * 0.15;

        /*
           Es más atractivo cuando el rival
           está debilitado.
        */

        if (
            hpObjetivo <= 50
        ) {

            puntuaciones.A002 +=
                18;
        }

        if (
            hpObjetivo <= 25
        ) {

            puntuaciones.A002 +=
                12;
        }

        /*
           Pero es peligroso con poca vida propia.
        */

        if (
            hpPorcentaje <= 50
        ) {

            puntuaciones.A002 -=
                20;
        }

        if (
            hpPorcentaje <= 25
        ) {

            puntuaciones.A002 -=
                25;
        }

        /*
           También consume mucha fatiga.
        */

        if (
            fatiga < 40
        ) {

            puntuaciones.A002 -=
                25;
        }

        /* ==============================================
           A003 — ATAQUE TÁCTICO
        ============================================== */

        puntuaciones.A003 +=
            tactica * 0.40;

        puntuaciones.A003 +=
            inteligencia * 0.30;

        /*
           Mayor interés cuando todavía existe
           suficiente fatiga para actuar con calidad.
        */

        if (
            fatiga >= 60
        ) {

            puntuaciones.A003 +=
                8;
        }

        /*
           Si ya existe un efecto útil en el objetivo,
           reduce su prioridad para evitar repetición.
        */

        if (
            objetivo &&
            this.obtenerEfecto(
                objetivo,
                this.obtenerEfectoPerfil(
                    combatiente
                )
            )
        ) {

            puntuaciones.A003 -=
                12;
        }

        /* ==============================================
           D001 — DEFENSA
        ============================================== */

        puntuaciones.D001 +=
            defensa * 0.45;

        puntuaciones.D001 +=
            resistencia * 0.20;

        /*
           La defensa gana mucho valor con poca vida.
        */

        if (
            hpPorcentaje <= 75
        ) {

            puntuaciones.D001 +=
                12;
        }

        if (
            hpPorcentaje <= 50
        ) {

            puntuaciones.D001 +=
                22;
        }

        if (
            hpPorcentaje <= 25
        ) {

            puntuaciones.D001 +=
                35;
        }

        /*
           Con poca fatiga defender es una opción
           especialmente eficiente.
        */

        if (
            fatiga < 20
        ) {

            puntuaciones.D001 +=
                30;
        }

        /*
           Si el rival tiene un ataque fuerte,
           la defensa gana valor.
        */

        if (
            objetivo &&
            objetivo.efectivos.ataque >= 70
        ) {

            puntuaciones.D001 +=
                18;
        }

        /*
           Si el rival está casi derrotado,
           hay menos necesidad de defender.
        */

        if (
            hpObjetivo <= 20
        ) {

            puntuaciones.D001 -=
                15;
        }

        /* ==============================================
           INTELIGENCIA
        ============================================== */

        /*
           Con inteligencia baja se favorecen
           opciones conservadoras y previsibles.
        */

        if (
            inteligencia <= 39
        ) {

            puntuaciones.A001 +=
                20;

            puntuaciones.A002 -=
                8;

            puntuaciones.A003 -=
                12;
        }

        /*
           Inteligencia media-baja:
           algo de variedad, pero todavía conservadora.
        */

        else if (
            inteligencia <= 59
        ) {

            puntuaciones.A001 +=
                8;

            puntuaciones.A003 -=
                3;
        }

        /*
           Inteligencia alta:
           considera más alternativas.
        */

        else if (
            inteligencia >= 80
        ) {

            puntuaciones.A003 +=
                10;

            puntuaciones.A002 +=
                5;
        }

        /*
           Evita acciones absurdas.
           Si la vida es crítica, la defensa conserva
           una prioridad mínima.
        */

        if (
            hpPorcentaje <= 15
        ) {

            puntuaciones.D001 +=
                20;

            puntuaciones.A002 -=
                20;
        }

        /*
           La IA no utiliza acciones imposibles.
        */

        const disponibles = [
            "A001",
            "A002",
            "A003",
            "D001"
        ];

        /*
           Temperatura de decisión:
           poca inteligencia = poca variación.
           mucha inteligencia = mayor variedad.
        */

        const temperatura =
            0.05 +
            (
                inteligencia /
                100
            ) * 0.35;

        const candidatos =
            disponibles.map(
                function(codigo) {

                    const ruido =
                        (
                            Math.random() -
                            0.5
                        ) *
                        100 *
                        temperatura;

                    return {

                        codigo:
                            codigo,

                        puntuacion:
                            puntuaciones[codigo] +
                            ruido
                    };
                }
            );

        candidatos.sort(
            function(a, b) {

                return b.puntuacion -
                    a.puntuacion;
            }
        );

        /*
           Con inteligencia baja se tiende claramente
           hacia la mejor opción.
           Con inteligencia alta se permite mayor
           diversidad entre las mejores opciones.
        */

        const mejor =
            candidatos[0];

        const segunda =
            candidatos[1];

        if (
            segunda &&
            inteligencia >= 70
        ) {

            const diferencia =
                mejor.puntuacion -
                segunda.puntuacion;

            const umbral =
                8 +
                (
                    inteligencia -
                    70
                ) * 0.20;

            if (
                diferencia < umbral &&
                Math.random() <
                (
                    inteligencia /
                    140
                )
            ) {

                return segunda.codigo;
            }
        }

        return mejor.codigo;
    },

    /* ==================================================
       EJECUTAR ACCIÓN
    ================================================== */

    ejecutarAccion(
        atacante,
        objetivo,
        accion
    ) {

        /*
           La defensa del turno anterior deja de estar
           activa cuando el combatiente realiza una
           nueva acción.
        */

        atacante.defendiendo =
            false;

        return this.ejecutarAtaque(
            atacante,
            objetivo,
            accion
        );
    },

    /* ==================================================
       FINALIZAR COMBATE
    ================================================== */

    finalizar(
        combate,
        ganador
    ) {

        combate.estado =
            "finalizado";

        combate.ganador =
            ganador.codigo;

        combate.perdedor =
            (
                combate.combatiente1.codigo ===
                ganador.codigo
            )

                ?

                combate.combatiente2.codigo

                :

                combate.combatiente1.codigo;

        ganador.derrotado =
            false;
    },

    /* ==================================================
       DESEMPATE POR LÍMITE
    ================================================== */

    finalizarPorLimite(
        combate
    ) {

        const c1 =
            combate.combatiente1;

        const c2 =
            combate.combatiente2;

        let ganador;

        if (
            c1.hp >
            c2.hp
        ) {

            ganador =
                c1;
        }

        else if (
            c2.hp >
            c1.hp
        ) {

            ganador =
                c2;
        }

        else if (
            c1.efectivos.resistencia >
            c2.efectivos.resistencia
        ) {

            ganador =
                c1;
        }

        else if (
            c2.efectivos.resistencia >
            c1.efectivos.resistencia
        ) {

            ganador =
                c2;
        }

        else if (
            c1.efectivos.tactica >
            c2.efectivos.tactica
        ) {

            ganador =
                c1;
        }

        else if (
            c2.efectivos.tactica >
            c1.efectivos.tactica
        ) {

            ganador =
                c2;
        }

        else {

            ganador =
                Math.random() < 0.5
                    ? c1
                    : c2;
        }

        this.finalizar(
            combate,
            ganador
        );
    },
       /* ==================================================
       EJECUTAR TURNO
    ================================================== */

    ejecutarTurno(
        combate
    ) {

        if (
            !combate ||
            combate.estado ===
            "finalizado"
        ) {

            return null;
        }

        if (
            combate.turno >
            this.configuracion
                .max_turnos
        ) {

            this.finalizarPorLimite(
                combate
            );

            return null;
        }

        const primero =
            this.obtenerCombatiente(
                combate,
                combate.primero
            );

        const segundo =
            this.obtenerCombatiente(
                combate,
                combate.segundo
            );

        const turnoActual =
            combate.turno;

        /* ==========================================
           PROCESAR EFECTOS
        ========================================== */

        const efectosPrimero =
            this.procesarEfectos(
                primero
            );

        const efectosSegundo =
            this.procesarEfectos(
                segundo
            );

        if (
            primero.derrotado
        ) {

            this.finalizar(
                combate,
                segundo
            );

            return {

                turno:
                    turnoActual,

                efectosPrimero:
                    efectosPrimero,

                efectosSegundo:
                    efectosSegundo,

                ganador:
                    segundo.codigo
            };
        }

        if (
            segundo.derrotado
        ) {

            this.finalizar(
                combate,
                primero
            );

            return {

                turno:
                    turnoActual,

                efectosPrimero:
                    efectosPrimero,

                efectosSegundo:
                    efectosSegundo,

                ganador:
                    primero.codigo
            };
        }

        /* ==========================================
           ACCIÓN DEL PRIMERO
        ========================================== */

        const accionPrimero =
            this.decidirAccion(
                primero,
                segundo
            );

        const resultadoPrimero =
            this.ejecutarAccion(
                primero,
                segundo,
                accionPrimero
            );

        const registroPrimero = {

            turno:
                turnoActual,

            codigo_atacante:
                primero.codigo,

            atacante:
                primero.nombre,

            codigo_objetivo:
                segundo.codigo,

            objetivo:
                segundo.nombre,

            accion:
                accionPrimero,

            resultado:
                resultadoPrimero
        };

        combate.historial.push(
            registroPrimero
        );

        if (
            segundo.derrotado
        ) {

            this.finalizar(
                combate,
                primero
            );

            return registroPrimero;
        }

        /* ==========================================
           ACCIÓN DEL SEGUNDO
        ========================================== */

        const accionSegundo =
            this.decidirAccion(
                segundo,
                primero
            );

        const resultadoSegundo =
            this.ejecutarAccion(
                segundo,
                primero,
                accionSegundo
            );

        const registroSegundo = {

            turno:
                turnoActual,

            codigo_atacante:
                segundo.codigo,

            atacante:
                segundo.nombre,

            codigo_objetivo:
                primero.codigo,

            objetivo:
                primero.nombre,

            accion:
                accionSegundo,

            resultado:
                resultadoSegundo
        };

        combate.historial.push(
            registroSegundo
        );

        if (
            primero.derrotado
        ) {

            this.finalizar(
                combate,
                segundo
            );

            return {

                primero:
                    registroPrimero,

                segundo:
                    registroSegundo
            };
        }

        /* ==========================================
           REGENERACIÓN DE FATIGA
        ========================================== */

        const regeneracionPrimero =
            this.regenerarFatiga(
                primero
            );

        const regeneracionSegundo =
            this.regenerarFatiga(
                segundo
            );

        /*
           La defensa solo dura durante el turno
           en el que se activó.
        */

        primero.defendiendo =
            false;

        segundo.defendiendo =
            false;

        combate.turno++;

        return {

            turno:
                turnoActual,

            primero:
                registroPrimero,

            segundo:
                registroSegundo,

            regeneracion_fatiga: {

                primero:
                    regeneracionPrimero,

                segundo:
                    regeneracionSegundo
            },

            estado:
                combate.estado
        };
    },

    /* ==================================================
       EJECUTAR COMBATE COMPLETO
    ================================================== */

    ejecutarCombate(
        ficha1,
        ficha2,
        reglas
    ) {

        const combate =
            this.crearCombate(
                ficha1,
                ficha2,
                reglas
            );

        if (!combate) {
            return null;
        }

        while (
            combate.estado !==
            "finalizado"
        ) {

            this.ejecutarTurno(
                combate
            );
        }

        return combate;
    },

    /* ==================================================
       RESUMEN
    ================================================== */

    obtenerResumen(
        combate
    ) {

        if (!combate) {
            return null;
        }

        return {

            estado:
                combate.estado,

            turno:
                combate.turno,

            ganador:
                combate.ganador,

            perdedor:
                combate.perdedor,

            combatiente1: {

                codigo:
                    combate.combatiente1.codigo,

                nombre:
                    combate.combatiente1.nombre,

                hp:
                    combate.combatiente1.hp,

                hp_max:
                    combate.combatiente1.hp_max,

                fatiga:
                    combate.combatiente1.fatiga,

                fatiga_max:
                    combate.combatiente1.fatiga_max,

                dominante:
                    combate.combatiente1.dominante,

                perfil:
                    combate.combatiente1.perfil,

                factor_imprevisible:
                    combate.combatiente1
                        .factor_imprevisible,

                coeficiente_combate:
                    combate.combatiente1
                        .coeficiente_combate,

                defendiendo:
                    combate.combatiente1
                        .defendiendo
            },

            combatiente2: {

                codigo:
                    combate.combatiente2.codigo,

                nombre:
                    combate.combatiente2.nombre,

                hp:
                    combate.combatiente2.hp,

                hp_max:
                    combate.combatiente2.hp_max,

                fatiga:
                    combate.combatiente2.fatiga,

                fatiga_max:
                    combate.combatiente2.fatiga_max,

                dominante:
                    combate.combatiente2.dominante,

                perfil:
                    combate.combatiente2.perfil,

                factor_imprevisible:
                    combate.combatiente2
                        .factor_imprevisible,

                coeficiente_combate:
                    combate.combatiente2
                        .coeficiente_combate,

                defendiendo:
                    combate.combatiente2
                        .defendiendo
            },

            acciones:
                combate.historial.length
        };
    }
};

/* ======================================================
   EXPORTACIONES
====================================================== */

window.crearCombatienteEstandar =
    function(
        ficha,
        reglas
    ) {

        return window.PALARENA_STANDAR
            .crearCombatiente(
                ficha,
                reglas
            );
    };

window.crearCombateEstandar =
    function(
        ficha1,
        ficha2,
        reglas
    ) {

        return window.PALARENA_STANDAR
            .crearCombate(
                ficha1,
                ficha2,
                reglas
            );
    };

window.ejecutarTurnoEstandar =
    function(
        combate
    ) {

        return window.PALARENA_STANDAR
            .ejecutarTurno(
                combate
            );
    };

window.ejecutarCombateEstandar =
    function(
        ficha1,
        ficha2,
        reglas
    ) {

        return window.PALARENA_STANDAR
            .ejecutarCombate(
                ficha1,
                ficha2,
                reglas
            );
    };

window.obtenerResumenEstandar =
    function(
        combate
    ) {

        return window.PALARENA_STANDAR
            .obtenerResumen(
                combate
            );
    };

/* ======================================================
   FIN STANDAR.JS v1.2
====================================================== */
