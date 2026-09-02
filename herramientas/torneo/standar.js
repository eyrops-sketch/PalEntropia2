/* ========================================================
   PALARENA standar.js v1.1
   PalEntropía
   MOTOR DE COMBATE ESTÁNDAR
======================================================== */

window.PALARENA_STANDAR = {

    version: "1.1",

    configuracion: {

        hp_base: 100,

        bonificacion_dominante: 0.15,

        /* ==============================================
           FACTOR IMPREVISIBLE
        ============================================== */

        factor_imprevisible_min: 0.92,
        factor_imprevisible_max: 1.08,

        iniciativa_velocidad: 0.70,
        iniciativa_tactica: 0.30,

        dano_base: 10,
        dano_por_ataque: 0.20,

        defensa_divisor: 200,

        variacion_dano: 0.10,

        multiplicador_critico: 1.50,

        critico_base: 5,
        critico_tactica: 0.10,

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

        reduccion_defensa: 0.50,

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


        const maximo = Math.max(
            ...atributos.map(
                function(item) {

                    return item.valor;
                }
            )
        );


        let candidatos =
            atributos.filter(
                function(item) {

                    return item.valor === maximo;
                }
            );


        if (candidatos.length > 1) {

            const tactica =
                candidatos.find(
                    function(item) {

                        return item.atributo ===
                            "tactica";
                    }
                );


            if (tactica) {

                candidatos = [tactica];
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

            ataque: "agresivo",

            defensa: "defensivo",

            velocidad: "rapido",

            resistencia: "aguante",

            tactica: "tactico"
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
        factor
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

        efectivos[dominante.atributo] =
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
           Después se aplica el factor
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

    crearCombatiente(ficha) {

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
           factor imprevisible al comenzar
           el combate.
        */

        const factor =
            this.obtenerFactorImprevisible();


        const efectivos =
            this.obtenerEfectivos(
                indicadores,
                dominante,
                factor
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


            perfil: perfil,

            /*
               Guardamos el factor para que
               forme parte del estado del combate.
            */

            factor_imprevisible:
                factor,


            hp: hpMax,

            hp_max: hpMax,

            iniciativa: iniciativa,

            ataques: [],

            efectos: [],

            defendiendo: false,

            derrotado: false
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

    crearCombate(ficha1, ficha2) {

        const combatiente1 =
            this.crearCombatiente(
                ficha1
            );


        const combatiente2 =
            this.crearCombatiente(
                ficha2
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

            primero = combatiente1;
            segundo = combatiente2;

        }

        else if (
            combatiente2.iniciativa >
            combatiente1.iniciativa
        ) {

            primero = combatiente2;
            segundo = combatiente1;

        }

        else {

            if (
                Math.random() < 0.5
            ) {

                primero = combatiente1;
                segundo = combatiente2;

            }

            else {

                primero = combatiente2;
                segundo = combatiente1;
            }
        }


        return {

            estado: "combate",

            turno: 1,

            primero:
                primero.codigo,

            segundo:
                segundo.codigo,

            combatiente1:
                combatiente1,

            combatiente2:
                combatiente2,

            historial: [],

            ganador: null,

            perdedor: null
        };
    },


    /* ==================================================
       BUSCAR COMBATIENTE
    ================================================== */

    obtenerCombatiente(combate, codigo) {

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

    obtenerEfecto(combatiente, codigo) {

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


        if (codigo === "E001") {

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

                codigo: codigo,

                nombre: base.nombre,

                tipo: "curacion",

                potencia:
                    objetivo.hp -
                    hpAnterior,

                duracion: 0
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


        objetivo.efectos.push(
            efecto
        );


        return {

            codigo: codigo,

            nombre: base.nombre,

            tipo: base.tipo,

            potencia: base.potencia,

            duracion: base.duracion,

            renovado: false
        };
    },


    /* ==================================================
       PROCESAR EFECTOS
    ================================================== */

    procesarEfectos(combatiente) {

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

                        dano: dano,

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

    obtenerDefensa(combatiente) {

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

    obtenerVelocidad(combatiente) {

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

    obtenerTactica(combatiente) {

        return this.limitar(

            combatiente.efectivos.tactica
        );
    },


    /* ==================================================
       ESQUIVA
    ================================================== */

    comprobarEsquiva(objetivo) {

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

    comprobarFallo(atacante) {

        /*
           La táctica reduce la posibilidad
           de cometer un fallo.

           Con 0 de táctica:
           8 % de fallo.

           Con 100 de táctica:
           aproximadamente 4 %.
        */

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

                critico: false,

                probabilidad: 0,

                dado: 100
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
                dado
        };
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


        dano =
            Math.max(

                1,

                Math.round(dano)
            );


        return {

            dano: dano,

            critico:
                critico.critico,

            probabilidad_critico:
                critico.probabilidad,

            dado_critico:
                critico.dado,

            defensa:
                defensa
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

                tipo: "error",

                mensaje:
                    "Falta standar-ataques.js."
            };
        }


        const ataque =
            window.PALARENA_STANDAR_ATAQUES
                .obtener(codigo);


        if (!ataque) {

            return {

                tipo: "error",

                mensaje:
                    "Ataque no encontrado: " +
                    codigo
            };
        }


        /* ==============================================
           DEFENDER
        ============================================== */

        if (
            ataque.tipo === "defensa"
        ) {

            atacante.defendiendo =
                true;


            return {

                tipo: "defensa",

                codigo:
                    ataque.codigo,

                nombre:
                    ataque.nombre,

                dano: 0,

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


        /* ==============================================
           FALLO
        ============================================== */

        const fallo =
            this.comprobarFallo(
                atacante
            );


        /*
           El coste del ataque potente se paga
           incluso si el ataque falla.
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


        if (
            fallo.fallo
        ) {

            return {

                tipo: "ataque",

                codigo:
                    ataque.codigo,

                nombre:
                    ataque.nombre,

                dano: 0,

                fallo: true,

                esquiva: false,

                critico: false,

                coste_hp: costeHp,

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

                tipo: "ataque",

                codigo:
                    ataque.codigo,

                nombre:
                    ataque.nombre,

                dano: 0,

                fallo: false,

                esquiva: true,

                critico: false,

                coste_hp: costeHp,

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
           DEFENDER
        ============================================== */

        if (
            objetivo.defendiendo
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

            tipo: "ataque",

            codigo:
                ataque.codigo,

            nombre:
                ataque.nombre,

            dano: dano,

            fallo: false,

            critico:
                resultado.critico,

            esquiva: false,

            defensa:
                resultado.defensa,

            efecto: efecto,

            coste_hp: costeHp,

            hp_restante:
                objetivo.hp
        };
    },
    /* ==================================================
   EFECTO SEGÚN PERFIL
================================================== */

    obtenerEfectoPerfil(combatiente) {

        const efectos = {

            agresivo: "E007",

            defensivo: "E003",

            rapido: "E002",

            aguante: "E005",

            tactico: "E006",

            equilibrado: "E006"
        };


        return efectos[
            combatiente.perfil
        ] || "E006";
    },


/* ==================================================
   IA
================================================== */

    decidirAccion(combatiente) {

        const hpPorcentaje =

            (
                combatiente.hp /
                combatiente.hp_max
            ) * 100;


        const tactica =
            this.obtenerTactica(
                combatiente
            );


        const dado =
            this.enteroAleatorio(
                1,
                100
            );


        /*
           Si tiene muy poca vida,
           aumenta la posibilidad de defender.
        */

        if (
            hpPorcentaje <= 25 &&
            dado <= 30
        ) {

            return "D001";
        }


        /*
           Táctica alta:
           utiliza con mayor frecuencia
           el ataque táctico.
        */

        if (
            tactica >= 70
        ) {

            if (dado <= 40) {

                return "A003";
            }


            if (dado <= 65) {

                return "A002";
            }


            return "A001";
        }


        /*
           Táctica media:
           comportamiento equilibrado.
        */

        if (
            tactica >= 40
        ) {

            if (dado <= 25) {

                return "A003";
            }


            if (dado <= 55) {

                return "A002";
            }


            if (dado <= 90) {

                return "A001";
            }


            return "D001";
        }


        /*
           Táctica baja:
           comportamiento más directo,
           pero sin abusar del ataque potente.
        */

        if (
            dado <= 60
        ) {

            return "A001";
        }


        if (
            dado <= 90
        ) {

            return "A002";
        }


        return "D001";
    },


/* ==================================================
   EJECUTAR ACCIÓN
================================================== */

    ejecutarAccion(
        atacante,
        objetivo,
        accion
    ) {

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

    finalizarPorLimite(combate) {

        const c1 =
            combate.combatiente1;


        const c2 =
            combate.combatiente2;


        let ganador;


        if (
            c1.hp >
            c2.hp
        ) {

            ganador = c1;

        }

        else if (
            c2.hp >
            c1.hp
        ) {

            ganador = c2;

        }

        else if (
            c1.efectivos.resistencia >
            c2.efectivos.resistencia
        ) {

            ganador = c1;

        }

        else if (
            c2.efectivos.resistencia >
            c1.efectivos.resistencia
        ) {

            ganador = c2;

        }

        else if (
            c1.efectivos.tactica >
            c2.efectivos.tactica
        ) {

            ganador = c1;

        }

        else if (
            c2.efectivos.tactica >
            c1.efectivos.tactica
        ) {

            ganador = c2;

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

    ejecutarTurno(combate) {

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

                primero
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

                segundo
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

            estado:
                combate.estado
        };
    },


/* ==================================================
   EJECUTAR COMBATE COMPLETO
================================================== */

    ejecutarCombate(
        ficha1,
        ficha2
    ) {

        const combate =
            this.crearCombate(

                ficha1,

                ficha2
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

    obtenerResumen(combate) {

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

                dominante:
                    combate.combatiente1.dominante,

                perfil:
                    combate.combatiente1.perfil,

                factor_imprevisible:
                    combate.combatiente1
                        .factor_imprevisible
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

                dominante:
                    combate.combatiente2.dominante,

                perfil:
                    combate.combatiente2.perfil,

                factor_imprevisible:
                    combate.combatiente2
                        .factor_imprevisible
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

    function(ficha) {

        return window.PALARENA_STANDAR
            .crearCombatiente(
                ficha
            );
    };


window.crearCombateEstandar =

    function(
        ficha1,
        ficha2
    ) {

        return window.PALARENA_STANDAR
            .crearCombate(

                ficha1,

                ficha2
            );
    };


window.ejecutarTurnoEstandar =

    function(combate) {

        return window.PALARENA_STANDAR
            .ejecutarTurno(
                combate
            );
    };


window.ejecutarCombateEstandar =

    function(
        ficha1,
        ficha2
    ) {

        return window.PALARENA_STANDAR
            .ejecutarCombate(

                ficha1,

                ficha2
            );
    };


window.obtenerResumenEstandar =

    function(combate) {

        return window.PALARENA_STANDAR
            .obtenerResumen(
                combate
            );
    };


/* ======================================================
   FIN STANDAR.JS v1.1
====================================================== */
