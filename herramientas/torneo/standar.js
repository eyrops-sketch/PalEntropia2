/*
========================================================
PALARENA
standar.js v1.0
PalEntropía

Creación del combatiente para el combate estándar.

master.csv
    ↓
e1-e11
    ↓
PALARENA_STATS
    ↓
5 indicadores
    ↓
atributo dominante
    ↓
bonificación +15%
    ↓
perfil de combate
    ↓
HP + iniciativa
========================================================
*/

window.PALARENA_STANDAR = {


    /* ==================================================
       CONFIGURACIÓN
    ================================================== */

    configuracion: {

        hp_base: 100,

        bonificacion_dominante: 0.15,

        porcentaje_iniciativa_velocidad: 0.70,

        porcentaje_iniciativa_tactica: 0.30

    },


    /* ==================================================
       LIMITAR
    ================================================== */

    limitar(valor) {

        return Math.max(
            0,
            Math.min(
                100,
                Math.round(valor)
            )
        );

    },


    /* ==================================================
       OBTENER ATRIBUTO DOMINANTE
    ================================================== */

    obtenerDominante(indicadores) {

        const atributos = [

            {
                nombre: "ataque",
                valor: indicadores.ataque
            },

            {
                nombre: "defensa",
                valor: indicadores.defensa
            },

            {
                nombre: "velocidad",
                valor: indicadores.velocidad
            },

            {
                nombre: "resistencia",
                valor: indicadores.resistencia
            },

            {
                nombre: "tactica",
                valor: indicadores.tactica
            }

        ];


        let maximo =
            Math.max(
                ...atributos.map(
                    function(atributo) {
                        return atributo.valor;
                    }
                )
            );


        let candidatos =
            atributos.filter(
                function(atributo) {
                    return atributo.valor === maximo;
                }
            );


        /*
        ----------------------------------------------
        EMPATE
        Táctica desempata.
        ----------------------------------------------
        */

        if (candidatos.length > 1) {

            const tactica =
                indicadores.tactica;


            const tacticaEsMaxima =
                candidatos.some(
                    function(atributo) {

                        return (
                            atributo.nombre === "tactica" &&
                            tactica === maximo
                        );

                    }
                );


            if (tacticaEsMaxima) {

                candidatos =
                    candidatos.filter(
                        function(atributo) {

                            return (
                                atributo.nombre === "tactica"
                            );

                        }
                    );

            }

        }


        /*
        ----------------------------------------------
        Si continúa el empate
        elección aleatoria.
        ----------------------------------------------
        */

        const elegido =
            candidatos[
                Math.floor(
                    Math.random() *
                    candidatos.length
                )
            ];


        return {

            atributo: elegido.nombre,

            valor: maximo,

            bonificacion:
                this.configuracion.bonificacion_dominante

        };

    },


    /* ==================================================
       OBTENER PERFIL
    ================================================== */

    obtenerPerfil(atributo) {

        const perfiles = {

            ataque: "agresivo",

            defensa: "defensivo",

            velocidad: "rapido",

            resistencia: "aguante",

            tactica: "tactico"

        };


        return (
            perfiles[atributo] ||
            "equilibrado"
        );

    },


    /* ==================================================
       CALCULAR VALORES EFECTIVOS
    ================================================== */

    calcularEfectivos(indicadores, dominante) {

        const efectivos = {

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

        };


        /*
        ----------------------------------------------
        Potenciación del atributo dominante.
        ----------------------------------------------
        */

        efectivos[dominante.atributo] =
            this.limitar(
                efectivos[dominante.atributo] *
                (
                    1 +
                    dominante.bonificacion
                )
            );


        return efectivos;

    },


    /* ==================================================
       CALCULAR INICIATIVA
    ================================================== */

    calcularIniciativa(efectivos) {

        return Math.round(

            (
                efectivos.velocidad *
                this.configuracion
                    .porcentaje_iniciativa_velocidad
            )

            +

            (
                efectivos.tactica *
                this.configuracion
                    .porcentaje_iniciativa_tactica
            )

        );

    },


    /* ==================================================
       CREAR COMBATIENTE
    ================================================== */

    crear(ficha) {

        if (!ficha) {

            console.error(
                "PALARENA_STANDAR: ficha no válida."
            );

            return null;

        }


        /*
        ----------------------------------------------
        Obtener e1-e11
        ----------------------------------------------
        */

        const stats =
            window.PALARENA_STATS
                .obtenerStats(ficha);


        if (!stats) {

            console.error(
                "PALARENA_STANDAR: no se pudieron obtener e1-e11."
            );

            return null;

        }


        /*
        ----------------------------------------------
        Calcular 5 indicadores
        ----------------------------------------------
        */

        const indicadores =
            window.PALARENA_STATS
                .calcular(stats);


        if (!indicadores) {

            console.error(
                "PALARENA_STANDAR: no se pudieron calcular los indicadores."
            );

            return null;

        }


        /*
        ----------------------------------------------
        Atributo dominante
        ----------------------------------------------
        */

        const dominante =
            this.obtenerDominante(
                indicadores
            );


        /*
        ----------------------------------------------
        Perfil
        ----------------------------------------------
        */

        const perfil =
            this.obtenerPerfil(
                dominante.atributo
            );


        /*
        ----------------------------------------------
        Valores efectivos
        ----------------------------------------------
        */

        const efectivos =
            this.calcularEfectivos(
                indicadores,
                dominante
            );


        /*
        ----------------------------------------------
        HP
        ----------------------------------------------
        */

        const hpMax =
            this.configuracion.hp_base +
            efectivos.resistencia;


        /*
        ----------------------------------------------
        Iniciativa
        ----------------------------------------------
        */

        const iniciativa =
            this.calcularIniciativa(
                efectivos
            );


        /*
        ----------------------------------------------
        Crear combatiente
        ----------------------------------------------
        */

        return {

            codigo:
                ficha.j1 ||
                ficha.codigo ||
                "",

            nombre:
                ficha.j2 ||
                ficha.nombre ||
                "",


            /*
            Stats originales
            */

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


            /*
            Cinco indicadores originales
            */

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


            /*
            Valores efectivos durante combate
            */

            efectivos: efectivos,


            /*
            Especialización
            */

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
            Estado inicial
            */

            hp: hpMax,

            hp_max: hpMax,

            iniciativa: iniciativa,


            /*
            Combate
            */

            ataques: [],

            efectos: [],

            defendiendo: false,

            derrotado: false

        };

    }

};


/*
========================================================
EXPORTACIÓN
========================================================
*/

window.crearCombatienteEstandar =
    window.PALARENA_STANDAR.crear.bind(
        window.PALARENA_STANDAR
);


/*
========================================================
FIN STANDAR
========================================================
*/
